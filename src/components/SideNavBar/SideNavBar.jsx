import React from "react";
import styles from './SideNavBar.module.scss';
import { Link } from 'react-router';

function SideNavBar() {
    return (
      <nav className={styles['sidebar']}>
      <h2 className={styles['logo']}>MyFinance</h2>
      <Link to="/">🏠 Home</Link>
      <Link to="/Overview">📊 Overview</Link>
      <Link to="/Balances">💰 Balances</Link>
      <Link to="/Transactions">🔄 Transactions</Link>
      <Link to="/Bills">📅 Bills</Link>
      <Link to="/Expenses">💸 Expenses</Link>
      <Link to="/Goals">🎯 Goals</Link>
      <Link to="/Settings">⚙️ Settings</Link>
    </nav>
    );
  }
  
  export default SideNavBar;
