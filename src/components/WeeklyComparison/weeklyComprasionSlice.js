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
    reducers: {
        addExpenseToTable: (state, action) => {
            state.forEach(i => {
              console.log(i.month);
            })
            const month = action.payload.date.slice(5, 7);
            state.data = state.data.map(i => {
                if (i.id === month) {
                  return {...i, thisWeek: i.thisWeek + action.payload.amount};
                }
                return i;
              });
        },
        removeExpenseFromTable: (state, action) => {
            const month = action.payload.date.slice(5, 7);
            state.data = state.data.map(i => {
                if (i.id === month) {
                  return {...i, thisWeek: i.thisWeek - action.payload.amount};
                }
                return i;
              });
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
    },
    extraReducers: (builder) => {
        builder.addCase(fetchTransactionsToDashboard.fulfilled, (state, action) => {
          state.data = action.payload;  
        });
      },
});


export const {addExpenseToTable, removeExpenseFromTable, editExpenseInTable} = weeklyComprasionSlice.actions;
export default weeklyComprasionSlice.reducer;


