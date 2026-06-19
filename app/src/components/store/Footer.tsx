"use client";

import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-display font-bold mb-4">
              IZZY <span className="text-gold">SIGNATURE</span>
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Premium quality products delivered to your doorstep across Sri Lanka. 
              Cash on delivery available.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-gold font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { href: "/", label: "Home" },
                { href: "/#products", label: "Shop" },
                { href: "/contact", label: "Contact" },
                { href: "/admin", label: "Admin" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-gold transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-gold font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Cash On Delivery</li>
              <li>Islandwide Delivery</li>
              <li>Premium Quality</li>
              <li>24/7 Support</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-gold font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://wa.me/94784622453"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-400 hover:text-gold transition-colors text-sm"
                >
                  <Phone className="w-4 h-4" />
                  +94 78 462 2453
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@izzysignature.com"
                  className="flex items-center gap-2 text-gray-400 hover:text-gold transition-colors text-sm"
                >
                  <Mail className="w-4 h-4" />
                  info@izzysignature.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                Sri Lanka
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 text-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Izzy Signature. All rights reserved.
          </p>
          <p className="text-gray-600 text-xs mt-1">
            Made with love in Sri Lanka
          </p>
        </div>
      </div>
    </footer>
  );
}
