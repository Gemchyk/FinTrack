import Select from 'react-select';
import { useTranslation } from 'react-i18next';

const options = [
  { value: 'all', label: 'All Categories' },
  { value: 'Food', label: 'Food' },
  { value: 'Transport', label: 'Transport' },
  { value: 'Fun', label: 'Fun' },
  { value: 'Shopping', label: 'Shopping' },
  { value: 'Other', label: 'Other' },
];

const customStyles = (theme = 'light') => {
  const colors = {
    light: {
      accent: 'var(--color-accent)',
      accentHover: 'var(--color-accent-hover)',
      bg: 'white',
      textPrimary: 'var(--color-text-primary)',
      menuBg: 'white',
      menuBorder: 'var(--color-accent)',
    },
    dark: {
      accent: 'var(--color-accent)',
      accentHover: 'rgba(79, 195, 177, 0.2)',
      bg: '#1a1a1a',
      textPrimary: 'var(--color-text-primary)',
      menuBg: '#222222',
      menuBorder: 'var(--color-accent)',
    },
  };

  const c = theme === 'dark' ? colors.dark : colors.light;

  return {
    control: (base, state) => ({
      ...base,
      border: `1px solid ${c.accent}`,
      borderRadius: '4px',
      padding: '2px 4px',
      boxShadow: 'none',
      backgroundColor: c.bg,
      cursor: 'pointer',
      minHeight: '36px',
      '&:hover': {
        backgroundColor: state.menuIsOpen ? c.bg : c.accentHover,
      },
      width: '160px',
    }),
    singleValue: (base) => ({
      ...base,
      color: c.accent,
      fontWeight: '600',
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: c.accent,
      padding: '0 6px',
    }),
    option: (base, { isFocused, isSelected }) => ({
      ...base,
      backgroundColor: isSelected
        ? c.accentHover
        : isFocused
        ? c.accentHover
        : c.bg,
      color: c.textPrimary,
      cursor: 'pointer',
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: c.menuBg,
      border: `1px solid ${c.menuBorder}`,
      borderRadius: '4px',
      marginTop: 4,
      zIndex: 100,
    }),
  };
};

export default function CategorySelect({ value, onChange, theme = 'light' }) {
  const { t } = useTranslation();

  const translatedOptions = options.map(opt => ({
    value: opt.value,
    label: t(`${opt.label}`) 
  }));

  return (
    <Select
      options={translatedOptions}
      value={translatedOptions.find((opt) => opt.value === value)}
      onChange={(selected) => onChange(selected.value)}
      styles={customStyles(theme)}
      isSearchable={false}
      theme={(reactSelectTheme) => ({
        ...reactSelectTheme,
        colors: {
          ...reactSelectTheme.colors,
          primary25: theme === 'dark' ? 'rgba(79, 195, 177, 0.2)' : 'var(--color-accent-hover)',
          primary: 'var(--color-accent)',
          neutral0: theme === 'dark' ? '#1a1a1a' : 'white',
          neutral80: 'var(--color-text-primary)',
        },
      })}
    />
  );
}
