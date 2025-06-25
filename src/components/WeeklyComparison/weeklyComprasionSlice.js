import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    data: [
        { id: '01', day: "Sun", thisWeek: 200000, lastWeek: 200000,},
        { id: '02', day: "Mon", thisWeek: 100000, lastWeek: 120000 },
        { id: '03', day: "Tue", thisWeek: 80000, lastWeek: 90000 },
        { id: '04', day: "Wed", thisWeek: 10000, lastWeek: 110000 },
        { id: '05', day: "Thu", thisWeek: 130000, lastWeek: 100000 },
        { id: '06', day: "Fri", thisWeek: 220000, lastWeek: 210000 },
        { id: '07', day: "Sat", thisWeek: 150000, lastWeek: 170000 },
        { id: '08', day: "Sat", thisWeek: 150000, lastWeek: 17000 },
        { id: '09', day: "Sat", thisWeek: 150000, lastWeek: 170000 },
        { id: '10', day: "Sat", thisWeek: 15000, lastWeek: 170000 },
        { id: '11', day: "Sat", thisWeek: 150000, lastWeek: 100000 },
        { id: '12', day: "Sat", thisWeek: 150000, lastWeek: 150000 },
      ]
}



const weeklyComprasionSlice = createSlice({
    name: 'weeklyComprasion',
    initialState,
    reducers: {
        addExpenseToTable: (state, action) => {
            const month = action.payload.date.slice(5, 7);
            state.data.map(i => {
                if(i.id == month){
                    i.thisWeek += action.payload.amount;
            }});
        },
        removeExpenseFromTable: (state, action) => {
            const month = action.payload.date.slice(5, 7);
            state.data.map(i => {
                if(i.id == month){
                    i.thisWeek -= action.payload.amount;
            }});
        },
        editExpenseInTable: (state, action) => {
            const payload = action.payload;
            const oldMonth = payload.oldData.date.slice(5, 7);
            const newMonth = payload.updatedData.date.slice(5,7);
            const difference = payload.updatedData.amount - payload.oldData.amount;
            state.data.map(i => {
                if(i.id == oldMonth && i.id == newMonth){
                    i.thisWeek += difference;
                }else{
                    if(i.id == oldMonth){
                        i.thisWeek -= action.payload.oldData.amount;
                    }
                    if(i.id == newMonth){
                        difference > 0 ? i.thisWeek += difference : i.thisWeek -= difference;
                    }
                }
            });
        }
    }
});


export const {addExpenseToTable, removeExpenseFromTable, editExpenseInTable} = weeklyComprasionSlice.actions;
export default weeklyComprasionSlice.reducer;