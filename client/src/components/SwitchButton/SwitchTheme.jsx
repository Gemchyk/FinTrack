import React from 'react';
import styles from './SwitchTheme.module.scss';

const SwitchTheme = ({ checked, onChange }) => {
  return (
    <div className={styles.toggleSwitch}>
      <label className={styles.switchLabel}>
        <input
          type="checkbox"
          className={styles.checkbox}
          checked={checked}
          onChange={onChange}
        />
        <span className={styles.slider} />
      </label>
    </div>
  );
};

export default SwitchTheme;
