import type { TFunction } from 'i18next';
import { api, INVALIDATES } from '../../store/api';
import type { Category, CategoryInput, Report } from '../../../../shared/api-types';

const categoriesApi = api.injectEndpoints({
  endpoints: (build) => ({
    categories: build.query<Category[], void>({
      query: () => '/categories',
      providesTags: ['Categories'],
    }),
    // Totals of one month and every category with its goal and what was spent in it
    report: build.query<Report, string>({
      query: (month) => `/report?month=${month}`,
      providesTags: ['Report'],
    }),
    addCategory: build.mutation<Category, CategoryInput>({
      query: (body) => ({ url: '/categories', method: 'POST', body }),
      invalidatesTags: INVALIDATES.category,
    }),
    updateCategory: build.mutation<Category, CategoryInput & { id: string }>({
      query: ({ id, ...body }) => ({ url: `/categories/${id}`, method: 'PUT', body }),
      invalidatesTags: INVALIDATES.category,
    }),
    deleteCategory: build.mutation<void, string>({
      query: (id) => ({ url: `/categories/${id}`, method: 'DELETE' }),
      invalidatesTags: INVALIDATES.category,
    }),
  }),
});

export const {
  useCategoriesQuery,
  useReportQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApi;

// The default categories (Food, Fun…) have translations; a name the user typed is shown as it is.
// No separators: a user's "Bills: home" must not be read as namespace "Bills"
export function categoryName(t: TFunction, name: string): string {
  return t(name, { defaultValue: name, nsSeparator: false, keySeparator: false });
}
