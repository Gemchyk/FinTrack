import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    data: [
        { id: '01', day: "Jan", thisWeek: 10000,},
        { id: '02', day: "Feb", thisWeek: 12000 },
        { id: '03', day: "Mar", thisWeek: 13000},
        { id: '04', day: "Apr", thisWeek: 10000 },
        { id: '05', day: "May", thisWeek: 8000 },
        { id: '06', day: "Jun", thisWeek: 10000 },
        { id: '07', day: "Jul", thisWeek: 10000 },
        { id: '08', day: "Aug", thisWeek: 6000},
        { id: '09', day: "Sep", thisWeek: 9000 },
        { id: '10', day: "Oct", thisWeek: 1000 },
        { id: '11', day: "Nov", thisWeek: 10000 },
        { id: '12', day: "Dec", thisWeek: 8500 },
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


