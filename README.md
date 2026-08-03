# Library REST API

A REST API for managing a book catalog and user reviews, built with Node.js, Express, and MySQL. Includes JWT-based authentication, role-based access control, request validation, and a full automated test suite.

## Live Demo:
- **API Base URL:** [https://your-api.onrender.com/api/v1](https://library-rest-api-j3ri.onrender.com/api/v1)
- **Swagger Docs:** [https://your-api.onrender.com/api/v1/docs](https://library-rest-api-j3ri.onrender.com/api/v1/docs)
- **Health Check:** [https://library-rest-api-j3ri.onrender.com/api/v1/health](https://library-rest-api-j3ri.onrender.com/api/v1/health)

## Features

- Book catalog with create, read, update, and delete operations
- Filtering, sorting, and pagination on the book listing endpoint
- User-submitted reviews with ownership-based access rules
- Role-based access control (regular users vs. admins)
- Request validation on every endpoint
- Automated test suite with an isolated test database

## Architecture Overview

```
Client
  │
  ▼
Express App
  │
  ▼
Middleware  (Helmet → CORS → Rate Limiting → JWT Auth → Request Validation)
  │
  ▼
Controllers  (business logic)
  │
  ▼
Sequelize  (ORM layer)
  │
  ▼
MySQL  (persistence)
```

Every request passes through the same middleware pipeline before reaching a controller, and every controller talks to the database exclusively through Sequelize models — no raw queries.


## Tech Stack

| Layer | Choice |
|---|---|
| Runtime | Node.js, Express |
| Database | MySQL, via Sequelize |
| Validation | Zod |
| Authentication | JSON Web Tokens, bcrypt for password hashing |
| Testing | Vitest, Supertest |


## Project Structure

```
├── app.js              # Express app, middleware, error handling
├── server.js            # Entry point
├── config/                # Sequelize configuration
├── controllers/             # Route handlers
├── middleware/                # Auth, RBAC, validation, rate limiting
├── migrations/                  # Sequelize migrations
├── models/                        # Sequelize models and associations
├── routes/                          # Express routers
├── services/                          # Validation schemas, error class, query helpers
├── tests/                                # Vitest + Supertest suite
│   ├── fixtures/                           # Seeding and database reset helpers
│   └── helpers/                              # JWT generation for authenticated tests
└── docs/                                       # OpenAPI specification
```

## Getting Started

### Requirements

Node.js and a running MySQL instance.

### 1. Install dependencies

```bash
git clone https://github.com/arnavmer-935/library-rest-api.git
cd library_REST_API
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env` and fill in your own values (see the Environment Variables section below).

### 3. Set up the database

```bash
npx sequelize-cli db:create
npx sequelize-cli db:migrate
```

Migrations are used instead of syncing models directly, so the schema is defined explicitly and applied the same way across development, testing, and production, rather than relying on Sequelize to infer it at runtime.

### 4. Start the server

```bash
npm run dev
```

The API is available at `http://localhost:3000` (or whichever port is set).

## Environment Variables

| Variable | Purpose |
|---|---|
| `DB_USER` | MySQL username |
| `DB_PASSWD` | MySQL password |
| `DB_NAME` | Development database name |
| `TEST_DB_NAME` | Separate database used only when running tests |
| `PROD_DB_NAME` | Production database name |
| `DB_HOST` | MySQL host |
| `DB_PORT` | MySQL port |
| `DB_DIALECT` | Database dialect (mysql) |
| `JWT_SECRET_KEY` | Secret used to sign and verify JWTs |
| `APP_PORT` | Port the server listens on |

A `.env.example` file with placeholder values is included as a starting point.

## Authentication & Authorization

- Login issues a JWT containing the user's ID and role, sent via `Authorization: Bearer <token>` on protected routes.
- Two roles: regular users and admins.
- Book management (create, update, delete) is admin-only.
- Reviews use ownership-based rules instead: users can always edit or delete their own review; admins can delete any review but cannot edit one that isn't theirs, keeping moderation and authorship separate.

## Security

- **JWT authentication** on every protected route, verified before any business logic runs.
- **Password hashing with bcrypt** — plaintext passwords are never stored.
- **Constant-time login responses** — login takes the same amount of time whether or not the account exists, to avoid leaking valid usernames or emails through response timing.
- **Request validation with Zod** on every endpoint, rejecting malformed input before it reaches a controller.
- **Rate limiting**, tuned differently for authentication endpoints versus general read/write traffic.
- **Security headers via Helmet.**

## API Reference

Full endpoint documentation, request/response schemas, and example payloads are available in the OpenAPI spec:

- [`docs/openapi.yaml`](./docs/openapi.yaml)

The spec can be viewed interactively by importing it into tools like Swagger UI or Postman.

### Example: Logging In

**Request**
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "identifier": "alice",
  "password": "correcthorsebattery"
}
```

**Response — 200 OK**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "user_id": 1,
    "username": "alice",
    "email": "alice@example.com",
    "role": "USER"
  }
}
```

## Design Decisions

- **Titles lock once a book has reviews.**
Once a book has at least one review attached, its title can no longer be changed, since existing reviews are implicitly tied to that title. Every other field (price, genre, author) can still be updated freely.

- **Reviews are owned by the authenticated user, never by client-supplied input.**
The user attached to a review is always taken from the verified JWT, not from the request body. This closes off a class of bug where a request could otherwise claim to be submitted by someone else.

- **Admins can delete reviews but not edit them.** Moderation and authorship are treated as separate concerns — an admin can remove something inappropriate without ever being able to alter what a user actually wrote.

- **Price is stored as a decimal, not a float.** This avoids rounding issues with currency, and the value is explicitly cast back to a number before being returned in API responses.

- **The test suite runs against a fully separate database.**
The target database is selected automatically based on the environment the process is started in, so running tests never touches development data.

## Testing

The test suite covers authentication, authorization rules, book and review management, validation, error handling, and rate limiting.

Before running tests for the first time, create a separate test database and run migrations against it:

```bash
npx sequelize-cli db:create --env test
npx sequelize-cli db:migrate --env test
```

Then run the suite:

```bash
npm test
```

Each test run resets and reseeds the test database automatically, so every test starts from a known, clean state.

**Current metrics:**

| Metric | Value |
|---|---|
| Total tests | 60 |
| Line coverage | 93.45% |
| Branch coverage | 80.18% |

## Known Limitations

- There's no refresh token flow — sessions expire and require logging in again.
- Rate limiting is tracked in memory, which works for a single server instance but wouldn't hold up correctly across multiple instances in production.
- There's no automated CI pipeline yet; tests are run locally.

## License and Contact

- Maintainer: Arnav Merani
- GitHub: arnavmer-935
- License: MIT
