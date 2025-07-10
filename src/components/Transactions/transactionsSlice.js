import { createSlice, createAsyncThunk, nanoid } from '@reduxjs/toolkit';
import { setCategoriesFromTransactions, removeExpenseMirror } from '../Categories/categoriesSlice';
import { fetchTransactionsToDashboard } from '../WeeklyComparison/weeklyComprasionSlice.js';

const BASE_URL = 'http://localhost:5050';

const initialState = {
  data: [],
  loading: false,
  error: null,
  page: 1,
  hasMore: true,
};

const getAuthHeader = (getState) => {
  const token = getState().login.token || localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const fetchAllTransactionsForCategories = createAsyncThunk(
  'transactions/fetchAllForCategories',
  async (_, { dispatch, getState }) => {
    const res = await fetch(`${BASE_URL}/transactions`, {
      headers: getAuthHeader(getState),
    });

    if (!res.ok) throw new Error('Failed to load all transactions');

    const allTransactions = await res.json();
    dispatch(setCategoriesFromTransactions(allTransactions));
  }
);

export const fetchPaginatedTransactions = createAsyncThunk(
  'transactions/fetchPaginated',
  async (
    { page, limit = 5, filter = "all", selectedCategory = "all", skipPageIncrement = false },
    { getState }
  ) => {
    const res = await fetch(
      `${BASE_URL}/transactions/filtered?page=${page}&limit=${limit}&type=${filter}&category=${selectedCategory}`,
      { headers: getAuthHeader(getState) }
    );

    if (!res.ok) throw new Error('Failed to load transactions');

    const data = await res.json();
    return { ...data, page, limit, skipPageIncrement };
  }
);

export const addTransaction = createAsyncThunk(
  'transactions/add',
  async (transaction, { dispatch, getState }) => {
    const fallbackCategory = transaction.category || "Work";
    const fallbackImage = transaction.image || "/src/assets/icons/IconOthers.svg?react";

    const newTransaction = {
      ...transaction,
      id: nanoid(),
      category: fallbackCategory,
      image: fallbackImage,
    };

    await fetch(`${BASE_URL}/transactions`, {
      method: 'POST',
      headers: getAuthHeader(getState),
      body: JSON.stringify(newTransaction),
    });

    dispatch(resetTransactions());
    dispatch(fetchPaginatedTransactions({ page: 1 })); 

    dispatch(fetchTransactionsToDashboard());
    return newTransaction;
  }
);

export const removeTransaction = createAsyncThunk(
  'transactions/remove',
  async (id, { getState, dispatch }) => {
    await fetch(`${BASE_URL}/transactions/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(getState),
    });

    dispatch(fetchTransactionsToDashboard());
    dispatch(removeExpenseMirror(id));

    dispatch(resetTransactions()); 
    dispatch(fetchPaginatedTransactions({ page: 1 }));

    return id;
  }
);

export const editTransactionWithServer = createAsyncThunk(
  'transactions/edit',
  async ({ expenseId, updatedData }, { getState, dispatch }) => {
    const res = await fetch(`${BASE_URL}/transactions/${expenseId}`, {
      method: 'PUT',
      headers: getAuthHeader(getState),
      body: JSON.stringify(updatedData),
    });

    if (!res.ok) throw new Error('Failed to edit transaction');

    dispatch(fetchTransactionsToDashboard());
    dispatch(resetTransactions());
    dispatch(fetchPaginatedTransactions({ page: 1 }));

    const allTransactions = getState().transactions.data;
    dispatch(setCategoriesFromTransactions(allTransactions));

    return { expenseId, updatedData };
  }
);

export const sortTransactions = createAsyncThunk(
  'transactions/sort',
  async (criteria, { getState }) => {
    const res = await fetch(`${BASE_URL}/transactions/sortBy/${criteria}`, {
      headers: getAuthHeader(getState),
    });
    return await res.json();
  }
);

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    setTransactions: (state, action) => {
      state.data = action.payload;
    },
    resetTransactions: (state) => {
      state.data = [];
      state.loading = false;
      state.error = null;
      state.page = 1;
      state.hasMore = true;
    },
    editTransaction: (state, action) => {
      const { id, updatedData } = action.payload;
      const index = state.data.findIndex(item => item.id === id);
      if (index !== -1) {
        state.data[index] = { ...state.data[index], ...updatedData };
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(addTransaction.fulfilled, (state, action) => {
        state.data.unshift(action.payload);
      })
      .addCase(removeTransaction.fulfilled, (state, action) => {
        const id = action.payload;
        state.data = state.data.filter(t => t.id !== id);
      })
      .addCase(editTransactionWithServer.fulfilled, (state, action) => {
        const { expenseId, updatedData } = action.payload;
        state.data = state.data.map(t =>
          t.id === expenseId ? { ...t, ...updatedData } : t
        );
      })
      .addCase(sortTransactions.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      .addCase(fetchPaginatedTransactions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPaginatedTransactions.fulfilled, (state, action) => {
        state.loading = false;

        const existingIds = new Set(state.data.map(t => t.id));
        const newItems = action.payload.data.filter(tx => !existingIds.has(tx.id));
        state.data.push(...newItems);

        state.hasMore = action.payload.hasMore;
        if (!action.payload.skipPageIncrement) {
          state.page += 1;
        }
      })
      .addCase(fetchPaginatedTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  resetTransactions,
  editTransaction,
  setTransactions,
} = transactionsSlice.actions;

export default transactionsSlice.reducer;
