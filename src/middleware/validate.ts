import { NextFunction, Request, Response } from "express";
import { ZodType, ZodError } from "zod";

type Schemas = {
  body?: ZodType<unknown>;
  query?: ZodType<unknown>;
  params?: ZodType<unknown>;
};

function formatZodError(err: ZodError) {
  return err.issues.map((i) => ({
    path: i.path.join("."),
    message: i.message,
    code: i.code,
  }));
}

export function validate(schemas: Schemas) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schemas.body) {
        const result = schemas.body.safeParse(req.body);
        if (!result.success) {
          return res.status(400).json({
            error: "Invalid body",
            details: formatZodError(result.error),
          });
        }
        req.body = result.data;
      }

      if (schemas.query) {
        const result = schemas.query.safeParse(req.query);
        if (!result.success) {
          return res.status(400).json({
            error: "Invalid query",
            details: formatZodError(result.error),
          });
        }
        // Avoid reassigning req.query (getter-only in some Express versions)
        Object.assign(req.query as any, result.data as object);
      }

      if (schemas.params) {
        const result = schemas.params.safeParse(req.params);
        if (!result.success) {
          return res.status(400).json({
            error: "Invalid params",
            details: formatZodError(result.error),
          });
        }
        // Keep req.params reference; merge validated values
        Object.assign(req.params as any, result.data as object);
      }

      return next();
    } catch (e) {
      return next(e);
    }
  };
}
