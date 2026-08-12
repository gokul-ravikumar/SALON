import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";

type RequestSource = "body" | "query";

export const validateRequest =
  (schema: ZodType, source: RequestSource = "body") =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    if (source === "body") {
      req.body = result.data;
    }

    next();
  };
