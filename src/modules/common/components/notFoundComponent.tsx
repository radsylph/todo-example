import { Link } from "@tanstack/react-router";
import { m } from "#/paraglide/messages";

 export function NotFoundComponent(){
    return (
      <main className="page-wrap px-4 py-20 text-center">
        <h1 className="text-4xl font-bold mb-4">404 - {m.about_page()}?</h1>
        <p className="text-(--sea-ink-soft) mb-8">
          {m.not_found()}
        </p>
        <Link
          to="/"
          className="rounded-full bg-(--lagoon-deep) px-6 py-2 text-white no-underline hover:opacity-90"
        >
          {m.brand_name()} - {m.nav_home()}
        </Link>
      </main>
    )
  }