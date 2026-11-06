import { useTranslation } from 'react-i18next';
import styles from './LoginPage.module.scss';
import { errorKey } from '../../store/api';
import { useResendVerificationMutation } from './authApi';

function ResendVerification({ email }: { email: string }) {
  const { t } = useTranslation();
  const [resend, { isLoading, isSuccess, error }] = useResendVerificationMutation();
  const errorText = errorKey(error);

  if (isSuccess) return <p className={styles['form-message']}>{t('auth.resent')}</p>;

  return (
    <>
      <button type="button" className={styles['form-link-btn']} onClick={() => resend(email)} disabled={isLoading}>
        {t('auth.resend')}
      </button>
      {errorText && <p className={styles['form-error']} role="alert">{t(errorText)}</p>}
    </>
  );
}

export default ResendVerification;
