import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function calculateScore(correct: number, total: number): number {
  return Math.round((correct / total) * 100);
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Get the base URL for the application based on environment
 * Production: https://edusync.appwrite.network
 * Development: http://localhost:3000
 */
export function getBaseUrl(): string {
  // Check if we're in production mode
  if (process.env.NODE_ENV === 'production') {
    // Use the production URL from environment or default to your production domain
    return process.env.NEXT_PUBLIC_APP_URL || 'https://edusync.appwrite.network';
  }
  
  // Development mode
  if (typeof window !== 'undefined') {
    // Client-side: use window.location.origin
    return window.location.origin;
  }
  
  // Server-side in development
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
}
