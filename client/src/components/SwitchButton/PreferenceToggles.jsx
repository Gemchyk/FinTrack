import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import Toggle from './Toggle';
import styles from './PreferenceToggles.module.scss';
import { ThemeContext } from '../../context/ThemeContext.jsx';

function PreferenceToggles() {
  const { i18n } = useTranslation();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const currentLang = i18n.language;

  const handleSwitchLang = () => {
    i18n.changeLanguage(currentLang === "en" ? "ua" : "en");
  };

  return (
    <div className={styles.toggles}>
      <div className={styles.row}>
        <span className={styles.label}>EN</span>
        <Toggle
          variant="lang"
          checked={currentLang === "ua"}
          onChange={handleSwitchLang}
        />
        <span className={styles.label}>UA</span>
      </div>
      <div className={styles.row}>
        <span className={styles.label}>Light</span>
        <Toggle
          variant="theme"
          checked={theme === 'dark'}
          onChange={toggleTheme}
        />
        <span className={styles.label}>Dark</span>
      </div>
    </div>
  );
}

export default PreferenceToggles;
