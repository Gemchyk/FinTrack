import { useState } from "react";
import { useTranslation } from 'react-i18next';
import styles from "./TransactionsFullPage.module.scss";
import TransactionModalForm from "./TransactionModalForm";
import CategorySelect from "../SelectButton/CategorySelect";
import Loader from "../Loaders/Loader";
import { iconFor } from "../../assets/icons/iconFor";
import { errorKey } from "../../store/api";
import { useMoney } from "../../money";
import { useDeleteTransactionMutation, useTransactionsInfiniteQuery } from "../Transactions/transactionsApi";
import { categoryName, useCategoriesQuery } from "../Categories/categoriesApi";
import type { Transaction, TransactionType } from "../../../../shared/api-types";

const LIMIT = 5;

function TransactionsFullPage() {
    const { t } = useTranslation();
    const { format } = useMoney();

    const [filter, setFilter] = useState<TransactionType | 'all'>('all');
    const [selectedCategory, setSelectedCategory] = useState('all');
    // "Hide" goes back to the first page; the pages already loaded stay in the cache for "Load More"
    const [visiblePages, setVisiblePages] = useState(1);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

    
    const { currentData, error, isFetching, isFetchingNextPage, hasNextPage, fetchNextPage } =
        useTransactionsInfiniteQuery({ type: filter, category: selectedCategory, limit: LIMIT });
    const [deleteTransaction, { error: deleteError }] = useDeleteTransactionMutation();
    const categories = useCategoriesQuery().data ?? [];
    const errorText = errorKey(error ?? deleteError);

    const pages = currentData?.pages ?? [];
    const transactions = pages.slice(0, visiblePages).flatMap((page) => page.data);
    const canShowMore = currentData && (visiblePages < pages.length || hasNextPage);

    const categoryOptions = [
        { value: 'all', label: 'All Categories' },
        ...categories.map((category) => ({ value: category.id, label: category.name })),
    ];

    const changeFilter = (type: TransactionType | 'all') => {
        setFilter(type);
        setVisiblePages(1);
    };

    const changeCategory = (categoryId: string) => {
        setSelectedCategory(categoryId);
        setVisiblePages(1);
    };

    const handleLoadMore = async () => {
        if (visiblePages >= pages.length) await fetchNextPage();
        setVisiblePages((count) => count + 1);
    };

    return (
        <div className={styles.wrapper}>
            <h2>{t('Recent Transaction')}</h2>

            <div className={styles.tabs}>
                <button className={filter==="all" ? styles.active : ""} onClick={() => changeFilter("all")}>
                    {t('All')}
                </button>
                <button className={filter==="Income" ? styles.active : ""} onClick={() => changeFilter("Income")}>
                    {t('Revenue')}
                </button>
                <button className={filter==="Expense" ? styles.active : ""} onClick={() => changeFilter("Expense")}>
                    {t('Expenses')}
                </button>

                <CategorySelect value={selectedCategory} onChange={changeCategory} customOptions={categoryOptions} />
            </div>


            {errorText && <p className={styles.error} role="alert">{t(errorText)}</p>}

            <div className={styles.table}>
                <div className={styles.header}>
                    <span>{t('Title')}</span>
                    <span>{t('Category')}</span>
                    <span>{t('Date')}</span>
                    <span>{t('Type')}</span>
                    <span>{t('Amount')}</span>
                    <span>{t('Actions')}</span>
                </div>
                {transactions.map((tx) => (
                    <div className={styles.row} key={tx.id}>
                        <span className={styles.item}>
                            {iconFor(tx.iconName)}
                            {tx.title}
                        </span>
                        <span className={styles.gray}>{tx.category ? categoryName(t, tx.category) : "—"}</span>
                        <span className={styles.gray}>{tx.date}</span>
                        <span className={styles.gray}>{t(tx.type)}</span>
                        <span className={styles.amount}>
                            {tx.type === "Expense" ? "-" : "+"}
                            {format(tx.amount)}
                        </span>
                        <span className={styles.actions}>
                            <button onClick={() => setEditingTransaction(tx)} className={styles.editBtn}>
                                {t('Edit')}
                            </button>
                            <button onClick={() => deleteTransaction(tx.id)} className={styles.deleteBtn}>
                                {t('Remove')}
                            </button>
                        </span>
                    </div>
                ))}
                {((!currentData && isFetching) || isFetchingNextPage) && <div className={styles.flex}> <span className={styles.loader}>{t('Loading...')}</span>{<Loader />}</div>}
                {currentData && transactions.length === 0 && (
                    <div className={styles.noData}>
                        {t("No transactions found")}
                    </div>
                )}
            </div>

            {editingTransaction && (
                <TransactionModalForm
                    transaction={editingTransaction}
                    onClose={() => setEditingTransaction(null)}
                />
            )}
            <div className={styles.flex}>
                {canShowMore && (
                    <div className={styles.loadMoreContainer}>
                        <button onClick={handleLoadMore} className={styles.loadMoreBtn} disabled={isFetchingNextPage}>
                        {t("Load More")}
                        </button>
                    </div>
                )}
                {visiblePages > 1 &&
                    <div className={styles.loadMoreContainer}>
                        <button onClick={() => setVisiblePages(1)} className={styles.loadMoreBtn}>
                        {t("Hide")}
                        </button>
                    </div>
                }
            </div>
        </div>
    );
}

export default TransactionsFullPage;
