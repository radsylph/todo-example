import { createServerFn } from "@tanstack/react-start";
import { auth } from "#/lib/auth";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";

export type Session = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  expiresAt: Date;
  token: string;
  ipAddress?: string | null | undefined;
  userAgent?: string | null | undefined;
};

let cacheSession: Session | null = null;

export const clearSessionCache = () => {
  cacheSession = null;
};

export const getCachedSession = async (): Promise<Session | null> => {
  if (cacheSession) {
    const now = Date.now();
    const createdAt = new Date(cacheSession.createdAt).getTime();
    const expiresAt = new Date(cacheSession.expiresAt).getTime();

    if (expiresAt <= now) {
      cacheSession = null;
    } else {
      const totalLifetime = expiresAt - createdAt;
      const remainingTime = expiresAt - now;

      if (remainingTime < totalLifetime / 2) {
        const fresh = await getSessionFn();

        if (fresh?.session) {
          cacheSession = fresh.session;
        } else {
          cacheSession = null;
        }
      }

      return cacheSession;
    }
  }

  const session = await getSessionFn();

  if (session?.session) {
    cacheSession = session.session;
  }

  return cacheSession;
};

// ── Server functions ──

export const getSessionFn = createServerFn({ method: "GET" }).handler(
  async () => {
    const request = getRequest();
    if (!request) return null;

    const session = await auth.api.getSession({
      headers: request.headers,
    });

    return session;
  },
);

export const logoutFn = createServerFn({ method: "POST" }).handler(async () => {
  const request = getRequest();
  if (!request) return;

  await auth.api.signOut({
    headers: request.headers,
  });
});

export const signUpEmailFn = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      email: z.email(),
      password: z.string().min(6),
      name: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    const request = getRequest();
    if (!request) throw new Error("No request");

    return await auth.api.signUpEmail({
      body: data,
      headers: request.headers,
    });
  });

export const signInEmailFn = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      email: z.email(),
      password: z.string().min(6),
    }),
  )
  .handler(async ({ data }) => {
    const request = getRequest();
    if (!request) throw new Error("No request");

    return await auth.api.signInEmail({
      body: data,
      headers: request.headers,
    });
  });
