import React from "react"
import TotalBalance from "../components/TotalBalance/TotalBalance"
import UpcomingBillList from "../components/UpcomingBills/UpcomingBillList"
import Goal from "../components/Goals/Goal"
import WeeklyComparison from "../components/WeeklyComparison/WeeklyComparison"
import styles from './Overview.module.scss';

function Overview () {
    return (
        <>
           <div className={styles['header']}>
                <TotalBalance /> 
                <Goal /> 
                <UpcomingBillList /> 
            </div>  

            <div className={styles['flex']}>
            <div>
                <h1 className={styles['title']}>Recent Transaction</h1>
                <div className={styles['Zaglushka']}>
            </div>
            </div>
            <WeeklyComparison />
            </div>
        </>
    )
}
export default Overview