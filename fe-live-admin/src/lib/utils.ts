import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatFileSize(size: number): string {
  if (size < 0) {
    throw new Error("Size must be a non-negative number.");
  }

  const sizeInMB = size / (1024 * 1024);
  return `${sizeInMB.toFixed(2)} MB`;
}

export function formatDuration(duration: number): string {
  if (duration < 0) {
    throw new Error("Duration must be a non-negative number.");
  }

  // Convert nanoseconds to seconds
  const totalSeconds = Math.floor(duration / 1_000_000_000);
  
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${String(hours).padStart(2, '0')}.${String(minutes).padStart(2, '0')}.${String(seconds).padStart(2, '0')}`;
}
