import { api } from '../../store/api';
import type { SigninInput, SigninResponse, SignupInput } from '../../../../shared/api-types';

// Only signin returns a session. store/api.ts looks for the name 'signin': its 401 is a wrong password,
// not an expired session
const authApi = api.injectEndpoints({
  endpoints: (build) => ({
    signup: build.mutation<void, SignupInput>({
      query: (body) => ({ url: '/signup', method: 'POST', body }),
    }),
    signin: build.mutation<SigninResponse, SigninInput>({
      query: (body) => ({ url: '/signin', method: 'POST', body }),
    }),
    verifyEmail: build.mutation<void, string>({
      query: (token) => ({ url: '/verify-email', method: 'POST', body: { token } }),
    }),
    resendVerification: build.mutation<void, string>({
      query: (email) => ({ url: '/resend-verification', method: 'POST', body: { email } }),
    }),
    forgotPassword: build.mutation<void, string>({
      query: (email) => ({ url: '/forgot-password', method: 'POST', body: { email } }),
    }),
    resetPassword: build.mutation<void, { token: string; password: string }>({
      query: (body) => ({ url: '/reset-password', method: 'POST', body }),
    }),
  }),
});

export const {
  useSignupMutation,
  useSigninMutation,
  useVerifyEmailMutation,
  useResendVerificationMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;
