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
    typeof date === "string" || typeof date === "number"
      ? new Date(date)
      : date;

  if (isNaN(parsedDate.getTime())) {
    throw new Error("Invalid date input");
  }
  const day = String(parsedDate.getDate()).padStart(2, "0");
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = parsedDate.getFullYear();
  if (includeTime) {
    const min = String(parsedDate.getMinutes()).padStart(2, "0");
    const time = String(parsedDate.getHours()).padStart(2, "0");
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

export function formatDateToCustomFormat(dateInput) {
  const date = new Date(dateInput);

  if (isNaN(date.getTime())) {
    throw new Error("Invalid date input");
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const milliseconds = String(date.getMilliseconds()).padStart(3, '0');

  const offset = date.getTimezoneOffset();
  const offsetSign = offset <= 0 ? '+' : '-';
  const offsetHours = String(Math.abs(Math.floor(offset / 60))).padStart(2, '0');
  const offsetMinutes = String(Math.abs(offset % 60)).padStart(2, '0');

  const timezoneOffset = `${offsetSign}${offsetHours}${offsetMinutes}`;

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds} ${timezoneOffset}`;
}
