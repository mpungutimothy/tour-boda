import Link from "next/link";
import { Globe } from "lucide-react";

const navLinks = [
  { label: "Tours", href: "/tours" },
  { label: "Guides", href: "/guides" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
          <span className="text-primary">Tour-Boda</span>
          <span className="text-ink font-normal hidden sm:inline">Uganda</span>
        </Link>

        {/* Center nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Language / currency switcher */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-sm text-muted-foreground">
            <Globe className="h-4 w-4" />
            <span>EN</span>
            <span className="text-border">|</span>
            <span>UGX</span>
          </div>
        </div>
      </div>
    </header>
  );
}
