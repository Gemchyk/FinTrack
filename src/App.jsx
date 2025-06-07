import './App.css'
import WeeklyComparison from './components/WeeklyComparison';
import TotalBalance from './components/TotalBalance/TotalBalance';
import UpcomingBillList from './components/UpcomingBills/UpcomingBillList';
import ExpensesGoalsByCategory from './components/ExpensesGoals/ExpensesGoalsByCategory';


function App() {

  return (
    <>

    <div className='header'>
      <TotalBalance />
      <UpcomingBillList />     
    </div>
      
      {/* <WeeklyComparison /> */}
    </>
  )
}

export default App
