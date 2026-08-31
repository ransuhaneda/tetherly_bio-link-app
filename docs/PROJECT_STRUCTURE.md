# Tetherly project structure

```text
apps/
├── api/
│   ├── app/
│   │   ├── Console/Commands/       Bounded operational commands
│   │   ├── Data/                   Small workflow result objects
│   │   ├── Enums/                  Persisted domain states
│   │   ├── Http/                   Versioned controllers, middleware, requests, resources
│   │   ├── Mail/                   Queueable product email
│   │   ├── Models/                 Eloquent domain models and relationships
│   │   ├── Services/               Transactional account and publishing workflows
│   │   └── Support/                Shared normalization and session keys
│   ├── database/                   Factories, migrations, and seeders
│   ├── resources/views/emails/     Laravel mail views
│   ├── routes/                     API and scheduler registration
│   └── tests/Feature/              API, persistence, command, and schedule tests
└── web/
    └── src/
        ├── app/                    Providers and route configuration
        ├── assets/                 Local fonts, approved images, global Sass
        ├── components/             Shared layout and UI primitives
        ├── features/               Typed auth, account deletion, workspace APIs and state
        ├── pages/                  Public, auth, legal, and dashboard route surfaces
        ├── services/               Credentialed HTTP boundary and error normalization
        ├── test/                   Vitest setup
        └── types/                  Shared frontend API contracts
docs/                               Product, design, architecture, ADR, and OpenAPI contracts
```

Keep Laravel workflows in focused services instead of React or controllers. Keep external API data behind the typed web client boundary. Route-specific components stay beside their page; reusable state and API modules belong under `features/`.
