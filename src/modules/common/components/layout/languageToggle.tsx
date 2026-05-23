import { Languages } from "lucide-react"

import { Button } from "#components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "#components/ui/dropdown-menu"
import { locales, setLocale, getLocale } from "#/paraglide/runtime"
import { m } from "#/paraglide/messages"

export function LanguageToggle() {
  const currentLocale = getLocale()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="w-full justify-start gap-2 px-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
          <Languages className="size-4" />
          <p className="group-data-[collapsible=icon]:hidden">{m.language_label()}</p>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {(locales).map((locale) => (
          <DropdownMenuItem 
            key={locale} 
            onClick={() => setLocale(locale)}
            className={currentLocale === locale ? "bg-accent font-medium text-accent-foreground" : ""}
          >
            {locale === "es" ? m.language_spanish() : locale === "en" ? m.language_english() : locale}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
