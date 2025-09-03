"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Droplets, History, Cog } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dasbor", icon: Droplets },
  { href: "/history", label: "Riwayat", icon: History },
  { href: "/settings", label: "Pengaturan", icon: Cog },
];

export function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const desktopNav = (
    <aside className="hidden md:flex flex-col w-64 border-r bg-card h-full">
      <div className="flex items-center gap-2 p-4 border-b">
        <Droplets className="h-8 w-8 text-primary" />
        <h1 className="text-xl font-bold tracking-tight">HydraTracker</h1>
      </div>
      <nav className="flex flex-col gap-2 p-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
              pathname === item.href && "bg-muted text-primary"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );

  const mobileHeader = (
     <header className="md:hidden sticky top-0 flex items-center h-16 px-4 border-b bg-background z-10">
        <Link href="/" className="flex items-center gap-2">
            <Droplets className="h-6 w-6 text-primary" />
            <h1 className="text-lg font-bold">HydraTracker</h1>
        </Link>
     </header>
  );

  const mobileNav = (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-card border-t z-10">
      <div className="grid h-full max-w-lg grid-cols-3 mx-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "inline-flex flex-col items-center justify-center px-5 hover:bg-muted font-medium group",
              pathname === item.href
                ? "text-primary"
                : "text-muted-foreground"
            )}
          >
            <item.icon className="w-5 h-5 mb-1" />
            <span className="text-xs">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );

  return (
    <div className="flex h-screen w-full bg-background font-body">
      {desktopNav}
      <div className="flex flex-col flex-1">
        {mobileHeader}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
          {children}
        </main>
        {mobileNav}
      </div>
    </div>
  );
}
