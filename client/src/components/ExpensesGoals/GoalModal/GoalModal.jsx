import styles from './GoalModal.module.scss';
import { useDispatch } from 'react-redux';
import { setGoal } from '../../Categories/categoriesSlice.js';
import { useTranslation } from 'react-i18next';

export default function GoalModal({ categoryId, onClose, initialGoal }) {
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const handleSubmit = (e) => {
        e.preventDefault();
        const goal = Number(new FormData(e.target).get('goal'));
        dispatch(setGoal({ categoryId, goalAmount: goal }));
        onClose();
    };

    return (
        <div className={styles.modalContainer}>
            <div className={styles.modal}>
                <h2>{initialGoal ? t('Change Goal') : t('New Goal')}</h2>

                <form onSubmit={handleSubmit}>
                    <label>{t('Goal Amount')}</label>
                    <input name="goal" type="number" min="0.01" step="0.01" defaultValue={initialGoal || ''} required />

                    <div className={styles.actions}>
                    <button type="button" onClick={onClose}>{t('Cancel')}</button>
                    <button type="submit">{initialGoal ? t('Save Changes') : t('Add')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}