import Goal from '../Goals/Goal';
import WeeklyComparison from '../WeeklyComparison/WeeklyComparison';
import styles from './Statistics.module.scss';

// Charts moved off Overview: this month by category and the last twelve months
function Statistics() {
  return (
    <div className={styles.statistics}>
      <Goal />
      <WeeklyComparison />
    </div>
  );
}

export default Statistics;
