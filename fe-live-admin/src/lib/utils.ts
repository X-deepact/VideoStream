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

  const nanosToSeconds = duration / 1e9;
  const hours = Math.floor(nanosToSeconds / 3600);
  const remainingSeconds = nanosToSeconds % 3600;
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = Math.floor(remainingSeconds % 60);

  return `${String(hours).padStart(2, '0')}.${String(minutes).padStart(2, '0')}.${String(seconds).padStart(2, '0')}`;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
}