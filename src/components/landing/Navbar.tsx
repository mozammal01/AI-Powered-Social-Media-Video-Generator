"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Templates", href: "#templates" },
  { label: "Features", href: "#features" },
  { label: "FAQ", href: "#faq" },
];

/** Shared gradient treatment for primary CTAs on the dark canvas. */
const gradientCta =
  "bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 text-white shadow-md shadow-purple-500/30 hover:opacity-90";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /** Smooth-scrolls to an in-page section; falls back to native anchor jump. */
  function handleAnchorClick(
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) {
    const target = document.getElementById(href.slice(1));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuOpen(false);
  }

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled || menuOpen
          ? "border-b border-border/60 bg-background/80 shadow-lg shadow-black/20 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Brand */}
        <Link href="/landing" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-fuchsia-500 text-white shadow-md shadow-purple-500/25">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-fuchsia-300 bg-clip-text text-lg font-bold tracking-tight text-transparent">
            VividAI
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleAnchorClick(e, link.href)}
              className="rounded-lg px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop actions */}
        <div className="hidden items-center gap-2 md:flex">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </Link>
          <Link href="/create-video">
            <Button size="sm" className={gradientCta}>
              Start Creating
            </Button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground md:hidden"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile menu panel */}
      {menuOpen && (
        <div className="border-t border-border/60 bg-background/95 backdrop-blur-xl md:hidden">
          <div className="space-y-1 px-6 py-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleAnchorClick(e, link.href)}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-3 flex gap-2 border-t border-border/60 pt-4">
              <Link href="/dashboard" className="flex-1">
                <Button variant="outline" className="w-full">
                  Sign In
                </Button>
              </Link>
              <Link href="/create-video" className="flex-1">
                <Button className={cn("w-full", gradientCta)}>Start Creating</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}