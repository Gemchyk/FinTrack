import React, { useState } from "react";
import * as yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";

import { useSelector, useDispatch } from "react-redux";
import { editExpense, addExpense } from "../categoriesSlice";
import { removeAmount } from "../../../features/balance/balanceSlice";
import { addExpenseToTable } from "../../WeeklyComparison/weeklyComprasionSlice";

import "./AddExpenseModal.scss";

const validationSchema = yup.object().shape({
  title: yup.string().required("Обов'язково"),
  amount: yup.number().positive("Має бути > 0").required("Обов'язково"),
  date: yup.date().required("Оберіть дату"),
});

const AddExpenseModal = ({ categoryId, onClose, show, editingExpense }) => {
  const dispatch = useDispatch();
  const balance = useSelector((state) => state.balance.sum);
  const [error, setError] = useState("");

  const initialValues = {
    title: editingExpense?.title || "",
    amount: editingExpense?.amount || "",
    date: editingExpense?.date || "",
  };

  const handleSubmit = (values) => {
    const amount = Number(values.amount);

    if (editingExpense) {
      dispatch(
        editExpense({
          categoryId,
          expenseId: editingExpense.id,
          updatedData: values,
        })
      );
      onClose();
      return;
    }
    if (amount > balance) {
      setError("❌ Недостатньо коштів на балансі");
      return;
    }
    dispatch(addExpense({ categoryId, ...values }));
    dispatch(addExpenseToTable(values));
    dispatch(removeAmount(amount));
    onClose();
  };

  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>{editingExpense ? "Редагувати витрату" : "Нова витрата"}</h3>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <div className="form-group">
              <label>Назва</label>
              <Field name="title" className="form-control" />
              <ErrorMessage
                name="title"
                component="div"
                className="text-danger"
              />
            </div>

            <div className="form-group">
              <label>Сума</label>
              <Field name="amount" type="number" className="form-control" />
              <ErrorMessage
                name="amount"
                component="div"
                className="text-danger"
              />
            </div>

            <div className="form-group">
              <label>Дата</label>
              <Field name="date" type="date" className="form-control" />
              <ErrorMessage
                name="date"
                component="div"
                className="text-danger"
              />
            </div>
            {error && <div className="text-danger mb-2">{error}</div>}
            <div className="modal-buttons">
              <button type="submit">Додати</button>
              <button type="button" onClick={onClose}>
                Скасувати
              </button>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default AddExpenseModal;
