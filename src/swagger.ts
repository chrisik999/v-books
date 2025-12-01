import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import { OpenAPIV3 } from "openapi-types";

const spec: OpenAPIV3.Document = {
  openapi: "3.0.3",
  info: {
    title: "My TypeScript Express API",
    version: "1.0.0",
    description: "API documentation",
  },
  servers: [{ url: "/" }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      UploadedBy: {
        type: "object",
        properties: {
          id: { type: "string" },
          firstName: { type: "string" },
          lastName: { type: "string" },
        },
      },
      Book: {
        type: "object",
        properties: {
          id: { type: "string" },
          author: { type: "string" },
          isbn: { type: "string" },
          price: { type: "number", minimum: 0 },
          genre: { type: "string" },
          imagePath: { type: "string" },
          pdfPath: { type: "string" },
          uploadedBy: { $ref: "#/components/schemas/UploadedBy" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      BookResponse: {
        type: "object",
        properties: { book: { $ref: "#/components/schemas/Book" } },
      },
      BookListResponse: {
        type: "object",
        properties: {
          data: { type: "array", items: { $ref: "#/components/schemas/Book" } },
          total: { type: "integer" },
          page: { type: "integer" },
          limit: { type: "integer" },
        },
      },
      DeleteResponse: {
        type: "object",
        properties: { deleted: { type: "boolean" } },
      },
      DeleteManyResponse: {
        type: "object",
        properties: { deletedCount: { type: "integer" } },
      },
    },
  },
  paths: {
    "/api/books": {
      get: {
        summary: "List books (paginated)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "page",
            in: "query",
            schema: { type: "integer", minimum: 1 },
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", minimum: 1, maximum: 100 },
          },
        ],
        responses: {
          "200": {
            description: "Paginated books",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/BookListResponse" },
                example: {
                  data: [
                    {
                      id: "b1",
                      author: "Jane Doe",
                      isbn: "9781234567890",
                      price: 9.99,
                      genre: "Fiction",
                      imagePath: "uploads/images/cover.jpg",
                      pdfPath: "uploads/pdfs/book.pdf",
                      uploadedBy: { id: "u1", firstName: "A", lastName: "B" },
                    },
                  ],
                  total: 1,
                  page: 1,
                  limit: 10,
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Create a book",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["author", "isbn", "price"],
                properties: {
                  author: { type: "string" },
                  isbn: { type: "string" },
                  price: { type: "number", minimum: 0 },
                  genre: { type: "string" },
                  image: { type: "string", format: "binary" },
                  pdf: { type: "string", format: "binary" },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/BookResponse" },
                example: {
                  book: {
                    id: "b1",
                    author: "Jane Doe",
                    isbn: "9781234567890",
                    price: 9.99,
                    genre: "Fiction",
                    imagePath: "uploads/images/cover.jpg",
                    pdfPath: "uploads/pdfs/book.pdf",
                    uploadedBy: { id: "u1", firstName: "A", lastName: "B" },
                  },
                },
              },
            },
          },
          "409": { description: "Conflict - ISBN exists" },
          "400": { description: "Bad request" },
        },
      },
    },
    "/api/books/mine": {
      get: {
        summary: "List books uploaded by the authenticated user",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", minimum: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", minimum: 1, maximum: 100 } },
        ],
        responses: {
          "200": {
            description: "Paginated books",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/BookListResponse" },
                example: {
                  data: [
                    {
                      id: "b1",
                      author: "Jane Doe",
                      isbn: "9781234567890",
                      price: 9.99,
                      genre: "Fiction",
                      imagePath: "uploads/images/cover.jpg",
                      pdfPath: "uploads/pdfs/book.pdf",
                      uploadedBy: { id: "u1", firstName: "A", lastName: "B" },
                    },
                  ],
                  total: 1,
                  page: 1,
                  limit: 10,
                },
              },
            },
          },
          "401": { description: "Unauthorized" },
        },
      },
    },
    "/api/books/{id}": {
      get: {
        summary: "Get book by id",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/BookResponse" },
                example: {
                  book: {
                    id: "b1",
                    author: "Jane Doe",
                    isbn: "9781234567890",
                    price: 9.99,
                    genre: "Fiction",
                    imagePath: "uploads/images/cover.jpg",
                    pdfPath: "uploads/pdfs/book.pdf",
                    uploadedBy: { id: "u1", firstName: "A", lastName: "B" },
                  },
                },
              },
            },
          },
          "404": { description: "Not found" },
        },
      },
      patch: {
        summary: "Update book",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: false,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  author: { type: "string" },
                  isbn: { type: "string" },
                  price: { type: "number", minimum: 0 },
                  genre: { type: "string" },
                  image: { type: "string", format: "binary" },
                  pdf: { type: "string", format: "binary" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Updated",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/BookResponse" },
              },
            },
          },
          "403": { description: "Forbidden" },
          "404": { description: "Not found" },
          "409": { description: "Conflict - ISBN exists" },
        },
      },
      delete: {
        summary: "Delete book",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Deleted",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/DeleteResponse" } },
            },
          },
          "403": { description: "Forbidden" },
          "404": { description: "Not found" },
        },
      },
    },
    "/api/books/delete-many": {
      post: {
        summary: "Delete multiple books",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["ids"],
                properties: {
                  ids: { type: "array", items: { type: "string" } },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Deleted count returned",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/DeleteManyResponse" } },
            },
          },
          "401": { description: "Unauthorized" },
          "400": { description: "Bad request" },
        },
      },
    },
    "/": {
      get: {
        summary: "Root message",
        responses: {
          "200": {
            description: "Hello message",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { message: { type: "string" } },
                },
              },
            },
          },
        },
      },
    },
    "/health": {
      get: {
        summary: "Health check",
        responses: {
          "200": {
            description: "Service health",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string" },
                    uptime: { type: "number" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/auth/register": {
      post: {
        summary: "Register a new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: [
                  "email",
                  "phone",
                  "firstName",
                  "lastName",
                  "username",
                  "password",
                ],
                properties: {
                  email: { type: "string", format: "email" },
                  phone: { type: "string" },
                  firstName: { type: "string" },
                  lastName: { type: "string" },
                  username: { type: "string" },
                  password: { type: "string", maxLength: 20 },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Created with wallet",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    user: { type: "object" },
                    wallet: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        user: { type: "string" },
                        balance: { type: "number", minimum: 0 },
                      },
                    },
                  },
                },
                example: {
                  user: {
                    id: "u1",
                    email: "test@example.com",
                    username: "testuser",
                  },
                  wallet: {
                    id: "w1",
                    user: "u1",
                    balance: 20,
                  },
                },
              },
            },
          },
          "409": { description: "Conflict - unique constraint" },
          "400": { description: "Bad request" },
        },
      },
    },
    "/api/auth/login": {
      post: {
        summary: "Login with username or email and password",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["usernameOrEmail", "password"],
                properties: {
                  usernameOrEmail: { type: "string" },
                  password: { type: "string", maxLength: 20 },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "OK" },
          "401": { description: "Unauthorized" },
          "400": { description: "Bad request" },
        },
      },
    },
    "/api/users": {
      get: {
        summary: "List users (paginated)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "page",
            in: "query",
            schema: { type: "integer", minimum: 1 },
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", minimum: 1, maximum: 100 },
          },
          { name: "q", in: "query", schema: { type: "string" } },
        ],
        responses: {
          "200": {
            description: "Paginated users",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: { type: "array", items: { type: "object" } },
                    total: { type: "integer" },
                    page: { type: "integer" },
                    limit: { type: "integer" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/users/{id}": {
      get: {
        summary: "Get user by id",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": { description: "OK" },
          "404": { description: "Not found" },
        },
      },
      patch: {
        summary: "Update user",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  firstName: { type: "string" },
                  lastName: { type: "string" },
                  phone: { type: "string" },
                  username: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "OK" },
          "404": { description: "Not found" },
          "409": { description: "Conflict" },
        },
      },
      delete: {
        summary: "Delete user",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": { description: "Deleted" },
          "404": { description: "Not found" },
        },
      },
    },
    "/api/wallet": {
      get: {
        summary: "Get authenticated user's wallet",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Wallet",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    wallet: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        user: { type: "string" },
                        balance: { type: "number", minimum: 0 },
                      },
                    },
                  },
                },
                example: {
                  wallet: {
                    id: "w1",
                    user: "u1",
                    balance: 20,
                  },
                },
              },
            },
          },
          "401": { description: "Unauthorized" },
          "404": { description: "Not found" },
        },
      },
    },
  },
};

export function setupSwagger(app: Express) {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(spec, { explorer: true }));
  app.get("/openapi.json", (_req, res) => res.json(spec));
}
