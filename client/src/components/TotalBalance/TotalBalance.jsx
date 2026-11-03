import React from 'react';
import cardLogo from './imgs/cardLogo.png';
import './TotalBalance.scss';
import { useTranslation } from 'react-i18next';
import { useBalanceQuery } from '../Balance/balanceApi';
import { currentMonth } from '../../dates';
import { useMoney } from '../../money';

function TotalBalance() {
  const { t } = useTranslation();
  const { format } = useMoney();
  const balance = useBalanceQuery(currentMonth()).data?.balance;
  const amount = balance === undefined ? '…' : format(balance);

  return (
    <div>
      <h1 className="totalBalanceTitle">{t("Total Balance")}</h1>

      <div className="main">
        <div className="main-header">
          {/* Spending more than came in this month is shown, not prevented */}
          <h1 className={balance < 0 ? 'main-title negative' : 'main-title'}>{amount}</h1>
          <h4 className="main-sec-title">{t("All Accounts")}</h4>
        </div>

        <div className="card-preview">
          <div className="card-preview-info">
            <h4 className="main-sec-title">{t("Account Type")}</h4>
            <h3 className="card-preview-info-title">{t("Credit Card")}</h3>
            <h4 className="main-sec-title">**** **** **** 2598</h4>
          </div>

          <div className="card-preview-addinfo">
            <img className="card-preview-logo" src={cardLogo} alt="Card logo" />
            <div className="card-preview-moneyDiv">
              <h3 className="balanceAmount">{amount}</h3>
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
