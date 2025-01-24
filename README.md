# SPLIT Stack

<p align="center">
  <strong>Svelte • PostgreSQL • Laravel • Inertia • TypeScript</strong><br>
  A modern, type-safe, multi-context web application stack for rapid development
</p>

🏗️ Full-stack type safety from database to UI using TypeScript and automated type generation

🎭 Built-in role-based context switching with strategy pattern implementation

⚡ Modern tech stack: Svelte, Laravel, PostgreSQL, Inertia.js

🏃‍♂️ Rapid development with extensive code scaffolding commands

🎨 Clean DDD architecture with clear separation of concerns

🔄 Context-aware components that adapt to user roles

📦 Pre-configured development environment with Docker

<!-- 🛠️ Comprehensive tooling (ESLint, Prettier, Vite, etc.) -->

## 🎯 Use Cases

SPLIT Stack is ideal for:
- Startups needing a robust foundation
- Applications with complex "multi-role users" requirements
- Teams who don't want to sacrifice architecture for speed
- CRUD-centered applications
- Freelancers/solopreneurs wanting to jumpstart a spaghetti-free project 🍝

## 🌟 Features

### Type Safety Everywhere
- Full-stack type safety from database to UI
- Automatic TypeScript interface generation from Laravel models
- Inertia.js props typing for seamless backend-frontend communication

### Role-Based Architecture
- Built-in context switching based on user roles
- Strategy pattern implementation for role-specific views and behaviors
- Clean separation of concerns following DDD principles

### Developer Experience
- Comprehensive CLI tools for code generation
- Pre-configured development environment
- Hot module replacement
- Automated code formatting and linting
- Type-safe forms and API calls

### Performance
- Server-side rendering capabilities
- Efficient state management
- Optimized asset bundling with Vite

## 🚀 Quick Start

1. Clone the repository
```
git clone https://github.com/yourusername/split-stack
```
2. Install dependencies
```
composer install
npm install
```
3. Set up environment
```
cp .env.example .env
php artisan key:generate
```
4. Start development servers

```
npm run start
```

This should spin up docker containers, laravel server, and vite dev server.

⚠️ You need to have docker and docker compose installed.


## 📦 Stack Components

- **Frontend**: Svelte + TypeScript
- **Backend**: Laravel 11
- **Database**: PostgreSQL
- **API Layer**: Inertia.js
- **Build Tool**: Vite
- **Styling**: TailwindCSS + DaisyUI

## 🧠 Core Concepts

### Domain-Driven Design


DISCLAIMER: We are opinionated. But feel free to disagree! 

