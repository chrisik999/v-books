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
          "201": { description: "Created" },
          "409": { description: "Conflict - ISBN exists" },
          "400": { description: "Bad request" },
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
          "200": { description: "OK" },
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
          "200": { description: "Updated" },
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
          "200": { description: "Deleted" },
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
          "200": { description: "Deleted count returned" },
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
