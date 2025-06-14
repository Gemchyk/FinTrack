import React from 'react';
import './Balances.css';
import cardLogo from '../components/TotalBalance/imgs/cardLogo.png'




function Balances () {
    return (
        <>
        <div className='wrapper-balances'>
            <div className='balances'>
                My Balance
            </div>
            <div className='credit-card'>
                <div className='credit-card-header'>
                    <div className='credit-card-text'>Credit Card</div>
                    <div className='master-card'>
                        <div className='master-card-text'>Master Card</div>
                        <div className='icon'><img src={cardLogo} alt="Card logo" /></div>
                    </div>
                </div>
                <div className='account-number'>
                    <div className='card-num'>3388 4556  8860 8***</div>
                    <div className='acc-num'>Account Number</div>
                </div>
                <div className='total-amount'>
                    <div className='total-sum'>$25000</div>
                    <div className='total-amount-text'>Total Amount</div>
                </div>
                <div className='buttons'>
                    <button>Remove</button>
                    <button>Add</button>
                </div>
            </div>
        </div>
        </>
    )
}
export default Balances