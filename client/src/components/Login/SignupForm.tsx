import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import type { Lang } from '../../../../shared/api-types';
import styles from './LoginPage.module.scss';
import { errorKey } from '../../store/api';
import { useSignupMutation } from './authApi';
import NewPasswordInput from './NewPasswordInput';
import ResendVerification from './ResendVerification';
import CurrencySelect from '../SelectButton/CurrencySelect';

// The browser accepts "a@b" as an email, the server wants a dot in the domain: that is the usual 400
const SIGNUP_ERRORS = { 400: 'auth.invalidEmail', 409: 'auth.emailTaken' };

function SignupForm() {
  const { t, i18n } = useTranslation();
  const [signup, { isLoading, isSuccess, error }] = useSignupMutation();
  const [email, setEmail] = useState('');
  const errorText = errorKey(error, SIGNUP_ERRORS);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    // Emails go out in this language; the toggle on the profile page changes it later
    const lang: Lang = i18n.resolvedLanguage === 'uk' ? 'uk' : 'en';
    const values = {
      email: String(form.get('email')),
      password: String(form.get('password')),
      currency: String(form.get('currency')),
      lang,
    };
    setEmail(values.email);
    signup(values);
  };

  if (isSuccess) {
    return (
      <div className={styles['centered-form']}>
        <h2 className={styles['form-title']}>{t('auth.checkEmailTitle')}</h2>
        <p className={styles['form-message']}>{t('auth.checkEmail', { email })}</p>
        <ResendVerification email={email} />
        <p className={styles['form-links']}>
          <Link to="/">{t('auth.toSignin')}</Link>
        </p>
      </div>
    );
  }

  return (
    <form className={styles['centered-form']} onSubmit={handleSubmit}>
      <h2 className={styles['form-title']}>{t('auth.signupTitle')}</h2>
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
        <NewPasswordInput />
      </div>
      <div>
        <label className={styles['form-label']} htmlFor="currency">{t("Currency")}</label><br />
        <CurrencySelect className={styles['form-input']} id="currency" name="currency" defaultValue="UAH" />
      </div>
      {errorText && <p className={styles['form-error']} role="alert">{t(errorText)}</p>}
      <button className={styles['form-btn']} type="submit" disabled={isLoading}>
        {t("Sign up")}
      </button>
      <p className={styles['form-links']}>
        <Link to="/">{t('auth.toSignin')}</Link>
      </p>
    </form>
  );
}

export default SignupForm;
