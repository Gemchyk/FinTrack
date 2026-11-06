import React from "react"
import TotalBalance from "../components/TotalBalance/TotalBalance"
import TransactionsList from "../components/Transactions/TransactionsList"
import styles from './Overview.module.scss';

// Like the main screen of a banking app: the month's balance and actions on top, the latest operations
// below. The charts are on /Statistics
function Overview () {
    return (
        <div className={styles.overview}>
            <TotalBalance />
            <TransactionsList />
        </div>
    )
}
export default Overview
