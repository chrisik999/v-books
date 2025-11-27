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
  },
};

export function setupSwagger(app: Express) {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(spec, { explorer: true }));
  app.get("/openapi.json", (_req, res) => res.json(spec));
}
