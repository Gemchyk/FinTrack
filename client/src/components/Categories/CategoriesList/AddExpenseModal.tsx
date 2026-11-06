import type { FormEvent } from "react";
import { useTranslation } from "react-i18next";
import "./AddExpenseModal.scss";
import AmountInput from "../../AmountInput/AmountInput";
import { errorKey } from "../../../store/api";
import { today } from "../../../dates";
import { useAddTransactionMutation, useUpdateTransactionMutation } from "../../Transactions/transactionsApi";
import { categoryName, useCategoriesQuery } from "../categoriesApi";
import type { Transaction } from "../../../../../shared/api-types";

// A select value: "" would not pass the required check, and the expense may stay without a category
const NO_CATEGORY = "none";

interface Props {
  // Given from a category card; without it the form asks for the category (the expense button on Overview)
  categoryId?: string;
  editingExpense: Transaction | null;
  onClose: () => void;
}

// No check against the balance: on the 1st it is zero, and an overspent month is shown in red instead
const AddExpenseModal = ({ categoryId, editingExpense, onClose }: Props) => {
  const { t } = useTranslation();
  const categories = useCategoriesQuery(undefined, { skip: Boolean(categoryId) }).data ?? [];
  const [addTransaction, addState] = useAddTransactionMutation();
  const [updateTransaction, updateState] = useUpdateTransactionMutation();
  const errorText = errorKey(addState.error ?? updateState.error, { 400: "errors.invalid" });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const chosen = categoryId ?? String(form.get("categoryId"));
    const input = {
      type: "Expense" as const,
      title: String(form.get("title")),
      amount: Number(form.get("amount")),
      date: String(form.get("date")),
      categoryId: chosen === NO_CATEGORY ? null : chosen,
    };
    const result = editingExpense
      ? await updateTransaction({ ...input, id: editingExpense.id })
      : await addTransaction(input);
    if (result.data) onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>{editingExpense ? t("Edit Expense") : t("New Expense")}</h3>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t("Name")}</label>
            <input name="title" className="form-control" maxLength={100} defaultValue={editingExpense?.title} required />
          </div>

          <div className="form-group">
            <label>{t("Amount")}</label>
            <AmountInput className="form-control" defaultValue={editingExpense?.amount} />
          </div>

          <div className="form-group">
            <label>{t("Date")}</label>
            <input name="date" type="date" className="form-control" defaultValue={editingExpense?.date ?? today()} required />
          </div>

          {!categoryId && (
            <div className="form-group">
              <label>{t("Category")}</label>
              <select name="categoryId" className="form-control" defaultValue="" required>
                <option value="" disabled>{t("Select")}</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{categoryName(t, category.name)}</option>
                ))}
                <option value={NO_CATEGORY}>{t("Without category")}</option>
              </select>
            </div>
          )}

          {errorText && (
            <div className="form-group">
              <div className="text-danger" role="alert">{t(errorText)}</div>
            </div>
          )}
          <div className="modal-buttons">
            <button type="submit" disabled={addState.isLoading || updateState.isLoading}>{t("Ok")}</button>
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
