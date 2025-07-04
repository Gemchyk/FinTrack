import React, { useState } from 'react';
import "./Transactions.scss";
import Transaction from "./Transaction";
import IconHousing from "/src/assets/icons/IconHousing.svg?react";
import { filterByAmount, filterByDate, filterByName } from './transactionsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';




const TransactionsList = () => {

    const store = useSelector(state => state.transactions.data);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const [isDateFilter, setIsDateFilter] = useState(true);
    const [isAmountFilter, setIsAmountFilter] = useState(false);
    const [isNameFilter, setIsNameFilter] = useState(false);


    const handleDateClick = () => {
      setIsAmountFilter(false);
      setIsNameFilter(false);
      setIsDateFilter(true);
      dispatch(filterByDate());
    }
    const handleAmountClick = () => {
      setIsAmountFilter(true);
      setIsNameFilter(false);
      setIsDateFilter(false);
      dispatch(filterByAmount())
    }
    const handleNameClick = () => {
      setIsAmountFilter(false);
      setIsNameFilter(true);
      setIsDateFilter(false);
      dispatch(filterByName())
    }

    
      return (
        <>
          <h1 className='title'>{t("Recent Transaction")}</h1>
          <div className="container">
            <nav className="navigation">
              <a onClick={handleDateClick} className={isDateFilter ? "span" : ""}>
                {t("Date")}
              </a>
              <a onClick={handleAmountClick} className={isAmountFilter ? "span" : ""}>
                {t("Amount")}
              </a>
              <a onClick={handleNameClick} className={isNameFilter ? "span" : ""}>
                {t("Name")}
              </a>
            </nav>
            <main>
              {store.map((tx, index) => (
                <Transaction key={index} item={tx} />
              ))}
            </main>
          </div>
        </>
        
      );
};

export default TransactionsList;