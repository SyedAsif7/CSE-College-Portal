import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getAssetPath(path) {
  const publicUrl = process.env.PUBLIC_URL || '';
  // Ensure the path starts with a / if it doesn't already, but only if publicUrl is present
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${publicUrl}${normalizedPath}`;
}
