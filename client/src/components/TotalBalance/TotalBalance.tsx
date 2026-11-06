import { useState } from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import styles from './TotalBalance.module.scss';
import BalanceAddModalForm from '../Balance/BalanceAddModalForm';
import AddExpenseModal from '../Categories/CategoriesList/AddExpenseModal';
import { useBalanceQuery } from '../Balance/balanceApi';
import { currentMonth } from '../../dates';
import { useMoney } from '../../money';

// Top of Overview: this month's balance with its income and expenses, and the actions used most
function TotalBalance() {
  const { t, i18n } = useTranslation();
  const { format } = useMoney();
  const totals = useBalanceQuery(currentMonth()).data;
  const [dialog, setDialog] = useState<'income' | 'expense' | null>(null);
  const monthName = new Intl.DateTimeFormat(i18n.resolvedLanguage, { month: 'long', year: 'numeric' }).format(new Date());
  const show = (amount: number | undefined) => (amount === undefined ? '…' : format(amount));

  return (
    <section className={styles.hero}>
      <p className={styles.month}>{monthName}</p>
      {/* Spending more than came in this month is shown, not prevented */}
      <p className={totals && totals.balance < 0 ? `${styles.balance} ${styles.negative}` : styles.balance}>
        {show(totals?.balance)}
      </p>

      <div className={styles.totals}>
        <div className={styles.total}>
          <span className={styles.label}>{t('Income')}</span>
          <span className={`${styles.amount} ${styles.income}`}>{show(totals?.income)}</span>
        </div>
        <div className={styles.total}>
          <span className={styles.label}>{t('Expenses')}</span>
          <span className={styles.amount}>{show(totals?.expense)}</span>
        </div>
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.action} onClick={() => setDialog('income')}>
          <span className={styles.actionIcon} aria-hidden="true">+</span>
          {t('overview.income')}
        </button>
        <button type="button" className={styles.action} onClick={() => setDialog('expense')}>
          <span className={styles.actionIcon} aria-hidden="true">−</span>
          {t('overview.expense')}
        </button>
        <Link to="/Statistics" className={styles.action}>
          <span className={styles.actionIcon} aria-hidden="true">📈</span>
          {t('Statistics')}
        </Link>
      </div>

      {dialog === 'income' && <BalanceAddModalForm onClose={() => setDialog(null)} />}
      {dialog === 'expense' && <AddExpenseModal editingExpense={null} onClose={() => setDialog(null)} />}
    </section>
  );
}

export default TotalBalance;
