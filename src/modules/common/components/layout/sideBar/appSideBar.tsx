import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  useSidebar,
} from "#components/ui/sidebar";
import { Link, useLocation } from "@tanstack/react-router";
import { List, Settings, LayoutDashboard, ChevronLeft } from "lucide-react";
import { m } from "#/paraglide/messages";
import { SideBarItems } from "#components/layout/sideBar/sideBarItems";
import { ThemeToggle } from "#components/layout/themeToggle";
import { LanguageToggle } from "#components/layout/languageToggle";
import { cn } from "#lib/utils.ts";

export function AppSideBar() {
  const { pathname } = useLocation();
  const { state, isMobile } = useSidebar();

  const sideBarItemsContent = [
    {
      title: m.tasks_title(),
      href: "/app/task",
      icon: <List className="size-4" />,
    },
  ];

  return (
    <Sidebar
      collapsible="icon"
      variant={isMobile ? "sidebar" : "floating"}
      className="border-r-0 transition-all duration-300 ease-in-out"
    >
      <SidebarHeader className="relative h-16 border-b border-sidebar-border justify-center">
        <div className="flex items-center gap-3 px-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg">
            <LayoutDashboard className="size-4 shrink-0" />
          </div>
          <div className="flex flex-col gap-0.5 group-data-[collapsible=icon]:hidden text-nowrap">
            <span className="font-bold text-lg tracking-tight">
              TanStack Todo
            </span>
          </div>
          {!isMobile && (
            <SidebarTrigger
              className={cn(
                "size-8 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-300",
                "group-data-[collapsible=icon]:absolute group-data-[collapsible=icon]:-right-12 group-data-[collapsible=icon]:top-1/2 group-data-[collapsible=icon]:-translate-y-1/2",
                "group-data-[collapsible=icon]:bg-sidebar group-data-[collapsible=icon]:border group-data-[collapsible=icon]:shadow-md group-data-[collapsible=icon]:rounded-full",
                state === "collapsed" && "rotate-180",
              )}
            >
              <ChevronLeft className="size-4" />
            </SidebarTrigger>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-base font-bold tracking-widest text-accent-foreground">
            {m.sider_bar_title()}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SideBarItems items={sideBarItemsContent} pathname={pathname} />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-sidebar-border/50">
        <SidebarMenu>
          <SidebarMenuItem>
            <LanguageToggle />
          </SidebarMenuItem>
          <SidebarMenuItem>
            <ThemeToggle />
          </SidebarMenuItem>
          {/* <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === "/app/settings"}
              tooltip={m.nav_settings()}
              className="w-full transition-all duration-200"
            >
              <Link to="/app/settings">
                <Settings />
                <span className="font-semibold">{m.nav_settings()}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem> */}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
