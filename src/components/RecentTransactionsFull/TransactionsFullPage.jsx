import { useContext, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./TransactionsFullPage.module.scss";
import TransactionModalForm from "./TransactionModalForm";
import { fetchPaginatedTransactions, removeTransaction, resetTransactions } from "../Transactions/transactionsSlice";
import { useTranslation } from 'react-i18next';
import CategorySelect from "../SelectButton/CategorySelect";
import { ThemeContext } from "../../context/ThemeContext";
import store from '../../store/store.js'
import Loader from "../Loaders/Loader";

function TransactionsFullPage() {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { theme } = useContext(ThemeContext);

    const transactions = useSelector((state) => state.transactions.data);
    console.log(transactions);
    const loading = useSelector((state) => state.transactions.loading);
    const error = useSelector((state) => state.transactions.error);

    const LIMIT = 5;
    const page = useSelector((state) => state.transactions.page);
    const hasMore = useSelector((state) => state.transactions.hasMore);


    const [filter, setFilter] = useState("all");
    const [showModal, setShowModal] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [isLoadedMore, setIsLoadedMore] = useState(false);

    useEffect(() => {
        dispatch(resetTransactions());
        dispatch(fetchPaginatedTransactions({ page: 1, filter, selectedCategory }));
      }, [dispatch, filter, selectedCategory])

    const handleDelete = async (id) => {
        await dispatch(removeTransaction(id));
      
        const state = store.getState().transactions;
        const page = state.page;
        const hasMore = state.hasMore;
        const currentCount = state.data.length;
      
        const gap = (page * LIMIT) - currentCount;
      
        if (gap > 0 && hasMore) {
          dispatch(fetchPaginatedTransactions({
            page: page - 1,
            limit: gap - 1,
            skipPageIncrement: true,
            filter,
            selectedCategory
          }));
        }
      };

    const handleEdit = (transaction) => {
        setEditingTransaction(transaction);
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setEditingTransaction(null);
    };
    

    const handleLoadMore = () => {
        setIsLoadedMore(true)
        dispatch(fetchPaginatedTransactions({ page, filter, selectedCategory }));
    };

    const handleHideAll = () => {
        setIsLoadedMore(false);
        dispatch(resetTransactions());
        dispatch(fetchPaginatedTransactions({ page: 1, filter, selectedCategory }));
    }

    const getIcon = (tx) => {
        return tx.image || "/src/assets/icons/IconOthers.svg?react";
    };

    return (
        <div className={styles.wrapper}>
            <h2>{t('Recent Transaction')}</h2>

            <div className={styles.tabs}>
                <button className={filter==="all" ? styles.active : ""} onClick={() => setFilter("all")}>
                    {t('All')}
                </button>
                <button className={filter==="Income" ? styles.active : ""} onClick={() => setFilter("Income")}>
                    {t('Revenue')}
                </button>
                <button className={filter==="Expense" ? styles.active : ""} onClick={() => setFilter("Expense")}>
                    {t('Expenses')}
                </button>
                
                <CategorySelect value={selectedCategory} onChange={setSelectedCategory} theme={theme}/>
            </div>

            
            {error && <p className={styles.error}>{t('Error')}: {error}</p>}

            <div className={styles.table}>
                <div className={styles.header}>
                    <span>{t('Title')}</span>
                    <span>{t('Category')}</span>
                    <span>{t('Date')}</span>
                    <span>{t('Type')}</span>
                    <span>{t('Amount')}</span>
                    <span>{t('Actions')}</span>
                </div>
                {loading && <div className={styles.flex}> <span className={styles.loader}>{t('Loading...')}</span>{<Loader />}</div>}
                {!loading && transactions.length === 0 && (
                    <div className={styles.noData}>
                        {t("No transactions found")}
                    </div>
                )}
                {transactions.map((tx) => (
                    <div className={styles.row} key={tx.id}>
                        <span className={styles.item}>
                            <img src={getIcon(tx)} alt="" />
                            {tx.title}
                        </span>
                        <span className={styles.gray}>{t(tx.category) || "—"}</span>
                        <span className={styles.gray}>{tx.date}</span>
                        <span className={styles.gray}>{t(tx.type)}</span>
                        <span className={styles.amount}>
                            {tx.type === "Expense" ? "-" : "+"}
                            {tx.amount.toFixed(2)}$
                        </span>
                        <span className={styles.actions}>
                            <button onClick={() => handleEdit(tx)} className={styles.editBtn}>
                                {t('Edit')}
                            </button>
                            <button onClick={() => handleDelete(tx.id)} className={styles.deleteBtn}>
                                {t('Remove')}
                            </button>
                        </span>
                    </div>
                ))}
            </div>

            {showModal && (
                <TransactionModalForm
                    mode={editingTransaction ? "edit" : "add"}
                    editingTransaction={editingTransaction}
                    onClose={handleClose}
                />
            )}
            {
                <div className={styles.flex}>
                    {hasMore && (
                        <div className={styles.loadMoreContainer}>
                            <button onClick={handleLoadMore} className={styles.loadMoreBtn}>
                            {t("Load More")}
                            </button>
                        </div>
                    )}
                    {isLoadedMore &&
                        <div className={styles.loadMoreContainer}>
                            <button onClick={handleHideAll} className={styles.loadMoreBtn}>
                            {t("Hide")}
                            </button>
                        </div>
                    }
                </div>            
                }
        </div>
    );
}

export default TransactionsFullPage;