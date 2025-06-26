import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";






const initialState = {
    data: [{
      image: "/src/assets/icons/IconHousing.svg?react",
      alt: "Joystick",
      title: "GTR 5",
      amount: 160.00,
      date: "2023-11-17",
    },
    {
      image: "/src/assets/icons/IconFood.svg?react",
      alt: "Bag",
      title: "Polo Shirt",
      amount: 20.00,
      date: "2023-08-17",
    },
    {
      image: "/src/assets/icons/IconFood.svg?react",
      alt: "House",
      title: "Biriyani",
      amount: 10.00,
      date: "2023-09-17",
    },
    {
      image: "/src/assets/icons/IconFood.svg?react",
      alt: "Taxi",
      title: "Taxi Fare",
      amount: 12.00,
      date: "2023-10-17",
    },
    {
      image: "/src/assets/icons/IconFood.svg?react",
      alt: "Bag2",
      title: "Keyboard",
      amount: 22.50,
      date: "2023-05-17",
    },]
};


const transactionsSlice = createSlice({
    name: "transactions",
    initialState,
    reducers: {
        addTransaction: (state, action) => {
          console.log(action.payload);
          state.data.push(action.payload);
        },
        filterByDate: (state) => {
            state.data = state.data.sort((a, b) => new Date(a.date) - new Date(b.date));
        },
        filterByAmount: (state) => {
            state.data = state.data.sort((a, b) => a.amount - b.amount);
        },
        filterByName: (state) => {
            state.data = state.data.sort((a, b) => a.title.localeCompare(b.title))
        }
    },
});



export const {addTransaction, filterByDate, filterByAmount, filterByName} = transactionsSlice.actions;
export default transactionsSlice.reducer;