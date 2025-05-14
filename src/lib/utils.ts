
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Add date formatting helpers
export function formatDate(date: Date): string {
  return `${padZero(date.getDate())}.${padZero(date.getMonth() + 1)}.${date.getFullYear()}`;
}

export function padZero(num: number): string {
  return num.toString().padStart(2, '0');
}

// Status helpers
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'danger':
      return 'text-red-500';
    case 'warning':
      return 'text-amber-500';
    default:
      return 'text-green-500';
  }
};
