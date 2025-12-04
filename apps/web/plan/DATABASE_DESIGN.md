# Budget App - Database Design

## Overview

This document describes the database schema for the Budget App money management application. The application uses **SQLite** with **better-sqlite3** for local data persistence.

**Default Currency:** INR (Indian Rupee - ₹)

---

## Entity Relationship Diagram

```
┌─────────────────┐       ┌─────────────────────┐
│   categories    │       │    transactions     │
├─────────────────┤       ├─────────────────────┤
│ id (PK)         │◄──────│ category (FK)       │
│ name            │       │ id (PK)             │
│ type            │       │ type                │
│ icon            │       │ amount              │
│ color           │       │ currency            │
│ created_at      │       │ description         │
└─────────────────┘       │ date                │
        │                 │ is_recurring        │
        │                 │ recurring_id (FK)   │
        │                 │ tags                │
        │                 │ created_at          │
        │                 │ updated_at          │
        │                 └─────────────────────┘
        │
        ├─────────────────────────────────────────┐
        │                                         │
        ▼                                         ▼
┌─────────────────┐       ┌─────────────────────────────┐
│    budgets      │       │   recurring_transactions    │
├─────────────────┤       ├─────────────────────────────┤
│ id (PK)         │       │ id (PK)                     │
│ category (FK)   │       │ type                        │
│ amount          │       │ amount                      │
│ currency        │       │ currency                    │
│ period          │       │ category (FK)               │
│ spent           │       │ description                 │
│ start_date      │       │ frequency                   │
│ created_at      │       │ start_date                  │
└─────────────────┘       │ end_date                    │
                          │ next_due_date               │
        │                 │ is_active                   │
        │                 │ created_at                  │
        │                 └─────────────────────────────┘
        │
        ├────────────────────────────────────────────────┐
        │                                                │
        ▼                                                ▼
┌─────────────────┐       ┌─────────────────────┐
│     goals       │       │    reminders        │
├─────────────────┤       ├─────────────────────┤
│ id (PK)         │       │ id (PK)             │
│ name            │       │ title               │
│ target_amount   │       │ amount              │
│ current_amount  │       │ currency            │
│ currency        │       │ due_date            │
│ deadline        │       │ category (FK)       │
│ category (FK)   │       │ is_recurring        │
│ icon            │       │ frequency           │
│ color           │       │ is_paid             │
│ is_completed    │       │ notify_before       │
│ created_at      │       │ created_at          │
└─────────────────┘       └─────────────────────┘


┌─────────────────┐       ┌─────────────────────┐
│   currencies    │       │     settings        │
├─────────────────┤       ├─────────────────────┤
│ code (PK)       │       │ id (PK)             │
│ name            │       │ default_currency    │
│ symbol          │       │ theme               │
│ rate            │       │ date_format         │
└─────────────────┘       │ language            │
                          │ notifications_enabled│
                          └─────────────────────┘
```

---

## Tables

### 1. categories

Stores income and expense categories.

| Column     | Type    | Constraints                              | Description                    |
|------------|---------|------------------------------------------|--------------------------------|
| id         | TEXT    | PRIMARY KEY                              | Unique identifier (UUID)       |
| name       | TEXT    | NOT NULL                                 | Category name                  |
| type       | TEXT    | NOT NULL, CHECK (type IN ('income', 'expense')) | Category type         |
| icon       | TEXT    | NOT NULL                                 | Icon name (Lucide icons)       |
| color      | TEXT    | NOT NULL                                 | Hex color code                 |
| created_at | TEXT    | DEFAULT (datetime('now'))                | Record creation timestamp      |

**Indexes:**
- Primary Key on `id`

**Default Categories:**
- **Income:** Salary, Freelance, Investments, Rental Income, Gifts, Other Income
- **Expense:** Rent, Groceries, Utilities, Transportation, Entertainment, Shopping, Healthcare, Education, Dining, Travel, Subscriptions, Insurance, Gifts, Other

---

### 2. transactions

Stores all income and expense transactions.

