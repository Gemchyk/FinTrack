import styles from './GoalModal.module.scss';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { setGoal } from '../../Categories/categoriesSlice.js';
import { useTranslation } from 'react-i18next';

const validationSchema = yup.object().shape({
    goal: yup.number().positive('Must be higher than 0').required('Required'),
});

export default function GoalModal({ categoryId, onClose, initialGoal }) {
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const handleSubmit = (values) => {
        dispatch(setGoal({ categoryId, goalAmount: values.goal }));
        onClose();
    };

    return (
        <div className={styles.modalContainer}>
            <div className={styles.modal}>
                <h2>{initialGoal ? t('Change Goal') : t('New Goal')}</h2>

                <Formik
                initialValues={{ goal: initialGoal || '' }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                >
                    <Form>
                        <label>{t('Goal Amount')}</label>
                        <Field name="goal" type="number" />
                        <ErrorMessage name="goal" component="div" className={styles.error} />

                        <div className={styles.actions}>
                        <button type="button" onClick={onClose}>{t('Cancel')}</button>
                        <button type="submit">{initialGoal ? t('Save Changes') : t('Add')}</button>
                        </div>
                    </Form>
                </Formik>
            </div>
        </div>
    );
}