We consider that more often that not, grouping things by what **entity** (or domain, or model) is one 
on the clearest way to structure your application (which doesn't exlude blending in other patterns like MVC, which ... we are doing anyway).

### Context-Aware Components

To make pages or components context-aware (usually to respond to having different logic or views based on the user's role),
we use the **strategy pattern**.

For each "domain" (e.g. `Projects`) we define **contexts** that you can decide to make wide or narrow down
to a specific type of view (e.g. tables or datalists).

Each context will **need** to provide a `getStrategyForRole` method, but the implementation details are up to you (ususally a `switch` statement or a `map`).

Each strategy will then define things like the kind of data to display (e.g. headers and action buttons of a table, or the data of a datalist).

Code example (full,non-simplified!):

```typescript
// Provided in the SPLIT Stack
import { Context } from '$lib/core/contexts/context';
import { BaseDataDisplayStrategy } from '$lib/core/strategies/dataDisplayStrategy';

// Made available through type generation
import { Project } from '$models';

// Default strategy generated by the split:domain command
import { DefaultProjectTableStrategy } from './strategies/defaultProjectTableStrategy';

// Your strategies (the skeleton is provided by the split:domain command too)
import { AdminProjectTableStrategy } from './strategies/adminProjectTableStrategy';
import { EmployerProjectDataDisplayStrategy } from './strategies/employerProjectTableStrategy';
import { FreelancerProjectDataDisplayStrategy } from './strategies/freelancerProjectTableStrategy';

export class ProjectContext implements Context<Project> {
  strategy: BaseDataDisplayStrategy<Project>;

  constructor(role: string) {
    this.strategy = this.getStrategyForRole(role);
  }

  getStrategyForRole(role: string): BaseDataDisplayStrategy<Project> {
    switch (role) {
      case 'admin':
        return new AdminProjectTableStrategy();
      case 'freelancer':
        return new FreelancerProjectDataDisplayStrategy();
      case 'employer':
        return new EmployerProjectDataDisplayStrategy();
      default:
        return new DefaultProjectTableStrategy();
    }
  }
} 
```

```typescript
// Included with the batteries
import type { DataAction, DataHeader, IDataStrategy } from '$types/common/dataDisplay';
import {
  BaseDataDisplayStrategy
} from '$lib/core/strategies/dataDisplayStrategy';
import { InertiaForm } from '$lib/inertia';

// Models made available through type generation
import { Project } from '..';

// Yours
import { Trash2 } from 'lucide-svelte';

export class FreelancerProjectTableStrategy
  extends BaseDataDisplayStrategy<Project> // BaseDataDisplayStrategy is provided by the SPLIT Stack
  implements IDataStrategy<Project> // IDataStrategy is provided by the SPLIT Stack
{
  // defaultHeaders() is an abstract method that you need to implement
  defaultHeaders(): DataHeader<Project>[] {
    return [
      { key: 'name', label: 'Name', searchable: true },
      { key: 'description', label: 'Description', searchable: true },
      { key: 'organization.name', label: 'Organization', searchable: true },
    ];
  }

  // defaultActions() is an abstract method that you need to implement
  defaultActions(): DataAction<Project>[] {
    return [
      { label: 'Edit', href: (row: Project) => route('project.edit', row.id) },
      {
        label: 'Delete',
        callback: Project.delete,
        css: () => 'text-red-500',
        icon: () => Trash2,
      },
    ];
  }
}
```



This allows Pages that include tables or lists to be context-aware and adapt to the user's role easily.
You can switch on the spot (we provide a `<RoleSwitcher/>` component for that!), 
or just use it as DRYer way to define your components.

Example component:
```typescript
<script lang="ts">
  // Components/layouts provided out of the box
  import DynamicFilterSearch from '$components/DataInput/DynamicFilterSearch.svelte';
  import { DataTable } from '$components/Display/DataTable';
  import Header from '$components/UI/Header.svelte';
  import AuthenticatedLayout from '$layouts/AuthenticatedLayout.svelte';
  import RoleSwitcher from '$components/UI/RoleSwitcher.svelte';

  // The global role context store is included
  import { RoleContext } from '$lib/stores/global/roleContext.svelte';

  // Contexts and strategies provided by the split:domain command
  import { ProjectContext } from '$lib/domains/Project/context';

  // Models made available through type generation
  import type { Project } from '$models';

  interface Props {
    projects: Project[];
  }

  let { projects }: Props = $props();

  let context = $derived(new ProjectContext(RoleContext.selected));
  let headers = $derived(context.strategy.headers());
  let actions = $derived(context.strategy.actions());

  let q = $state('');
  let filteredProjects = $state(projects);

  function searchHandler (q: string) {
    filteredProjects = projects.filter( 
      // Your search logic here
    );
  };

  function clearHandler () {
    // Your clear logic here
  }
</script>

<AuthenticatedLayout>
  <Header>
    <h1>Projects</h1>
    <RoleSwitcher />
    <div class="flex items-center gap-2 mx-auto">
      <DynamicFilterSearch {searchHandler} {clearHandler} bind:q />
    </div>
  </Header>

  <DataTable {headers} {actions} data={filteredProjects} searchStrings={[q]} />
</AuthenticatedLayout>
```

That's it, your component is now context-aware and will adapt to the user's role (whether it is changing on the fly or not).

Of course, no one is **forcing** you to use the strategy patterns if your requirements don't match.
But we figured that for a good deal of CRUD-centered applications, it is a good way to keep your code clean and organized
but still have the flexibility to adapt to the user's role.

### Role Handling made simpler

#### Made possible by:

- A tweak to Inertia's `HandleInertiaRequests` middleware to include roles in the shared data
- A `RoleContext` store that you can use to access the user's role or switch roles on the fly
- A `RoleSwitcher` component if you need frontend role switching (e.g. one user has multiple roles)
- A `NavigationContext` and strategies for you to define your available navigation options based on roles


## 🛠️ Development / Quality of life Tools

### Code Generation Commands

#### Generate new component
```
// On our roadmap
```

#### Generate role-based strategies/contexts

```
php artisan split:tables ModelName role1 role2 role3
```

#### Generate new navigation strategy

Because we all know that handling routes and navigation with role conditionals is a pain in the donkey.

```
php artisan split:navigation StrategyName
```

### Directory Structure

```
├── app/
│ ├── Console/Commands/ # CLI tools
│ ├── Http/Controllers/ # Laravel controllers
│ └── Models/ # Laravel models
├── resources/
│ └── js/
│ ├── Components/ # Svelte components
│ ├── Layouts/ # Page layouts
│ ├── Lib/ # Core utilities
| | ├── navigation/ # Navigation strategies
│ │ └── domains/ # Domain-specific logic
│ └── Pages/ # Svelte pages
```

## 🎮 Quick Showcase

👆 Switch roles, and both the UI and business logic adapt automatically - no IF statements in sight!
Coming soon!

## 🌍 See it in Action

Coming soon!
- [qadran.io](https://qadran.io) - Time tracking SaaS // Coming soon!

## 💬 Getting Support

- Join our [Discord](link) // Coming soon!
- Follow updates on [Twitter](link) // Coming soon!
- Check out the [documentation](link) // Coming soon!
- Read our [blog posts](link) // Coming soon!



## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


