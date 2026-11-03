import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import "./Transactions.scss";
import Transaction from "./Transaction";
import { useTransactionsInfiniteQuery } from './transactionsApi';
import type { TransactionFilter } from './transactionsApi';

type Sort = NonNullable<TransactionFilter['sort']>;

const SORTS: { sort: Sort; label: string }[] = [
  { sort: 'date', label: 'Date' },
  { sort: 'amount', label: 'Amount' },
  { sort: 'name', label: 'Name' },
];

// The first five transactions by the chosen order; the server sorts, the list only shows
const TransactionsList = () => {
  const { t } = useTranslation();
  const [sort, setSort] = useState<Sort>('date');
  const { data } = useTransactionsInfiniteQuery({ sort, limit: 5 });
  const transactions = data?.pages[0]?.data ?? [];

  return (
    <>
      <h1 className='title'>{t("Recent Transaction")}</h1>
      <div className="container">
        <nav className="navigation">
          {SORTS.map((item) => (
            <a key={item.sort} onClick={() => setSort(item.sort)} className={sort === item.sort ? "span" : ""}>
              {t(item.label)}
            </a>
          ))}
        </nav>
        <main>
          {transactions.map((tx) => (
            <Transaction key={tx.id} item={tx} />
          ))}
        </main>
      </div>
    </>
  );
};

export default TransactionsList;
