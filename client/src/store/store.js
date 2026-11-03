import { configureStore } from '@reduxjs/toolkit';
import categoriesReducer from '../components/Categories/categoriesSlice';
import { api } from './api';


// Server data lives in the RTK Query cache (api); plain slices hold UI state only
export const store = configureStore({
  reducer: {
    categories: categoriesReducer,
    [api.reducerPath]: api.reducer,
   },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
});

export default store;