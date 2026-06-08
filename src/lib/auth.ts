import { betterAuth } from "better-auth";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { db } from "../db/index";
import * as schema from "../db/schema";
import { i18n } from "@better-auth/i18n";

// mejorar las vista de register y login para que sean mas bonitas y explicativas idk

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      ...schema,
    },
  }),
  secret: process.env.BETTER_AUTH_SECRET,

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },
  plugins: [
    i18n({
      detection: ["cookie", "header"],
      localeCookie: "PARAGLIDE_LOCALE",
      translations: {
        en: {
          USER_NOT_FOUND: "User not found",
          INVALID_EMAIL_OR_PASSWORD: "Email or password invalid",
          EMAIL_ALREADY_IN_USE: "Email already in use",
          USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: "The user already exists, use another email",
        },
        es: {
          USER_NOT_FOUND: "Usuario no encontrado",
          INVALID_EMAIL_OR_PASSWORD: "Email o contraseña invalida",
          EMAIL_ALREADY_IN_USE: "Email ya en uso",
          USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: "El usuario ya existe, usa otro email",
        },
      },
    }),
    tanstackStartCookies(),
  ],
});
