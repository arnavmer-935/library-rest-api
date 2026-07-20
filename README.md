# Library REST API

A REST API for managing a book catalog, built with Node.js, Express, and Zod. It supports CRUD operations for books, nested review resources, and flexible filtering, sorting, and pagination through query parameters.

This project was built as a personal milestone in backend development, with a focus on clean route/service separation, consistent API responses, and centralized validation and error handling.

## Tech Stack

- **Node.js** / **Express** — server and routing
- **Zod** — schema validation for request bodies, params, and query strings
- **Morgan** — request logging
- **CORS** — cross-origin support
- **JSON file storage** — lightweight persistence for book and review data

## Project Structure

```
├── app.js                     # Express app setup, middleware, error handling
├── router/
│   └── router.js               # All /books routes
├── services/
│   ├── utils.js                 # Data access, pagination, sorting/filtering logic
│   ├── validator.js             # Zod schemas
│   └── apiError.js              # Custom ApiError class + factory methods
├── middleware/
│   └── validation.js            # Generic schema-validation middleware
└── storage/
    └── books.json                # Book data
```

## Getting Started

```bash
npm install
npm run dev     # starts with nodemon, auto-restarts on changes
# or
npm start        # plain node
```

The server listens on the `PORT` environment variable, or `3000` if none is provided.

## API Reference

All responses are JSON. Successful responses include `"success": true`; errors follow a consistent shape (see [Error Handling](#error-handling)).

### Get all books

```
GET /books
```

Supports the following query parameters, all optional:

| Param          | Type   | Description                                  | Default |
|----------------|--------|-----------------------------------------------|---------|
| `genre`        | string | Filter by genre (case-insensitive)             | —       |
| `minPrice`     | number | Minimum price                                   | —       |
| `maxPrice`     | number | Maximum price                                   | —       |
| `minAvgRating` | number | Minimum average rating (1–5)                    | —       |
| `maxAvgRating` | number | Maximum average rating (1–5)                    | —       |
| `sortBy`       | string | `title` \| `genre` \| `price` \| `avgrating`    | `title` |
| `order`        | string | `asc` \| `desc`                                 | `asc`   |
| `page`         | number | Page number (max 10)                            | `1`     |
| `limit`        | number | Results per page (max 20)                       | `5`     |

Books with no reviews are excluded from `minAvgRating`/`maxAvgRating` filtering, and sort to the end when sorting by `avgrating`.

```
GET /books?genre=programming&sortBy=price&order=desc&limit=10
```

### Get a single book

```
GET /books/:id
```

### Get a book's reviews

```
GET /books/:id/reviews
```

### Create a book

```
POST /books
Content-Type: application/json

{
  "title": "The Pragmatic Programmer",
  "genre": "Programming",
  "price": 49.99
}
```

Duplicate titles (case-insensitive) return a `409 Conflict`.

### Add a review

```
POST /books/:id/reviews
Content-Type: application/json

{
  "rating": 5,
  "comment": "Excellent read."
}
```

`rating` must be between 1 and 5.

### Update a book

```
PATCH /books/:id
Content-Type: application/json

{
  "price": 39.99
}
```

Any subset of `title`, `genre`, and `price` can be included.

- Renaming to a title already used by another book returns a `409 Conflict`.
- Semantic title changes are blocked once a book has reviews. 
- Cosmetic changes (such as capitalization or whitespace) are still allowed.— see [Design Decisions](#design-decisions).

There is no `PUT` endpoint; see [Design Decisions](#design-decisions).

### Delete a book

```
DELETE /books/:id
```

## Error Handling

Validation failures, missing resources, conflicts, and unexpected server errors are all handled by centralized error-handling middleware and returned in a consistent JSON format.
```json
{
  "error": "NotFound",
  "message": "Book with ID 42 not found",
  "details": null
}
```

Validation errors include field-level detail:

```json
{
  "error": "ValidationError",
  "message": "Validation failed",
  "details": [
    { "field": "body.price", "message": "Expected number, received string" }
  ]
}
```

Unmatched routes also return a `404` in this format, rather than Express's default HTML error page.

## Design Decisions

- **No `PUT` endpoint.** With only three updatable fields, `PATCH` already covers full updates; `PUT`'s only distinct behavior would be resetting `reviews`, which conflicts with the rule below.
- Titles can be changed freely until the first review. After reviews exist, only cosmetic changes (for example, capitalization or whitespace) are allowed.
- **Unrated books are excluded from rating filters and sort last.** `getAverageRating()` returns `null` for books with no reviews, distinguishing "no data" from "a rating of zero."
- **Errors are centralized.** All routes forward errors via `next(err)` to a single `ApiError`-aware middleware, keeping response shape and status codes consistent across the API.
- **File-backed storage.** Data resets if `books.json` is replaced or removed. This project intentionally uses a JSON file instead of a database to keep the focus on API design; see [Known Limitations](#known-limitations).

## Known Limitations

- **No transactional storage.** Reads and writes to `books.json` aren't atomic, so concurrent writes can race. A production version would use a database with row-level locking or transactions.
- **No authentication.** Any client can create, update, or delete books.

## Possible Next Steps

- Replace JSON storage with PostgreSQL or SQLite
- Add authentication and role-based authorization
- Add endpoints to edit and delete individual reviews
- Add automated unit and integration tests
- Generate OpenAPI/Swagger documentation
