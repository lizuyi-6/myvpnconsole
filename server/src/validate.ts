import { z, type ZodType } from "zod";
import { Errors } from "./errors.js";

/** Parse `data` against `schema`, mapping failure to a 400 AppError. */
export function parse<T>(schema: ZodType<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw Errors.validation();
  }
  return result.data;
}

/** Rule shared by the register form and the API — keep them in sync. */
export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Invalid email address.")
  .max(254);
