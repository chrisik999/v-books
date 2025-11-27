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
          "201": { description: "Created" },
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
  },
};

export function setupSwagger(app: Express) {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(spec, { explorer: true }));
  app.get("/openapi.json", (_req, res) => res.json(spec));
}
