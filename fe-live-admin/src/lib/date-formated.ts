/**
 * A utility function to format dates in "DD/MM/YYYY, H:MM AM/PM" format.
 *
 * @param date - The date or/and time to be formatted. Accepts Date, string, or number.
 * @param includeTime - The boolean flag for including time or not, default value is false.
 * @returns A formatted date string in "DD/MM/YYYY, H:MM AM/PM" if time included and "DD/MM/YYYY if not" .
 */
export function formatDate(date: Date | string | number, includeTime = false): string {
	const parsedDate = typeof date === "string" || typeof date === "number" ? new Date(date) : date;

	if (isNaN(parsedDate.getTime())) {
		throw new Error("Invalid date input");
	}

	const day = String(parsedDate.getDate()).padStart(2, "0");
	const month = String(parsedDate.getMonth() + 1).padStart(2, "0"); // Months are 0-based
	const year = parsedDate.getFullYear();

	return `${day}/${month}/${year}`;
}