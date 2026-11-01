import { Outlet } from 'react-router';
import SideNavBar from '../SideNavBar/SideNavBar';
import TabBar from '../TabBar/TabBar';
import styles from './Layout.module.scss';

// Shell of the signed-in pages; CSS shows the sidebar on desktop and the tab bar on phones
function AppLayout() {
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