| Column       | Type    | Constraints                              | Description                    |
|--------------|---------|------------------------------------------|--------------------------------|
| id           | TEXT    | PRIMARY KEY                              | Unique identifier (UUID)       |
| type         | TEXT    | NOT NULL, CHECK (type IN ('income', 'expense')) | Transaction type      |
| amount       | REAL    | NOT NULL                                 | Transaction amount             |
| currency     | TEXT    | NOT NULL, DEFAULT 'INR'                  | Currency code                  |
| category     | TEXT    | NOT NULL, FK → categories(id)            | Category reference             |
| description  | TEXT    |                                          | Transaction description        |
| date         | TEXT    | NOT NULL                                 | Transaction date (YYYY-MM-DD)  |
| is_recurring | INTEGER | DEFAULT 0                                | Is recurring (0=No, 1=Yes)     |
| recurring_id | TEXT    | FK → recurring_transactions(id)          | Link to recurring transaction  |
| tags         | TEXT    |                                          | JSON array of tags             |
| created_at   | TEXT    | DEFAULT (datetime('now'))                | Record creation timestamp      |
| updated_at   | TEXT    | DEFAULT (datetime('now'))                | Last update timestamp          |

**Indexes:**
- Primary Key on `id`
- Foreign Key on `category` → `categories(id)`
- Index on `date` for filtering
- Index on `type` for filtering

---

### 3. budgets

Stores budget limits for categories.

| Column     | Type    | Constraints                              | Description                    |
|------------|---------|------------------------------------------|--------------------------------|
| id         | TEXT    | PRIMARY KEY                              | Unique identifier (UUID)       |
| category   | TEXT    | NOT NULL, FK → categories(id)            | Category reference             |
| amount     | REAL    | NOT NULL                                 | Budget limit                   |
| currency   | TEXT    | NOT NULL, DEFAULT 'INR'                  | Currency code                  |
| period     | TEXT    | NOT NULL, CHECK (period IN ('weekly', 'monthly', 'quarterly', 'yearly')) | Budget period |
| spent      | REAL    | DEFAULT 0                                | Amount spent                   |
| start_date | TEXT    | NOT NULL                                 | Budget start date              |
| created_at | TEXT    | DEFAULT (datetime('now'))                | Record creation timestamp      |

**Indexes:**
- Primary Key on `id`
- Foreign Key on `category` → `categories(id)`

---

### 4. goals

Stores savings goals.

| Column         | Type    | Constraints                   | Description                    |
|----------------|---------|-------------------------------|--------------------------------|
| id             | TEXT    | PRIMARY KEY                   | Unique identifier (UUID)       |
| name           | TEXT    | NOT NULL                      | Goal name                      |
| target_amount  | REAL    | NOT NULL                      | Target savings amount          |
| current_amount | REAL    | DEFAULT 0                     | Current saved amount           |
| currency       | TEXT    | NOT NULL, DEFAULT 'INR'       | Currency code                  |
| deadline       | TEXT    | NOT NULL                      | Goal deadline (YYYY-MM-DD)     |
| category       | TEXT    | FK → categories(id)           | Optional category              |
| icon           | TEXT    | NOT NULL                      | Icon name                      |
| color          | TEXT    | NOT NULL                      | Hex color code                 |
| is_completed   | INTEGER | DEFAULT 0                     | Completed (0=No, 1=Yes)        |
| created_at     | TEXT    | DEFAULT (datetime('now'))     | Record creation timestamp      |

**Indexes:**
- Primary Key on `id`
- Foreign Key on `category` → `categories(id)`

---

### 5. reminders

Stores bill payment reminders.

| Column        | Type    | Constraints                              | Description                    |
|---------------|---------|------------------------------------------|--------------------------------|
| id            | TEXT    | PRIMARY KEY                              | Unique identifier (UUID)       |
| title         | TEXT    | NOT NULL                                 | Reminder title                 |
| amount        | REAL    | NOT NULL                                 | Bill amount                    |
| currency      | TEXT    | NOT NULL, DEFAULT 'INR'                  | Currency code                  |
| due_date      | TEXT    | NOT NULL                                 | Due date (YYYY-MM-DD)          |
| category      | TEXT    | NOT NULL, FK → categories(id)            | Category reference             |
| is_recurring  | INTEGER | DEFAULT 0                                | Is recurring (0=No, 1=Yes)     |
| frequency     | TEXT    | CHECK (frequency IN ('daily', 'weekly', 'biweekly', 'monthly', 'quarterly', 'yearly')) | Recurrence frequency |
| is_paid       | INTEGER | DEFAULT 0                                | Paid status (0=No, 1=Yes)      |
| notify_before | INTEGER | DEFAULT 3                                | Days before due to notify      |
| created_at    | TEXT    | DEFAULT (datetime('now'))                | Record creation timestamp      |

