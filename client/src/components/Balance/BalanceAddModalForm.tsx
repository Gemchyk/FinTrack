import type { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../RecentTransactionsFull/TransactionModalForm.module.scss';
import AmountInput from '../AmountInput/AmountInput';
import { errorKey } from '../../store/api';
import { today } from '../../dates';
import { useAddTransactionMutation } from '../Transactions/transactionsApi';

// Adds an income. The balance is computed from the transactions, so there is nothing else to update
export default function BalanceAddModalForm({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  const [addTransaction, { isLoading, error }] = useAddTransactionMutation();
  const errorText = errorKey(error, { 400: 'errors.invalid' });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const result = await addTransaction({
      type: 'Income',
      title: String(form.get('title')),
      amount: Number(form.get('amount')),
      date: String(form.get('date')),
      categoryId: null,
    });
    if (result.data) onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3>{t('Add Balance')}</h3>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label>
            {t('Title')}
            <input name="title" type="text" maxLength={100} required />
          </label>

          <label>
            {t('Amount')}
            <AmountInput />
          </label>

          <label>
            {t('Date')}
            <input name="date" type="date" defaultValue={today()} required />
          </label>

          {errorText && <p className={styles.error} role="alert">{t(errorText)}</p>}
          <div className={styles.actions}>
            <button type="submit" disabled={isLoading}>{t('Add Balance')}</button>
            <button type="button" onClick={onClose}>{t('Cancel')}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
