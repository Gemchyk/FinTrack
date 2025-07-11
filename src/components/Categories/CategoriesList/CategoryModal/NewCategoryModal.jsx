import { useState, useContext } from "react";
import { useDispatch } from "react-redux";
import { addCategory } from "../../categoriesSlice";
import { nanoid } from "@reduxjs/toolkit";
import { useTranslation } from "react-i18next";
import CategorySelect, {options} from "../../../SelectButton/CategorySelect";
import { ThemeContext } from "../../../../context/ThemeContext";



const NewCategoryModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [iconName, setIconName] = useState("Housing");
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);
  const  filteredOptions = options.filter(i => i.value != 'all');

  const handleSubmit = () => {
    const finalName = iconName === "Other" ? name.trim() : iconName;
    if (!finalName) return;

    dispatch(
      addCategory({
        id: nanoid(),
        name: finalName,
        iconName,
      })
    );

    onClose();
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
            onChange={(e) => setName(e.target.value)}
          />
        )}

        <div className="modal-buttons">
          <button onClick={handleSubmit}>{t("Add")}</button>
          <button onClick={onClose}>{t("Cancel")}</button>
        </div>
      </div>
    </div>
  );
};

export default NewCategoryModal;
