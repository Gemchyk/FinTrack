import React from "react";
import styles from './SideNavBar.module.scss';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import Switch from "../SwitchButton/Switch";

function SideNavBar() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;

  const handleSwitchLang = () => {
    i18n.changeLanguage(currentLang === "en" ? "ua" : "en");
  };

  return (
    <nav className={styles['sidebar']}>
      <h2 className={styles['logo']}>{t("MyFinance")}</h2>
      <Link to="/">{t("Home")}</Link>
      <Link to="/Overview">📊 {t("Overview")}</Link>
      <Link to="/Balances">💰 {t("Balances")}</Link>
      <Link to="/Transactions">🔄 {t("Transactions")}</Link>
      <Link to="/Bills">📅 {t("Bills")}</Link>
      <Link to="/Expenses">💸 {t("Expenses")}</Link>
      <Link to="/Goals">🎯 {t("Goals")}</Link>
      
      <div className={styles['flex']}>
        EN
        <Switch
          checked={currentLang === "ua"}
          onChange={handleSwitchLang}
        />
        UA
      </div>
    </nav>
  );
}


export default SideNavBar;
