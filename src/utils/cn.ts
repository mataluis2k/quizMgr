import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';

// Utility for merging tailwind classes conditionally
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}