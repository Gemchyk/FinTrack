import { BrowserRouter as Router, Routes, Route } from 'react-router';
import './App.css';
import { Suspense } from 'react';

import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import AppLayout from './components/Layout/AppLayout';
import PublicLayout from './components/Layout/PublicLayout';

import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import VerifyPage from './pages/VerifyPage';
import ForgotPage from './pages/ForgotPage';
import ResetPage from './pages/ResetPage';
import Overview from './pages/Overview';
import Balances from './pages/Balances';
import Transactions from './pages/Transactions';
import Expenses from './pages/Expenses';
import Profile from './pages/Profile';

function App() {
  return (
    <Suspense fallback="loading...">
      <Router>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            {/* /verify and /reset are the links in the emails (server/mail.ts) */}
            <Route path="/verify" element={<VerifyPage />} />
            <Route path="/forgot" element={<ForgotPage />} />
            <Route path="/reset" element={<ResetPage />} />
          </Route>

          <Route element={<PrivateRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/Overview" element={<Overview />} />
              <Route path="/Balances" element={<Balances />} />
              <Route path="/Transactions" element={<Transactions />} />
              <Route path="/Expenses" element={<Expenses />} />
              <Route path="/Profile" element={<Profile />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </Suspense>
  );
}

export default App;
