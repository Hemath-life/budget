# Budget App Backend (NestJS)

This is the backend for the Budget App, built with NestJS, Prisma, and SQLite.

## Setup

1.  Install dependencies:

    ```bash
    pnpm install
    ```

2.  Initialize the database:

    ```bash
    npx prisma generate
    npx prisma db push
    ```

3.  Start the development server:
    ```bash
    pnpm start:dev
    ```

## API Documentation

The API documentation is available at `http://localhost:3001/api` (Swagger UI).

## Modules

- **Auth**: JWT authentication (Login/Signup).
- **Users**: User management.
- **Categories**: Manage budget categories.
- **Transactions**: Manage income and expenses.

## Migration Status

The following modules have been migrated from Next.js API:

- [x] Categories
- [x] Transactions
- [ ] Budgets
- [ ] Goals
- [ ] Reminders
- [ ] Recurring Transactions
- [ ] Settings
- [ ] Currencies
- [ ] Dashboard

## Database Schema

The database schema is defined in `prisma/schema.prisma`. It uses SQLite by default.
