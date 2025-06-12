import styles from './ExpensesGoalsByCategory.module.scss';
import AdjustEditBtn from '/src/assets/icons/AdjustEditBtn.svg?react';

export default function CategoryCard({ category }) {
    const { title, icon, amount } = category;

    return (
        <div className={styles.card}>
            <span className={styles.icon}>{icon}</span>
            <div className={styles.cardText}>
                <span className={styles.title}>{title}</span>
                <span className={styles.amount}>${amount.toFixed(2)}</span>
            </div>
            <button type='button' className={styles.adjustBtn}>
                Adjust
                <AdjustEditBtn />
            </button>
        </div>
    )
}
