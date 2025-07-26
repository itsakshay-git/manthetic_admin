import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const truncateText = (text, maxLength = 20) =>
  text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
