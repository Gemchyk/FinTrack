import React from "react"
import TotalBalance from "../components/TotalBalance/TotalBalance"
import UpcomingBillList from "../components/UpcomingBills/UpcomingBillList"
import Goal from "../components/Goals/Goal"
import WeeklyComparison from "../components/WeeklyComparison"
import './Overview.scss';

function Overview () {
    return (
        <>
            <div className='header'>
                <TotalBalance /> 
                <Goal /> 
                <UpcomingBillList /> 
            </div>  
            <div className="flex">
                <div>
                    <h1 className="title">Recent Transaction</h1>
                    <div className="Zaglushka">

                    </div>
                </div>
                <WeeklyComparison />
            </div>
        </>
    )
}
export default Overview