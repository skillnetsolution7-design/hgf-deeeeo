"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Package, Loader2 } from "lucide-react";
import { AnnouncementBar } from "@/components/store/AnnouncementBar";
import { Header } from "@/components/store/Header";
import { Footer } from "@/components/store/Footer";
import { ProductCard } from "@/components/store/ProductCard";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { searchProducts, getProductImages } from "@/lib/supabase";
import { Product } from "@/types";

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setProducts([]);
      setSearched(false);
      return;
    }

    setLoading(true);
    setSearched(true);

    try {
      const results = await searchProducts(searchQuery);
      // Get images for each product
      const withImages = await Promise.all(
        results.map(async (p) => ({
          ...p,
          images: await getProductImages(p.id),
        }))
      );
      setProducts(withImages);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);

    // Update URL
    const url = new URL(window.location.href);
    url.searchParams.set("q", query);
    window.history.pushState({}, "", url.toString());
  };

  return (
    <main className="flex-1 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-display font-bold mb-4">
            Search Products
          </h1>
          <form onSubmit={handleSubmit} className="max-w-xl mx-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search by product name or description..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-12 h-12 text-base"
            />
          </form>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-80 rounded-xl" />
              ))}
          </div>
        ) : searched ? (
          <>
            <p className="text-muted-foreground mb-6">
              {products.length > 0
                ? `Showing ${products.length} result${
                    products.length !== 1 ? "s" : ""
                  } for "${query}"`
                : `No products found matching "${query}"`}
            </p>

            {products.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-muted-foreground">
              Enter a search term to find products
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

export default function SearchPage() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <Suspense
        fallback={
          <main className="flex-1 py-12">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-gold" />
            </div>
          </main>
        }
      >
        <SearchContent />
      </Suspense>
      <Footer />
    </>
  );
}
