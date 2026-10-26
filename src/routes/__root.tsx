import {
	createRootRoute,
	HeadContent,
	redirect,
	Scripts,
} from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";

import { getLocale } from "#/paraglide/runtime";
import { AppSideBar } from "#components/layout/sideBar/appSideBar";
import { Separator } from "#components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "#components/ui/sidebar";
import { Toaster } from "#components/ui/sonner";
import { getCachedSession } from "#modules/auth/logic/functions";
import { NotFoundComponent } from "../modules/common/components/notFoundComponent";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
	beforeLoad: async ({ location }) => {
		const session = await getCachedSession();
		const isPublicPath = location.pathname.startsWith("/public");
		const isAuthOnlyPath =
			location.pathname === "/public/login" ||
			location.pathname === "/public/register";

		if (!session && !isPublicPath) {
			throw redirect({
				to: "/public/login",
				search: {
					redirect: location.href,
				},
			});
		}

		if (session && isAuthOnlyPath) {
			throw redirect({
				to: "/",
			});
		}

		if (typeof document !== "undefined") {
			document.documentElement.setAttribute("lang", getLocale());
		}

		return {
			session,
		};
	},

	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "TTT | TanStack Todo",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),
	shellComponent: RootDocument,
	notFoundComponent: () => NotFoundComponent(),
});

function RootDocument({ children }: { children: React.ReactNode }) {
	const locale = getLocale();
	const { session } = Route.useRouteContext();

	return (
		<html lang={locale} suppressHydrationWarning>
			<head>
				<HeadContent />
			</head>
			<body>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					{session ? (
						<SidebarProvider>
							<AppSideBar />
							<SidebarInset className="flex flex-col h-svh">
								<header className="flex h-14 shrink-0 items-center gap-2 border-b px-4 md:hidden">
									<SidebarTrigger />
									<Separator orientation="vertical" className="mr-2 h-4" />
									<div className="font-bold">TanStack Todo</div>
								</header>
								<main className="flex-1 overflow-y-auto">{children}</main>
							</SidebarInset>
						</SidebarProvider>
					) : (
						<main className="flex-1 h-svh">{children}</main>
					)}
				</ThemeProvider>

				{/*<TanStackDevtools
					config={{
						position: "bottom-right",
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
					]}
				/>*/}
				<Scripts />
				<Toaster position="top-center" richColors expand />
			</body>
		</html>
	);
}
