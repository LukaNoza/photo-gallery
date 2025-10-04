"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="border-b border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold text-foreground">
              PhotoGallery
            </Link>
            <div className="flex gap-4">
              <Link
                href="/"
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === "/" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Home
              </Link>
              <Link
                href="/history"
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === "/history" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                History
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
