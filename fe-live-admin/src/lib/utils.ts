import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatFileSize(size: number): string {
  if (size < 0) {
    throw new Error("Size must be a non-negative number.");
  }

  const sizeInMB = size / (1024 * 1024);
  return `${sizeInMB.toFixed(2)} MB`;
}

export function formatDuration(duration: number | string): string {

  if (typeof duration === "string") {
    return duration;
  }

  if (!duration || duration <= 0) {
    return "00:00:00";
  }

  // Convert microseconds to seconds
  const totalSeconds = duration / 1_000_000;

  const hours = Math.floor(totalSeconds / 3600);
  const remainingSeconds = totalSeconds % 3600;
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = Math.floor(remainingSeconds % 60);

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")}`;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
}

/**
 * Converts an object into a query string for use in a URL.
 *
 * @template T - A generic type extending Record<string, unknown>.
 * @param payload - A partial object of type T containing key-value pairs to be mapped to query parameters.
 * @returns A query string representation of the payload (e.g., `key1=value1&key2=value2`).
 *
 * - Handles arrays by appending the same key multiple times with different values (e.g., `key=value1&key=value2`).
 * - Ignores `undefined` and `null` values.
 */
/**
 * Converts an object into a query string for use in a URL.
 *
 * @template T - A generic type extending Record<string, unknown>.
 * @param payload - A partial object of type T containing key-value pairs to be mapped to query parameters.
 * @returns A query string representation of the payload with keys converted to snake_case.
 *
 * - Handles arrays by appending the same key multiple times with different values (e.g., `key=value1&key=value2`).
 * - Ignores `undefined` and `null` values.
 * - Converts camelCase keys to snake_case.
 */
export const mapToQueryString = <T extends Record<string, unknown>>(
  payload: Partial<T>
): string => {
  const queryParams = new URLSearchParams();

  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    const snakeCaseKey = toSnakeCase(key);

    if (Array.isArray(value))
      value.forEach((v) => queryParams.append(snakeCaseKey, v.toString()));
    else queryParams.append(snakeCaseKey, value.toString());
  });

  return queryParams.toString();
};

const toSnakeCase = (str: string): string =>
  str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

export const retrieveAuthToken = () => {
  const userStr = localStorage.getItem("user");
  let user = null;
  if (userStr) user = JSON.parse(userStr);

  if (user && user.token) return user.token;
  return null;
};

export function formatKMBCount(count: number | undefined  ): string {
  if (count === undefined) return '';
  if (count >= 1000000000) return `${(count / 1000000000).toFixed(1)}B`;
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count.toString();
}

export function getAvatarFallbackText(str: string): string {
  return str?.length > 0 ? str.substring(0, 2).toUpperCase() : "PF";
}
export function getRandomColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ("00" + value.toString(16)).slice(-2);
  }
  return color;
}
