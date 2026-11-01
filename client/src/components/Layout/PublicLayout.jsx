import { Outlet } from 'react-router';
import PreferenceToggles from '../SwitchButton/PreferenceToggles';
import styles from './Layout.module.scss';

// Pages before sign-in: no navigation, only the language and theme toggles
function PublicLayout() {
  return (
    <div className={styles.public}>
      <div className={styles.publicToggles}>
        <PreferenceToggles />
      </div>
      <div className={styles.publicContent}>
        <Outlet />
      </div>
    </div>
  );
}

export default PublicLayout;
