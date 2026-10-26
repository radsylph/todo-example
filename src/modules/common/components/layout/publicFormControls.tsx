import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { m } from "#/paraglide/messages";
import { getLocale, locales, setLocale } from "#/paraglide/runtime";
import { Button } from "#components/ui/button";

type ThemeMode = "light" | "dark" | "system";

const THEME_ORDER: ThemeMode[] = ["light", "dark", "system"];

export function PublicFormControls() {
	const { theme, setTheme } = useTheme();
	const currentLocale = getLocale();

	const cycleTheme = () => {
		const current = (theme as ThemeMode | undefined) ?? "system";
		const nextIndex = (THEME_ORDER.indexOf(current) + 1) % THEME_ORDER.length;
		setTheme(THEME_ORDER[nextIndex]);
	};

	const cycleLocale = () => {
		const nextIndex = (locales.indexOf(currentLocale) + 1) % locales.length;
		setLocale(locales[nextIndex]);
	};

	return (
		<div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
			<Button
				type="button"
				variant="outline"
				size="icon"
				className="rounded-full shadow-md"
				onClick={cycleTheme}
				aria-label={m.theme_toggle()}
				title={m.theme_toggle()}
			>
				<div className="relative size-4">
					<Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
					<Moon className="absolute left-0 top-0 h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
				</div>
			</Button>
			<Button
				type="button"
				variant="outline"
				size="icon"
				className="rounded-full shadow-md font-bold"
				onClick={cycleLocale}
				aria-label={m.language_label()}
				title={m.language_label()}
			>
				{currentLocale.toUpperCase()}
			</Button>
		</div>
	);
}
