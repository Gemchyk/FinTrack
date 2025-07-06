import { useState } from "react";
import { useDispatch } from "react-redux";
import { addCategory } from "../../categoriesSlice";
import { nanoid } from "@reduxjs/toolkit";
import { useTranslation } from "react-i18next";

const NewCategoryModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [iconName, setIconName] = useState("Housing");
  const { t } = useTranslation();

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

        <select value={iconName} onChange={(e) => setIconName(e.target.value)}>
          <option value="Housing">{t("Housing")}</option>
          <option value="Food">{t("categories.food")}</option>
          <option value="Transport">{t("categories.transport")}</option>
          <option value="Entertainment">{t("categories.fun")}</option>
          <option value="Shopping">{t("categories.shopping")}</option>
          <option value="Health">{t("categories.health")}</option>
          <option value="Other">{t("categories.other")}</option>
        </select>

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
