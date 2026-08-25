import Link from "next/link";
import { Globe, Mail, MessageCircle, Sparkles } from "lucide-react";

const footerColumns = [
  {
    heading: "Product",
    links: [
      { label: "How It Works", href: "/#how-it-works" },
      { label: "Templates", href: "/dashboard/templates" },
      { label: "Features", href: "/#features" },
      { label: "Start Creating", href: "/create-video" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "FAQ", href: "/#faq" },
      { label: "Dashboard", href: "/dashboard" },
      { label: "My Videos", href: "/dashboard/my-videos" },
      { label: "Settings", href: "/dashboard/settings" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
    ],
  },
];

const socialLinks = [
  { label: "Website", href: "#", icon: Globe },
  { label: "Email", href: "mailto:hello@vividai.studio", icon: Mail },
  { label: "Community", href: "#", icon: MessageCircle },
];

export function Footer() {
  return (
    <footer className="relative border-t border-border/60 bg-card/30">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div className="max-w-sm">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-fuchsia-500 text-white shadow-md shadow-purple-500/25">
                <Sparkles className="h-4 w-4" />
              </span>
              <span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-fuchsia-300 bg-clip-text text-lg font-bold tracking-tight text-transparent">
                VividAI
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              The AI-powered studio that turns product briefs into
              scroll-stopping social media videos — scripted, animated, and
              rendered in seconds.
            </p>
            <div className="mt-6 flex items-center gap-2">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border/70 bg-card/60 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Link columns */}
          {footerColumns.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <h3 className="text-sm font-semibold tracking-tight">
                {column.heading}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} VividAI Labs. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Crafted with Remotion · Rendered in the cloud
          </p>
        </div>
      </div>
    </footer>
  );
}