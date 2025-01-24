# SPLIT Stack

<p align="center">
  <strong>Svelte • PostgreSQL • Laravel • Inertia • TypeScript</strong><br>
  A modern, type-safe, multi-context web application stack for rapid development.
</p>

## Overview

🏗️ **Full-stack Type Safety**: From database to UI using TypeScript and automated type generation  
🎭 **Role-Based Architecture**: Built-in context switching with strategy pattern implementation  
⚡ **Modern Tech Stack**: Svelte, Laravel, PostgreSQL, Inertia.js  
🏃‍♂️ **Developer Experience**: Rapid development with extensive code scaffolding  
🎨 **Clean Architecture**: Clear separation of concerns and domain-driven design
🔋 **Battery Included**: Comes with many common but customizable components (tables, filter search, ...) and utilities (toasts, array helpers, ...)
💎 **Modern Monolith**: Hostable one one machine or containerized. No more complex web of microservices or BaaS latency.

## Why SPLIT Stack?

### The Return to Productive Simplicity

Tired of cloud complexity and microservice overhead? 

Tired of spending more time on infrastructure, cloud configuration, build errors, and other non-productivity issues?

SPLIT Stack embraces a return to productive, maintainable monoliths while keeping modern developer experience:

- No complex cloud infrastructure to manage
- No microservices to orchestrate
- No BaaS vendor lock-in
- Just a clean, powerful stack you fully control
- Fully open-source and free

## Is SPLIT Stack Right for You?

SPLIT Stack is ideal for:
- Applications with complex "multi-role users" requirements
- Small, composite teams who want to work fast with a clean basis to build on
- CRUD-heavy applications
- Freelancers/solopreneurs wanting to jumpstart a spaghetti-free project 🍝
(or anyone who likes to get moving fast but wants to keep it clean)

## Getting Started

### Quick Start

1. Clone the repository
```bash
git clone https://github.com/yourusername/split-stack
```

2. Install dependencies
```bash
composer install
npm install
```

3. Set up environment
```bash
cp .env.example .env
php artisan key:generate
```

4. Start development servers
```bash
npm run start
```

⚠️ Docker and docker-compose are required for the DB and pgAdmin.

### Stack Components

- **Flexible, Fast Frontend**: Svelte + TypeScript
- **Battle-tested Backend**: Laravel 11
- **Reliable Database**: PostgreSQL
- **The glue**: Inertia.js
- **Build Tool**: Vite
- **Styling**: TailwindCSS + DaisyUI

## Technical Documentation

### Core Features

#### Type Safety System
- Consistent types from Database to Backend to Frontend
- Type-safe forms with runtime validation
- Type-safe data passing between Laravel and Inertia
- Route-safety for both Laravel and frontend

#### Role Flexibility
- Context switching based on user roles
- Strategy pattern for role-specific behaviors
- Zero conditional statements for role handling
- Live role switching capability

#### Developer Experience
- CLI tools for code generation
- Pre-made components
- Many convenient utilities (toasts, array helpers, Laravel Traits for common pain points)
- Hot module replacement
- Pre-configured DB containers
- Automated code formatting and linting

### Understanding Inertia.js Integration

Inertia.js connects your frontend and backend by:
- Enabling Laravel to directly drive your Svelte frontend
- Eliminating need for an actual API
- Providing SPA behavior with monolith simplicity
- Handling authentication and authorization seamlessly

Flow:
1. User clicks a link
2. Inertia makes XHR request
3. Laravel controller returns data
4. Svelte component displays data
5. URL updates without page reload

### Code Organization

```
├── app/
│ ├── Console/Commands/    # CLI tools
│ ├── Http/Controllers/    # Laravel controllers
│ └── Models/             # Laravel models
├── resources/
│ └── js/
│   ├── Components/       # Svelte components
│   ├── Layouts/         # Page layouts
│   ├── Lib/             # Core utilities
│   │ ├── navigation/    # Navigation strategies
│   │ └── domains/       # Domain-specific logic
│   └── Pages/           # Svelte pages
```

### Working with Context-Aware Components

[Check out TECHNICAL.md](TECHNICAL.md)

### Toast Notification System

[Check out TECHNICAL.md](TECHNICAL.md)

## Development Tools

### Code Generation Commands

```bash
# Generate role-based strategies/contexts
php artisan split:domain Project admin freelancer employer

# Generate new navigation strategy
php artisan split:navigation admin freelancer employer
```

## Resources and Support

- Documentation: [Coming Soon]
- Discord Community: [Coming Soon]
- Twitter Updates: [Coming Soon]
- Blog Posts: [Coming Soon]

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

SPLIT Stack is pre-v1.0.0 and under active development. While suitable as a project foundation, it's not yet production-tested. Feedback and contributions are welcome!