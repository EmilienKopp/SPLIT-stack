# SPLIT Stack

<p align="center">
  <strong>Svelte • PostgreSQL • Laravel • Inertia • TypeScript</strong><br>
  A modern, type-safe, multi-context web application stack for rapid development
</p>

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

## 🛠️ Development Tools

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

## 🎯 Use Cases

SPLIT Stack is ideal for:
- Startups needing a robust foundation
- Applications with complex role-based requirements
- Teams wanting type safety without sacrificing development speed
- Projects requiring clean architecture and maintainability
- Freelancers wanting to build a new project quickly with professional quality
- CRUD-centered applications

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


