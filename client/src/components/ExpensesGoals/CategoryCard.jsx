import styles from "./ExpensesGoalsByCategory.module.scss";
import AdjustEditBtn from "/src/assets/icons/AdjustEditBtn.svg?react";
import { useState } from "react";
import GoalModal from "./GoalModal/GoalModal";
import { useTranslation } from "react-i18next";

export default function CategoryCard({
  category,
  onAdd,
  onDetailsToggle,
  isDetailsOpen,
  expenses,
  onEdit,
  onDelete,
  onDeleteCategory,
}) {
  const { name, icon, amount, goalAmount, id } = category;
  console.log(name);

  const percentOfGoal = goalAmount
    ? Math.min((amount / goalAmount) * 100, 100)
    : 0;
  const isOverGoal = goalAmount && amount > goalAmount;
  const [showGoalModal, setShowGoalModal] = useState(false);

  const { t } = useTranslation();

  const handleGoalClick = () => {
    setShowGoalModal(true);
  };

  if (!category.isShownOnPage) {
    return;
  } else {
    return (
      <div className={`${styles.card} ${isDetailsOpen ? styles.expanded : ""}`}>
        <div className={styles.topRow}>
          <span className={styles.icon}>{icon}</span>

          <div className={styles.cardText}>
            <span className={styles.title}>
              {t(`categories.${name.toLowerCase()}`, { defaultValue: name })}
            </span>
            <span className={styles.amount}>{amount.toFixed(2)} $</span>
          </div>

          <button type="button" className={styles.adjustBtn} onClick={onAdd}>
            {t("Adjust")} <AdjustEditBtn />
          </button>

          <button
            type="button"
            className={styles.adjustBtn}
            onClick={onDetailsToggle}
          >
            {t("Details")}
          </button>
          <button
            type="button"
            className={styles.adjustBtn}
            onClick={() => onDeleteCategory(id)}
          >
            {t("Remove")}
          </button>
        </div>

        <div className={styles.goalSection}>
          <div className={styles.progressWrapper}>
            {goalAmount && (
              <div
                className={styles.progressBar}
                style={{
                  width: `${percentOfGoal}%`,
                  backgroundColor: isOverGoal ? "#FF5A5F" : "#299D91",
                }}
              />
            )}
          </div>

          <div className={styles.goalDisplay}>
            <button className={styles.goalBtn} onClick={handleGoalClick}>
              {goalAmount !== null ? `${goalAmount}$` : t("Set goal")}
            </button>
          </div>
        </div>

        {showGoalModal && (
          <GoalModal
            categoryId={category.id}
            initialGoal={goalAmount}
            onClose={() => setShowGoalModal(false)}
          />
        )}

        {isDetailsOpen && (
          <div className={styles.dropdown}>
            <ul className={styles.expenseList}>
              {expenses.map((exp) => (
                <li key={exp.id} className={styles.expenseItem}>
                  <span>
                    {exp.title} — {exp.amount}₴ ({exp.date})
                  </span>
                  <button
                    onClick={() => onEdit(exp)}
                    className={styles.btnSmall}
                  >
                    {t("Edit")}
                  </button>
                  <button
                    onClick={() => onDelete(exp)}
                    className={styles.btnSmall}
                  >
                    {t("Remove")}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
}
