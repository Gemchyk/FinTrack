import { configureStore } from '@reduxjs/toolkit';
import categoriesReducer from '../components/Categories/categoriesSlice';
import balanceReducer from '../features/balance/balanceSlice'
import weeklyComparisonReducer from '../components/WeeklyComparison/weeklyComprasionSlice'
import transactionsReducer from '../components/Transactions/transactionsSlice';
import loginReducer from '../components/Login/loginSlice'


export const store = configureStore({
  reducer: {
    categories: categoriesReducer,
    balance: balanceReducer,
    weeklyComparison: weeklyComparisonReducer,
    transactions: transactionsReducer,
    login: loginReducer
   },
});

export default store;