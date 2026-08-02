import { createSlice, createAsyncThunk, nanoid } from "@reduxjs/toolkit";
import {
  addTransaction,
  removeTransaction,
  editTransaction,
} from "../Transactions/transactionsSlice";

const initialState = [
  {
    id: 1,
    name: "Food",
    iconName: "Food",
    goalAmount: 300,
    expenses: [],
    isShownOnPage: true,
  },
  {
    id: 2,
    name: "Fun",
    iconName: "Entertainment",
    goalAmount: 250,
    expenses: [],
    isShownOnPage: true,
  },
  {
    id: 3,
    name: "Transport",
    iconName: "Transport",
    goalAmount: 100,
    expenses: [],
    isShownOnPage: true,
  },
  {
    id: 4,
    name: "Shopping",
    iconName: "Shopping",
    goalAmount: 2000,
    expenses: [],
    isShownOnPage: true,
  },
  {
    id: 5,
    name: "Health",
    iconName: "Health",
    goalAmount: 150,
    expenses: [],
    isShownOnPage: true,
  },
  {
    id: 6,
    name: "Other",
    iconName: "Other",
    goalAmount: null,
    expenses: [],
    isShownOnPage: true,
  },
];

export const addExpenseWithStats = createAsyncThunk(
  "categories/addExpenseWithStats",
  async (
    { categoryId, category, type, title, amount, date },
    { dispatch }
  ) => {
    const id = nanoid();
    dispatch(addExpense({ id, categoryId, title, amount, date }));
    dispatch(
      addTransaction({ categoryId, type, category, title, amount, date })
    );
  }
);

export const removeExpenseWithStats = createAsyncThunk(
  "categories/removeExpenseWithStats",
  async ({ categoryId, expenseId, date, amount }, { dispatch }) => {
    dispatch(removeExpense({ categoryId, expenseId }));
    dispatch(removeTransaction({ categoryId, expenseId, date, amount }));
  }
);

export const editExpenseWithStats = createAsyncThunk(
  "categories/editExpenseWithStats",
  async ({ categoryId, expenseId, updatedData }, { dispatch }) => {
    dispatch(
      editExpense({
        categoryId,
        expenseId,
        updatedData,
      })
    );
    dispatch(editTransaction({ expenseId, updatedData }));
  }
);

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setCategoriesFromTransactions: (state, action) => {
      const transactions = action.payload;

      state.forEach(category => {
        category.expenses = [];
      });


      transactions.forEach(tx => {

        const category = state.find(cat => cat.name === tx.category);
        if (category) {
          category.expenses.push(tx);
        } else {

          let others = state.find(cat => cat.name === 'Other');
          if (!others) {
            others = {
              id: 'others',
              name: 'Others',
              expenses: [],
            };
            state.push(others);
          }
          others.expenses.push(tx);
        }
      });
    },
    removeExpenseMirror: (state, action) => {
      const id = action.payload;
      for (const cat of state) {
        cat.expenses = cat.expenses.filter(exp => exp.id !== id);
      }
    },
    searchCategories: (state, action) => {
      state.map((item) => {
        if (item.name.includes(action.payload)) {
          item.isShownOnPage = true;
        } else {
          item.isShownOnPage = false;
        }
      });
    },
    addExpense: (state, action) => {
      console.log(action.payload);
      const { id, categoryId, title, amount, date } = action.payload;
      const category = state.find((cat) => cat.id === categoryId);
      if (category) {
        category.expenses.push({ id, title, amount, date });
      }
    },
    removeExpense: (state, action) => {
      const { categoryId, expenseId } = action.payload;
      const category = state.find((cat) => cat.id === categoryId);
      if (category) {
        category.expenses = category.expenses.filter(
          (exp) => exp.id !== expenseId
        );
      }
    },
    editExpense: (state, action) => {
      const { categoryId, expenseId, updatedData } = action.payload;
      const category = state.find((cat) => cat.id === categoryId);
      if (category) {
        const expense = category.expenses.find((exp) => exp.id === expenseId);
        if (expense) {
          expense.title = updatedData.title;
          expense.amount = updatedData.amount;
          expense.date = updatedData.date;
        }
      }
    },
    addCategory: (state, action) => {
      const { id, name, iconName } = action.payload;
      state.push({
        id,
        name,
        iconName,
        goalAmount: null,
        expenses: [],
        isShownOnPage: true,
      });
      console.log(iconName);
    },
    setGoal: (state, action) => {
      const { categoryId, goalAmount } = action.payload;
      const category = state.find((cat) => cat.id === categoryId);
      if (category) {
        category.goalAmount = goalAmount;
      }
    },
    removeCategory: (state, action) => {
      const index = state.findIndex((cat) => cat.id === action.payload);
      if (index !== -1) {
        state.splice(index, 1);
      }
    },
  },
});

export const { 
  setCategoriesFromTransactions, 
  removeExpenseMirror,
  searchCategories,
  addExpense,
  removeExpense,
  editExpense,
  addCategory,
  setGoal,
  removeCategory,
} = categoriesSlice.actions;
export default categoriesSlice.reducer;
