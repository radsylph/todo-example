import { z } from "zod";
import { registerSchema } from "./schemas";

export type RegisterValues = z.infer<typeof registerSchema>;
