import ExpensesGoalsByCategory from '../components/ExpensesGoals/ExpensesGoalsByCategory';
import SearchForm from '../components/SearchForm/SearchForm';
import '../components/SearchForm/SearchForm.scss'
import AddCategoryButton from '../components/Categories/CategoriesList/CategoryModal/AddCategoryButton';



function Expenses () {
    return (
        <>
            <div>
                <SearchForm />
                <AddCategoryButton />
            </div>
            <ExpensesGoalsByCategory />  
        </>
    )
}
export default Expenses