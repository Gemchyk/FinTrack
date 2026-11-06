import { useTranslation } from 'react-i18next';
import { useMeQuery } from './components/Profile/profileApi';

// 1 234,50 ₴ in Ukrainian, UAH 1,234.50 in English: the account's currency in the interface language
export function formatMoney(amount: number, currency: string, lang: string): string {
  return new Intl.NumberFormat(lang, { style: 'currency', currency }).format(amount);
}

// JPY 0, USD 2, KWD 3; the server rejects amounts with more decimals than this
export function fractionDigits(currency: string): number {
  return new Intl.NumberFormat('en', { style: 'currency', currency }).resolvedOptions().maximumFractionDigits ?? 2;
}

// The `step` of amount inputs: "1" for JPY, "0.01" for UAH, "0.001" for KWD
export function amountStep(currency: string): string {
  const digits = fractionDigits(currency);
  return (10 ** -digits).toFixed(digits);
}

// Formatting with the signed-in account's currency. Until /me arrives amounts show as plain numbers
export function useMoney() {
  const { i18n } = useTranslation();
  const lang = i18n.resolvedLanguage ?? 'en';
  const currency = useMeQuery().data?.currency;

  return {
    currency,
    format: (amount: number) =>
      currency ? formatMoney(amount, currency, lang) : new Intl.NumberFormat(lang).format(amount),
    step: currency ? amountStep(currency) : '0.01',
  };
}
