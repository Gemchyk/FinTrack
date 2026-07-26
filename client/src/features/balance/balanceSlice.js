import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Fetch balance from server
export const fetchBalance = createAsyncThunk(
  'balance/fetchBalance',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');

      const res = await fetch('http://localhost:5050/balance', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!res.ok) throw new Error('Failed to fetch balance');
      
      const data = await res.json();
      return data.sum;

    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Add amount
export const addBalance = createAsyncThunk(
  'balance/addBalance',
  async (amount, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');

      const res = await fetch('http://localhost:5050/balance/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ amount }),
      });

      const data = await res.json();

      if (res.ok) return data.sum;

      throw new Error(data.error || 'Failed to add funds');
    } catch (err) {
      return rejectWithValue(err.message || 'Network error');
    }
  }
);

// Remove amount
export const removeBalance = createAsyncThunk(
  'balance/removeBalance',
  async (amount, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');

      const res = await fetch('http://localhost:5050/balance/remove', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ amount }),
      });

      const data = await res.json();

      if (res.ok) return data.sum;

      return rejectWithValue(data.error || 'Failed to withdraw funds');
    } catch (err) {
      return rejectWithValue(err.message || 'Network error');
    }
  }
);
const balanceSlice = createSlice({
  name: 'balance',
  initialState: {
    sum: 0,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchBalance.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBalance.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.sum = action.payload;
      })
      .addCase(fetchBalance.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // Add
      .addCase(addBalance.fulfilled, (state, action) => {
        state.sum = action.payload;
      })
      .addCase(addBalance.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // Remove
      .addCase(removeBalance.fulfilled, (state, action) => {
        state.sum = action.payload;
      })
      .addCase(removeBalance.rejected, (state, action) => {
        state.error = action.payload || 'Unknown error';
      });
  },
});

export default balanceSlice.reducer;
