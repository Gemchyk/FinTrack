import type { ChangeEvent, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import type { Lang } from '../../../../shared/api-types';
import PreferenceToggles from '../SwitchButton/PreferenceToggles';
import CurrencySelect from '../SelectButton/CurrencySelect';
import Loader from '../Loaders/Loader';
import { errorKey, logout } from '../../store/api';
import { useMeQuery, useUpdateMeMutation } from './profileApi';
import styles from './ProfileSettings.module.scss';

function ProfileSettings() {
  const { t } = useTranslation();
  const { data: me, error: loadError } = useMeQuery();
  const [updateMe, { isLoading: isSaving, error: saveError }] = useUpdateMeMutation();
  const errorText = errorKey(loadError ?? saveError);

  const handleCurrencyChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const currency = e.target.value;
    // Amounts are not converted, so ask first. On "cancel" the controlled select returns to me.currency
    if (window.confirm(t('profile.currencyConfirm', { currency }))) updateMe({ currency });
  };

  const handleNameSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateMe({ name: String(new FormData(e.currentTarget).get('name')) });
  };

  return (
    <section className={styles.settings}>
      <h1 className="title">{t("Profile")}</h1>
      {me && (
        <>
          {/* Accounts created before signup asked for a name have none until it is saved here */}
          {me.name && <p className={styles.name}>{me.name}</p>}
          <p className={styles.email}>{me.email}</p>
          <form className={styles.field} onSubmit={handleNameSubmit}>
            <label htmlFor="profile-name">{t("Your name")}</label>
            {/* The key resets the field to the saved name once the server has trimmed it */}
            <input
              key={me.name}
              className={styles.select}
              id="profile-name"
              name="name"
              type="text"
              autoComplete="name"
              defaultValue={me.name ?? ''}
              maxLength={50}
              pattern=".*\S.*"
              required
            />
            <button type="submit" className={styles.save} disabled={isSaving}>
              {t("Save Changes")}
            </button>
          </form>
          <label className={styles.field}>
            {t("Currency")}
            <CurrencySelect
              className={styles.select}
              value={me.currency}
              onChange={handleCurrencyChange}
              disabled={isSaving}
            />
          </label>
          <label className={styles.check}>
            <input
              type="checkbox"
              checked={me.monthlyReport}
              onChange={(e) => updateMe({ monthlyReport: e.target.checked })}
              disabled={isSaving}
            />
            {t('profile.monthlyReport')}
          </label>
        </>
      )}
      {!me && !loadError && <Loader />}
      <PreferenceToggles onLangChange={(lang: Lang) => updateMe({ lang })} />
      {errorText && <p className={styles.error} role="alert">{t(errorText)}</p>}
      <button type="button" className={styles.logout} onClick={logout}>
        {t("Log out")}
      </button>
    </section>
  );
}

export default ProfileSettings;
