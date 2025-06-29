import { createSlice} from "@reduxjs/toolkit";






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
          state.data.unshift(action.payload);
        },
        removeTransaction: (state, action) => {
          state.data = state.data.filter(item => item.id != action.payload.expenseId);
        },
        editTransaction: (state, action) => {
          console.log(action.payload.updatedData);
          state.data = state.data.map(item => {
            if(item.id == action.payload.expenseId){
              console.log({ ...item, ...action.payload.updatedData });
              return { ...item, ...action.payload.updatedData };
            }else{
              return item;
            }
          });
        },
        filterByDate: (state) => {
            state.data = state.data.sort((a, b) => new Date(b.date) - new Date(a.date));
        },
        filterByAmount: (state) => {
            state.data = state.data.sort((a, b) => a.amount - b.amount);
        },
        filterByName: (state) => {
            state.data = state.data.sort((a, b) => a.title.localeCompare(b.title))
        }
    },
});



export const {addTransaction, removeTransaction, editTransaction, filterByDate, filterByAmount, filterByName} = transactionsSlice.actions;
export default transactionsSlice.reducer;