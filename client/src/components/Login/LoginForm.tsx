import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import styles from './LoginPage.module.scss';
import { errorKey } from '../../store/api';
import { useSigninMutation } from './authApi';
import ResendVerification from './ResendVerification';

const SIGNIN_ERRORS = { 401: 'auth.wrongCredentials', 403: 'auth.notVerified' };

function LoginForm() {
  const { t } = useTranslation();
  const [signin, { isLoading, error }] = useSigninMutation();
  const [email, setEmail] = useState('');
  const errorText = errorKey(error, SIGNIN_ERRORS);
  const notVerified = error !== undefined && 'status' in error && error.status === 403;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const values = { email: String(form.get('email')), password: String(form.get('password')) };
    setEmail(values.email);

    const result = await signin(values);
    if (result.data) {
      localStorage.setItem('token', result.data.token);
      // A full load, like logout: nothing cached for a previous account survives
      location.assign('/Overview');
    }
  };

  return (
    <form className={styles['centered-form']} onSubmit={handleSubmit}>
      <div>
        <label className={styles['form-label']} htmlFor="email">{t("Email")}</label><br />
        <input
          className={styles['form-input']}
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
        />
      </div>
      <div>
        <label className={styles['form-label']} htmlFor="password">{t("Password")}</label><br />
        <input
          className={styles['form-input']}
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••••"
          required
        />
      </div>
      {errorText && <p className={styles['form-error']} role="alert">{t(errorText)}</p>}
      {notVerified && <ResendVerification key={email} email={email} />}
      <button className={styles['form-btn']} type="submit" disabled={isLoading}>
        {t("Login-btn")}
      </button>
      <p className={styles['form-links']}>
        <Link to="/signup">{t('auth.toSignup')}</Link>
        <Link to="/forgot">{t('auth.toForgot')}</Link>
      </p>
    </form>
  );
}

export default LoginForm;
