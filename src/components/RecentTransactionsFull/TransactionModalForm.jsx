import { Formik, Form, Field, ErrorMessage } from 'formik';
import styles from './TransactionModalForm.module.scss';
import { useDispatch } from 'react-redux';
import { nanoid } from '@reduxjs/toolkit';
import { addTransaction, editTransaction } from '../Transactions/transactionsSlice';
import { useTranslation } from 'react-i18next';



const iconMap = {
  Housing: "/src/assets/icons/IconHousing.svg",
  Food: "/src/assets/icons/IconFood.svg",
  Transport: "/src/assets/icons/IconTransportation.svg",
  Entertainment: "/src/assets/icons/IconEntertainment.svg",
  Shopping: "/src/assets/icons/IconShopping.svg",
  Health: "/src/assets/icons/IconOthers.svg",
  Other: "/src/assets/icons/IconOthers.svg",
};



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

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3>{isEdit ? 'Edit' : 'Add'} {t('Transaction')}</h3>
        <Formik
          initialValues={initialValues}
          validate={(values) => {
            const errors = {};
            if (!values.title) errors.title = 'Required';
            if (!values.amount || isNaN(values.amount)) errors.amount = 'Enter a valid amount';
            if (!values.date) errors.date = 'Required';
            if (!values.category) errors.category = 'Required';
            return errors;
          }}
          onSubmit={(values, { resetForm }) => {
            console.log(values.category);
            const payload = {
              id: isEdit ? editingTransaction.id : nanoid(),
              ...values,
              amount: parseFloat(values.amount),
              image: iconMap[values.category] || iconMap.Other,
            };
    
            if (isEdit) {
              dispatch(editTransaction({
                expenseId: editingTransaction.id,
                updatedData: payload
              }));
            } else {
              dispatch(addTransaction(payload));
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

              <label>
                {t('Type')}
                <Field name="type" as="select">
                  <option value="Expense">{t('Expense')}</option>
                  <option value="Income">{t('Income')}</option>
                </Field>
              </label>

              <label>
                {t('Category')}
                <Field name="category" type="text"/>
                <ErrorMessage name="category" component="div" className={styles.error} />
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
