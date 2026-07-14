export function isValidISBN(isbn: string): boolean {
  if (!isbn) return false;
  const value = isbn.replace(/[\s-]/g, "");

  if (value.length === 10) return isValidISBN10(value);
  if (value.length === 13) return isValidISBN13(value);

  return false;
}

function isValidISBN10(isbn: string): boolean {
  if (!/^\d{9}[\dX]$/i.test(isbn)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += Number(isbn[i]) * (10 - i);
  }
  const last = isbn[9].toUpperCase() === "X" ? 10 : Number(isbn[9]);
  sum += last;
  return sum % 11 === 0;
}

function isValidISBN13(isbn: string): boolean {
  if (!/^\d{13}$/.test(isbn)) return false;
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const digit = Number(isbn[i]);
    sum += digit * (i % 2 === 0 ? 1 : 3);
  }
  const checkDigit = (10 - (sum % 10)) % 10;
  return checkDigit === Number(isbn[12]);
}