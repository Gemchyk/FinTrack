import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
    data: [      ]
}


export const fetchTransactionsToDashboard = createAsyncThunk(
    'weeklyComparison/fetchData',
    async (_, { getState }) => {
      const token = getState().login.token || localStorage.getItem('token');
      const response = await fetch('http://localhost:5050/dashboard', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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


