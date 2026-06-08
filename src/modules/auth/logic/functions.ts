import { createServerFn } from "@tanstack/react-start";
import { auth } from "#/lib/auth";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";

export const getSessionFn = createServerFn({ method: "GET" })
  .handler(async () => {
    const request = getRequest();
    if (!request) return null;
    
    const session = await auth.api.getSession({
        headers: request.headers
    });
    
    return session;
  });

export const logoutFn = createServerFn({ method: "POST" })
  .handler(async () => {
    const request = getRequest();
    if (!request) return;

    await auth.api.signOut({
        headers: request.headers
    });
  });

export const signUpEmailFn = createServerFn({ method: "POST" })
  .inputValidator(z.object({
    email: z.email(),
    password: z.string().min(6),
    name: z.string(),
  }))
  .handler(async ({ data }) => {
    const request = getRequest();
    if (!request) throw new Error("No request");
    
    return await auth.api.signUpEmail({
        body: data,
        headers: request.headers
    });
  });

export const signInEmailFn = createServerFn({ method: "POST" })
  .inputValidator(z.object({
    email: z.email(),
    password: z.string().min(6),
  }))
  .handler(async ({ data }) => {
    const request = getRequest();
    if (!request) throw new Error("No request");
    
    return await auth.api.signInEmail({
        body: data,
        headers: request.headers
    });
  });

