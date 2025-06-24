import { Modal, Button } from 'react-bootstrap';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { editExpense, addExpense, editExpenseWithStats } from "../categoriesSlice"
import { addExpenseToTable, editExpenseInTable } from '../../WeeklyComparison/weeklyComprasionSlice';

const validationSchema = yup.object().shape({
  title: yup.string().required("Обов'язково"),
  amount: yup.number().positive("Має бути > 0").required("Обов'язково"),
  date: yup.date().required("Оберіть дату"),
});

const AddExpenseModal = ({ categoryId, onClose, show, editingExpense }) => {
  const dispatch = useDispatch();


const initialValues = {
  title: editingExpense?.title || '',
  amount: editingExpense?.amount || '',
  date: editingExpense?.date || '',
};

   const handleSubmit = (values) => {
    if (editingExpense) {
        dispatch(editExpenseWithStats({
          categoryId, 
          expenseId: editingExpense.id, 
          updatedData: values, 
          oldData: initialValues
        }));
    } else {
      dispatch(addExpense({ categoryId, ...values }));
      dispatch(addExpenseToTable(values));
    }
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Нова витрата</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={ initialValues }
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <div className="mb-3">
              <label>Назва</label>
              <Field name="title" className="form-control" />
              <ErrorMessage name="title" component="div" className="text-danger" />
            </div>

            <div className="mb-3">
              <label>Сума</label>
              <Field name="amount" type="number" className="form-control" />
              <ErrorMessage name="amount" component="div" className="text-danger" />
            </div>

            <div className="mb-3">
              <label>Дата</label>
              <Field name="date" type="date" className="form-control" />
              <ErrorMessage name="date" component="div" className="text-danger" />
            </div>

            <div className="d-flex justify-content-end">
              <Button variant="secondary" onClick={onClose} className="me-2">
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Ok
              </Button>
            </div>
          </Form>
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default AddExpenseModal;