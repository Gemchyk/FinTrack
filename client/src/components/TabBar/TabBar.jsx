import { Link, NavLink } from 'react-router';
import { useTranslation } from 'react-i18next';
import styles from './TabBar.module.scss';
import { navLinks } from '../SideNavBar/navLinks';

function TabBar() {
  const { t } = useTranslation();

  return (
    <>
      <header className={styles.topBar}>
        <span className={styles.logo}>{t("MyFinance")}</span>
        <Link to="/Profile" className={styles.profile} aria-label={t("Profile")}>👤</Link>
      </header>

      <nav className={styles.tabBar}>
        {navLinks.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => isActive ? `${styles.tab} ${styles.active}` : styles.tab}
          >
            <span className={styles.icon} aria-hidden="true">{icon}</span>
            {t(label)}
          </NavLink>
        ))}
      </nav>
    </>
  );
}

export default TabBar;
