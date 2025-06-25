import styles from "./CategoriesList.module.scss";
import { useState } from "react";
import AddExpenseModal from "./AddExpenseModal";
import { useDispatch,  useSelector  } from "react-redux";
import { removeExpenseWithStats } from "../categoriesSlice";


const CategoriesList = () => {
  const categories = useSelector((state) => state.categories);
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [editingExpense, setEditingExpense] = useState(null);
  const [showModalForCategory, setShowModalForCategory] = useState(null);
  const dispatch = useDispatch();

const handleEdit = (categoryId, expense) => {
  setEditingExpense({ categoryId, ...expense });
  setShowModalForCategory(categoryId);
};

  const handleToggleCategory = (id) => {
    if (activeCategoryId === id) {
      setActiveCategoryId(null);
    } else {
      setActiveCategoryId(id);
    }
  };

  return (
    <div className={styles.categories}>
      <h2 className={styles.categories__title}>Категорії розтрат</h2>
      <ul className={styles.categories__list}>
        {categories.map((cat) => {
          const total = cat.expenses.reduce((sum, e) => sum + e.amount, 0);
          return (
            <li className={styles.categories__item} key={cat.id}>
              <div className={styles.categories__card}>
                <div className={styles.categories__name}>{cat.name}</div>
                <div className={styles.categories__total}>{total}₴</div>
                <button
                  type="button"
                  onClick={() => setShowModalForCategory(cat.id)}
                >
                  Додати витрату
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleCategory(cat.id)}
                >
                  Детальніше
                </button>
                {activeCategoryId === cat.id && (
                  <ul className={styles.expenseList}>
                    {cat.expenses.map((exp) => (
                    <li key={exp.id}>
                      {exp.title} — {exp.amount}₴ ({exp.date})
                      <button onClick={() => handleEdit(cat.id, exp)}>Edit</button>
                      <button onClick={() => {dispatch(removeExpenseWithStats({categoryId: cat.id, expenseId: exp.id, date: exp.date, amount: exp.amount}))}}>
                        Remove
                      </button>
                    </li>
                    ))}
                    <button
                      type="button"
                      onClick={() => setShowModalForCategory(cat.id)}
                    >
                      Додати витрату
                    </button>
                  </ul>
                )}
                {showModalForCategory && (
  <AddExpenseModal
    show={true}
    categoryId={showModalForCategory}
    onClose={() => {
      setShowModalForCategory(null);
      setEditingExpense(null);
    }}
    editingExpense={editingExpense}
  />
)}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default CategoriesList;
