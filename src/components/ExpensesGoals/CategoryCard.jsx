import styles from "./ExpensesGoalsByCategory.module.scss";
import AdjustEditBtn from "/src/assets/icons/AdjustEditBtn.svg?react";
// import 'bootstrap/dist/css/bootstrap.min.css';

export default function CategoryCard({
  category,
  onAdd,
  onDetailsToggle,
  isDetailsOpen,
  expenses,
  onEdit,
  onDelete,
}) {
  const { title, icon, amount } = category;

  return (
    <div className={`${styles.card} ${isDetailsOpen ? styles.expanded : ""}`}>
      <div className={styles.topRow}>
        <span className={styles.icon}>{icon}</span>

        <div className={styles.cardText}>
          <span className={styles.title}>{title}</span>
          <span className={styles.amount}>{amount.toFixed(2)} ₴</span>
        </div>

        <button type="button" className={styles.adjustBtn} onClick={onAdd}>
          Adjust <AdjustEditBtn />
        </button>

        <button
          type="button"
          className={styles.adjustBtn}
          onClick={onDetailsToggle}
        >
          Details
        </button>
      </div>

      {isDetailsOpen && (
        <div className={styles.dropdown}>
          <ul className={styles.expenseList}>
            {expenses.map((exp) => (
              <li key={exp.id} className={styles.expenseItem}>
                <span>
                  {exp.title} — {exp.amount}₴ ({exp.date})
                </span>
                <button onClick={() => onEdit(exp)} className={styles.btnSmall}>
                  Редагувати
                </button>
                <button
                  onClick={() => onDelete(exp)}
                  className={styles.btnSmall}
                >
                  Видалити
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
