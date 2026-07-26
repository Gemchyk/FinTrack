import { BrowserRouter as Router, Routes, Route } from 'react-router';
import './App.css';
import { Suspense } from 'react';

import SideNavBar from './components/SideNavBar/SideNavBar';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';

import LoginPage from './pages/LoginPage';
import Overview from './pages/Overview';
import Balances from './pages/Balances';
import Transactions from './pages/Transactions';
import Bills from './pages/Bills';
import Expenses from './pages/Expenses';
import Goals from './pages/Goals';
import Settings from './pages/Settings';

function App() {
  return (
    <Suspense fallback="loading...">
      <Router>
        <SideNavBar />
        <div style={{ marginLeft: '220px', padding: '20px' }}>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            
            <Route
              path="/Overview"
              element={
                <PrivateRoute>
                  <Overview />
                </PrivateRoute>
              }
            />
            <Route
              path="/Balances"
              element={
                <PrivateRoute>
                  <Balances />
                </PrivateRoute>
              }
            />
            <Route
              path="/Transactions"
              element={
                <PrivateRoute>
                  <Transactions />
                </PrivateRoute>
              }
            />
            <Route
              path="/Bills"
              element={
                <PrivateRoute>
                  <Bills />
                </PrivateRoute>
              }
            />
            <Route
              path="/Expenses"
              element={
                <PrivateRoute>
                  <Expenses />
                </PrivateRoute>
              }
            />
            <Route
              path="/Goals"
              element={
                <PrivateRoute>
                  <Goals />
                </PrivateRoute>
              }
            />
            <Route
              path="/Settings"
              element={
                <PrivateRoute>
                  <Settings />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </Suspense>
  );
}

export default App;
