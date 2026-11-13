import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Goal from '../Goals/Goal';
import WeeklyComparison from '../WeeklyComparison/WeeklyComparison';
import MonthReport from './MonthReport';
import { currentMonth, isMonth } from '../../dates';
import styles from './Statistics.module.scss';

// The report of the chosen month with its charts; the twelve-month chart ends with that month
function Statistics() {
  const { t } = useTranslation();
  const [month, setMonth] = useState(currentMonth);

  return (
    <div className={styles.statistics}>
      <label className={styles.picker}>
        {t('report.month')}
        {/* Uncontrolled: in the text-field fallback a half-typed month stays in the field while the page
            keeps the last complete one; the server checks the format anyway */}
        <input
          type="month"
          className={styles.monthInput}
          defaultValue={month}
          max={currentMonth()}
          pattern="\d{4}-\d{2}"
          placeholder="2026-10"
          onChange={(event) => {
            if (isMonth(event.target.value)) setMonth(event.target.value);
          }}
        />
      </label>

      <MonthReport month={month} />

      <div className={styles.charts}>
        <Goal month={month} />
        <WeeklyComparison month={month} />
      </div>
    </div>
  );
}

export default Statistics;
