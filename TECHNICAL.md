# SPLIT Stack Technical Documentation

## Core Architecture

### Domain-Driven Organization

SPLIT Stack encourages organizing code by domain (entity/model) rather than technical layers. This approach:
- Makes related code easier to find and maintain
- Reduces cognitive load when working on features
- Facilitates better separation of concerns
- Makes the codebase more scalable

### Type Generation Pipeline

```
Database Schema → Laravel Models → TypeScript Interfaces → Frontend Components
```

The type generation system ensures:
1. Database columns are reflected in Laravel model properties
2. Laravel models are automatically converted to TypeScript interfaces
3. Form validation matches TypeScript types
4. API responses are fully typed
5. Route parameters are type-checked

## Context-Aware Components

### The Strategy Pattern Implementation

The context system uses the strategy pattern to handle different behaviors based on user roles. Here's how it works:

1. **Context Definition**

```typescript
import { Context } from '$lib/core/contexts/context';
import { BaseDataDisplayStrategy } from '$lib/core/strategies/dataDisplayStrategy';
import { Project } from '$models';

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

2. **Strategy Implementation**

```typescript
import type { DataAction, DataHeader, IDataStrategy } from '$types/common/dataDisplay';
import { BaseDataDisplayStrategy } from '$lib/core/strategies/dataDisplayStrategy';
import { Project } from '$models';

export class FreelancerProjectTableStrategy
  extends BaseDataDisplayStrategy<Project>
  implements IDataStrategy<Project>
{
  defaultHeaders(): DataHeader<Project>[] {
    return [
      { key: 'name', label: 'Name', searchable: true },
      { key: 'description', label: 'Description', searchable: true },
      { key: 'organization.name', label: 'Organization', searchable: true },
    ];
  }

  defaultActions(): DataAction<Project>[] {
    return [
      { 
        label: 'Edit', 
        href: (row: Project) => route('project.edit', row.id) 
      },
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

3. **Usage in Components**

```typescript
<script lang="ts">
  import { RoleContext } from '$lib/stores/global/roleContext.svelte';
  import { ProjectContext } from '$lib/domains/Project/context';
  import type { Project } from '$models';

  interface Props {
    projects: Project[];
  }

  let { projects }: Props = $props();
  let context = $derived(new ProjectContext(RoleContext.selected));
  let headers = $derived(context.strategy.headers());
  let actions = $derived(context.strategy.actions());
</script>

<DataTable {headers} {actions} data={projects} />
```

## Navigation System

### Role-Based Navigation

Navigation is handled through strategies similar to context-aware components:

```typescript
export class AdminNavigationStrategy implements NavigationStrategy {
  getNavigationItems(): NavigationItem[] {
    return [
      {
        label: 'Dashboard',
        href: route('dashboard'),
        icon: Home
      },
      {
        label: 'Projects',
        href: route('projects.index'),
        icon: Briefcase,
        children: [
          {
            label: 'All Projects',
            href: route('projects.index')
          },
          {
            label: 'Archived',
            href: route('projects.archived')
          }
        ]
      }
    ];
  }
}
```

## Toast Notification System

### Backend Integration

The toast system automatically captures Laravel flash messages:

```php
// In your controller
return redirect()->back()->with('success', 'Project created!');
```

### Frontend Usage

Direct toast triggering from components:

```typescript
import { toaster } from '$lib/stores/global/toaster.svelte';

// Basic usage
toaster.success('Operation completed!');

// With Inertia form
const form = superUseForm();

function handleSubmit() {
  $form.post(route('project.store'), {
    onSuccess: () => {
      toaster.success('Project created successfully');
    },
    onError: () => {
      toaster.error('Failed to create project');
    }
  });
}
```

### Toast Configuration

Toasts can be customized globally:

```typescript
// $lib/config/toast.ts
export const DEFAULT_TOAST_OPTIONS: ToastOptions = {
  color: 'purple',
  duration: 3000,
  position: 'top-right',
};
```

## Form Handling

### Type-Safe Forms

Forms are automatically typed based on your Laravel models:

```typescript
// This type can be generated by the split:modelgen command
interface ProjectForm {
  name: string;
  description: string;
  due_date: Date;
  organization_id: number;
}

const form = superUseForm<ProjectForm>();
```

### Validation Integration

Laravel validation rules are automatically mapped to frontend validation:

```php
// Backend validation
public function rules(): array
{
    return [
        'name' => ['required', 'string', 'max:255'],
        'description' => ['required', 'string'],
        'due_date' => ['required', 'date'],
        'organization_id' => ['required', 'exists:organizations,id']
    ];
}
```

```typescript
// Frontend receives typed validation errors
function handleSubmit() {
  $form.post(route('project.store'), {
    onError: (errors) => {
      // errors is typed based on ProjectForm
      console.log(errors.name); // string | undefined
    }
  });
}
```

## CLI Tools

### Domain Generation

Generate a new domain with role-based contexts:

```bash
php artisan split:domain Project admin freelancer employer
```

This creates:
- ProjectContext class
- Role-specific strategies
- Default strategy
- Basic tests

### Navigation Generation

Create role-specific navigation:

```bash
php artisan split:navigation admin freelancer employer
```

Generates:
- Navigation strategies for each role
- Navigation store
- Navigation components

