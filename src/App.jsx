import './App.css'
import WeeklyComparison from './components/WeeklyComparison';
import TotalBalance from './components/TotalBalance/TotalBalance';
import UpcomingBillList from './components/UpcomingBills/UpcomingBillList';

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
