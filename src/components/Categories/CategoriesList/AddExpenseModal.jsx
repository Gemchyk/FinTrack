import React, { useState } from "react";
import * as yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useSelector, useDispatch } from "react-redux";
import { removeBalance } from "../../../features/balance/balanceSlice";
import "./AddExpenseModal.scss";
import { addExpenseWithStats, editExpenseWithStats } from "../categoriesSlice"
import { useTranslation } from "react-i18next";


const validationSchema = yup.object().shape({
  title: yup.string().required("Обов'язково"),
  amount: yup.number().positive("Має бути > 0").required("Обов'язково"),
  date: yup.date().required("Оберіть дату"),
});

const iconMap = {
  Housing: "/src/assets/icons/IconHousing.svg?react",
  Food: "/src/assets/icons/IconFood.svg?react",
  Transport: "/src/assets/icons/IconTransportation.svg?react",
  Entertainment: "/src/assets/icons/IconEntertainment.svg?react",
  Shopping: "/src/assets/icons/IconShopping.svg?react",
  Health: "/src/assets/icons/IconOthers.svg?react",
  Other: "/src/assets/icons/IconOthers.svg?react",
};

const AddExpenseModal = ({ categoryId, onClose, show, editingExpense }) => {
  const dispatch = useDispatch();
  const balance = useSelector((state) => state.balance.sum);
  const categories = useSelector((state) => state.categories);
  const iconName = categories.find(i => i.id == categoryId).iconName;
  const category = categories.find(i => i.id == categoryId).name;
  const [error, setError] = useState("");
  const {t} = useTranslation();

  const initialValues = {
    title: editingExpense?.title || "",
    amount: editingExpense?.amount || "",
    date: editingExpense?.date || "",
  };
  

  const handleSubmit = (values) => {
  const amount = Number(values.amount);

  if (editingExpense) {
    dispatch(editExpenseWithStats({
      categoryId,
      expenseId: editingExpense.id,
      updatedData: values,
      oldData: initialValues,
    }));
    onClose();
    return;
  }

  if (amount > balance) {
    setError("❌ Not enough money on balance");
    return;
  }

  dispatch(addExpenseWithStats({ categoryId, category, type: "Expense", image: iconMap[iconName] || iconMap["Other"],  ...values }));
  dispatch(removeBalance(amount));
  onClose();
};

  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>{editingExpense ? t("Edit Expense") : t("New Expense")}</h3>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <div className="form-group">
              <label>{t("Name")}</label>
              <Field name="title" className="form-control" />
              <ErrorMessage
                name="title"
                component="div"
                className="text-danger"
              />
            </div>

            <div className="form-group">
              <label>{t("Amount")}</label>
              <Field name="amount" type="number" className="form-control" />
              <ErrorMessage
                name="amount"
                component="div"
                className="text-danger"
              />
            </div>

            <div className="form-group">
              <label>{t("Date")}</label>
              <Field name="date" type="date" className="form-control" />
              <ErrorMessage
                name="date"
                component="div"
                className="text-danger"
              />
            </div>

            {error && <div className="text-danger mb-2">{error}</div>}
            <div className="modal-buttons">
              <button type="submit">{t("Ok")}</button>
              <button type="button" onClick={onClose}>
                {t("Cancel")}
              </button>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default AddExpenseModal;
