import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Truck,
  Banknote,
  Award,
  ChevronRight,
  Shield,
  RefreshCw,
} from "lucide-react";
import { AnnouncementBar } from "@/components/store/AnnouncementBar";
import { Header } from "@/components/store/Header";
import { Footer } from "@/components/store/Footer";
import { OrderForm } from "@/components/store/OrderForm";
import { ProductCard } from "@/components/store/ProductCard";
import { Badge } from "@/components/ui/badge";
import { getProductBySlug, getProducts } from "@/lib/supabase";
import { formatPrice, getStockBadge } from "@/lib/utils";
import { ProductWithImages } from "@/types";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found | Izzy Signature",
    };
  }

  return {
    title: `${product.name} | Izzy Signature`,
    description:
      product.description?.slice(0, 160) ||
      `Buy ${product.name} at Izzy Signature. Cash on delivery available.`,
    openGraph: {
      title: product.name,
      description: product.description?.slice(0, 160) || "",
      images: product.images[0]?.image_url
        ? [{ url: product.images[0].image_url }]
        : [],
    },
  };
}

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

// Related Products
async function RelatedProducts({
  currentId,
}: {
  currentId: string;
}) {
  const products = await getProducts();
  const related = products.filter((p) => p.id !== currentId).slice(0, 4);

  const { getProductImages } = await import("@/lib/supabase");
  const relatedWithImages = await Promise.all(
    related.map(async (p) => ({
      ...p,
      images: await getProductImages(p.id),
    }))
  );

  if (relatedWithImages.length === 0) return null;

  return (
    <section className="py-12 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-display font-bold mb-8">
          You May Also Like
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedWithImages.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const stockBadge = getStockBadge(product.stock);
  const primaryImage =
    product.images.find((img) => img.is_primary) || product.images[0];

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || "",
    image: product.images.map((img) => img.image_url),
    offers: {
      "@type": "Offer",
      priceCurrency: "LKR",
      price: product.price,
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      url: `https://izzysignature.com/products/${product.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AnnouncementBar />
      <Header />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-gold transition-colors">
                Home
              </Link>
              <ChevronRight className="w-4 h-4" />
              <Link
                href="/#products"
                className="hover:text-gold transition-colors"
              >
                Products
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-foreground truncate max-w-[200px]">
                {product.name}
              </span>
            </nav>
          </div>
        </div>

        {/* Product Detail */}
        <section className="py-8 sm:py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Image Gallery */}
              <div className="space-y-4">
                <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 border">
                  {primaryImage ? (
                    <Image
                      src={primaryImage.image_url}
                      alt={product.name}
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-gray-400">No image</span>
                    </div>
                  )}
                </div>

                {/* Thumbnails */}
                {product.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {product.images.map((img) => (
                      <div
                        key={img.id}
                        className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 cursor-pointer ${
                          img.is_primary
                            ? "border-gold"
                            : "border-gray-200 hover:border-gold/50"
                        }`}
                      >
                        <Image
                          src={img.image_url}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info & Order Form */}
              <div className="space-y-6">
                <div>
                  <Badge
                    variant={stockBadge.variant as any}
                    className="mb-3"
                  >
                    {stockBadge.label}
                  </Badge>
                  <h1 className="text-2xl sm:text-3xl font-display font-bold">
                    {product.name}
                  </h1>
                </div>

                {product.description && (
                  <div className="prose prose-sm max-w-none text-muted-foreground">
                    <p>{product.description}</p>
                  </div>
                )}

                {/* Trust badges */}
                <div className="flex flex-wrap gap-4 py-4 border-y">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Truck className="w-4 h-4 text-gold" />
                    Free Delivery
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Banknote className="w-4 h-4 text-gold" />
                    Cash on Delivery
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="w-4 h-4 text-gold" />
                    Quality Guaranteed
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <RefreshCw className="w-4 h-4 text-gold" />
                    Easy Returns
                  </div>
                </div>

                <OrderForm product={product} />
              </div>
            </div>
          </div>
        </section>

        {/* Related Products */}
        <RelatedProducts currentId={product.id} />
      </main>

      <Footer />
    </>
  );
}
