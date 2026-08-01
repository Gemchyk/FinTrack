import { BrowserRouter as Router, Routes, Route } from 'react-router';
import './App.css';
import { Suspense } from 'react';

import SideNavBar from './components/SideNavBar/SideNavBar';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';

import LoginPage from './pages/LoginPage';
import Overview from './pages/Overview';
import Balances from './pages/Balances';
import Transactions from './pages/Transactions';
import Expenses from './pages/Expenses';

function App() {
  return (
    <Suspense fallback="loading...">
      <Router>
        <SideNavBar />
        <div style={{ marginLeft: '220px', padding: '20px' }}>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            
            <Route element={<PrivateRoute />}>
              <Route path="/Overview" element={<Overview />} />
              <Route path="/Balances" element={<Balances />} />
              <Route path="/Transactions" element={<Transactions />} />
              <Route path="/Expenses" element={<Expenses />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </Suspense>
  );
}

export default App;
