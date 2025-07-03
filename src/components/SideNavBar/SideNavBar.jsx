import React, { useContext } from "react";
import styles from './SideNavBar.module.scss';
import { Link, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import SwitchLang from "../SwitchButton/SwitchLang";
import SwitchTheme from "../SwitchButton/SwitchTheme";
import { ThemeContext } from "../../context/ThemeContext.jsx";


function SideNavBar() {
  const { t, i18n } = useTranslation();
  const {theme, toggleTheme} = useContext(ThemeContext);
  const currentLang = i18n.language;
  const location = useLocation();

  const handleSwitchLang = () => {
    i18n.changeLanguage(currentLang === "en" ? "ua" : "en");
  };



  if(location.pathname === '/'){
    return null;
  }


  return (
    <nav className={styles['sidebar']}>
      <h2 className={styles['logo']}>{t("MyFinance")}</h2>
      <Link to="/Overview">📊 {t("Overview")}</Link>
      <Link to="/Balances">💰 {t("Balances")}</Link>
      <Link to="/Transactions">🔄 {t("Transactions")}</Link>
      <Link to="/Expenses">💸 {t("Expenses")}</Link>

      <div className={styles['flex']}>
        <span className={styles.label}>EN</span>
        <SwitchLang
          checked={currentLang === "ua"}
          onChange={handleSwitchLang}
        />
        <span className={styles.label}>UA</span>
      </div>

      <div className={styles['flex']}>
        <span className={styles.label}>Light</span>
        <SwitchTheme
          checked={theme === 'dark'}
          onChange={toggleTheme}
        />
        <span className={styles.label}>Dark</span>
      </div>
    </nav>
  );
}


export default SideNavBar;
