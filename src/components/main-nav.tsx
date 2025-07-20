"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Bell, Settings as SettingsIcon, MessageSquare, Video } from "lucide-react";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";

export function MainNav({ clubId, subdivision }: { clubId: string; subdivision: string }) {
  const pathname = usePathname();
  
  const baseHref = `/clubs/${clubId}/${subdivision}`;

  const links = [
    { href: `${baseHref}/dashboard`, label: "Dashboard", icon: LayoutDashboard },
    { href: `${baseHref}/members`, label: "Members", icon: Users },
    { href: `${baseHref}/notice-board`, label: "Notice Board", icon: Bell },
    { href: `${baseHref}/chat`, label: "Chat", icon: MessageSquare },
    { href: `${baseHref}/meetings`, label: "Meetings", icon: Video },
    { href: `${baseHref}/settings`, label: "Settings", icon: SettingsIcon },
  ];

  return (
    <SidebarMenu>
      {links.map((link) => (
        <SidebarMenuItem key={link.href}>
          <SidebarMenuButton
            asChild
            isActive={pathname === link.href}
            className="w-full justify-start"
          >
            <Link href={link.href}>
              <link.icon className="h-4 w-4" />
              <span>{link.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
