import { useState } from "react";
import { useDispatch } from "react-redux";
import { addCategory } from "../../categoriesSlice";
import { nanoid } from "@reduxjs/toolkit";
import { useTranslation } from 'react-i18next';

const NewCategoryModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [iconName, setIconName] = useState("Other");
  const {t} = useTranslation();

  const handleSubmit = () => {
    if (!name.trim()) return;
    dispatch(addCategory({
      id: nanoid(),
      name,
      iconName
    }));
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>{t("Newcategory")}</h3>
        <input
          type="text"
          placeholder={t("Name category")}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <select value={iconName} onChange={(e) => setIconName(e.target.value)}>
          <option value="Housing">Housing</option>
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Shopping">Shopping</option>
          <option value="Health">Health</option>
          <option value="Other">Other</option>
        </select>
        <div className="modal-buttons">
          <button onClick={handleSubmit}>{t("Add")}</button>
          <button onClick={onClose}>{t("Cancel")}</button>
        </div>
      </div>
    </div>
  );
};

export default NewCategoryModal;