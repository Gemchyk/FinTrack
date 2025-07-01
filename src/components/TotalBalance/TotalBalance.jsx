import React, { useEffect, useState } from 'react';
import cardLogo from './imgs/cardLogo.png';
import './TotalBalance.scss'; 
import { useDispatch } from 'react-redux';
import { fetchBalance } from '../../features/balance/balanceSlice';
import { useTranslation } from 'react-i18next';

function TotalBalance() {
  const dispatch = useDispatch();
  const [store, setStore] = useState();
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(fetchBalance())
      .unwrap()
      .then(data => {
        setStore(data);
      })
      .catch(err => {
        console.error('Balance error:', err);
      });
  }, [dispatch]);

  return (
    <div>
      <h1 className="totalBalanceTitle">{t("Total Balance")}</h1>

      <div className="main">
        <div className="main-header">
          <h1 className="main-title">${store}</h1>
          <h4 className="main-sec-title">{t("All Accounts")}</h4>
        </div>

        <div className="card-preview">
          <div className="card-preview-info">
            <h4 className="main-sec-title">{t("Account Type")}</h4>
            <h3 className="card-preview-info-title">{t("Credit Card")}</h3>
            <h4 className="main-sec-title">**** **** **** 2598</h4>
          </div>

          <div className="card-preview-addinfo">
            <img src={cardLogo} alt="Card logo" />
            <div className="card-preview-moneyDiv">
              <h3 className="balanceAmount">${store}</h3>
              <div className="card-preview-linkDiv">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M4.66669 11.3333L11.3334 4.66667"
                    stroke="#299D91"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M4.66669 4.66667H11.3334V11.3333"
                    stroke="#299D91"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TotalBalance;
