"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Star,
  Eye,
  EyeOff,
  Loader2,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import {
  getAllProductsAdmin,
  deleteProduct,
  updateProduct,
} from "@/lib/supabase";
import { formatPrice, getStockBadge } from "@/lib/utils";
import { Product } from "@/types";

export function ProductsView() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: products, isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: getAllProductsAdmin,
  });

  const filteredProducts = products?.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTogglePublished = async (product: Product) => {
    try {
      await updateProduct(product.id, { published: !product.published });
      toast({
        title: product.published ? "Product Unpublished" : "Product Published",
        variant: "success",
      });
    } catch {
      toast({ title: "Error", description: "Failed to update", variant: "destructive" });
    }
  };

  const handleToggleFeatured = async (product: Product) => {
    try {
      await updateProduct(product.id, { featured: !product.featured });
      toast({
        title: product.featured ? "Removed from Featured" : "Added to Featured",
        variant: "success",
      });
    } catch {
      toast({ title: "Error", description: "Failed to update", variant: "destructive" });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteProduct(deleteId);
      toast({ title: "Product Deleted", variant: "success" });
      setDeleteId(null);
    } catch {
      toast({ title: "Error", description: "Failed to delete", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-muted-foreground">
            Manage your product catalog
          </p>
        </div>
        <Button onClick={() => router.push("/admin/products/new")}>
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Products Table */}
      {isLoading ? (
        <div className="space-y-3">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead>Published</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts && filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => {
                    const stockBadge = getStockBadge(product.stock);
                    const primaryImage = (product as any).images?.find(
                      (img: any) => img.is_primary
                    )?.image_url;

                    return (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                            {primaryImage ? (
                              <Image
                                src={primaryImage}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <Package className="w-6 h-6 text-gray-400 m-auto" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          <Link
                            href={`/products/${product.slug}`}
                            className="hover:text-gold transition-colors"
                          >
                            {product.name}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold text-gold">
                            {formatPrice(product.price)}
                          </span>
                          {product.compare_price && (
                            <span className="ml-2 text-sm text-gray-400 line-through">
                              {formatPrice(product.compare_price)}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={stockBadge.variant as any}>
                            {stockBadge.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <button
                            onClick={() => handleToggleFeatured(product)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              product.featured
                                ? "bg-gold/10 text-gold"
                                : "bg-gray-100 text-gray-400 hover:text-gold"
                            }`}
                          >
                            <Star
                              className={`w-4 h-4 ${
                                product.featured ? "fill-current" : ""
                              }`}
                            />
                          </button>
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={product.published}
                            onCheckedChange={() => handleTogglePublished(product)}
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/admin/products/${product.id}/edit`}>
                              <Button variant="ghost" size="icon">
                                <Pencil className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeleteId(product.id)}
                              className="text-red-500 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <Package className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-muted-foreground">
                        {searchQuery
                          ? "No products match your search"
                          : "No products yet"}
                      </p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Delete Dialog */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure? This will permanently delete the product and all its
              images. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
