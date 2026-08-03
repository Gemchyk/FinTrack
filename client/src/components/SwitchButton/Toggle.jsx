import React from 'react';
import styles from './Toggle.module.scss';

const Toggle = ({ checked, onChange, variant = 'lang' }) => {
  return (
    <label className={`${styles.toggle} ${styles[variant]}`}>
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

export default Toggle;
