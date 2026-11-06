import { api, INVALIDATES } from '../../store/api';
import type { Transaction, TransactionInput, TransactionPage, TransactionType } from '../../../../shared/api-types';

// Query of GET /transactions without the page, which the infinite query adds
export interface TransactionFilter {
  type?: TransactionType | 'all';
  category?: string; // category id or 'all'
  month?: string; // YYYY-MM
  sort?: 'date' | 'amount' | 'name';
  limit?: number;
}

const transactionsApi = api.injectEndpoints({
  endpoints: (build) => ({
    // Every set of filters is its own cache entry. After a change all loaded pages of each list are fetched
    // again with that list's own filters
    transactions: build.infiniteQuery<TransactionPage, TransactionFilter, number>({
      infiniteQueryOptions: {
        initialPageParam: 1,
        getNextPageParam: (lastPage, _allPages, lastPageParam) => (lastPage.hasMore ? lastPageParam + 1 : undefined),
      },
      query: ({ queryArg, pageParam }) => {
        const params = new URLSearchParams({ page: String(pageParam) });
        for (const [key, value] of Object.entries(queryArg)) {
          if (value !== undefined) params.set(key, String(value));
        }
        return `/transactions?${params}`;
      },
      providesTags: ['Transactions'],
    }),
    addTransaction: build.mutation<Transaction, TransactionInput>({
      query: (body) => ({ url: '/transactions', method: 'POST', body }),
      invalidatesTags: INVALIDATES.transaction,
    }),
    updateTransaction: build.mutation<Transaction, TransactionInput & { id: string }>({
      query: ({ id, ...body }) => ({ url: `/transactions/${id}`, method: 'PUT', body }),
      invalidatesTags: INVALIDATES.transaction,
    }),
    deleteTransaction: build.mutation<void, string>({
      query: (id) => ({ url: `/transactions/${id}`, method: 'DELETE' }),
      invalidatesTags: INVALIDATES.transaction,
    }),
  }),
});

export const {
  useTransactionsInfiniteQuery,
  useAddTransactionMutation,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
} = transactionsApi;
