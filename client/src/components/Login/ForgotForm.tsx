import type { FormEvent } from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import styles from './LoginPage.module.scss';
import { errorKey } from '../../store/api';
import { useForgotPasswordMutation } from './authApi';

function ForgotForm() {
  const { t } = useTranslation();
  const [forgotPassword, { isLoading, isSuccess, error }] = useForgotPasswordMutation();
  const errorText = errorKey(error, { 400: 'auth.invalidEmail' });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    forgotPassword(String(new FormData(e.currentTarget).get('email')));
  };

  if (isSuccess) {
    return (
      <div className={styles['centered-form']}>
        <h2 className={styles['form-title']}>{t('auth.forgotTitle')}</h2>
        {/* The server answers the same whether or not the account exists */}
        <p className={styles['form-message']}>{t('auth.resetSent')}</p>
        <p className={styles['form-links']}>
          <Link to="/">{t('auth.toSignin')}</Link>
        </p>
      </div>
    );
  }

  return (
    <form className={styles['centered-form']} onSubmit={handleSubmit}>
      <h2 className={styles['form-title']}>{t('auth.forgotTitle')}</h2>
      <p className={styles['form-message']}>{t('auth.forgotHint')}</p>
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
      {errorText && <p className={styles['form-error']} role="alert">{t(errorText)}</p>}
      <button className={styles['form-btn']} type="submit" disabled={isLoading}>
        {t('auth.sendLink')}
      </button>
      <p className={styles['form-links']}>
        <Link to="/">{t('auth.toSignin')}</Link>
      </p>
    </form>
  );
}

export default ForgotForm;
