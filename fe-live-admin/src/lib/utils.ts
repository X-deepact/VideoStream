import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatFileSize(size: number): string {
  if (size < 0) {
    throw new Error("Size must be a non-negative number.");
  }

  const units = ["B", "KB", "MB", "GB", "TB"];
  let index = 0;

  while (size >= 1024 && index < units.length - 1) {
    size /= 1024;
    index++;
  }

  return `${size.toFixed(2)} ${units[index]}`;
}

export function formatDuration(duration: number): string {
  if (duration < 0) {
    throw new Error("Duration must be a non-negative number.");
  }

  const hours = Math.floor(duration / 3600);
  duration %= 3600;
  const minutes = Math.floor(duration / 60);
  duration %= 60;

  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours} hour(s)`);
  if (minutes > 0) parts.push(`${minutes} minute(s)`);
  if (duration > 0 || parts.length === 0) parts.push(`${duration} second(s)`);

  return parts.join(" ");
}
