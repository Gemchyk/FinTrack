import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../api";

const initialState = {
  isAuth: false,
  token: '',
};

export const signInAsync = createAsyncThunk('signin', async ({ username, password }) => {
    const body = { username, password };

    const result = await api('/signin', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    const response = await result.json();

    if (response.token) {
      localStorage.setItem('token', response.token);
    }

    return { token: response.token };
  });


const authSlice = createSlice({
  name: 'auth',
  initialState,
  extraReducers: builder => {
    builder.addCase(signInAsync.fulfilled, (state, action) => {
      state.isAuth = true;
      state.token = action.payload.token;
    });
  }
});

export default authSlice.reducer;
