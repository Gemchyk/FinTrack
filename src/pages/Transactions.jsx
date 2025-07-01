import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./Transactions.module.scss";
import TransactionModalForm from "../components/RecentTransactionsFull/TransactionModalForm";
import { removeTransaction } from "../components/Transactions/transactionsSlice";
import { useTranslation } from 'react-i18next';
import { iconMap } from "../components/ExpensesGoals/ExpensesGoalsByCategory";

function Transactions () {
    const transactions = useSelector((state) => state.transactions.data);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const [filter, setFilter] = useState("all");
    const [showModal, setShowModal] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);

    const filteredData = transactions.filter((tx) => {
        if (filter === "all") return true;
        return tx.type === filter;
    });

    const getIcon = (category) => {
        return iconMap[category] || iconMap["Others"];
    };

    const handleEdit = (transaction) => {
        setEditingTransaction(transaction);
        setShowModal(true);
      };
    
      const handleAdd = () => {
        setEditingTransaction(null);
        setShowModal(true);
      };
    
      const handleClose = () => {
        setShowModal(false);
        setEditingTransaction(null);
      };
    
      const handleDelete = (id) => {
        dispatch(removeTransaction({ expenseId: id }));
      };


    return (
        <div className={styles.wrapper}>
            <h2>{t('Recent Transaction')}</h2>

            <div className={styles.tabs}>
                <span>
                    <button className={filter==="all" ? styles.active : "" } onClick={()=> setFilter("all")}>
                        {t('All')}
                    </button>
                    <button className={filter==="Income" ? styles.active : "" } onClick={()=> setFilter("Income")}>
                        {t('Revenue')}
                    </button>
                    <button className={filter==="Expense" ? styles.active : "" } onClick={()=> setFilter("Expense")}>
                        {t('Expenses')}
                    </button>
                </span>
                <span>
                    <button className={styles.addButton} onClick={() => handleAdd()}>
                        {t('Add Transaction')}
                    </button>
                </span>
            </div>

            <div className={styles.table}>
                <div className={styles.header}>
                    <span>{t('Title')}</span>
                    <span>{t('Category')}</span>
                    <span>{t('Date')}</span>
                    <span>{t('Type')}</span>
                    <span>{t('Amount')}</span>
                    <span>{t('Actions')}</span>
                </div>

                {filteredData.map((tx) => (
                    <div className={styles.row} key={tx.id}>
                        <span className={styles.item}>
                            {getIcon(tx.category)}
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
        </div>
    )
}
export default Transactions