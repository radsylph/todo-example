import {
  SidebarMenuButton,
  SidebarMenu,
  SidebarMenuItem,
} from "#components/ui/sidebar";
import { Link } from "@tanstack/react-router";
import { cn } from "#/lib/utils.ts";

interface SideBarItemsProps {
    pathname?: string
    items: {
        title: string;
        href: string;
        icon: React.ReactNode;
    }[];
}

export function SideBarItems({items, pathname}: SideBarItemsProps) {
  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            asChild
            isActive={pathname === item.href}
            tooltip={item.title}
            className={cn(
              "w-full transition-all duration-300 ease-in-out",
              "data-[active=true]:rounded-full data-[active=true]:font-semibold data-[active=true]:scale-105 data-[active=true]:bg-muted-foreground/20"
            )}
          >
            <Link to={item.href}>
              {item.icon}
              <span>{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
