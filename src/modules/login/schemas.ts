import { z } from "zod";
import { m } from "#/paraglide/messages";

export const loginSchema = z.object({
  email: z.email(m.auth_validation_email_invalid()),
  password: z.string().min(6, m.auth_validation_password_min()),
});
