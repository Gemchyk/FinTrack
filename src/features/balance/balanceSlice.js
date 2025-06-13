import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sum: 25000, // начальный баланс
};

const balanceSlice = createSlice({
  name: 'balance',
  initialState,
  reducers: {
    addAmount: (state, action) => {
      state.sum += action.payload;
    },
    removeAmount: (state, action) => {
      state.sum = Math.max(0, state.sum - action.payload);
    },
  },
});

export const { addAmount, removeAmount } = balanceSlice.actions;
export default balanceSlice.reducer;
