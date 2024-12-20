/**
 * A utility function to format dates in "DD/MM/YYYY" format.
 *
 * @param date - The date to be formatted. Accepts Date, string, or number.
 * @returns A formatted date string in "DD/MM/YYYY".
 */
export function formatDate(date: Date | string | number): string {
	const parsedDate = typeof date === "string" || typeof date === "number" ? new Date(date) : date;

	if (isNaN(parsedDate.getTime())) {
		throw new Error("Invalid date input");
	}

	const day = String(parsedDate.getDate()).padStart(2, "0");
	const month = String(parsedDate.getMonth() + 1).padStart(2, "0"); // Months are 0-based
	const year = parsedDate.getFullYear();

	return `${day}/${month}/${year}`;
}