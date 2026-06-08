import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  useSidebar,
} from "#components/ui/sidebar";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { List, LayoutDashboard, ChevronLeft, LogOut } from "lucide-react";
import { m } from "#/paraglide/messages";
import { SideBarItems } from "#components/layout/sideBar/sideBarItems";
import { ThemeToggle } from "#components/layout/themeToggle";
import { LanguageToggle } from "#components/layout/languageToggle";
import { cn } from "#lib/utils.ts";
import { Button } from "#components/ui/button";
import { logoutFn } from "#modules/auth/logic/functions.ts";
import { useState } from "react";
import { ConfirmDialog } from "#components/layout/confirmDialog";

export function AppSideBar() {
  const { pathname } = useLocation();
  const { state, isMobile } = useSidebar();
  const navigate = useNavigate();
  const [confirmLogout, setConfirmLogout] = useState(false);

  const handleLogout = async () => {
    await logoutFn();
    navigate({ to: "/public/login" });
  };

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
      className="transition-all duration-300 ease-in-out bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60"
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
          <SidebarGroupContent className="mt-6">
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
          <SidebarMenuItem>
            <Button
              variant="ghost"
              size="icon"
              className="w-full justify-start gap-2 px-2 hover:text-sidebar-accent-foreground hover:bg-red-500/10"
              onClick={() => setConfirmLogout(true)}
            >
              <LogOut className="size-4 text-rose-500" />
              <p className="group-data-[collapsible=icon]:hidden text-rose-500">
                {m.logout()}
              </p>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <ConfirmDialog
        open={confirmLogout}
        onOpenChange={setConfirmLogout}
        title={m.auth_logout_confirm_title()}
        description={m.auth_logout_confirm_description()}
        onConfirm={handleLogout}
        isDestructive
        confirmBtnText={m.logout()}
        icon={<LogOut className="size-4" />}
      />
    </Sidebar>
  );
}
