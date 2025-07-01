import { createSlice, createAsyncThunk, nanoid } from "@reduxjs/toolkit";
import { addExpenseToTable, removeExpenseFromTable, editExpenseInTable } from "../WeeklyComparison/weeklyComprasionSlice";
import { addTransaction, removeTransaction, editTransaction } from "../Transactions/transactionsSlice";

const initialState = [
  {
    id: "groceries",
    name: "Food",
    iconName: "Food",
    goalAmount: 3000,
    expenses: [
      { id: "1", title: "АТБ", amount: 1200, date: "2025-06-01" },
      { id: "2", title: "РОСТ", amount: 800, date: "2025-06-03" },
    ],
    isShownOnPage: true,
  },
  {
    id: "fun",
    name: "Fun",
    iconName: "Entertainment",
    goalAmount: 2500,
    expenses: [
      { id: "3", title: "Кіно", amount: 600, date: "2025-06-02" },
      { id: "4", title: "Спорт", amount: 600, date: "2025-06-02" },
    ],
    isShownOnPage: true,
  },
  {
    id: "transport",
    name: "Transport",
    iconName: "Transport",
    goalAmount: 1000,
    expenses: [
      { id: "5", title: "Метро", amount: 100, date: "2025-06-04" },
    ],
    isShownOnPage: true,
  },
  {
    id: "shopping",
    name: "Shopping",
    iconName: "Shopping",
    goalAmount: 2000,
    expenses: [
      { id: "6", title: "H&M", amount: 900, date: "2025-06-05" },
    ],
    isShownOnPage: true,
  },
  {
    id: "health",
    name: "Health",
    iconName: "Health",
    goalAmount: 1500,
    expenses: [
      { id: "7", title: "Аптека", amount: 300, date: "2025-06-06" },
    ],
    isShownOnPage: true,
  },
  {
    id: "other",
    name: "Other",
    iconName: "Other",
    goalAmount: null,
    expenses: [
      { id: "8", title: "Подарунок", amount: 500, date: "2025-06-07" },
    ],
    isShownOnPage: true,
  },
];



export const addExpenseWithStats = createAsyncThunk(
  "categories/addExpenseWithStats",
  async ({  categoryId, image, title, amount, date }, { dispatch }) => {
    const id = nanoid();
    dispatch(addExpense({ id, categoryId, title, amount, date }));
    dispatch(addExpenseToTable({ date, amount }));
    dispatch(addTransaction({ id, categoryId, image, title, amount, date}));
  }
)



export const removeExpenseWithStats = createAsyncThunk(
  "categories/removeExpenseWithStats",
  async ({ categoryId, expenseId, date, amount }, { dispatch }) => {
    dispatch(removeExpense({ categoryId, expenseId }));
    dispatch(removeExpenseFromTable({ date, amount }));
    dispatch(removeTransaction({categoryId, expenseId, date, amount}))
  }
)

export const editExpenseWithStats = createAsyncThunk(
  "categories/editExpenseWithStats",
  async ({ categoryId, expenseId, updatedData, oldData }, { dispatch }) => {
    dispatch(editExpense({
      categoryId,
      expenseId,
      updatedData,
    }));
    dispatch(editExpenseInTable({
      categoryId, 
      expenseId,
      updatedData,
      oldData,
    }));
    dispatch(editTransaction({expenseId, updatedData}));
  }
)


const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    searchCategories: (state, action) => {
      state.map(item => {
        if(item.name.includes(action.payload)){
          item.isShownOnPage = true;
        }else{
          item.isShownOnPage = false;
        }
      })
    },
    addExpense: (state, action) => {
      const { id, categoryId, title, amount, date } = action.payload;
      const category = state.find(cat => cat.id === categoryId);
      if (category) {
        category.expenses.push({ id, title, amount, date });
      }
    },
    removeExpense: (state, action) => {
      const { categoryId, expenseId } = action.payload;
      const category = state.find(cat => cat.id === categoryId);
      if (category) {
        category.expenses = category.expenses.filter(exp => exp.id !== expenseId);
      }
    },
    editExpense: (state, action) => {
      const { categoryId, expenseId, updatedData } = action.payload;
      const category = state.find(cat => cat.id === categoryId);
      if (category) {
        const expense = category.expenses.find(exp => exp.id === expenseId);
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
},
    setGoal: (state, action) => {
      const { categoryId, goalAmount } = action.payload;
      const category = state.find(cat => cat.id === categoryId);
      if (category) {
        category.goalAmount = goalAmount;
      }
    }
  },
});

export const { searchCategories, addExpense, removeExpense, editExpense, addCategory, setGoal } = categoriesSlice.actions;
export default categoriesSlice.reducer;





