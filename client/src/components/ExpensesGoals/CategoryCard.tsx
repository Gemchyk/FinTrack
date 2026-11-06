import { useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./ExpensesGoalsByCategory.module.scss";
import AdjustEditBtn from "/src/assets/icons/AdjustEditBtn.svg?react";
import GoalModal from "./GoalModal/GoalModal";
import { iconFor } from "../../assets/icons/iconFor";
import { categoryName } from "../Categories/categoriesApi";
import { useTransactionsInfiniteQuery } from "../Transactions/transactionsApi";
import { currentMonth } from "../../dates";
import { useMoney } from "../../money";
import type { ReportCategory, Transaction } from "../../../../shared/api-types";

interface Props {
  category: ReportCategory;
  isDetailsOpen: boolean;
  onDetailsToggle: () => void;
  onAdd: () => void;
  onEdit: (expense: Transaction) => void;
  onDelete: (expense: Transaction) => void;
  onDeleteCategory: () => void;
}

export default function CategoryCard({
  category,
  isDetailsOpen,
  onDetailsToggle,
  onAdd,
  onEdit,
  onDelete,
  onDeleteCategory,
}: Props) {
  const { t } = useTranslation();
  const { format } = useMoney();
  const [showGoalModal, setShowGoalModal] = useState(false);
  const { spent, goal } = category;

  const percentOfGoal = goal ? Math.min((spent / goal) * 100, 100) : 0;
  const isOverGoal = goal !== null && spent > goal;

  return (
    <div className={`${styles.card} ${isDetailsOpen ? styles.expanded : ""}`}>
      <div className={styles.topRow}>
        <span className={styles.icon}>{iconFor(category.iconName)}</span>

        <div className={styles.cardText}>
          <span className={styles.title}>{categoryName(t, category.name)}</span>
          <span className={styles.amount}>{format(spent)}</span>
        </div>

        <button type="button" className={styles.adjustBtn} onClick={onAdd}>
          {t("Adjust")} <AdjustEditBtn />
        </button>

        <button type="button" className={styles.adjustBtn} onClick={onDetailsToggle}>
          {t("Details")}
        </button>
        <button type="button" className={styles.adjustBtn} onClick={onDeleteCategory}>
          {t("Remove")}
        </button>
      </div>

      <div className={styles.goalSection}>
        <div className={styles.progressWrapper}>
          {goal !== null && (
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
          <button className={styles.goalBtn} onClick={() => setShowGoalModal(true)}>
            {goal !== null ? format(goal) : t("Set goal")}
          </button>
        </div>
      </div>

      {showGoalModal && <GoalModal category={category} onClose={() => setShowGoalModal(false)} />}

      {isDetailsOpen && <CategoryExpenses categoryId={category.id} onEdit={onEdit} onDelete={onDelete} />}
    </div>
  );
}

interface ExpensesProps {
  categoryId: string;
  onEdit: (expense: Transaction) => void;
  onDelete: (expense: Transaction) => void;
}

// Loaded only while the details are open: this month's expenses of the category
function CategoryExpenses({ categoryId, onEdit, onDelete }: ExpensesProps) {
  const { t } = useTranslation();
  const { format } = useMoney();
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = useTransactionsInfiniteQuery({
    type: "Expense",
    category: categoryId,
    month: currentMonth(),
    limit: 20,
  });
  const expenses = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <div className={styles.dropdown}>
      <ul className={styles.expenseList}>
        {expenses.map((exp) => (
          <li key={exp.id} className={styles.expenseItem}>
            <span>
              {exp.title} — {format(exp.amount)} ({exp.date})
            </span>
            <button onClick={() => onEdit(exp)} className={styles.btnSmall}>
              {t("Edit")}
            </button>
            <button onClick={() => onDelete(exp)} className={styles.btnSmall}>
              {t("Remove")}
            </button>
          </li>
        ))}
        {hasNextPage && (
          <li className={styles.expenseItem}>
            <button onClick={() => fetchNextPage()} className={styles.btnSmall} disabled={isFetchingNextPage}>
              {t("Load More")}
            </button>
          </li>
        )}
      </ul>
    </div>
  );
}
