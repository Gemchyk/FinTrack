import './App.css'
import WeeklyComparison from './components/WeeklyComparison';
import TotalBalance from './components/TotalBalance/TotalBalance';
import UpcomingBillList from './components/UpcomingBills/UpcomingBillList';
import ExpensesGoalsByCategory from './components/ExpensesGoals/ExpensesGoalsByCategory';
import Goal from './components/Goals/Goal';



function App() {

  return (
    <>
    <div className='header'>
         <TotalBalance /> 
         <Goal />
         <UpcomingBillList /> 
    </div>    
      {/* <WeeklyComparison /> */}
      {/* <ExpensesGoalsByCategory /> */}


    </>
  )
}

export default App
