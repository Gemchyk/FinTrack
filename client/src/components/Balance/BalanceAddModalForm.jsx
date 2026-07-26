import { Formik, Form, Field, ErrorMessage } from 'formik';
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

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3>{isEdit ? 'Edit' : 'Add'} {t('Balance')}</h3>
        <Formik
          initialValues={initialValues}
          validate={(values) => {
            const errors = {};
            if (!values.title) errors.title = 'Required';
            if (!values.amount || isNaN(values.amount)) errors.amount = 'Enter a valid amount';
            if (!values.date) errors.date = 'Required';
            return errors;
          }}
          onSubmit={(values, { resetForm }) => {
            const amount = parseFloat(values.amount);
            console.log('Submitting form with values:', values);
          
            if (isNaN(amount) || amount <= 0) {
              console.error('Invalid amount:', amount);
              return;
            }
          
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
          
            resetForm();
            onClose();
          }}
        >
          {() => (
            <Form className={styles.form}>
              <label>
                {t('Title')}
                <Field name="title" type="text" />
                <ErrorMessage name="title" component="div" className={styles.error} />
              </label>

              <label>
                {t('Amount')}
                <Field name="amount" type="number" step="0.01" />
                <ErrorMessage name="amount" component="div" className={styles.error} />
              </label>

              <label>
                {t('Date')}
                <Field name="date" type="date" />
                <ErrorMessage name="date" component="div" className={styles.error} />
              </label>

              <div className={styles.actions}>
                <button type="submit">{isEdit ? t('Save Changes') : t('Add Balance')}</button>
                <button type="button" onClick={onClose}>{t('Cancel')}</button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
