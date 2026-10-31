"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { ArrowLeft, Calendar, Car, Cog, LayoutDashboard } from "lucide-react";
import { BRAND_NAME } from "@/lib/brand";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const routes = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { label: "Cars", icon: Car, href: "/admin/cars" },
  { label: "Test Drives", icon: Calendar, href: "/admin/test-drives" },
  { label: "Settings", icon: Cog, href: "/admin/settings" },
];

function isActive(pathname, href) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AdminShell({ user, children }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="border-white/10">
        <SidebarHeader className="gap-1 px-4 py-5">
          <Link
            href="/admin"
            className="truncate font-[family-name:var(--font-clash)] text-lg font-semibold uppercase tracking-tight text-white"
          >
            {BRAND_NAME}
          </Link>
          <p className="font-[family-name:var(--font-label)] text-[10px] uppercase tracking-[0.32em] text-[#ff4d1a] group-data-[collapsible=icon]:hidden">
            Admin
          </p>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Showroom</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {routes.map((route) => {
                  const active = isActive(pathname, route.href);
                  const Icon = route.icon;
                  return (
                    <SidebarMenuItem key={route.href}>
                      <SidebarMenuButton asChild isActive={active} tooltip={route.label}>
                        <Link
                          href={route.href}
                          className={active ? "border-l-2 border-[#ff4d1a]" : ""}
                        >
                          <Icon />
                          <span>{route.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
      <SidebarInset className="bg-[#050505] text-white">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-white/10 bg-[#0b0b0c]/95 px-3 backdrop-blur-xl md:px-5">
          <SidebarTrigger className="text-white hover:bg-white/5 hover:text-white" />
          <Button
            asChild
            variant="outline"
            className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
          >
            <Link href="/">
              <ArrowLeft className="text-[#ff4d1a]" />
              <span className="hidden sm:inline">Back to app</span>
            </Link>
          </Button>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden max-w-[12rem] truncate text-sm text-white/70 md:inline">
              {user?.name || user?.email}
            </span>
            <UserButton appearance={{ elements: { avatarBox: "h-9 w-9" } }} />
          </div>
        </header>
        <div data-admin className="min-h-[calc(100svh-4rem)]">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
