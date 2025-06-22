import { createSlice, createAsyncThunk, nanoid } from "@reduxjs/toolkit";
import { removeExpenseFromTable } from "../WeeklyComparison/weeklyComprasionSlice";

const initialState = [
  {
    id: "groceries",
    name: "Продукти",
    iconName: "Food",
    expenses: [
      { id: "1", title: "АТБ", amount: 1200, date: "2025-06-01" },
      { id: "2", title: "РОСТ", amount: 800, date: "2025-06-03" },
    ],
  },
  {
    id: "fun",
    name: "Розваги",
    iconName: "Entertainment",
    expenses: [
      { id: "3", title: "Кіно", amount: 600, date: "2025-06-02" },
      { id: "4", title: "Спорт", amount: 600, date: "2025-06-02" },
    ],
  },
  {
    id: "transport",
    name: "Транспорт",
    iconName: "Transport",
    expenses: [
      { id: "5", title: "Метро", amount: 100, date: "2025-06-04" },
    ],
  },
  {
    id: "shopping",
    name: "Шопінг",
    iconName: "Shopping",
    expenses: [
      { id: "6", title: "H&M", amount: 900, date: "2025-06-05" },
    ],
  },
  {
    id: "health",
    name: "Здоров'я",
    iconName: "Health",
    expenses: [
      { id: "7", title: "Аптека", amount: 300, date: "2025-06-06" },
    ],
  },
  {
    id: "other",
    name: "Інше",
    iconName: "Other",
    expenses: [
      { id: "8", title: "Подарунок", amount: 500, date: "2025-06-07" },
    ],
  },
];


export const removeExpenseWithStats = createAsyncThunk(
  "categories/removeExpenseWithStats",
  async ({ categoryId, expenseId, date, amount }, { dispatch }) => {
    console.log("buba")
    dispatch(removeExpense({ categoryId, expenseId }));
    dispatch(removeExpenseFromTable({ date, amount }));
  }
)

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    addExpense: (state, action) => {
      const { categoryId, title, amount, date } = action.payload;
      const category = state.find(cat => cat.id === categoryId);
      if (category) {
        category.expenses.push({ id: nanoid(), title, amount, date });
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
    
  },
});

export const { addExpense, removeExpense, editExpense } = categoriesSlice.actions;
export default categoriesSlice.reducer;