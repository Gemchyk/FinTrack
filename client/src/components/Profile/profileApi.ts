import { api, INVALIDATES } from '../../store/api';
import type { Me, MeUpdate } from '../../../../shared/api-types';

const profileApi = api.injectEndpoints({
  endpoints: (build) => ({
    me: build.query<Me, void>({
      query: () => '/me',
      providesTags: ['Me'],
    }),
    updateMe: build.mutation<Me, MeUpdate>({
      query: (body) => ({ url: '/me', method: 'PATCH', body }),
      invalidatesTags: INVALIDATES.me,
    }),
  }),
});

export const { useMeQuery, useUpdateMeMutation } = profileApi;
