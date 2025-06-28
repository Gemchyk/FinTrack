import React, {useEffect, useState} from 'react';
import cardLogo from './imgs/cardLogo.png';
import styles from './TotalBalance.module.scss';
import { useDispatch } from 'react-redux';
import { fetchBalance } from '../../features/balance/balanceSlice';

function TotalBalance() {

    
    const dispatch = useDispatch();

    const [store, setStore] = useState();

    useEffect(() => {
        // fetch('http://localhost:5050/balance').then(res => {
        //     if(!res.ok){
        //         throw new Error("Fetch failed");
        //     }
        //     return res.json();
        // }).then(data => {
        //     setStore(data.sum);
        // });

        dispatch(fetchBalance())
        .unwrap()
        .then(data => {
        setStore(data);
        })
        .catch(err => {
        console.error('Ошибка при получении баланса:', err);
        });
      }, [dispatch]);
    return (
        <>
            <div>
                <h1 className={styles['totalBalanceTitle']}>Total Balance</h1>
                <div className={styles['main']}>
                    <div className={styles['main-header']}>
                    <h1 className={styles['main-title']}>${store}</h1>
                    <h4 className={styles['main-sec-title']}>All Acounts</h4>
                    </div>
                    <div className={styles['card-preview']}>
                    <div className={styles['card-preview-info']}>
                        <h4 className={styles['main-sec-title']}>Account Type</h4>
                        <h3 className={styles['card-preview-info-title']}>Credit Card</h3>
                        <h4 className={styles['main-sec-title']}>**** **** **** 2598</h4>
                    </div>
                    <div className={styles['card-preview-addinfo']}>
                        <img src={cardLogo} alt="Buba" />
                        <div className={styles['card-preview-moneyDiv']}>
                        <h3 className={styles['balanceAmount']}>${store}</h3>
                        <div className={styles['card-preview-linkDiv']}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M4.66669 11.3333L11.3334 4.66667" stroke="#299D91" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M4.66669 4.66667H11.3334V11.3333" stroke="#299D91" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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