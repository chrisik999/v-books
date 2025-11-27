import { NextFunction, Request, Response } from 'express';
import { AnyZodObject, ZodError } from 'zod';

type Schemas = {
  body?: AnyZodObject;
  query?: AnyZodObject;
  params?: AnyZodObject;
};

function formatZodError(err: ZodError) {
  return err.issues.map((i) => ({
    path: i.path.join('.'),
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
          return res.status(400).json({ error: 'Invalid body', details: formatZodError(result.error) });
        }
        req.body = result.data;
      }

      if (schemas.query) {
        const result = schemas.query.safeParse(req.query);
        if (!result.success) {
          return res.status(400).json({ error: 'Invalid query', details: formatZodError(result.error) });
        }
        req.query = result.data as any;
      }

      if (schemas.params) {
        const result = schemas.params.safeParse(req.params);
        if (!result.success) {
          return res.status(400).json({ error: 'Invalid params', details: formatZodError(result.error) });
        }
        req.params = result.data as any;
      }

      return next();
    } catch (e) {
      return next(e);
    }
  };
}
