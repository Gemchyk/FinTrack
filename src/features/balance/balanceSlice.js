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
      if (action.payload <= state.sum) {
        state.sum -= action.payload;
      } else {
        alert('❌ Недостаточно средств для снятия');
      }
    },
  },
});

export const { addAmount, removeAmount } = balanceSlice.actions;
export default balanceSlice.reducer;
