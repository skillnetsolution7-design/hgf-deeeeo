"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Search, Settings, ShoppingBag } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/#products", label: "Shop" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <button className="p-2 -ml-2 text-gray-700 hover:text-gold transition-colors">
                <Menu className="w-5 h-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] bg-black text-white">
              <div className="flex flex-col gap-6 mt-8">
                <Link href="/" className="text-2xl font-display font-bold text-gold">
                  IZZY SIGNATURE
                </Link>
                <nav className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <SheetClose asChild key={link.href}>
                      <Link
                        href={link.href}
                        className="text-lg text-white/80 hover:text-gold transition-colors py-2 border-b border-white/10"
                      >
                        {link.label}
                      </Link>
                    </SheetClose>
                  ))}
                  <SheetClose asChild>
                    <Link
                      href="/admin"
                      className="text-lg text-white/80 hover:text-gold transition-colors py-2 border-b border-white/10 flex items-center gap-2"
                    >
                      <Settings className="w-4 h-4" />
                      Admin
                    </Link>
                  </SheetClose>
                </nav>
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="flex items-center">
            <h1 className="text-xl sm:text-2xl font-display font-bold text-black tracking-tight">
              IZZY <span className="text-gold">SIGNATURE</span>
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-gold ${
                  pathname === link.href ? "text-gold" : "text-gray-700"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <Link
              href="/search"
              className="p-2 text-gray-700 hover:text-gold transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </Link>
            <Link
              href="/admin"
              className="hidden sm:flex p-2 text-gray-700 hover:text-gold transition-colors"
              aria-label="Admin"
            >
              <Settings className="w-5 h-5" />
            </Link>
            <Link
              href="/#products"
              className="p-2 text-gray-700 hover:text-gold transition-colors lg:hidden"
              aria-label="Shop"
            >
              <ShoppingBag className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
