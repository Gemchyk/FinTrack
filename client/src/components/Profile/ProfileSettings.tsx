import type { ChangeEvent } from 'react';
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

  return (
    <section className={styles.settings}>
      <h1 className="title">{t("Profile")}</h1>
      {me && (
        <>
          <p className={styles.email}>{me.email}</p>
          <label className={styles.field}>
            {t("Currency")}
            <CurrencySelect
              className={styles.select}
              value={me.currency}
              onChange={handleCurrencyChange}
              disabled={isSaving}
            />
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
