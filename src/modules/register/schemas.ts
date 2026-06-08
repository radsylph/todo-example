import { z } from "zod";
import { m } from "#/paraglide/messages";

export const registerSchema = z.object({
  name: z.string().min(2, m.auth_validation_name_min()),
  email: z.email(m.auth_validation_email_invalid()),
  password: z.string().min(6, m.auth_validation_password_min()),
});
