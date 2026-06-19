import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Izzy Signature | Premium Products in Sri Lanka",
  description:
    "Discover premium quality products at Izzy Signature. Cash on delivery, islandwide delivery in Sri Lanka.",
  openGraph: {
    title: "Izzy Signature | Premium Products in Sri Lanka",
    description:
      "Discover premium quality products at Izzy Signature. Cash on delivery, islandwide delivery in Sri Lanka.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-cream">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
