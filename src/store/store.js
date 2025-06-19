import { configureStore } from '@reduxjs/toolkit';
import categoriesReducer from '../components/Categories/categoriesSlice';
import balanceReducer from '../features/balance/balanceSlice'

export const store = configureStore({
  reducer: {
    categories: categoriesReducer,
    balance: balanceReducer
   },
});

export default store;