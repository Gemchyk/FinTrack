import type { FormEvent } from "react";
import { useTranslation } from "react-i18next";
import "./AddExpenseModal.scss";
import AmountInput from "../../AmountInput/AmountInput";
import { errorKey } from "../../../store/api";
import { today } from "../../../dates";
import { useAddTransactionMutation, useUpdateTransactionMutation } from "../../Transactions/transactionsApi";
import type { Transaction } from "../../../../../shared/api-types";

interface Props {
  categoryId: string;
  editingExpense: Transaction | null;
  onClose: () => void;
}

// No check against the balance: on the 1st it is zero, and an overspent month is shown in red instead
const AddExpenseModal = ({ categoryId, editingExpense, onClose }: Props) => {
  const { t } = useTranslation();
  const [addTransaction, addState] = useAddTransactionMutation();
  const [updateTransaction, updateState] = useUpdateTransactionMutation();
  const errorText = errorKey(addState.error ?? updateState.error, { 400: "errors.invalid" });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const input = {
      type: "Expense" as const,
      title: String(form.get("title")),
      amount: Number(form.get("amount")),
      date: String(form.get("date")),
      categoryId,
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
