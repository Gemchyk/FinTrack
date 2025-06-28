import { BrowserRouter as Router, Routes, Route } from 'react-router';
import './App.css'
import WeeklyComparison from './components/WeeklyComparison/WeeklyComparison';


import Goal from './components/Goals/Goal';
import SideNavBar from './components/SideNavBar/SideNavBar';
import Home from './pages/Home';
import Overview from './pages/Overview';
import Balances from './pages/Balances';
import Transactions from './pages/Transactions'
import Bills from './pages/Bills'
import Expenses from './pages/Expenses'
import Goals from './pages/Goals'
import Settings from './pages/Settings'
import LoginPage from './pages/LoginPage';
import { Suspense } from 'react';

function App() {


  return (
    <>
     <Suspense fallback="loading">
      <Router>
        <SideNavBar />
        <div style={{ marginLeft: '220px', padding: '20px' }}>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/Overview" element={<Overview />} />
            <Route path="/Balances" element={<Balances />} />
            <Route path="/Transactions" element={<Transactions />} />
            <Route path="/Bills" element={<Bills />} />
            <Route path="/Expenses" element={<Expenses />} />
            <Route path="/Goals" element={<Goals />} />
            <Route path="/Settings" element={<Settings />} />
          </Routes>
        </div>
      </Router>
     </Suspense>

    </>
  )
}

export default App
