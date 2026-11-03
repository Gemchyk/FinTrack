import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import styles from './LoginPage.module.scss';
import Loader from '../Loaders/Loader';
import { errorKey } from '../../store/api';
import { useVerifyEmailMutation } from './authApi';

// Opened from the email: /verify?token=…
function VerifyEmail() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [verifyEmail, { isSuccess, error }] = useVerifyEmailMutation();
  const errorText = token ? errorKey(error, { 400: 'auth.verifyFailed' }) : 'auth.verifyFailed';

  useEffect(() => {
    if (token) verifyEmail(token);
  }, [token, verifyEmail]);

  return (
    <div className={styles['centered-form']}>
      <h2 className={styles['form-title']}>{t('auth.verifyTitle')}</h2>
      {/* No automatic sign-in: on iPhone this page opens in Safari, not in the installed app */}
      {isSuccess && <p className={styles['form-message']}>{t('auth.emailVerified')}</p>}
      {errorText && <p className={styles['form-error']} role="alert">{t(errorText)}</p>}
      {/* A sleeping server takes up to a minute to answer: a spinner, not an error */}
      {!isSuccess && !errorText && (
        <>
          <Loader />
          <p className={styles['form-message']}>{t('auth.verifying')}</p>
        </>
      )}
      {(isSuccess || errorText) && (
        <p className={styles['form-links']}>
          <Link to="/">{t("Login-btn")}</Link>
        </p>
      )}
    </div>
  );
}

export default VerifyEmail;
