import { useContext, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./Transactions.module.scss";
import TransactionModalForm from "../components/RecentTransactionsFull/TransactionModalForm";
import { fetchPaginatedTransactions, removeTransaction, resetTransactions } from "../components/Transactions/transactionsSlice";
import { useTranslation } from 'react-i18next';
import { iconMap } from "../components/ExpensesGoals/ExpensesGoalsByCategory";
import CategorySelect from "../components/SelectButton/CategorySelect";
import { ThemeContext } from "../context/ThemeContext.jsx";
import store from '../store/store.js'

function Transactions () {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { theme } = useContext(ThemeContext);

    const transactions = useSelector((state) => state.transactions.data);
    const loading = useSelector((state) => state.transactions.loading);
    const error = useSelector((state) => state.transactions.error);

    const LIMIT = 5;
    const page = useSelector((state) => state.transactions.page);
    const hasMore = useSelector((state) => state.transactions.hasMore);


    const [filter, setFilter] = useState("all");
    const [showModal, setShowModal] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('all');

    useEffect(() => {
        dispatch(resetTransactions()); 
        dispatch(fetchPaginatedTransactions({ page: 1 }));
      }, [dispatch]);



    const filteredData = transactions.filter((tx) => {
        const categoryKey = iconMap[tx.category] ? tx.category : "Other";

        if (filter !== "all" && tx.type !== filter) return false;
        if (selectedCategory !== "all" && categoryKey !== selectedCategory) return false;

        return true;
    });

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
            skipPageIncrement: true
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
        dispatch(fetchPaginatedTransactions({ page }));
      };

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

            {loading && <p>{t('Loading...')}</p>}
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
                {console.log("Filtered data:", filteredData)}
                {filteredData.map((tx) => (
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
                            {tx.amount.toFixed(2)}₴
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
            {hasMore && (
                <div className={styles.loadMoreContainer}>
                    <button onClick={handleLoadMore} className={styles.loadMoreBtn}>
                    {t("Load More")}
                    </button>
                </div>
            )}
        </div>
    );
}


export default Transactions;
