import React from 'react';
import './UpcomingBill.scss'

function UpcomingBill({item}) {
    return (
        <>
            <div className='singleBill'>
                <div className='date-div'>
                    <h4 className='main-sec-title'>{item.month}</h4>
                    <h3 className='main-title'>{item.date}</h3>
                </div>
                <div className='details-div'>
                    <h3 className='main-sec-title'>{item.company}</h3>
                    <h3 className='mini-title'>{item.company} - {item.type}</h3>
                    <h4 className='main-charge-date'>Last Charge - {item.lastCharge}</h4>
                </div>
                <div className='amount-div'>
                    <h3 className='mini-title'>{item.price}</h3>
                </div>
            </div>
        </>
    );
}

export default UpcomingBill;