// Local calendar dates, never toISOString(): that is UTC, and in Kyiv the first hours of the 1st would
// still belong to the previous month. The server takes the month from the client for the same reason

// YYYY-MM-DD
export function today(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

// YYYY-MM
export function currentMonth(): string {
  return today().slice(0, 7);
}
