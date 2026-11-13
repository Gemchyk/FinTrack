export type Cell = string | number | null;

// Excel takes the list separator and the decimal mark from the regional settings of the computer: ";" and
// a comma in Ukraine, "," and a dot in English-speaking countries. The interface language stands in for the region
const FORMATS: Record<string, { delimiter: string; decimal: string }> = {
  uk: { delimiter: ';', decimal: ',' },
  en: { delimiter: ',', decimal: '.' },
};

// Text is always quoted, so a category the user named `Bills; "home"` stays one cell. Numbers get the
// currency's digits and no thousands separator, so Excel reads them as numbers and can sum them
export function toCsv(rows: Cell[][], lang: string, digits: number): string {
  const { delimiter, decimal } = FORMATS[lang] ?? FORMATS.en;
  const cell = (value: Cell) => {
    if (value === null) return '';
    if (typeof value === 'number') return value.toFixed(digits).replace('.', decimal);
    return `"${value.replaceAll('"', '""')}"`;
  };
  return rows.map((row) => row.map(cell).join(delimiter)).join('\r\n');
}

// The BOM makes Excel read the file as UTF-8; without it Cyrillic names turn into mojibake
export function downloadCsv(text: string, filename: string): void {
  const url = URL.createObjectURL(new Blob(['﻿', text], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  // Some browsers still read the URL after click() returns, so it is not revoked at once
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
