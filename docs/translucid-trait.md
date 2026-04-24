# Translucid Trait

The Translucid trait provides automatic event broadcasting for Eloquent models. When added to a model, it will automatically dispatch events on create, update, and delete operations, which will be broadcast on the `translucid` private channel.

## Installation

1. Ensure your broadcasting configuration is set up correctly in your `.env` file:

```
BROADCAST_CONNECTION=reverb  # or pusher, ably, etc.

# For Reverb, add these settings:
REVERB_APP_KEY=your_app_key
REVERB_APP_SECRET=your_app_secret
REVERB_APP_ID=your_app_id
REVERB_HOST=localhost
REVERB_PORT=8080
REVERB_SCHEME=http
REVERB_SERVER_HOST=0.0.0.0
REVERB_SERVER_PORT=8080

# For frontend:
VITE_REVERB_APP_KEY="${REVERB_APP_KEY}"
VITE_REVERB_HOST="${REVERB_HOST}"
VITE_REVERB_PORT="${REVERB_PORT}"
VITE_REVERB_SCHEME="${REVERB_SCHEME}"
```

2. Start the Reverb server:

```bash
php artisan reverb:start
```

3. Add the Translucid trait to any model you want to broadcast events for:

```php
<?php

namespace App\Models;

use App\Traits\Translucid;
use Illuminate\Database\Eloquent\Model;

class YourModel extends Model
{
    use Translucid;

    // ... rest of your model
}
```

## How It Works

The Translucid trait uses `bootTranslucid()` (Laravel's per-trait boot convention) to hook into Eloquent model events without overriding the model's own `boot()` method:

- `created` → dispatches `TranslucidCreated`
- `updated` → dispatches `TranslucidUpdated`
- `deleted` → dispatches `TranslucidDeleted`

### Broadcast event names

| Operation | Event name (broadcastAs)                        | Scope       |
|-----------|--------------------------------------------------|-------------|
| created   | `translucid.created.{table}`                     | table-wide  |
| updated   | `translucid.updated.{table}.{id}`                | per-record  |
| deleted   | `translucid.deleted.{table}.{id}`                | per-record  |

All events broadcast on the `PrivateChannel('translucid')` channel.

### Normalized payload envelope

Every event shares a common envelope:

| Field   | Type   | Description                              |
|---------|--------|------------------------------------------|
| `type`  | string | Table name (`$model->getTable()`)        |
| `model` | string | Fully-qualified PHP class name           |
| `id`    | mixed  | Primary key (`$model->getKey()`)         |
| `op`    | string | `"created"`, `"updated"`, or `"deleted"` |

Additional fields per operation:

- **created** – `data`: full model attributes (`$model->toArray()`)
- **updated** – `changes`: only the changed fields (`$model->getChanges()`)
- **deleted** – no additional fields

## Frontend API

### `watchCollection(table, opts)` — collection pages

Subscribe to `created` events for a table. New records are accepted only when their payload matches the **current page URL query string** (see URL filter convention below).

```typescript
import { watchCollection } from '@/Lib/translucid.svelte';

const stop = watchCollection('posts', {
  onCreated(payload) {
    items = [payload.data, ...items];
  },
});

// Call stop() in onDestroy / component teardown to unsubscribe
```

Returns an unsubscribe function.

#### URL filter convention

Filtering is driven entirely by URL query params — no server-side state needed.

| URL pattern                     | Meaning                                  |
|---------------------------------|------------------------------------------|
| `?status=published`             | `data.status === "published"`            |
| `?category_id=5`                | `data.category_id === "5"`              |
| `?status[]=draft&status[]=review` | `data.status` is in `{"draft","review"}` |

Params named `page`, `sort`, `order`, `direction`, `per_page`, `limit`, `offset` are always ignored. All comparisons are string-based. Parameter order does not matter.

---

### `watchId(table, id, opts)` — individual record pages

Subscribe to `updated` and `deleted` events for a specific record.

```typescript
import { watchId } from '@/Lib/translucid.svelte';

const stop = watchId('posts', post.id, {
  onUpdated(payload) {
    Object.assign(post, payload.changes);
  },
  onDeleted() {
    // e.g. redirect away
  },
});

// Call stop() in onDestroy / component teardown
```

Returns an unsubscribe function.

---

### `Translucid` class — reactive array watching

For reactive Svelte stores backed by the class API:

```typescript
import { translucid } from '@/Lib/translucid.svelte';

// Watch a specific model for updates & deletes
translucid.table('posts').watch(post);

// Watch an entire array (registers update + delete listeners per record)
translucid.table('posts').watchAll(posts);

// Stop watching a model
translucid.table('posts').unwatch(post);
```

## Channel Authorization

The `translucid` channel is a private channel; users must be authenticated. The default authorization in `routes/channels.php`:

```php
Broadcast::channel('translucid', function ($user) {
    return Auth::check();
});
```
