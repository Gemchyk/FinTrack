import { api } from '../../store/api';
import type { MonthTotals } from '../../../../shared/api-types';

const balanceApi = api.injectEndpoints({
  endpoints: (build) => ({
    // Income minus expenses of one month, computed by the server; nothing stores a balance
    balance: build.query<MonthTotals, string>({
      query: (month) => `/balance?month=${month}`,
      providesTags: ['Balance'],
    }),
  }),
});

export const { useBalanceQuery } = balanceApi;
