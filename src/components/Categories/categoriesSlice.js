import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = [
  {
    id: "groceries",
    name: "Продукти",
    expenses: [
      { id: "1", title: "АТБ", amount: 1200, date: "2025-06-01" },
      { id: "2", title: "РОСТ", amount: 800, date: "2025-06-03" },
    ],
  },
  {
    id: "fun",
    name: "Розваги",
    expenses: [
        { id: "3", title: "Кіно", amount: 600, date: "2025-06-02" },
        { id: "4", title: "Спорт", amount: 600, date: "2025-06-02" },
    ],
  },
];

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
  },
});

export const { addExpense } = categoriesSlice.actions;
export default categoriesSlice.reducer;