**Indexes:**
- Primary Key on `id`
- Foreign Key on `category` → `categories(id)`
- Index on `due_date` for sorting

---

### 6. recurring_transactions

Stores recurring transaction templates.

| Column        | Type    | Constraints                              | Description                    |
|---------------|---------|------------------------------------------|--------------------------------|
| id            | TEXT    | PRIMARY KEY                              | Unique identifier (UUID)       |
| type          | TEXT    | NOT NULL, CHECK (type IN ('income', 'expense')) | Transaction type      |
| amount        | REAL    | NOT NULL                                 | Transaction amount             |
| currency      | TEXT    | NOT NULL, DEFAULT 'INR'                  | Currency code                  |
| category      | TEXT    | NOT NULL, FK → categories(id)            | Category reference             |
| description   | TEXT    |                                          | Transaction description        |
| frequency     | TEXT    | NOT NULL, CHECK (frequency IN ('daily', 'weekly', 'biweekly', 'monthly', 'quarterly', 'yearly')) | Recurrence frequency |
| start_date    | TEXT    | NOT NULL                                 | Start date (YYYY-MM-DD)        |
| end_date      | TEXT    |                                          | Optional end date              |
| next_due_date | TEXT    | NOT NULL                                 | Next occurrence date           |
| is_active     | INTEGER | DEFAULT 1                                | Active status (0=No, 1=Yes)    |
| created_at    | TEXT    | DEFAULT (datetime('now'))                | Record creation timestamp      |

**Indexes:**
- Primary Key on `id`
- Foreign Key on `category` → `categories(id)`
- Index on `next_due_date` for processing

---

### 7. settings

Stores application settings (single row).

| Column                 | Type    | Constraints                              | Description                    |
|------------------------|---------|------------------------------------------|--------------------------------|
| id                     | INTEGER | PRIMARY KEY, CHECK (id = 1)              | Fixed to 1 (singleton)         |
| default_currency       | TEXT    | NOT NULL, DEFAULT 'INR'                  | Default currency code          |
| theme                  | TEXT    | NOT NULL, DEFAULT 'system', CHECK (theme IN ('light', 'dark', 'system')) | App theme |
| date_format            | TEXT    | NOT NULL, DEFAULT 'MMM dd, yyyy'         | Date display format            |
| language               | TEXT    | NOT NULL, DEFAULT 'en'                   | Language code                  |
| notifications_enabled  | INTEGER | DEFAULT 1                                | Notifications (0=Off, 1=On)    |

**Constraints:**
- Only one row allowed (id = 1)

---

### 8. currencies

Stores currency information and exchange rates.

| Column | Type | Constraints           | Description                    |
|--------|------|-----------------------|--------------------------------|
| code   | TEXT | PRIMARY KEY           | ISO 4217 currency code         |
| name   | TEXT | NOT NULL              | Currency name                  |
| symbol | TEXT | NOT NULL              | Currency symbol                |
| rate   | REAL | NOT NULL, DEFAULT 1   | Exchange rate to base (USD)    |

**Default Currencies:**
| Code | Name            | Symbol | Rate   |
|------|-----------------|--------|--------|
| USD  | US Dollar       | $      | 1.00   |
| EUR  | Euro            | €      | 0.92   |
| GBP  | British Pound   | £      | 0.79   |
| JPY  | Japanese Yen    | ¥      | 149.50 |
| CAD  | Canadian Dollar | C$     | 1.36   |
| AUD  | Australian Dollar| A$    | 1.53   |
| CHF  | Swiss Franc     | CHF    | 0.88   |
| CNY  | Chinese Yuan    | ¥      | 7.24   |
| INR  | Indian Rupee    | ₹      | 83.12  |
| MXN  | Mexican Peso    | $      | 17.15  |

---

## Data Types

