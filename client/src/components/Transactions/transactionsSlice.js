import { createSlice, createAsyncThunk, nanoid } from '@reduxjs/toolkit';
import { setCategoriesFromTransactions, removeExpenseMirror } from '../Categories/categoriesSlice';
import { fetchTransactionsToDashboard } from '../WeeklyComparison/weeklyComprasionSlice.js';
import { api } from '../../api';

const initialState = {
  data: [],
  loading: false,
  error: null,
  page: 1,
  hasMore: true,
};

export const fetchAllTransactionsForCategories = createAsyncThunk(
  'transactions/fetchAllForCategories',
  async (_, { dispatch }) => {
    const res = await api('/transactions');

    if (!res.ok) throw new Error('Failed to load all transactions');

    const allTransactions = await res.json();
    dispatch(setCategoriesFromTransactions(allTransactions));
  }
);

export const fetchPaginatedTransactions = createAsyncThunk(
  'transactions/fetchPaginated',
  async ({ page, limit = 5, filter = "all", selectedCategory = "all", skipPageIncrement = false }) => {
    const res = await api(
      `/transactions/filtered?page=${page}&limit=${limit}&type=${filter}&category=${selectedCategory}`
    );

    if (!res.ok) throw new Error('Failed to load transactions');

    const data = await res.json();
    return { ...data, page, limit, skipPageIncrement };
  }
);

export const addTransaction = createAsyncThunk(
  'transactions/add',
  async (transaction, { dispatch }) => {
    const fallbackCategory = transaction.category || "Work";

    const newTransaction = {
      ...transaction,
      // Category expenses pass their own id so a later delete hits the same record on the server
      id: transaction.id ?? nanoid(),
      category: fallbackCategory,
    };

    await api('/transactions', {
      method: 'POST',
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
  async (id, { dispatch }) => {
    await api(`/transactions/${id}`, {
      method: 'DELETE',
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
    const res = await api(`/transactions/${expenseId}`, {
      method: 'PUT',
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
  async (criteria) => {
    const res = await api(`/transactions/sortBy/${criteria}`);
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
