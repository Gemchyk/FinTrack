import type { FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import styles from './LoginPage.module.scss';
import { errorKey } from '../../store/api';
import { useResetPasswordMutation } from './authApi';
import NewPasswordInput from './NewPasswordInput';

// Opened from the email: /reset?token=…
function ResetForm() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [resetPassword, { isLoading, isSuccess, error }] = useResetPasswordMutation();
  // The password length is checked in the browser, so a 400 here is about the link
  const errorText = token ? errorKey(error, { 400: 'auth.invalidLink' }) : 'auth.invalidLink';

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (token) resetPassword({ token, password: String(new FormData(e.currentTarget).get('password')) });
  };

  // No automatic sign-in: on iPhone this page opens in Safari, not in the installed app
  if (isSuccess) {
    return (
      <div className={styles['centered-form']}>
        <h2 className={styles['form-title']}>{t('auth.resetTitle')}</h2>
        <p className={styles['form-message']}>{t('auth.passwordChanged')}</p>
        <p className={styles['form-links']}>
          <Link to="/">{t("Login-btn")}</Link>
        </p>
      </div>
    );
  }

  return (
    <form className={styles['centered-form']} onSubmit={handleSubmit}>
      <h2 className={styles['form-title']}>{t('auth.resetTitle')}</h2>
      <div>
        <label className={styles['form-label']} htmlFor="password">{t("New password")}</label><br />
        <NewPasswordInput />
      </div>
      {errorText && <p className={styles['form-error']} role="alert">{t(errorText)}</p>}
      <button className={styles['form-btn']} type="submit" disabled={isLoading || !token}>
        {t('auth.savePassword')}
      </button>
      <p className={styles['form-links']}>
        <Link to="/forgot">{t('auth.newLink')}</Link>
        <Link to="/">{t('auth.toSignin')}</Link>
      </p>
    </form>
  );
}

export default ResetForm;
