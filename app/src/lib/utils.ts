import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
    .format(price)
    .replace("LKR", "Rs.");
}

export function generateWhatsAppMessage(
  productName: string,
  price: number,
  customerName: string,
  address: string,
  phone1: string,
  phone2?: string
): string {
  const message = `🛒 NEW ORDER\n\n📦 Product: ${productName}\n💰 Price: ${formatPrice(price)}\n👤 Customer Name: ${customerName}\n🏠 Delivery Address: ${address}\n📱 Phone Number 1: ${phone1}${phone2 ? `\n📱 Phone Number 2: ${phone2}` : ""}\n\n---\nOrder sent from Izzy Signature website`;

  return encodeURIComponent(message);
}

export function getWhatsAppNumber(): string {
  return process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "94784622453";
}

export function generateWhatsAppUrl(message: string, customNumber?: string): string {
  const phoneNumber = customNumber || getWhatsAppNumber();
  return `https://wa.me/${phoneNumber}?text=${message}`;
}

export function generateWhatsAppContactUrl(): string {
  const phoneNumber = getWhatsAppNumber();
  return `https://wa.me/${phoneNumber}`;
}

export function getStockBadge(stock: number): {
  label: string;
  variant: "success" | "warning" | "danger";
} {
  if (stock <= 0) return { label: "Out of Stock", variant: "danger" };
  if (stock < 10) return { label: `Only ${stock} left`, variant: "warning" };
  return { label: "In Stock", variant: "success" };
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
