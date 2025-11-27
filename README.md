# My TypeScript Express API

TypeScript-based Express API with auth, users, wallets, and books. Validation with Zod, JWT auth, file uploads via Multer, and Swagger documentation.

## Scripts

- `npm run dev`: Start dev server
- `npm test`: Run Jest tests

## Features

- Authentication: Register and login, JWT issued on login.
- User routes: Protected CRUD; require `Authorization: Bearer <token>`.
- Wallets: Auto-created on registration with default balance 20 (min 0). Fetch wallet via protected route.
- Books: CRUD with local file uploads (image/pdf). Only uploader or `ADMIN` can update/delete. Delete-many supported. `isbn` is unique; `price` >= 0.

## Endpoints

- `GET /` – Hello message
- `GET /health` – Health check

Auth

- `POST /api/auth/register` – Register user; returns `{ user, wallet }`
- `POST /api/auth/login` – Login; returns `{ token }`

Users (protected)

- `GET /api/users` – List users (paginated)
- `GET /api/users/:id` – Get user by id
- `PATCH /api/users/:id` – Update user
- `DELETE /api/users/:id` – Delete user

Wallet (protected)

- `GET /api/wallet` – Fetch authenticated user's wallet

Books (protected)

- `GET /api/books` – List books (paginated); `uploadedBy` populated with `firstName` and `lastName`
- `GET /api/books/:id` – Get book by id
- `POST /api/books` – Create book (multipart: `author`, `isbn`, `price`, optional `genre`, `image`, `pdf`)
- `PATCH /api/books/:id` – Update book (multipart optional fields); only uploader or `ADMIN`
- `DELETE /api/books/:id` – Delete book; only uploader or `ADMIN`
- `POST /api/books/delete-many` – Delete multiple books by ids

Swagger UI is available at `/docs`, and the OpenAPI spec at `/openapi.json`.

## Quick Start

1. Install dependencies:

```powershell
npm install
```

2. Environment variables (example):

```powershell
$env:JWT_SECRET = "dev-secret"
```

3. Start dev server:

```powershell
npm run dev
```

4. Register and login:

```powershell
curl -X POST http://localhost:3000/api/auth/register `
   -H "Content-Type: application/json" `
   -d '{"email":"a@b.com","phone":"123","firstName":"A","lastName":"B","username":"ab","password":"secret"}'

$token = (curl -X POST http://localhost:3000/api/auth/login `
   -H "Content-Type: application/json" `
   -d '{"usernameOrEmail":"ab","password":"secret"}').token
```

5. Wallet and Books:

```powershell
# Wallet
curl -X GET http://localhost:3000/api/wallet -H "Authorization: Bearer $token"

# Create book (multipart)
curl -X POST http://localhost:3000/api/books `
   -H "Authorization: Bearer $token" `
   -F "author=Jane Doe" `
   -F "isbn=9781234567890" `
   -F "price=9.99" `
   -F "genre=Fiction" `
   -F "image=@C:\path\to\cover.jpg" `
   -F "pdf=@C:\path\to\book.pdf"
```

Uploads are stored locally under `uploads/images` and `uploads/pdfs`; database stores file paths.
