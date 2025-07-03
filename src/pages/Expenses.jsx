import ExpensesGoalsByCategory from "../components/ExpensesGoals/ExpensesGoalsByCategory";
import SearchForm from "../components/SearchForm/SearchForm";
import "../components/SearchForm/SearchForm.scss";
import styles from "../components/ExpensesGoals/ExpensesGoalsByCategory.module.scss";
import AddCategoryButton from "../components/Categories/CategoriesList/CategoryModal/AddCategoryButton";
import { useTranslation } from "react-i18next";

function Expenses() {
  const { t } = useTranslation();
  return (
    <>
      <div className={styles.expensesGoals}>
        <h2>{t("Expenses by category")}</h2>
      </div>
      <div className="Expense_head">
        <SearchForm />
        <AddCategoryButton />
      </div>
      <ExpensesGoalsByCategory />
    </>
  );
}
export default Expenses;
