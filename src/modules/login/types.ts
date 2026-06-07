import { z } from "zod";
import { loginSchema } from "./schemas";

export type LoginValues = z.infer<typeof loginSchema>;
