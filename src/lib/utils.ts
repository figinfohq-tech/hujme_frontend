import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = 'INR') {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
  }).format(amount)
}

export function formatDate(date: Date | string | undefined | null) {
  if (!date) return "";

  const d = new Date(date);
  if (isNaN(d.getTime())) return "";

  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}



export function validateFileType(file: File, allowedTypes: string[]) {
  const fileType = file.type.toLowerCase()
  return allowedTypes.some(type => fileType.includes(type))
}

export function validateFileSize(file: File, maxSizeMB = 5) {
  const maxSize = maxSizeMB * 1024 * 1024 // Convert to bytes
  return file.size <= maxSize
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}
