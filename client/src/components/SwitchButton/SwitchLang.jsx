import React from 'react';
import styles from './SwitchLang.module.scss';

const SwitchLang = ({ checked, onChange }) => {
  return (
    <label className={styles.toggleSwitch}>
      <input
        type="checkbox"
        className={styles.checkbox}
        checked={checked}
        onChange={onChange}
      />
      <span className={styles.knob} />
    </label>
  );
};

export default SwitchLang;
