import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeBalance } from "../../../features/balance/balanceSlice";
import "./AddExpenseModal.scss";
import { addExpenseWithStats, editExpenseWithStats } from "../categoriesSlice"
import { useTranslation } from "react-i18next";


const AddExpenseModal = ({ categoryId, onClose, show, editingExpense }) => {
  const dispatch = useDispatch();
  const balance = useSelector((state) => state.balance.sum);
  const categories = useSelector((state) => state.categories);
  const category = categories.find(i => i.id == categoryId).name;
  const [error, setError] = useState("");
  const {t} = useTranslation();

  const initialValues = {
    title: editingExpense?.title || "",
    amount: editingExpense?.amount || "",
    date: editingExpense?.date || "",
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const values = Object.fromEntries(new FormData(e.target));
    const amount = Number(values.amount);

    if (editingExpense) {
      dispatch(editExpenseWithStats({
        categoryId,
        expenseId: editingExpense.id,
        updatedData: values,
      }));
      onClose();
      return;
    }

    if (amount > balance) {
      setError("❌ Not enough money on balance");
      return;
    }

    dispatch(addExpenseWithStats({ categoryId, category, type: "Expense", ...values }));
    dispatch(removeBalance(amount));
    onClose();
  };

  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>{editingExpense ? t("Edit Expense") : t("New Expense")}</h3>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t("Name")}</label>
            <input name="title" className="form-control" defaultValue={initialValues.title} required />
          </div>

          <div className="form-group">
            <label>{t("Amount")}</label>
            <input name="amount" type="number" min="0.01" step="0.01" className="form-control" defaultValue={initialValues.amount} required />
          </div>

          <div className="form-group">
            <label>{t("Date")}</label>
            <input name="date" type="date" className="form-control" defaultValue={initialValues.date} required />
          </div>

          {error && <div className="text-danger mb-2">{error}</div>}
          <div className="modal-buttons">
            <button type="submit">{t("Ok")}</button>
            <button type="button" onClick={onClose}>
              {t("Cancel")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpenseModal;
