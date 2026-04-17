# Architecture Guidelines

This document defines the architectural conventions for this project. All contributors and LLMs working in this codebase must follow these rules.

---

## Core Principle

This project uses a **clean(ish) layered architecture**:

```
HTTP Layer → Action / Query Layer → Domain Layer → Repository Layer → Persistence
     ↕ (via Inertia)
Frontend (Svelte/Inertia)
```

Each layer has a single responsibility. Do not bleed logic across layers.

---

## Layer Rules

### 1. Controllers (`app/Http/Controllers/`)

- **Thin only.** Controllers orchestrate; they do not contain business logic.
- Resolve the entity via a repository or query, pass it to an action, return an Inertia response or redirect.
- Use **constructor injection** for actions, queries, and repositories.
- Always validate with a dedicated `FormRequest` class — never inline validation.
- Return `Inertia::render()` for page renders, `redirect()->route()` for post-action redirects.

```php
// CORRECT
class UserProfileController extends Controller {
    public function __construct(
        private readonly GetUserProfile $getUserProfile,
        private readonly UpdateProfile $updateProfile,
    ) {}

    public function show(): Response {
        $profile = $this->getUserProfile->execute(Auth::id());
        return Inertia::render('profile/show', $profile);
    }

    public function update(UpdateProfileRequest $request): RedirectResponse {
        $this->updateProfile->execute(Auth::id(), $request->validated());
        return redirect()->route('profile.show');
    }
}

// WRONG — business logic in controller
public function update(Request $request): RedirectResponse {
    $user = User::find(Auth::id());
    $user->name = $request->name;
    $user->save();
    return redirect()->route('profile.show');
}
```

---

### 2. Actions (`app/Actions/`)

Actions represent **write operations** — mutations with side effects. Each action does exactly one thing.

- Named with an imperative verb phrase: `CreateUser`, `PublishPost`, `ProcessOrder`.
- Single public method: `execute()` with typed parameters and an explicit return type.
- Accept and return **domain entities**, not Eloquent models or raw arrays.
- Use constructor-injected **repository interfaces** for persistence — never touch Eloquent directly.
- Actions must not know about HTTP, sessions, or `Auth::`.

```php
// CORRECT
class PublishPost {
    public function __construct(
        private readonly PostRepositoryInterface $posts,
    ) {}

    public function execute(PostEntity $post, DateTimeImmutable $publishAt): PostEntity {
        $post->publish($publishAt);
        $this->posts->save($post);
        return $post;
    }
}

// WRONG — action calls Eloquent directly and knows about HTTP
public function execute(Request $request): void {
    Post::where('id', $request->id)->update(['published_at' => now()]);
}
```

---

### 3. Queries (`app/Queries/`)

Queries represent **read operations** — they return data and have no side effects.

- Named with a descriptive noun phrase: `GetUserProfile`, `ListPublishedPosts`, `FindOrderById`.
- Single public method: `execute()` with typed parameters and an explicit return type.
- Use repository interfaces for data access — never touch Eloquent directly.
- Must not trigger writes, dispatch events, or call actions.
- May return a domain entity, a DTO, a collection, or a primitive — whatever the caller needs.

```php
// CORRECT
class ListActiveOrders {
    public function __construct(
        private readonly OrderRepositoryInterface $orders,
    ) {}

    /** @return Collection<OrderEntity> */
    public function execute(int $userId): Collection {
        return $this->orders->findActiveByUser($userId);
    }
}

// CORRECT — returning a shaped DTO instead of an entity
class GetUserProfile {
    public function execute(int $userId): array {
        $user = $this->users->findOrFail($userId);
        return [
            'name' => $user->name,
            'email' => $user->email,
            'joinedAt' => $user->created_at,
        ];
    }
}

// WRONG — query has a side effect
public function execute(int $userId): UserEntity {
    $user = $this->users->findOrFail($userId);
    $user->recordLastSeen();      // side effect — belongs in an action
    $this->users->save($user);
    return $user;
}
```

The distinction between actions and queries maps loosely to CQRS: **actions mutate, queries read**. Controllers should use a query to fetch page data and an action to handle form submissions.

---

### 4. Domain Entities (`app/Domain/Entities/`)

- Named `NounEntity` (e.g., `UserEntity`, `OrderEntity`).
- Extend `BaseEntity`; implement the `Entity` contract.
- Contain **business behavior** — not just data bags.
- Use `static fromArray(array $data): static` as the canonical factory for deserialization.
- Use fluent builder methods returning `$this` for mutations.
- Do not import Eloquent models, HTTP concerns, or repositories.

```php
// Entity methods should express domain language
$order = OrderEntity::from($user, $items, $shippingAddress)
    ->applyDiscount($promoCode)
    ->flagForReview();
```

---

### 5. Value Objects (`app/Domain/ValueObjects/`)

- Represent **immutable state or calculations** (e.g., `Money`, `EmailAddress`, `DateRange`).
- Use `readonly` properties or PHP 8.4 `private(set)` to enforce immutability.
- Validate constraints in the constructor.
- Transformations that return a new state must return a **new instance**, not mutate in place.
- Use `static fromArray()` for deserialization.

```php
// Value object produces a new instance on state transition
public function add(Money $other): self {
    if (! $this->currency->equals($other->currency)) {
        throw new CurrencyMismatchException;
    }
    return new self($this->amount + $other->amount, $this->currency);
}
```

---

### 6. Repositories (`app/Infrastructure/`)

**Interfaces** live in `app/Infrastructure/Contracts/`.  
**Implementations** live in `app/Infrastructure/Repositories/`.

