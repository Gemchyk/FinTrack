import { useEffect } from 'react';
import { Outlet } from 'react-router';
import { useTranslation } from 'react-i18next';
import SideNavBar from '../SideNavBar/SideNavBar';
import TabBar from '../TabBar/TabBar';
import { useMeQuery } from '../Profile/profileApi';
import styles from './Layout.module.scss';

// Shell of the signed-in pages; CSS shows the sidebar on desktop and the tab bar on phones
function AppLayout() {
  const { i18n } = useTranslation();
  const lang = useMeQuery().data?.lang;

  // The account's language wins over the one this browser remembered: the emails go out in it too
  useEffect(() => {
    if (lang) i18n.changeLanguage(lang);
  }, [lang, i18n]);

  return (
    <>
      <SideNavBar />
      <TabBar />
      <div className={styles.content}>
        <Outlet />
      </div>
    </>
  );
}

export default AppLayout;
