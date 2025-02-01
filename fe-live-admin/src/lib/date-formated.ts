import {format, formatDistanceToNow, parse, subDays} from 'date-fns';

/**
 * A utility function to format dates in "DD/MM/YYYY, H:MM AM/PM" format.
 *
 * @param date - The date or/and time to be formatted. Accepts Date, string, or number.
 * @param includeTime - The boolean flag for including time or not, default value is false.
 * @returns A formatted date string in "DD/MM/YYYY, H:MM AM/PM" if time included and "DD/MM/YYYY if not" .
 */
export function formatDate(
  date: Date | string | number,
  includeTime = false
): string {
  const parsedDate =
    typeof date === 'string' || typeof date === 'number'
      ? new Date(date)
      : date;

  if (isNaN(parsedDate.getTime())) {
    throw new Error('Invalid date input');
  }
  const day = String(parsedDate.getDate()).padStart(2, '0');
  const month = String(parsedDate.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = parsedDate.getFullYear();
  if (includeTime) {
    const min = String(parsedDate.getMinutes()).padStart(2, '0');
    const time = String(parsedDate.getHours()).padStart(2, '0');
    return `${day}/${month}/${year} ${time}:${min}`;
  }

  return `${day}/${month}/${year}`;
}

/**
 * A utility function to format dates in "YYYY-MM-DD HH:mm:ss.SSS ±ZZZZ" format.
 *
 * @param dateInput - The date or/and time to be formatted. Accepts Date, string, or number.
 * @returns A formatted date string in "YYYY-MM-DD HH:mm:ss.SSS ±ZZZZ" if time included and "DD/MM/YYYY if not" .
 */

export function formatDateToCustomFormat(
  dateInput: Date,
  timezoneOffset: string
) {
  const date = new Date(dateInput);

  if (isNaN(date.getTime())) {
    throw new Error('Invalid date input');
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const milliseconds = String(date.getMilliseconds()).padStart(3, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds} ${timezoneOffset}`;
}

export function getTimezoneOffsetAsHoursAndMinutes() {
  const offsetMinutes = new Date().getTimezoneOffset();
  const absoluteMinutes = Math.abs(offsetMinutes);

  const hours = Math.floor(absoluteMinutes / 60);
  const minutes = absoluteMinutes % 60;

  const sign = offsetMinutes <= 0 ? '+' : '-'; // Positive offset means behind UTC, so we invert the sign
  return `${sign}${hours.toString().padStart(2, '0')}${minutes
    .toString()
    .padStart(2, '0')}`;
}

export function validateTimestampWithinThreeDays(input: Date): boolean {
  const currentTimestamp = Date.now(); // Current timestamp in milliseconds
  const lowerBound = currentTimestamp;
  const upperBound = currentTimestamp + 3 * 24 * 60 * 60 * 1000; // Add 3 days in milliseconds

  const inputDate = input.getTime();

  return inputDate > lowerBound && inputDate < upperBound;
}

export function formatTimestampToUnixTime(input: Date): number {
  return Math.floor(new Date(input).getTime() / 1000);
}

/**
 * Returns a "time ago" formatted string for the given date.
 *
 * @param date - The date to format.
 * @param addSuffix - Whether to add the "ago" suffix or not (default: true).
 * @returns A string representing the time elapsed since the given date.
 */
export const getTimeAgo = (
  date: Date | string | number,
  addSuffix = true
): string => {
  try {
    // Convert the input to a valid Date object
    const parsedDate =
      typeof date === 'string' || typeof date === 'number'
        ? new Date(date)
        : date;

    // Return the "time ago" formatted string
    return formatDistanceToNow(parsedDate, { addSuffix });
  } catch (error) {
    console.error('Invalid date provided to getTimeAgo:', error);
    return 'Invalid date';
  }
};


export const getYesterday = (
  date: Date | string | number,
): Date | string => {
  try {
    return subDays(date, 1);
  } catch (error) {
    console.error('Invalid date provided to getTimeAgo:', error);
    return 'Invalid date';
  }
}

export const formatDateToReadable = (value: Date | string) => {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const formatDateToHourlyRange = (timeString: string) => {
  const date = parse(timeString, 'yyyy-MM-dd HH:mm', new Date());
  const hour = format(date, 'HH');

  return `${hour}:00 - ${hour}:59`;
}
