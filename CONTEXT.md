# TanStack Todo

A full-stack task and client-form app (TanStack Start + Better Auth + Paraglide). This context pins down how the app is split into signed-in and public areas.

## Language

**Public area**:
The portion of the app reachable without signing in, rendered without the side navigation. It includes the auth pages and the public client form.
_Avoid_: public folder, public route

**App area**:
The signed-in portion of the app, rendered inside the side navigation and requiring a session.
_Avoid_: private area, authenticated area, authed area

**Auth pages**:
The sign-in and sign-up pages. They live in the public area but are only shown to signed-out users; signed-in users are redirected home.
_Avoid_: public pages, login screen

**Public folder**:
The project's static-assets directory, served verbatim by the bundler. Unrelated to the public area above.
_Avoid_: public area
