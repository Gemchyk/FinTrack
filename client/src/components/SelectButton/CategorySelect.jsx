import { useTranslation } from 'react-i18next';
import styles from './CategorySelect.module.scss';

export const options = [
  { value: 'all', label: 'All Categories' },
  { value: 'Food', label: 'Food' },
  { value: 'Transport', label: 'Transport' },
  { value: 'Fun', label: 'Fun' },
  { value: 'Shopping', label: 'Shopping' },
  { value: 'Health', label: 'Health' },
  { value: 'Other', label: 'Other' },
];

export default function CategorySelect({ value, onChange, customOptions }) {
  const { t } = useTranslation();

  const finalOprions = customOptions || options;

  const translatedOptions = finalOprions.map(opt => ({
    value: opt.value,
    label: t(`${opt.label}`)
  }));

  const hasMatch = translatedOptions.some((opt) => opt.value === value);

  return (
    <select
      className={styles.select}
      value={hasMatch ? value : ''}
      onChange={(e) => onChange(e.target.value)}
    >
      {!hasMatch && (
        <option value="" disabled hidden>
          {t('Select')}
        </option>
      )}
      {translatedOptions.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
