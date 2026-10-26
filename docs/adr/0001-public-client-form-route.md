# Expose the client form as a public route

Status: accepted

The client form was only reachable behind sign-in at `/app/clientForm/`. We now also serve the same `ClientForm` component at `/public/clientForm/`, so anyone can fill it without an account, and we render compact theme/language buttons there because the public area has no sidebar. We split the auth gate into a *public area* (`/public/*`, reachable when signed out) versus *auth pages* (login/register, which still redirect signed-in users home), leaving the form reachable by everyone. This is safe because the form persists nothing — on submit it only copies a structured summary to the clipboard.

## Consequences

- Signed-in users can also open `/public/clientForm/`; they are not redirected away (unlike login/register).
- `public/` (project root) is the static-assets directory and is unrelated to the `/public/*` route area — the form lives in `src/routes/public/`.
- The authenticated `/app/clientForm/` remains unchanged; both routes share the same `ClientForm`.
