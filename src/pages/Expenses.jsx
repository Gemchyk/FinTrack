import ExpensesGoalsByCategory from '../components/ExpensesGoals/ExpensesGoalsByCategory';
import Balances from './Balances';



function Expenses () {
    return (
        <>
            <Balances />
            <ExpensesGoalsByCategory />
        </>
    )
}
export default Expenses