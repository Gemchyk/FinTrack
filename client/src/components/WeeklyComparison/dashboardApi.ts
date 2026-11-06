import { api } from '../../store/api';
import type { DashboardMonth } from '../../../../shared/api-types';

const dashboardApi = api.injectEndpoints({
  endpoints: (build) => ({
    // Expenses of the 12 months ending with the given one, empty months included as zeros
    dashboard: build.query<DashboardMonth[], string>({
      query: (month) => `/dashboard?month=${month}`,
      providesTags: ['Dashboard'],
    }),
  }),
});

export const { useDashboardQuery } = dashboardApi;
