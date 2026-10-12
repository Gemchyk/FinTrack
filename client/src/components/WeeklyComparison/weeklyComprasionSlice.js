import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../api";

const initialState = {
    data: [      ]
}


export const fetchTransactionsToDashboard = createAsyncThunk(
    'weeklyComparison/fetchData',
    async () => {
      const response = await api('/dashboard');
      const result = await response.json();
      return result.data;
    }
  );


const weeklyComprasionSlice = createSlice({
    name: 'weeklyComprasion',
    initialState,
    extraReducers: (builder) => {
        builder.addCase(fetchTransactionsToDashboard.fulfilled, (state, action) => {
          state.data = action.payload;
        });
      },
});


export default weeklyComprasionSlice.reducer;
