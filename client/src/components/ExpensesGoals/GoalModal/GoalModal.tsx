import type { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './GoalModal.module.scss';
import AmountInput from '../../AmountInput/AmountInput';
import { errorKey } from '../../../store/api';
import { useUpdateCategoryMutation } from '../../Categories/categoriesApi';
import type { Category } from '../../../../../shared/api-types';

export default function GoalModal({ category, onClose }: { category: Category; onClose: () => void }) {
    const { t } = useTranslation();
    const [updateCategory, { isLoading, error }] = useUpdateCategoryMutation();
    const errorText = errorKey(error, { 400: 'errors.invalid' });

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const goal = Number(new FormData(e.currentTarget).get('goal'));
        // PUT replaces the whole category, so its name and icon go along unchanged
        const result = await updateCategory({ id: category.id, name: category.name, iconName: category.iconName, goal });
        if (result.data) onClose();
    };

    return (
        <div className="modal-overlay">
            <div className={styles.modal} role="dialog" aria-modal="true">
                <h2>{category.goal ? t('Change Goal') : t('New Goal')}</h2>

                <form onSubmit={handleSubmit}>
                    <label>{t('Goal Amount')}</label>
                    <AmountInput name="goal" defaultValue={category.goal ?? ''} />

                    {errorText && <p className={styles.error} role="alert">{t(errorText)}</p>}
                    <div className={styles.actions}>
                    <button type="button" onClick={onClose}>{t('Cancel')}</button>
                    <button type="submit" disabled={isLoading}>{category.goal ? t('Save Changes') : t('Add')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
