"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Banknote, Truck, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { createOrder } from "@/lib/supabase";
import { formatPrice, getStockBadge, generateWhatsAppMessage, generateWhatsAppUrl } from "@/lib/utils";
import { trackEvent } from "@/components/store/MetaPixel";
import { ProductWithImages } from "@/types";

const orderSchema = z.object({
  customer_name: z.string().min(2, "Name must be at least 2 characters"),
  address: z.string().min(10, "Please enter a complete address"),
  phone_1: z.string().min(10, "Enter a valid phone number"),
  phone_2: z.string().optional(),
});

type OrderFormData = z.infer<typeof orderSchema>;

interface OrderFormProps {
  product: ProductWithImages;
}

export function OrderForm({ product }: OrderFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const stockBadge = getStockBadge(product.stock);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
  });

  const onSubmit = async (data: OrderFormData) => {
    if (product.stock <= 0) {
      toast({
        title: "Out of Stock",
        description: "This product is currently out of stock.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Save order to Supabase
      const order = await createOrder({
        customer_name: data.customer_name,
        address: data.address,
        phone_1: data.phone_1,
        phone_2: data.phone_2 || null,
        product_name: product.name,
        product_price: product.price,
      });

      if (!order) {
        throw new Error("Failed to create order");
      }

      // Track Meta Pixel Purchase event
      trackEvent("Purchase", {
        content_ids: [product.id],
        content_name: product.name,
        value: product.price,
        currency: "LKR",
      });

      toast({
        title: "Order Placed!",
        description: "Redirecting to WhatsApp...",
        variant: "success",
      });

      // Generate WhatsApp message and redirect
      const message = generateWhatsAppMessage(
        product.name,
        product.price,
        data.customer_name,
        data.address,
        data.phone_1,
        data.phone_2
      );

      const whatsappUrl = generateWhatsAppUrl(message);
      window.open(whatsappUrl, "_blank");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      {/* Price Section */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl font-bold text-gold">
            {formatPrice(product.price)}
          </span>
          {product.compare_price && product.compare_price > product.price && (
            <span className="text-lg text-gray-400 line-through">
              {formatPrice(product.compare_price)}
            </span>
          )}
        </div>
        <Badge variant={stockBadge.variant as any}>{stockBadge.label}</Badge>
      </div>

      {/* Trust Badges */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex items-center gap-1.5 text-sm text-gray-600">
          <Banknote className="w-4 h-4 text-gold" />
          Cash on Delivery
        </div>
        <div className="flex items-center gap-1.5 text-sm text-gray-600">
          <Truck className="w-4 h-4 text-gold" />
          Free Delivery
        </div>
        <div className="flex items-center gap-1.5 text-sm text-gray-600">
          <Award className="w-4 h-4 text-gold" />
          Premium Quality
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="font-semibold text-lg mb-4">Order via WhatsApp</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="customer_name">Full Name *</Label>
            <Input
              id="customer_name"
              placeholder="Enter your full name"
              {...register("customer_name")}
              className={errors.customer_name ? "border-red-500" : ""}
            />
            {errors.customer_name && (
              <p className="text-red-500 text-xs mt-1">{errors.customer_name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="address">Delivery Address *</Label>
            <Textarea
              id="address"
              placeholder="Enter your complete delivery address"
              {...register("address")}
              className={errors.address ? "border-red-500" : ""}
            />
            {errors.address && (
              <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="phone_1">Phone Number 1 *</Label>
            <Input
              id="phone_1"
              type="tel"
              placeholder="07X XXX XXXX"
              {...register("phone_1")}
              className={errors.phone_1 ? "border-red-500" : ""}
            />
            {errors.phone_1 && (
              <p className="text-red-500 text-xs mt-1">{errors.phone_1.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="phone_2">Phone Number 2 (Optional)</Label>
            <Input
              id="phone_2"
              type="tel"
              placeholder="07X XXX XXXX"
              {...register("phone_2")}
            />
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-base"
            disabled={isSubmitting || product.stock <= 0}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : product.stock <= 0 ? (
              "Out of Stock"
            ) : (
              "Place Order via WhatsApp"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
