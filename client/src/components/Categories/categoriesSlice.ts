import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

// UI state only: the categories come from the server (categoriesApi.ts). The cards are filtered by this
// string while rendering, on the name as it is shown
const categoriesSlice = createSlice({
  name: 'categories',
  initialState: { search: '' },
  reducers: {
    searchCategories: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
  },
});

export const selectCategorySearch = (state: { categories: { search: string } }) => state.categories.search;

export const { searchCategories } = categoriesSlice.actions;
export default categoriesSlice.reducer;
