import type { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './LoginPage.module.scss';

// bcrypt on the server reads only the first 72 bytes and a Cyrillic letter takes two, so maxLength would not
// catch it; the browser shows the message and blocks the submit like any other native check
function NewPasswordInput() {
  const { t } = useTranslation();

  const checkLength = (e: FormEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    input.setCustomValidity(new TextEncoder().encode(input.value).length > 72 ? t('auth.passwordTooLong') : '');
  };

  return (
    <input
      className={styles['form-input']}
      id="password"
      name="password"
      type="password"
      autoComplete="new-password"
      minLength={8}
      placeholder={t('auth.passwordHint')}
      onInput={checkLength}
      required
    />
  );
}

export default NewPasswordInput;
