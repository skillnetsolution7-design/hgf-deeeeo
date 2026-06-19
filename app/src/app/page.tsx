import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { motion } from "framer-motion";
import {
  Truck,
  Banknote,
  Headphones,
  Award,
  Star,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { AnnouncementBar } from "@/components/store/AnnouncementBar";
import { Header } from "@/components/store/Header";
import { Footer } from "@/components/store/Footer";
import { ProductCard } from "@/components/store/ProductCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getProducts, getFeaturedProducts } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Izzy Signature | Premium Products in Sri Lanka",
  description:
    "Discover premium quality products at Izzy Signature. Cash on delivery, islandwide delivery in Sri Lanka.",
  alternates: {
    canonical: "/",
  },
};

// Product Section Component
async function ProductSections() {
  const [featuredProducts, allProducts] = await Promise.all([
    getFeaturedProducts(),
    getProducts(),
  ]);

  // Get images for products
  const { getProductImages } = await import("@/lib/supabase");
  const productsWithImages = await Promise.all(
    allProducts.map(async (p) => ({
      ...p,
      images: await getProductImages(p.id),
    }))
  );

  const featuredWithImages = await Promise.all(
    featuredProducts.map(async (p) => ({
      ...p,
      images: await getProductImages(p.id),
    }))
  );

  return (
    <>
      {/* Featured Products */}
      {featuredWithImages.length > 0 && (
        <section className="py-16 sm:py-20 bg-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-black">
                Featured Products
              </h2>
              <p className="text-muted-foreground mt-2">
                Handpicked items just for you
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredWithImages.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Products */}
      <section id="products" className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-black">
              Our Collection
            </h2>
            <p className="text-muted-foreground mt-2">
              Browse our complete product range
            </p>
          </div>
          {productsWithImages.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {productsWithImages.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No products available yet.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

// Testimonials
const testimonials = [
  {
    name: "Sarah M.",
    text: "Amazing quality! The cash on delivery option made it so easy to order. Will definitely buy again!",
    rating: 5,
  },
  {
    name: "Kumar S.",
    text: "Fast delivery and excellent customer service. The product exceeded my expectations.",
    rating: 5,
  },
  {
    name: "Dilini R.",
    text: "Love the premium quality. Islandwide delivery was so convenient. Highly recommend!",
    rating: 5,
  },
];

export default function HomePage() {
  return (
    <>
      <AnnouncementBar />
      <Header />

      <main className="flex-1">
        {/* Hero Banner */}
        <section className="relative bg-black text-white overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/70" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
            <div className="max-w-2xl">
              <p className="text-gold text-sm font-semibold tracking-widest uppercase mb-4">
                Premium Collection
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-tight mb-6">
                Discover Our Signature Collection
              </h1>
              <p className="text-lg text-white/80 mb-8 max-w-lg">
                Premium quality products delivered to your doorstep with cash on
                delivery across Sri Lanka.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/#products">
                  <Button size="lg" className="text-base px-8">
                    Shop Now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-base px-8 border-white/30 text-white hover:bg-white/10 hover:text-white"
                  >
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Bar */}
        <section className="bg-white py-12 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Truck,
                  title: "Islandwide Delivery",
                  desc: "Free delivery across Sri Lanka",
                },
                {
                  icon: Banknote,
                  title: "Cash On Delivery",
                  desc: "Pay when you receive",
                },
                {
                  icon: Headphones,
                  title: "Fast Support",
                  desc: "24/7 customer service",
                },
                {
                  icon: Award,
                  title: "Premium Quality",
                  desc: "Curated premium products",
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center text-center p-4"
                >
                  <div className="p-3 bg-gold/10 rounded-full mb-3">
                    <feature.icon className="w-6 h-6 text-gold" />
                  </div>
                  <h3 className="font-semibold text-sm">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Products */}
        <Suspense
          fallback={
            <div className="py-20">
              <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {Array(8)
                    .fill(0)
                    .map((_, i) => (
                      <Skeleton key={i} className="h-80 rounded-xl" />
                    ))}
                </div>
              </div>
            </div>
          }
        >
          <ProductSections />
        </Suspense>

        {/* Testimonials */}
        <section className="py-16 sm:py-20 bg-charcoal text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-display font-bold">
                What Our Customers Say
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, i) => (
                <div
                  key={i}
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
                >
                  <div className="flex gap-1 mb-4">
                    {Array(testimonial.rating)
                      .fill(0)
                      .map((_, j) => (
                        <Star
                          key={j}
                          className="w-4 h-4 text-gold fill-gold"
                        />
                      ))}
                  </div>
                  <p className="text-white/80 italic mb-4">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>
                  <p className="text-gold font-medium text-sm">
                    {testimonial.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Banner */}
        <section className="bg-gold py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="text-xl sm:text-2xl font-bold text-black mb-2">
              Shop with Confidence
            </h3>
            <p className="text-black/70 text-sm">
              Cash on Delivery &bull; Islandwide Shipping &bull; Premium Quality
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
