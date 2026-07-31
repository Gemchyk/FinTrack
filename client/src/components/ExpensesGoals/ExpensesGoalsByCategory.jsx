import styles from "./ExpensesGoalsByCategory.module.scss";
import CategoryCard from "./CategoryCard";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import AddExpenseModal from "../Categories/CategoriesList/AddExpenseModal";
import {
  removeExpenseWithStats,
  removeCategory,
} from "../Categories/categoriesSlice";
import { fetchAllTransactionsForCategories } from "../Transactions/transactionsSlice";
import { iconFor } from "../../assets/icons/iconFor";

export const titleMap = {
  Food: "Food",
  Transport: "Transport",
  Fun: "Fun",
  Shopping: "Shopping",
  Other: "Other",
};

export default function ExpensesGoalsByCategory() {
  const categories = useSelector((state) => state.categories);
  const dispatch = useDispatch();
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [showModalForCategory, setShowModalForCategory] = useState(null);
  const [editingExpense, setEditingExpense] = useState(null);

  useEffect(() => {
    dispatch(fetchAllTransactionsForCategories());
  }, [dispatch]);

  const handleToggleDetails = (id) => {
    setActiveCategoryId((prev) => (prev === id ? null : id));
  };

  const handleDelete = (categoryId, exp) => {
    dispatch(
      removeExpenseWithStats({
        categoryId,
        expenseId: exp.id,
        date: exp.date,
        amount: exp.amount,
      })
    );
  };

  const handleEdit = (categoryId, expense) => {
    setEditingExpense({ categoryId, ...expense });
    setShowModalForCategory(categoryId);
  };

  const handleAddNew = (categoryId) => {
    setEditingExpense(null);
    setShowModalForCategory(categoryId);
  };
  const handleDeleteCategory = (categoryId) => {
    dispatch(removeCategory(categoryId));
  };

  return (
    <div className={styles.expensesGoals}>
      <div className={styles.cardsGrid}>
        {categories.map((category) => {
          const total = category.expenses.reduce((sum, e) => sum + e.amount, 0);

          const enrichedCategory = {
            ...category,
            amount: total,
            goal: category.goalAmount ?? null,
            icon: iconFor(category.iconName),
          };

          return (
            <CategoryCard
              key={category.id}
              category={enrichedCategory}
              expenses={category.expenses}
              isDetailsOpen={activeCategoryId === category.id}
              onAdd={() => handleAddNew(category.id)}
              onDetailsToggle={() => handleToggleDetails(category.id)}
              onEdit={(exp) => handleEdit(category.id, exp)}
              onDelete={(exp) => handleDelete(category.id, exp)}
              onDeleteCategory={handleDeleteCategory}
            />
          );
        })}
      </div>

      {showModalForCategory && (
        <AddExpenseModal
          show={true}
          categoryId={showModalForCategory}
          editingExpense={editingExpense}
          onClose={() => {
            setShowModalForCategory(null);
            setEditingExpense(null);
          }}
        />
      )}
    </div>
  );
}
