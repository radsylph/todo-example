# Plan: Move the Client Form to the Public Area

## Goal

Make the multi-tab `ClientForm` fillable by anyone (no sign-in) by publishing it as a public route, and add two compact sticky controls (theme + language) to the bottom-right — replacing the sidebar controls that don't exist in the public area.

## Key clarification

- `public/` (project root) is the Vite **static-assets** directory (`favicon.ico`, `manifest.json`, logos). React route components cannot live here.
- `src/routes/public/` is the **public routes** area (already holds `login.tsx`, `register.tsx`).
- This plan adds the form to `src/routes/public/`, **not** the static `public/` folder.

## Decisions (from grilling)

| # | Decision |
|---|---|
| Q1 | New route `src/routes/public/clientForm/index.tsx` → URL `/public/clientForm/` |
| Q2 | Keep the authenticated `/app/clientForm/` route + sidebar item; both versions share the same `ClientForm` |
| Q3 | Refactor the auth gate: `/public/*` reachable signed-out; login/register still redirect signed-in users home; the form is reachable by everyone |
| Q4/Q9 | New `PublicFormControls`: theme button (Sun/Moon) cycles Light → Dark → System → Light; language button shows the current locale (EN/ES) and flips to the next |
| Q5/Q8 | Buttons are `fixed bottom-4 right-4 z-50`, stacked vertically (theme on top, language below) |
| Q7 | Controls render only on the public form; the authenticated form keeps its sidebar toggles |

## File changes

| File | Action |
|---|---|
| `src/routes/public/clientForm/index.tsx` | **Create** — public route |
| `src/modules/common/components/layout/publicFormControls.tsx` | **Create** — sticky theme/language controls |
| `src/routes/__root.tsx` | **Update** — auth gate refactor |
| `CONTEXT.md` | **Create** — glossary (public area / app area / auth pages / public folder) |
| `docs/adr/0001-public-client-form-route.md` | **Create** — ADR for the public-route + auth-gate decision |
| `src/modules/clientForm/PLAN.move-to-public.md` | **Create** — this plan |

**No changes** to `src/routes/app/clientForm/index.tsx`, `appSideBar.tsx`, the `clientForm` module, or `messages/*.json` (existing i18n keys are reused).

## Detailed steps

### 1. New public route — `src/routes/public/clientForm/index.tsx`

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { m } from "#/paraglide/messages";
import { PageContainer } from "#components/layout/pageContainer";
import { PublicFormControls } from "#components/layout/publicFormControls";
import { ClientForm } from "#modules/clientForm/components/clientForm";

export const Route = createFileRoute("/public/clientForm/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <PageContainer
      title={m.client_form_title()}
      description={m.client_form_description()}
    >
      <ClientForm />
      <PublicFormControls />
    </PageContainer>
  );
}
```

> The route tree (`src/routeTree.gen.ts`) regenerates automatically via the TanStack Start Vite plugin on the next `npm run dev` / build.

### 2. Auth gate refactor — `src/routes/__root.tsx`

Replace the current `isAuthPath` allow-list with a public-area check plus an auth-only check:

```ts
const isPublicPath = location.pathname.startsWith("/public");
const isAuthOnlyPath =
  location.pathname === "/public/login" ||
  location.pathname === "/public/register";

if (!session && !isPublicPath) {
  throw redirect({ to: "/public/login", search: { redirect: location.href } });
}

if (session && isAuthOnlyPath) {
  throw redirect({ to: "/" });
}
```

Semantics:

- Signed-out → any non-`/public` route redirects to login; `/public/clientForm` is allowed.
- Signed-in → `/public/login` and `/public/register` still redirect home; `/public/clientForm` is allowed (anyone can use it).

### 3. `PublicFormControls` — `src/modules/common/components/layout/publicFormControls.tsx`

A wrapper `<div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">` with two compact buttons, reusing the existing components' logic and i18n keys:

- **Theme button** — `useTheme()` from `next-themes`; read the current `theme` (`light` | `dark` | `system`, `undefined` during hydration); on click cycle `light → dark → system → light` via `setTheme`. Render `Sun` when `resolvedTheme !== "dark"`, otherwise `Moon`. `aria-label`/`title` from `m.theme_toggle()` / `theme_light` / `theme_dark` / `theme_system`.
- **Language button** — `getLocale`, `setLocale`, `locales` from `#/paraglide/runtime`; show the current locale uppercased (`EN`/`ES`); on click set the next locale in `locales` (wraps around, so it stays correct if a third language is added). Reuse `language_label`, `language_english`, `language_spanish`.

Reference logic (styling to match existing floating-chip tokens in `layout/themeToggle.tsx`):

```tsx
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { getLocale, locales, setLocale } from "#/paraglide/runtime";

const THEME_ORDER = ["light", "dark", "system"] as const;

export function PublicFormControls() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const currentLocale = getLocale();

  const cycleTheme = () => {
    const current = (theme ?? "system") as (typeof THEME_ORDER)[number];
    const next = THEME_ORDER[(THEME_ORDER.indexOf(current) + 1) % THEME_ORDER.length];
    setTheme(next);
  };

  const cycleLocale = () => {
    const next = locales[(locales.indexOf(currentLocale) + 1) % locales.length];
    setLocale(next);
  };

  const isDark = resolvedTheme === "dark";

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <button type="button" onClick={cycleTheme} aria-label={m.theme_toggle()}>
        {isDark ? <Moon className="size-4" /> : <Sun className="size-4" />}
      </button>
      <button type="button" onClick={cycleLocale} aria-label={m.language_label()}>
        {currentLocale.toUpperCase()}
      </button>
    </div>
  );
}
```

### 4. No changes elsewhere

- `/app/clientForm/` route and its sidebar entry stay as-is.
- The `ClientForm` component is shared unchanged between the two routes.

## Validation

1. `npm run dev`, visit `/public/clientForm/` signed-out → form renders, no sidebar, sticky buttons visible at bottom-right.
2. Signed-out → `/app/task` still redirects to `/public/login`.
3. Signed-in → `/public/login` still redirects to `/`; `/public/clientForm/` is accessible.
4. Theme button cycles and persists; language button flips EN↔ES and reloads with the new locale.
5. `npm run typecheck` and `npm run check` (biome) pass.

## Out of scope

- Removing the authenticated `/app/clientForm` (kept per Q2).
- Data persistence (the form already copies to the clipboard only).
- Adding a public entry point/link from the login page.
