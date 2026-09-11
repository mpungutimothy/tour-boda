import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border/40">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:px-6 lg:flex-row lg:px-8">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Tour-Boda Uganda. All rights reserved.
        </p>
        <nav className="flex items-center gap-6">
          <Link href="/privacy" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Privacy
          </Link>
          <Link href="/terms" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Terms
          </Link>
          <Link href="/docs" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Docs
          </Link>
        </nav>
      </div>
    </footer>
  );
}
