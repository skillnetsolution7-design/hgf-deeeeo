"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  // Get primary image from the product (will be populated by the query)
  const primaryImage = (product as any).images?.find((img: any) => img.is_primary)?.image_url 
    || (product as any).images?.[0]?.image_url 
    || null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <div className="group bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
        {/* Image */}
        <Link href={`/products/${product.slug}`} className="block relative aspect-square overflow-hidden bg-gray-100">
          {primaryImage ? (
            <Image
              src={primaryImage}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <span className="text-gray-400 text-sm">No image</span>
            </div>
          )}
          {product.compare_price && product.compare_price > product.price && (
            <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              SALE
            </div>
          )}
        </Link>

        {/* Content */}
        <div className="p-4">
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-medium text-gray-900 line-clamp-2 min-h-[2.5rem] hover:text-gold transition-colors">
              {product.name}
            </h3>
          </Link>

          <div className="mt-2 flex items-center gap-2">
            <span className="text-lg font-bold text-gold">
              {formatPrice(product.price)}
            </span>
            {product.compare_price && product.compare_price > product.price && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(product.compare_price)}
              </span>
            )}
          </div>

          <Link href={`/products/${product.slug}`} className="block mt-3">
            <Button className="w-full" size="sm">
              Order Now
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
