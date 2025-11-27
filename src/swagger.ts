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
  },
};

export function setupSwagger(app: Express) {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(spec, { explorer: true }));
  app.get("/openapi.json", (_req, res) => res.json(spec));
}
