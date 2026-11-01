import styles from './SideNavBar.module.scss';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { navLinks } from './navLinks';


function SideNavBar() {
  const { t } = useTranslation();

  return (
    <nav className={styles['sidebar']}>
      <h2 className={styles['logo']}>{t("MyFinance")}</h2>
      {navLinks.map(({ to, icon, label }) => (
        <Link key={to} to={to}>{icon} {t(label)}</Link>
      ))}
      <Link to="/Profile" className={styles['profile']}>👤 {t("Profile")}</Link>
    </nav>
  );
}


export default SideNavBar;
