import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatIdr(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCny(amount: number): string {
  return `¥${amount.toFixed(2)}`;
}

export function generateId(prefix = "FP"): string {
  return `${prefix}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}
