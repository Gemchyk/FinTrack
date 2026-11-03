import { useMemo } from 'react';
import type { SelectHTMLAttributes } from 'react';
import { useTranslation } from 'react-i18next';

// The server checks the code against the same Intl list in Node; names follow the interface language
const CURRENCIES = Intl.supportedValuesOf('currency');

function CurrencySelect(props: SelectHTMLAttributes<HTMLSelectElement>) {
  const { i18n } = useTranslation();
  const lang = i18n.resolvedLanguage ?? 'en';
  const names = useMemo(() => new Intl.DisplayNames([lang], { type: 'currency' }), [lang]);

  return (
    <select {...props}>
      {CURRENCIES.map((code) => (
        <option key={code} value={code}>
          {code} — {names.of(code)}
        </option>
      ))}
    </select>
  );
}

export default CurrencySelect;
