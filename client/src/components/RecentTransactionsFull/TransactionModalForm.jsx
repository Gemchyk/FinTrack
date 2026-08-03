import styles from './TransactionModalForm.module.scss';
import { useDispatch } from 'react-redux';
import { nanoid } from '@reduxjs/toolkit';
import { addTransaction, editTransactionWithServer } from '../Transactions/transactionsSlice';
import { useTranslation } from 'react-i18next';



export default function TransactionModalForm({ onClose, mode = 'add', editingTransaction }) {
  const dispatch = useDispatch();
  const isEdit = mode === 'edit';
  const {t} = useTranslation();

  const initialValues = editingTransaction || {
    title: '',
    amount: '',
    date: '',
    type: 'Expense',
    category: '',
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const values = Object.fromEntries(new FormData(e.target));
    const payload = {
      id: isEdit ? editingTransaction.id : nanoid(),
      ...values,
      amount: parseFloat(values.amount),
    };

    if (isEdit) {
      dispatch(editTransactionWithServer({
        expenseId: editingTransaction.id,
        updatedData: payload
      }));
    } else {
      dispatch(addTransaction(payload));
    }

    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3>{isEdit ? t('Edit') : 'Add'} {t('Transaction')}</h3>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label>
            {t('Title')}
            <input name="title" type="text" defaultValue={initialValues.title} required />
          </label>

          <label>
            {t('Amount')}
            <input name="amount" type="number" min="0.01" step="0.01" defaultValue={initialValues.amount} required />
          </label>

          <label>
            {t('Date')}
            <input name="date" type="date" defaultValue={initialValues.date} required />
          </label>

          <label>
            {t('Category')}
            <input name="category" type="text" defaultValue={initialValues.category} required />
          </label>

          <div className={styles.actions}>
            <button type="submit">{isEdit ? t('Save Changes') : t('Add Balance')}</button>
            <button type="button" onClick={onClose}>{t('Cancel')}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
