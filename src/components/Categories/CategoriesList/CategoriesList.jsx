import { useSelector } from 'react-redux';
import styles from './CategoriesList.module.scss';

const CategoriesList = () => {
  const categories = useSelector(state => state.categories);

  return (
    <div className={styles.categories}>
      <h2 className={styles.categories__title}>Категорії розтрат</h2>
      <ul className={styles.categories__list}>
        {categories.map(cat => {
          const total = cat.expenses.reduce((sum, e) => sum + e.amount, 0);
          return (
            <li className={styles.categories__item} key={cat.id}>
              <div className={styles.categories__card}>
                <div className={styles.categories__name}>{cat.name}</div>
                <div className={styles.categories__total}>{total}₴</div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default CategoriesList;