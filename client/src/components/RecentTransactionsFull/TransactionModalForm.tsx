import { useState } from 'react';
import type { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './TransactionModalForm.module.scss';
import AmountInput from '../AmountInput/AmountInput';
import { errorKey } from '../../store/api';
import { useUpdateTransactionMutation } from '../Transactions/transactionsApi';
import { categoryName, useCategoriesQuery } from '../Categories/categoriesApi';
import type { Transaction, TransactionType } from '../../../../shared/api-types';

interface Props {
  transaction: Transaction;
  onClose: () => void;
}

export default function TransactionModalForm({ transaction, onClose }: Props) {
  const { t } = useTranslation();
  const categories = useCategoriesQuery().data ?? [];
  const [type, setType] = useState<TransactionType>(transaction.type);
  const [updateTransaction, { isLoading, error }] = useUpdateTransactionMutation();
  const errorText = errorKey(error, { 400: 'errors.invalid' });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const categoryId = form.get('categoryId');
    const result = await updateTransaction({
      id: transaction.id,
      type,
      title: String(form.get('title')),
      amount: Number(form.get('amount')),
      date: String(form.get('date')),
      // Categories group spending: the server refuses one on an income
      categoryId: type === 'Expense' && categoryId ? String(categoryId) : null,
    });
    if (result.data) onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3>{t('Edit')} {t('Transaction')}</h3>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label>
            {t('Title')}
            <input name="title" type="text" maxLength={100} defaultValue={transaction.title} required />
          </label>

          <label>
            {t('Type')}
            <select name="type" value={type} onChange={(e) => setType(e.target.value as TransactionType)}>
              <option value="Expense">{t('Expense')}</option>
              <option value="Income">{t('Income')}</option>
            </select>
          </label>

          <label>
            {t('Amount')}
            <AmountInput defaultValue={transaction.amount} />
          </label>

          <label>
            {t('Date')}
            <input name="date" type="date" defaultValue={transaction.date} required />
          </label>

          <label>
            {t('Category')}
            <select name="categoryId" defaultValue={transaction.categoryId ?? ''} disabled={type === 'Income'}>
              <option value="">{t('Without category')}</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{categoryName(t, category.name)}</option>
              ))}
            </select>
          </label>

          {errorText && <p className={styles.error} role="alert">{t(errorText)}</p>}
          <div className={styles.actions}>
            <button type="submit" disabled={isLoading}>{t('Save Changes')}</button>
            <button type="button" onClick={onClose}>{t('Cancel')}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
