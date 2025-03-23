# Translucid Trait

The Translucid trait provides automatic event broadcasting for Eloquent models. When added to a model, it will automatically dispatch events on create, update, and delete operations, which will be broadcast on the "translucid" private channel.

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

The Translucid trait hooks into the Eloquent model events:

- `created`: Dispatches a `TranslucidCreated` event when a model is created
- `updated`: Dispatches a `TranslucidUpdated` event when a model is updated
- `deleted`: Dispatches a `TranslucidDeleted` event when a model is deleted

Each event includes the model instance and broadcasts the following data:

```json
{
  "model": "App\\Models\\YourModel",
  "id": 1,
  "data": {
    // The full model data as an array
  },
  "event": "created|updated|deleted"
}
```

## Listening for Events

### Backend (PHP)

You can listen for these events in your Laravel application by registering event listeners in your `EventServiceProvider`:

```php
protected $listen = [
    'App\Events\TranslucidCreated' => [
        'App\Listeners\YourListener',
    ],
    // ... other events
];
```

### Frontend (JavaScript/TypeScript)

#### Using Laravel Echo directly

You can listen for these events in your frontend using Laravel Echo:

```javascript
Echo.private('translucid')
    .listen('.App\\Events\\TranslucidCreated', (e) => {
        console.log('Model created:', e.model, 'ID:', e.id, 'Data:', e.data);
        // Handle the event
    })
    .listen('.App\\Events\\TranslucidUpdated', (e) => {
        console.log('Model updated:', e.model, 'ID:', e.id, 'Data:', e.data);
        // Handle the event
    })
    .listen('.App\\Events\\TranslucidDeleted', (e) => {
        console.log('Model deleted:', e.model, 'ID:', e.id, 'Data:', e.data);
        // Handle the event
    });
```

#### Using the Translucid helper class

We've created a helper class to make it easier to listen for Translucid events:

```typescript
// resources/js/Lib/translucid.svelte.ts
import Translucid from '$lib/translucid.svelte';

// Listen for all Translucid events
Translucid.listen(
  // Created event handler
  (e) => {
    console.log('Model created:', e);
    // Handle created event
  },
  // Updated event handler
  (e) => {
    console.log('Model updated:', e);
    // Handle updated event
  },
  // Deleted event handler
  (e) => {
    console.log('Model deleted:', e);
    // Handle deleted event
  }
);
```

#### Using model-specific helpers

For model-specific events, you can use the model's helper methods:

```typescript
// resources/js/Lib/models/Project.svelte.ts
import { Project } from '$lib/models/Project.svelte';

// Listen for Project-specific events
Project.listenForEvents(
  // Created event handler
  (project) => {
    console.log('Project created:', project);
    // Handle project created
  },
  // Updated event handler
  (project) => {
    console.log('Project updated:', project);
    // Handle project updated
  },
  // Deleted event handler
  (project) => {
    console.log('Project deleted:', project);
    // Handle project deleted
  }
);

// Or listen for events on a specific project instance
const project = new Project({ id: 1, name: 'My Project', /* ... */ });
project.listenForEvents(
  // Updated event handler
  (updatedProject) => {
    console.log('This project was updated:', updatedProject);
    // Handle this project updated
  },
  // Deleted event handler
  (deletedProject) => {
    console.log('This project was deleted:', deletedProject);
    // Handle this project deleted
  }
);
```

## Channel Authorization

The 'translucid' channel is a private channel, which means users must be authenticated to listen to it. The default authorization logic in `routes/channels.php` allows any authenticated user to listen to the channel:

```php
Broadcast::channel('translucid', function ($user) {
    return Auth::check();
});
```

You can customize this logic to restrict access based on your application's requirements.
