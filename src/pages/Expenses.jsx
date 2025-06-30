import ExpensesGoalsByCategory from '../components/ExpensesGoals/ExpensesGoalsByCategory';
import SearchForm from '../components/SearchForm/SearchForm';
import Balances from './Balances';

import '../components/SearchForm/SearchForm.scss'
import AddCategoryButton from '../components/Categories/CategoriesList/CategoryModal/AddCategoryButton';



function Expenses () {
    return (
        <>
            <SearchForm />
            <Balances />
            <AddCategoryButton />
            <ExpensesGoalsByCategory />  
        </>
    )
}
export default Expenses