// Local calendar dates, never toISOString(): that is UTC, and in Kyiv the first hours of the 1st would
// still belong to the previous month. The server takes the month from the client for the same reason

function localDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

// YYYY-MM-DD
export function today(): string {
  return localDate(new Date());
}

export function yesterday(): string {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return localDate(date);
}

// YYYY-MM
export function currentMonth(): string {
  return today().slice(0, 7);
}
