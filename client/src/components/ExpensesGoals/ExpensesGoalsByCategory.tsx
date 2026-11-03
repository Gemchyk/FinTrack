import { useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import styles from "./ExpensesGoalsByCategory.module.scss";
import CategoryCard from "./CategoryCard";
import AddExpenseModal from "../Categories/CategoriesList/AddExpenseModal";
import { categoryName, useDeleteCategoryMutation, useReportQuery } from "../Categories/categoriesApi";
import { selectCategorySearch } from "../Categories/categoriesSlice";
import { useDeleteTransactionMutation } from "../Transactions/transactionsApi";
import { errorKey } from "../../store/api";
import { currentMonth } from "../../dates";
import type { ReportCategory, Transaction } from "../../../../shared/api-types";

export default function ExpensesGoalsByCategory() {
  const { t } = useTranslation();
  const search = useSelector(selectCategorySearch);
  // One month of aggregates: every category with its goal and what was spent in it this month
  const { data: report, error } = useReportQuery(currentMonth());
  const [deleteCategory, { error: deleteCategoryError }] = useDeleteCategoryMutation();
  const [deleteTransaction, { error: deleteExpenseError }] = useDeleteTransactionMutation();
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  // The expense form is open for this category; editingExpense is set when an existing expense is edited
  const [modalCategoryId, setModalCategoryId] = useState<string | null>(null);
  const [editingExpense, setEditingExpense] = useState<Transaction | null>(null);
  const errorText = errorKey(error ?? deleteCategoryError ?? deleteExpenseError);

  // Matched against the name on screen, without case: in Ukrainian "їжа" finds Food
  const query = search.trim().toLocaleLowerCase();
  const categories = (report?.categories ?? []).filter((category) =>
    categoryName(t, category.name).toLocaleLowerCase().includes(query),
  );

  const openExpenseForm = (categoryId: string, expense: Transaction | null) => {
    setEditingExpense(expense);
    setModalCategoryId(categoryId);
  };

  const closeExpenseForm = () => {
    setModalCategoryId(null);
    setEditingExpense(null);
  };

  // Saved on the server now, so ask first. The expenses stay, without a category
  const handleDeleteCategory = (category: ReportCategory) => {
    if (window.confirm(t("category.deleteConfirm", { name: categoryName(t, category.name) }))) {
      deleteCategory(category.id);
    }
  };

  return (
    <div className={styles.expensesGoals}>
      {errorText && <p className={styles.error} role="alert">{t(errorText)}</p>}
      <div className={styles.cardsGrid}>
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            isDetailsOpen={activeCategoryId === category.id}
            onDetailsToggle={() => setActiveCategoryId((prev) => (prev === category.id ? null : category.id))}
            onAdd={() => openExpenseForm(category.id, null)}
            onEdit={(expense) => openExpenseForm(category.id, expense)}
            onDelete={(expense) => deleteTransaction(expense.id)}
            onDeleteCategory={() => handleDeleteCategory(category)}
          />
        ))}
      </div>

      {modalCategoryId && (
        <AddExpenseModal categoryId={modalCategoryId} editingExpense={editingExpense} onClose={closeExpenseForm} />
      )}
    </div>
  );
}
