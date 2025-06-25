import styles from './GoalModal.module.scss';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { setGoal } from '../../Categories/categoriesSlice.js';

const validationSchema = yup.object().shape({
    goal: yup.number().positive('Має бути більше 0').required('Обовʼязково'),
});

export default function GoalModal({ categoryId, onClose, initialGoal }) {
    const dispatch = useDispatch();

    const handleSubmit = (values) => {
        dispatch(setGoal({ categoryId, goalAmount: values.goal }));
        onClose();
    };

    return (
        <div className={styles.modalContainer}>
            <div className={styles.modal}>
                <h2>{initialGoal ? 'Редагувати ціль' : 'Нова ціль'}</h2>

                <Formik
                initialValues={{ goal: initialGoal || '' }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                >
                    <Form>
                        <label>Сума цілі</label>
                        <Field name="goal" type="number" />
                        <ErrorMessage name="goal" component="div" className={styles.error} />

                        <div className={styles.actions}>
                        <button type="button" onClick={onClose}>Скасувати</button>
                        <button type="submit">{initialGoal ? 'Зберегти' : 'Додати'}</button>
                        </div>
                    </Form>
                </Formik>
            </div>
        </div>
    );
}