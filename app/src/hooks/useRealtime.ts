"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createClientBrowser } from "@/lib/supabase";

export function useRealtimeProducts() {
  const queryClient = useQueryClient();
  const supabase = createClientBrowser();

  useEffect(() => {
    const channel = supabase
      .channel("products-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products" },
        (payload) => {
          console.log("Realtime product change:", payload);
          // Invalidate all product-related queries
          queryClient.invalidateQueries({ queryKey: ["products"] });
          queryClient.invalidateQueries({ queryKey: ["featured-products"] });
          queryClient.invalidateQueries({ queryKey: ["product"] });
          queryClient.invalidateQueries({ queryKey: ["search"] });
          queryClient.invalidateQueries({ queryKey: ["admin-products"] });
          queryClient.invalidateQueries({ queryKey: ["stats"] });
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "product_images" },
        (payload) => {
          console.log("Realtime image change:", payload);
          queryClient.invalidateQueries({ queryKey: ["products"] });
          queryClient.invalidateQueries({ queryKey: ["product"] });
          queryClient.invalidateQueries({ queryKey: ["admin-products"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, supabase]);
}

export function useRealtimeOrders() {
  const queryClient = useQueryClient();
  const supabase = createClientBrowser();

  useEffect(() => {
    const channel = supabase
      .channel("orders-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        (payload) => {
          console.log("Realtime order change:", payload);
          queryClient.invalidateQueries({ queryKey: ["orders"] });
          queryClient.invalidateQueries({ queryKey: ["recent-orders"] });
          queryClient.invalidateQueries({ queryKey: ["stats"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, supabase]);
}
