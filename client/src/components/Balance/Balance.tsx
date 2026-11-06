import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './Balance.scss';
import BalanceAddModalForm from './BalanceAddModalForm';
import RateCard, { CurrencyRateCards } from './RateCard';
import { useBalanceQuery } from './balanceApi';
import { errorKey } from '../../store/api';
import { currentMonth } from '../../dates';
import { useMoney } from '../../money';

// The balance is this month's income minus its expenses. There is no "Remove": money leaves only as an expense
function BalanceCardAndCourse() {
  const { t } = useTranslation();
  const { format } = useMoney();
  const { data, isLoading, error } = useBalanceQuery(currentMonth());
  const errorText = errorKey(error);
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="wrapper-balances">
      <div className="balances">{t("My Balance")}</div>
      <div className="credit-card">
        <div className="credit-card-header">
          <div className="credit-card-text">{t("Credit Card")}</div>
        </div>
        <div className="total-amount">
            {isLoading ? (
              <div className="total-sum">{t("Loading...")}</div>
            ) : (
            // An overspent month shows in red; it is information, not an error
            <div className={data && data.balance < 0 ? 'total-sum text-danger' : 'total-sum'}>
              {data ? format(data.balance) : '—'}
            </div>
            )}
          <div className="total-amount-text">{t("Total Amount")}</div>
            {errorText && <div className="text-danger">{t(errorText)}</div>}
        </div>
        <div className="buttons">
          <button onClick={() => setShowModal(true)}>{t("Add")}</button>
        </div>
      </div>
    </div>

      {showModal && <BalanceAddModalForm onClose={() => setShowModal(false)} />}

      <div className='exchangeRate'>
        <h2>{t("Actual Exchange Rate")}</h2>
      </div>
      <div className='courseWrapper'>
        <CurrencyRateCards />
        <RateCard title="BTC/USD" type="crypto" symbol="BTCUSDT" />
        <RateCard title="ETH/USD" type="crypto" symbol="ETHUSDT" />
        <RateCard title="TON/USD" type="crypto" symbol="TONUSDT" />
      </div>
    </>
  );
}

export default BalanceCardAndCourse;