- All repositories implement `RepositoryInterface` (base CRUD contract).
- Specialized interfaces extend the base: `OrderRepositoryInterface extends RepositoryInterface`.
- Implementations convert between Eloquent models and domain entities:
  - `Entity → toArray() → Model::updateOrCreate()` (write)
  - `Model::find() → fromArray() → Entity` (read)
- Validate entity type at the top of `save()` with an `instanceof` guard.
- Register bindings in `app/Providers/RepositoryProvider.php`.

```php
// RepositoryProvider.php
$this->app->bind(OrderRepositoryInterface::class, OrderRepository::class);
```

Never inject a concrete repository class. Always inject the interface.

---

### 7. Eloquent Models (`app/Models/`)

- Models are a **persistence detail only** — they are not passed across layers.
- Keep models lean: relationships, casts, fillable. No business logic.
- The domain layer must never import a Model class.

---

## Dependency Injection

- Use **constructor property promotion** for all injected dependencies.
- Always inject interfaces, not implementations.
- New bindings go in `RepositoryProvider` (repositories) or `AppServiceProvider` (everything else).
- Laravel's container resolves the full graph automatically — no manual wiring needed.

```php
public function __construct(
    private readonly OrderRepositoryInterface $orders,
    private readonly ProcessOrder $processOrder,
    private readonly GetOrderSummary $getOrderSummary,
) {}
```

---

## Frontend: Prefer Inertia Over AJAX

**Default rule: use Inertia, not `fetch`/`axios`.**

### Inertia Patterns to Use

| Need                             | Pattern                                            |
| -------------------------------- | -------------------------------------------------- |
| Navigate to a page               | `router.visit(url)`                                |
| Submit a form                    | `router.post(url, data)`                           |
| Partial refresh (preserve state) | `router.post(url, data, { preserveState: true })`  |
| Full refresh after mutation      | `router.post(url, data, { preserveState: false })` |
| Typed route URLs                 | Wayfinder-generated controller functions           |
| AJAX-y data fetching             | Inertia `useHttp()`                                |

### Routing: Always Use Wayfinder

Never hardcode route strings in frontend components. Use the generated Wayfinder functions.

```ts
// CORRECT
import UserProfileController from '@/actions/App/Http/Controllers/UserProfileController';
router.post(UserProfileController.update(), formData);

// WRONG
router.post('/profile/update', formData);
```

After adding a new route, run `php artisan wayfinder:generate` (or let the Vite plugin do it).

---

## Naming Conventions

| Layer                      | Convention                                        | Examples                                    |
| -------------------------- | ------------------------------------------------- | ------------------------------------------- |
| Actions                    | `VerbNoun`                                        | `CreateUser`, `PublishPost`, `ProcessOrder` |
| Queries                    | `GetNoun` / `ListNoun` / `FindNoun`               | `GetUserProfile`, `ListActiveOrders`        |
| Entities                   | `NounEntity`                                      | `UserEntity`, `OrderEntity`                 |
| Value Objects              | `Noun`                                            | `Money`, `EmailAddress`, `DateRange`        |
| Repository Interfaces      | `NounRepositoryInterface`                         | `OrderRepositoryInterface`                  |
| Repository Implementations | `NounRepository`                                  | `OrderRepository`                           |
| Controllers                | `VerbNounController` or `NounController`          | `UserProfileController`, `OrderController`  |
| Form Requests              | `VerbNounRequest`                                 | `UpdateProfileRequest`, `StoreOrderRequest` |
| Svelte Pages               | `PascalCase.svelte` in `resources/js/pages/`      | `UserProfile.svelte`, `OrderList.svelte`    |
| Svelte Components          | `PascalCase.svelte` in `resources/js/components/` | `OrderCard.svelte`, `ProfileForm.svelte`    |

---

## Adding a New Feature — Checklist

Follow this order when implementing any new feature:

1. **Domain first**: Does it need a new entity or value object? Define it in `app/Domain/`.
2. **Repository contract**: If new persistence is needed, add a method to the relevant interface (or create a new interface + implementation).
3. **Register DI**: Add the binding in `RepositoryProvider`.
4. **Query**: If the feature needs to read data, create a query in `app/Queries/`.
5. **Action**: If the feature mutates state, create an action in `app/Actions/`.
6. **Form Request**: Create a `FormRequest` for any input validation.
7. **Controller**: Create a thin controller — call the query for page data, call the action for form submissions.
8. **Route**: Register the route in `routes/web.php` and run Wayfinder generation.
9. **Frontend**: Build or update the Svelte page/component in `resources/js/Pages/` or `resources/js/Components/`. Use Inertia `router` for all data submissions.
10. **Tests**: Write a Pest feature test covering the happy path and relevant edge cases.

---

## Anti-Patterns to Avoid

- **Fat controllers**: No business logic in controllers.
- **Eloquent in actions/queries**: Neither may import or query Eloquent models directly.
- **Queries with side effects**: If it mutates state, it's an action, not a query.
- **Actions that also read**: Fetch the data in a query first, pass the entity to the action.
- **Raw `fetch` for page data**: Use Inertia deferred props instead.
- **Hardcoded URLs in frontend**: Always use Wayfinder-generated functions.
- **Mutable value objects**: Value objects that change state in place break the domain model.
- **Concrete repository injection**: Always inject the interface, not the implementation.
- **`DB::` raw queries**: Prefer Eloquent; use query builder only for genuinely complex joins.
- **`env()` outside config files**: Use `config('key')` everywhere in application code.