| SQLite Type | TypeScript Type | Description                    |
|-------------|-----------------|--------------------------------|
| TEXT        | string          | Variable-length string         |
| REAL        | number          | Floating-point number          |
| INTEGER     | number/boolean  | Integer (0/1 for booleans)     |

---

## Relationships

1. **categories → transactions** (One-to-Many)
   - One category can have many transactions

2. **categories → budgets** (One-to-Many)
   - One category can have multiple budgets (different periods)

3. **categories → goals** (One-to-Many, Optional)
   - Goals can optionally be linked to a category

4. **categories → reminders** (One-to-Many)
   - One category can have many reminders

5. **categories → recurring_transactions** (One-to-Many)
   - One category can have many recurring transactions

6. **recurring_transactions → transactions** (One-to-Many)
   - One recurring template can generate many transactions

---

## API Endpoints

| Resource     | Method | Endpoint                    | Description                    |
|--------------|--------|-----------------------------|--------------------------------|
| Transactions | GET    | /api/transactions           | List all transactions          |
| Transactions | POST   | /api/transactions           | Create transaction             |
| Transactions | GET    | /api/transactions/:id       | Get single transaction         |
| Transactions | PUT    | /api/transactions/:id       | Update transaction             |
| Transactions | DELETE | /api/transactions/:id       | Delete transaction             |
| Categories   | GET    | /api/categories             | List all categories            |
| Categories   | POST   | /api/categories             | Create category                |
| Categories   | PUT    | /api/categories/:id         | Update category                |
| Categories   | DELETE | /api/categories/:id         | Delete category                |
| Budgets      | GET    | /api/budgets                | List all budgets               |
| Budgets      | POST   | /api/budgets                | Create budget                  |
| Budgets      | PUT    | /api/budgets/:id            | Update budget                  |
| Budgets      | DELETE | /api/budgets/:id            | Delete budget                  |
| Goals        | GET    | /api/goals                  | List all goals                 |
| Goals        | POST   | /api/goals                  | Create goal                    |
| Goals        | PUT    | /api/goals/:id              | Update goal                    |
| Goals        | PATCH  | /api/goals/:id              | Contribute to goal             |
| Goals        | DELETE | /api/goals/:id              | Delete goal                    |
| Reminders    | GET    | /api/reminders              | List all reminders             |
| Reminders    | POST   | /api/reminders              | Create reminder                |
| Reminders    | PUT    | /api/reminders/:id          | Update reminder                |
| Reminders    | PATCH  | /api/reminders/:id          | Mark paid/unpaid               |
| Reminders    | DELETE | /api/reminders/:id          | Delete reminder                |
| Recurring    | GET    | /api/recurring              | List recurring transactions    |
| Recurring    | POST   | /api/recurring              | Create recurring               |
| Recurring    | PUT    | /api/recurring/:id          | Update recurring               |
| Recurring    | PATCH  | /api/recurring/:id          | Toggle active status           |
| Recurring    | DELETE | /api/recurring/:id          | Delete recurring               |
| Settings     | GET    | /api/settings               | Get settings                   |
| Settings     | PUT    | /api/settings               | Update settings                |
| Settings     | PATCH  | /api/settings               | Partial update settings        |
| Currencies   | GET    | /api/currencies             | List all currencies            |
| Currencies   | POST   | /api/currencies             | Add currency                   |
| Currencies   | PUT    | /api/currencies/:code       | Update currency                |
| Currencies   | DELETE | /api/currencies/:code       | Delete currency                |
| Dashboard    | GET    | /api/dashboard              | Get dashboard data             |

---

## Performance Considerations

1. **WAL Mode**: SQLite is configured with `journal_mode = WAL` for better concurrency
2. **Indexes**: Key columns used in WHERE clauses are indexed
3. **Connection Pooling**: Single connection reused across requests
4. **Local Storage**: Database file stored in project root (`budget.db`)

---

## Migration Notes

- Database is auto-initialized on first connection
- Default categories and currencies are seeded if tables are empty
- Settings table always has exactly one row (id = 1)
- All monetary values stored as REAL (float) for precision
- Dates stored as TEXT in ISO 8601 format (YYYY-MM-DD)
- Timestamps stored as TEXT using SQLite's `datetime('now')`
