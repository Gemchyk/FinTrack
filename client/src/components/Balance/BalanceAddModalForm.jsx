import styles from '../RecentTransactionsFull/TransactionModalForm.module.scss';
import { useDispatch } from 'react-redux';
import { nanoid } from '@reduxjs/toolkit';
import { addTransaction, editTransaction } from '../Transactions/transactionsSlice';
import { useTranslation } from 'react-i18next';
import { addBalance } from '../../features/balance/balanceSlice';

export default function BalanceAddModalForm({ onClose, mode = 'add', editingTransaction }) {
  const dispatch = useDispatch();
  const isEdit = mode === 'edit';
  const { t } = useTranslation();

  const initialValues = editingTransaction || {
    title: '',
    amount: '',
    date: new Date().toISOString().split('T')[0], // today's date
    type: 'Income',
    category: '',
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const values = Object.fromEntries(new FormData(e.target));
    const amount = parseFloat(values.amount);

    if (isEdit) {
      dispatch(editTransaction({ expenseId: initialValues.id, updatedData: values }));
    } else {
      dispatch(addTransaction({
        id: nanoid(),
        ...values,
        amount,
      }));

      dispatch(addBalance(amount));
    }

    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3>{isEdit ? 'Edit' : 'Add'} {t('Balance')}</h3>
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

          <div className={styles.actions}>
            <button type="submit">{isEdit ? t('Save Changes') : t('Add Balance')}</button>
            <button type="button" onClick={onClose}>{t('Cancel')}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
