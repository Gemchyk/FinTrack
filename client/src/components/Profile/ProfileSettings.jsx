import { useTranslation } from 'react-i18next';
import PreferenceToggles from '../SwitchButton/PreferenceToggles';

// Email, currency and logout join here once accounts exist (plan phase 3)
function ProfileSettings() {
  const { t } = useTranslation();

  return (
    <section>
      <h1 className="title">{t("Profile")}</h1>
      <PreferenceToggles />
    </section>
  );
}

export default ProfileSettings;
