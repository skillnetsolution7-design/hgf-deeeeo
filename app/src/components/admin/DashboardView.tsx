"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
  Package,
  ShoppingCart,
  Star,
  DollarSign,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "./StatCard";
import { getDashboardStats, getRecentOrders, getAllProductsAdmin } from "@/lib/supabase";
import { formatPrice, formatDate } from "@/lib/utils";

export function DashboardView() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["stats"],
    queryFn: getDashboardStats,
  });

  const { data: recentOrders, isLoading: ordersLoading } = useQuery({
    queryKey: ["recent-orders"],
    queryFn: () => getRecentOrders(5),
  });

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: getAllProductsAdmin,
  });

  const statusColors: Record<string, "default" | "warning" | "success" | "destructive"> = {
    pending: "warning",
    processing: "default",
    completed: "success",
    cancelled: "destructive",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your store</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsLoading ? (
          Array(4)
            .fill(0)
            .map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))
        ) : (
          <>
            <StatCard
              title="Total Products"
              value={stats?.totalProducts || 0}
              icon={Package}
            />
            <StatCard
              title="Total Orders"
              value={stats?.totalOrders || 0}
              icon={ShoppingCart}
            />
            <StatCard
              title="Featured Products"
              value={stats?.featuredProducts || 0}
              icon={Star}
            />
            <StatCard
              title="Total Revenue"
              value={formatPrice(stats?.totalRevenue || 0)}
              icon={DollarSign}
              trend="Lifetime"
              trendUp
            />
          </>
        )}
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Recent Orders</CardTitle>
          <Link href="/admin/orders">
            <Button variant="ghost" size="sm" className="gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {ordersLoading ? (
            <div className="space-y-3">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
            </div>
          ) : recentOrders && recentOrders.length > 0 ? (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm truncate">
                      {order.customer_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {order.product_name}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    <span className="text-sm font-semibold">
                      {formatPrice(order.product_price)}
                    </span>
                    <Badge variant={statusColors[order.status] || "default"}>
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <ShoppingCart className="w-8 h-8 mx-auto mb-2" />
              <p>No orders yet</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/admin/products">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-gold/10 rounded-lg">
                <Package className="w-6 h-6 text-gold" />
              </div>
              <div>
                <h3 className="font-semibold">Manage Products</h3>
                <p className="text-sm text-muted-foreground">
                  {products?.length || 0} products in store
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/orders">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-gold/10 rounded-lg">
                <TrendingUp className="w-6 h-6 text-gold" />
              </div>
              <div>
                <h3 className="font-semibold">View Orders</h3>
                <p className="text-sm text-muted-foreground">
                  {recentOrders?.length || 0} recent orders
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
