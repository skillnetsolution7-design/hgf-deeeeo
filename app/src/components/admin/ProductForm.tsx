"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { createProduct, updateProduct } from "@/lib/supabase";
import { ImageManager } from "./ImageManager";
import { Product, ProductWithImages } from "@/types";
import slugify from "slugify";

const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  price: z.coerce.number().positive("Price must be positive"),
  compare_price: z.coerce.number().optional(),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: ProductWithImages;
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const isEditing = !!product;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? {
          name: product.name,
          slug: product.slug,
          description: product.description || "",
          price: product.price,
          compare_price: product.compare_price || undefined,
          stock: product.stock,
          featured: product.featured,
          published: product.published,
        }
      : {
          name: "",
          slug: "",
          description: "",
          price: 0,
          stock: 0,
          featured: false,
          published: false,
        },
  });

  const name = watch("name");

  // Auto-generate slug from name
  useEffect(() => {
    if (!isEditing && name) {
      setValue(
        "slug",
        slugify(name, { lower: true, strict: true, remove: /[*+~.()'"!:@]/g })
      );
    }
  }, [name, setValue, isEditing]);

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);

    try {
      if (isEditing && product) {
        await updateProduct(product.id, {
          ...data,
          compare_price: data.compare_price || null,
        });
        toast({
          title: "Product Updated",
          description: `"${data.name}" has been updated.`,
          variant: "success",
        });
      } else {
        const newProduct = await createProduct({
          ...data,
          compare_price: data.compare_price || null,
        });
        if (newProduct) {
          toast({
            title: "Product Created",
            description: `"${data.name}" has been created.`,
            variant: "success",
          });
          router.push(`/admin/products/${newProduct.id}/edit`);
          return;
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: isEditing
          ? "Failed to update product"
          : "Failed to create product",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/admin/products")}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {isEditing ? "Edit Product" : "New Product"}
          </h1>
          <p className="text-muted-foreground">
            {isEditing
              ? `Editing: ${product?.name}`
              : "Create a new product"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter product name"
                  {...register("name")}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  placeholder="product-slug"
                  {...register("slug")}
                  className={errors.slug ? "border-red-500" : ""}
                />
                {errors.slug && (
                  <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter product description"
                rows={5}
                {...register("description")}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="price">Price (Rs.) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  {...register("price")}
                  className={errors.price ? "border-red-500" : ""}
                />
                {errors.price && (
                  <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="compare_price">Compare Price (Rs.)</Label>
                <Input
                  id="compare_price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Original price"
                  {...register("compare_price")}
                />
              </div>

              <div>
                <Label htmlFor="stock">Stock *</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  placeholder="0"
                  {...register("stock")}
                  className={errors.stock ? "border-red-500" : ""}
                />
                {errors.stock && (
                  <p className="text-red-500 text-xs mt-1">{errors.stock.message}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 pt-2">
              <div className="flex items-center gap-3">
                <Switch
                  id="featured"
                  checked={watch("featured")}
                  onCheckedChange={(checked) => setValue("featured", checked)}
                />
                <Label htmlFor="featured" className="cursor-pointer">
                  Featured Product
                </Label>
              </div>

              <div className="flex items-center gap-3">
                <Switch
                  id="published"
                  checked={watch("published")}
                  onCheckedChange={(checked) => setValue("published", checked)}
                />
                <Label htmlFor="published" className="cursor-pointer">
                  Published
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        {isEditing && product && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Product Images</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageManager
                productId={product.id}
                images={product.images}
                onChange={() => setRefreshKey((k) => k + 1)}
              />
            </CardContent>
          </Card>
        )}

        {/* Submit */}
        <div className="flex items-center gap-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="min-w-[140px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : isEditing ? (
              "Update Product"
            ) : (
              "Create Product"
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/products")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
