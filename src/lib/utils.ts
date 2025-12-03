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

export const calculateDaysStay = (checkinDate: any, checkoutDate: any) => {
  const checkin = new Date(checkinDate);
  const checkout = new Date(checkoutDate);

  // Difference in milliseconds
  const diffTime = checkout - checkin;

  // Convert ms → days
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
};


export const convertToISO = (dateObj, timeStr) => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  const d = new Date(dateObj);
  d.setHours(hours);
  d.setMinutes(minutes);
  return d.toISOString(); // final format API needs
};