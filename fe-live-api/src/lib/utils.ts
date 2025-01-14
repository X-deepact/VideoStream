import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Filters an array of objects based on a list of IDs.
 *
 * @param data - Array of objects to filter.
 * @param ids - Array of IDs to match.
 * @param idKey - Key of the object that contains the ID.
 * @returns Array of objects with matching IDs.
 */
export function getObjectsByIds<T, K extends keyof T>(
  data: T[],
  ids: (string | number)[],
  idKey: K
): T[] {
  const idSet = new Set(ids);
  return data.filter((item) => idSet.has(item[idKey] as string | number));
}

export function convertToHashtagStyle(str: string): string {
  return `#${str.replace(/\s+/g, '&').toLowerCase()}`;
}

export function capitalizeFirstLetter(str: string): string {
  return String(str).charAt(0).toUpperCase() + String(str).slice(1);
}

export function getAvatarFallbackText(str: string): string {
  return str?.length > 0 ? str.substring(0, 2).toUpperCase() : 'PF';
}

/**
 *
 * @param count (number)
 * @returns count in K, M, B format (eg: 1k, 2M, 1.3B likes, comments, etc)
 */
export function formatKMBCount(count: number | undefined): string {
  if (count === undefined) return '';
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}k`;
  return count.toString();
}

export const mapToQueryString = <T extends Record<string, unknown>>(
  payload: Partial<T>
): string => {
  const queryParams = new URLSearchParams();

  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (Array.isArray(value)) {
      value.forEach((v) => queryParams.append(key, v.toString())); // eg: category_ids=2&category_ids=4
    } else {
      queryParams.append(key, value.toString());
    }
  });

  return queryParams.toString();
};
