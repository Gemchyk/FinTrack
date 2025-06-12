import React from 'react';
import cardLogo from './imgs/cardLogo.png';
import './TotalBalance.scss';

function TotalBalance() {
    return (
        <>
            <div>
                <h1 className='title'>Total Balance</h1>
                <div className='main'>
                    <div className='main-header'>
                        <h1 className='main-title'>$240,399</h1>
                        <h4 className='main-sec-title'>All Acounts</h4>
                    </div>
                    <div className='card-preview'>
                        <div className="card-preview-info">
                            <h4 className='main-sec-title'>Account Type</h4>
                            <h3 className='card-preview-info-title'>Credit Card</h3>
                            <h4 className='main-sec-title'>**** **** **** 2598</h4>
                        </div>
                        <div className='card-preview-addinfo'>
                            <img src={cardLogo} alt="Buba" />
                            <div className='card-preview-moneyDiv'>
                                <h3>$25000</h3>
                                <div className='card-preview-linkDiv'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path d="M4.66669 11.3333L11.3334 4.66667" stroke="#299D91" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M4.66669 4.66667H11.3334V11.3333" stroke="#299D91" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </> 
    );
}

export default TotalBalance;