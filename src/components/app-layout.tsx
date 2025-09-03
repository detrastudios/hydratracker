"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Droplets, History, Cog, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dasbor", icon: Droplets },
  { href: "/history", label: "Riwayat", icon: History },
  { href: "/settings", label: "Pengaturan", icon: Cog },
];

export function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const desktopNav = (
    <nav className="hidden md:flex flex-col items-start gap-2 p-4 border-r bg-card h-full">
      <Link href="/" className="flex items-center gap-2 mb-4">
        <Droplets className="h-8 w-8 text-primary" />
        <h1 className="text-xl font-bold tracking-tight">HydraTracker</h1>
      </Link>
      {navItems.map((item) => (
        <Button
          key={item.href}
          variant={pathname === item.href ? "secondary" : "ghost"}
          className="w-full justify-start"
          asChild
        >
          <Link href={item.href}>
            <item.icon className="mr-2 h-4 w-4" />
            {item.label}
          </Link>
        </Button>
      ))}
    </nav>
  );

  const mobileHeader = (
    <header className="md:hidden flex items-center justify-between p-4 border-b bg-card">
      <Link href="/" className="flex items-center gap-2">
        <Droplets className="h-6 w-6 text-primary" />
        <h1 className="text-lg font-bold">HydraTracker</h1>
      </Link>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right">
          <nav className="flex flex-col gap-4 mt-8">
            {navItems.map((item) => (
              <Button
                key={item.href}
                variant={pathname === item.href ? "secondary" : "ghost"}
                className="w-full justify-start text-lg py-6"
                asChild
              >
                <Link href={item.href}>
                  <item.icon className="mr-4 h-5 w-5" />
                  {item.label}
                </Link>
              </Button>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );

  return (
    <div className="flex h-screen w-full bg-background font-body">
      {desktopNav}
      <div className="flex flex-col flex-1">
        {mobileHeader}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
