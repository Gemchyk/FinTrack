import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import styles from './TransactionsList.module.scss';
import { iconFor } from '../../assets/icons/iconFor';
import { useTransactionsInfiniteQuery } from './transactionsApi';
import { categoryName } from '../Categories/categoriesApi';
import { today, yesterday } from '../../dates';
import { useMoney } from '../../money';
import type { Transaction } from '../../../../shared/api-types';

const FEED_SIZE = 10;

// The latest operations by day, like the feed of a banking app; the full list is on /Transactions
const TransactionsList = () => {
  const { t, i18n } = useTranslation();
  const { format } = useMoney();
  const { data, isLoading } = useTransactionsInfiniteQuery({ limit: FEED_SIZE });
  const transactions = data?.pages[0]?.data ?? [];

  const dayLabel = (date: string) => {
    if (date === today()) return t('overview.today');
    if (date === yesterday()) return t('overview.yesterday');
    const [year, month, day] = date.split('-').map(Number);
    const sameYear = year === new Date().getFullYear();
    return new Intl.DateTimeFormat(i18n.resolvedLanguage, { day: 'numeric', month: 'long', ...(!sameYear && { year: 'numeric' }) })
      .format(new Date(year, month - 1, day));
  };

  // The server sorts newest first, so the operations of one day already come together
  const days: { date: string; items: Transaction[] }[] = [];
  for (const tx of transactions) {
    const last = days.at(-1);
    if (last?.date === tx.date) last.items.push(tx);
    else days.push({ date: tx.date, items: [tx] });
  }

  return (
    <section className={styles.feed}>
      <h2 className={styles.heading}>{t('Recent Transaction')}</h2>
      {!isLoading && transactions.length === 0 && <p className={styles.empty}>{t('No transactions found')}</p>}

      {days.map((day) => (
        <div key={day.date}>
          <h3 className={styles.day}>{dayLabel(day.date)}</h3>
          <ul className={styles.list}>
            {day.items.map((tx) => (
              <li key={tx.id} className={styles.item}>
                <span className={styles.icon} aria-hidden="true">{iconFor(tx.iconName)}</span>
                <span className={styles.text}>
                  <span className={styles.name}>{tx.title}</span>
                  {tx.category && <span className={styles.category}>{categoryName(t, tx.category)}</span>}
                </span>
                <span className={tx.type === 'Income' ? `${styles.amount} ${styles.income}` : styles.amount}>
                  {tx.type === 'Income' ? '+' : '-'}
                  {format(tx.amount)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {transactions.length > 0 && (
        <Link to="/Transactions" className={styles.all}>
          {t('overview.allTransactions')} →
        </Link>
      )}
    </section>
  );
};

export default TransactionsList;
