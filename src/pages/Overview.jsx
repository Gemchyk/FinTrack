import React from "react"
import TotalBalance from "../components/TotalBalance/TotalBalance"
import UpcomingBillList from "../components/UpcomingBills/UpcomingBillList"

function Overview () {
    return (
        <>
        <div className='header'>
            <TotalBalance />
            <UpcomingBillList />     
        </div>
        </>
    )
}
export default Overview