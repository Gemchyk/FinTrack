import styles from "./ExpensesGoalsByCategory.module.scss";
import CategoryCard from "./CategoryCard";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import AddExpenseModal from "../Categories/CategoriesList/AddExpenseModal";
import { removeExpense } from "../Categories/categoriesSlice";

import IconHousing from "/src/assets/icons/IconHousing.svg?react";
import IconFood from "/src/assets/icons/IconFood.svg?react";
import IconTransportation from "/src/assets/icons/IconTransportation.svg?react";
import IconEntertainment from "/src/assets/icons/IconEntertainment.svg?react";
import IconShopping from "/src/assets/icons/IconShopping.svg?react";
import IconOthers from "/src/assets/icons/IconOthers.svg?react";

const iconMap = {
  Housing: <IconHousing />,
  Food: <IconFood />,
  Transport: <IconTransportation />,
  Entertainment: <IconEntertainment />,
  Shopping: <IconShopping />,
  Others: <IconOthers />,
};

const titleMap = {
  Housing: "Житло",
  Food: "Їжа",
  Transport: "Транспорт",
  Entertainment: "Розваги",
  Shopping: "Покупки",
  Others: "Інше",
};

export default function ExpensesGoalsByCategory() {
  const categories = useSelector((state) => state.categories);
  const dispatch = useDispatch();

  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [showModalForCategory, setShowModalForCategory] = useState(null);
  const [editingExpense, setEditingExpense] = useState(null);

  const handleToggleDetails = (id) => {
    setActiveCategoryId((prev) => (prev === id ? null : id));
  };

  const handleDelete = (categoryId, expenseId) => {
    dispatch(removeExpense({ categoryId, expenseId }));
  };

  const handleEdit = (categoryId, expense) => {
    setEditingExpense({ categoryId, ...expense });
    setShowModalForCategory(categoryId);
  };

  const handleAddNew = (categoryId) => {
    setEditingExpense(null);
    setShowModalForCategory(categoryId);
  };

  return (
    <div className={styles.expensesGoals}>
      <h2>Витрати за категоріями</h2>
      <div className={styles.cardsGrid}>
        {categories.map((category) => {
          const total = category.expenses.reduce((sum, e) => sum + e.amount, 0);

          const enrichedCategory = {
            ...category,
            amount: total,
            goal: category.goalAmount ?? null,
            icon: iconMap[category.iconName] || <IconOthers />,
            title: titleMap[category.iconName] || category.name,
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
              onDelete={(expId) => handleDelete(category.id, expId)}
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
