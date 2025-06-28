import ExpensesGoalsByCategory from '../components/ExpensesGoals/ExpensesGoalsByCategory';
import SearchForm from '../components/SearchForm/SearchForm';
import Balances from './Balances';

import '../components/SearchForm/SearchForm.scss'



function Expenses () {
    return (
        <>
            <SearchForm />
            <Balances />
            <ExpensesGoalsByCategory />  
        </>
    )
}
export default Expenses