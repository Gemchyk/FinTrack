

import React from 'react';
import './UpcomingBill.scss'
import UpcomingBill from './UpcomingBill';

function UpcomingBillList({}) {

    const initialBills = [
        {
            id: "1",
            month: "May",
            date: 15,
            company: "Figma",
            type: "monthly",
            lastCharge: "14.05.2022",
            price: "$150"
        },
        {
            id: "2",
            month: "June",
            date: 28,
            company: "Adobe",
            type: "yearly",
            lastCharge: "14.05.2022",
            price: "$1000"
        }
    ]

    return (
        <>
            <div>
                <h1 className='title'>Upcoming bill</h1>
                <div className='main'>
                        {initialBills.map(i => <UpcomingBill key={i.id} item={i}/>)}
                </div>
            </div>
        </>
    );
}

export default UpcomingBillList;