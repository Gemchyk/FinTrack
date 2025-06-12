import styles from './ExpensesGoalsByCategory.module.scss';
import CategoryCard from './CategoryCard';

import IconHousing from '/src/assets/icons/IconHousing.svg?react';
import IconFood from '/src/assets/icons/IconFood.svg?react';
import IconTransportation from '/src/assets/icons/IconTransportation.svg?react';
import IconEntertainment from '/src/assets/icons/IconEntertainment.svg?react';
import IconShopping from '/src/assets/icons/IconShopping.svg?react';
import IconOthers from '/src/assets/icons/IconOthers.svg?react';


const categories = [
  { id: 1, title: 'Housing', icon: <IconHousing />, amount: 250 },
  { id: 2, title: 'Food', icon: <IconFood />, amount: 250 },
  { id: 3, title: 'Transportation', icon: <IconTransportation />, amount: 250 },
  { id: 4, title: 'Entertainment', icon: <IconEntertainment />, amount: 250 },
  { id: 5, title: 'Shopping', icon: <IconShopping />, amount: 250 },
  { id: 6, title: 'Others', icon: <IconOthers />, amount: 250 },
];

export default function ExpensesGoalsByCategory() {
  return (
    <div className={styles.expensesGoals}>
      <h2>Expenses Goals by Category</h2>
      <div className={styles.cardsGrid}>
        {categories.map(category => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  )
}
