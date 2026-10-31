"use client";

import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { ArrowLeft, Calendar, Car, Cog, LayoutDashboard } from "lucide-react";
import logo from "@/public/logo.png";
import { BRAND_NAME } from "@/lib/brand";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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

const CRUMB_LABELS = {
  admin: "Dashboard",
  cars: "Cars",
  create: "New car",
  "test-drives": "Test Drives",
  settings: "Settings",
};

function isActive(pathname, href) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function crumbsFor(pathname) {
  const parts = pathname.split("/").filter(Boolean);
  if (parts[0] !== "admin") {
    return [{ label: "Dashboard", href: "/admin" }];
  }
  return parts.map((part, index) => ({
    label: CRUMB_LABELS[part] || part,
    href: `/${parts.slice(0, index + 1).join("/")}`,
  }));
}

export default function AdminShell({ user, defaultOpen = true, children }) {
  const pathname = usePathname();
  const crumbs = crumbsFor(pathname);

  return (
    <SidebarProvider defaultOpen={defaultOpen} className="bg-[#050505] text-white">
      <Sidebar collapsible="icon" className="border-white/[0.08] bg-[#0a0a0b]">
        <SidebarHeader className="gap-1 bg-[#0a0a0b] px-4 py-5 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:items-center">
          <Link
            href="/admin"
            className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center"
          >
            <Image
              src={logo}
              alt={BRAND_NAME}
              width={28}
              height={28}
              priority
              className="hidden size-7 object-contain group-data-[collapsible=icon]:block"
            />
            <span className="truncate font-display text-lg font-semibold uppercase tracking-tight text-white group-data-[collapsible=icon]:hidden">
              {BRAND_NAME}
            </span>
          </Link>
          <p className="font-[family-name:var(--font-label)] text-[10px] uppercase tracking-[0.32em] text-[#ff4d1a] group-data-[collapsible=icon]:hidden">
            Admin
          </p>
        </SidebarHeader>
        <SidebarContent className="bg-[#0a0a0b]">
          <SidebarGroup>
            <SidebarGroupLabel>Showroom</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {routes.map((route) => {
                  const active = isActive(pathname, route.href);
                  const Icon = route.icon;
                  return (
                    <SidebarMenuItem key={route.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        tooltip={route.label}
                        className="border-l-[3px] border-transparent data-[active=true]:border-[#ff4d1a] data-[active=true]:bg-white/5 data-[active=true]:text-white"
                      >
                        <Link href={route.href}>
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
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-white/[0.08] bg-[#0a0a0b]/80 px-3 backdrop-blur-xl md:px-5">
          <SidebarTrigger className="text-white hover:bg-white/5 hover:text-white" />
          <Breadcrumb className="min-w-0">
            <BreadcrumbList className="flex-nowrap text-white/70">
              {crumbs.map((crumb, index) => {
                const last = index === crumbs.length - 1;
                return (
                  <Fragment key={crumb.href}>
                    {index > 0 ? <BreadcrumbSeparator className="text-white/40" /> : null}
                    <BreadcrumbItem className="min-w-0">
                      {last ? (
                        <BreadcrumbPage className="truncate text-white">{crumb.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild className="truncate text-white/70 hover:text-white">
                          <Link href={crumb.href}>{crumb.label}</Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </Fragment>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
          <Button
            asChild
            variant="outline"
            className="ml-auto border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
          >
            <Link href="/">
              <ArrowLeft className="text-[#ff4d1a]" />
              <span className="hidden sm:inline">Back to app</span>
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <span className="hidden max-w-[12rem] truncate text-sm text-white/70 md:inline">
              {user?.name || user?.email}
            </span>
            <UserButton appearance={{ elements: { avatarBox: "h-8 w-8" } }} />
          </div>
        </header>
        <div data-admin className="min-h-[calc(100svh-3.5rem)] bg-[#050505]">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
