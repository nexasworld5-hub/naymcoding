const BANGLA_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export function toBanglaDigits(input: number | string): string {
  return String(input).replace(/\d/g, (digit) => BANGLA_DIGITS[Number(digit)] ?? digit);
}

export function formatTaka(amount: number): string {
  const formatted = Math.round(amount).toLocaleString('en-IN');
  return `৳ ${toBanglaDigits(formatted)}`;
}
