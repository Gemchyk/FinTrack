import { useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import CategorySelect, {options} from "../../../SelectButton/CategorySelect";
import { ThemeContext } from "../../../../context/ThemeContext";
import { useAddCategoryMutation } from "../../categoriesApi";
import { errorKey } from "../../../../store/api";



const NewCategoryModal = ({ onClose }) => {
  const [name, setName] = useState("");
  const [iconName, setIconName] = useState("Housing");
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);
  const  filteredOptions = options.filter(i => i.value != 'all');
  const [addCategory, { isLoading, error }] = useAddCategoryMutation();
  const errorText = errorKey(error, { 409: "category.exists" });

  const handleSubmit = async () => {
    const finalName = iconName === "Other" ? name.trim() : iconName;
    if (!finalName) return;

    const result = await addCategory({ name: finalName, iconName, goal: null });
    if (result.data) onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>{t("New category")}</h3>

        <div className="select-center-wrapper">
          <CategorySelect value={iconName} onChange={setIconName} theme={theme} customOptions={filteredOptions}/>
        </div>

        {iconName === "Other" && (
          <input
            type="text"
            placeholder={t("Name category")}
            value={name}
            maxLength={50}
            onChange={(e) => setName(e.target.value)}
          />
        )}

        {errorText && <p style={{ color: '#e53935' }} role="alert">{t(errorText)}</p>}
        <div className="modal-buttons">
          <button onClick={handleSubmit} disabled={isLoading}>{t("Add")}</button>
          <button onClick={onClose}>{t("Cancel")}</button>
        </div>
      </div>
    </div>
  );
};

export default NewCategoryModal;
