import React, { useEffect, useState } from 'react';
import './Balances.scss';
import cardLogo from '../components/TotalBalance/imgs/cardLogo.png';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBalance, addBalance, removeBalance } from '../features/balance/balanceSlice';
import { useTranslation } from 'react-i18next';
import BalanceAddModalForm from '../components/Balance/BalanceAddModalForm';
import RateCard from '../components/Balance/RateCard';



function Balances() {
  const dispatch = useDispatch();
  const sum = useSelector(state => state.balance.sum);
  const status = useSelector(state => state.balance.status);
  const error = useSelector(state => state.balance.error);
  const {t} = useTranslation();

  const [inputValue, setInputValue] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null); // 'add' | 'remove'

  useEffect(() => {
    dispatch(fetchBalance());
  }, [dispatch]);

  const openModal = (type) => {
    setModalType(type);
    setInputValue('');
    setShowModal(true);
  };

  const handleConfirm = () => {
    const value = parseFloat(inputValue);
    if (!isNaN(value) && value > 0) {
      if (modalType === 'add') {
        dispatch(addBalance(value));
      } else if (modalType === 'remove') {
        dispatch(removeBalance(value));
      }
    }
    setShowModal(false);
    setModalType(null);
    setInputValue('');
  };

  const handleClose = () => {
    setInputValue('');
    setShowModal(false);
    setModalType(null);
  };

  return (
    <>
      <div className="wrapper-balances">
      <div className="balances">{t("My Balance")}</div>
      <div className="credit-card">
        <div className="credit-card-header">
          <div className="credit-card-text">{t("Credit Card")}</div>
          <div className="master-card">
            <div className="master-card-text">{t("Master Card")}</div>
            <div className="icon">
              <img src={cardLogo} alt={t("Card logo")} />
            </div>
          </div>
        </div>
        <div className="account-number">
          <div className="card-num">3388 4556 8860 8***</div>
          <div className="acc-num">{t("Account Number")}</div>
        </div>
        <div className="total-amount">
            {status === 'loading' ? (
              <div className="total-sum">Loading...</div>
            ) : (
            <div className="total-sum">${sum}</div>
            )}
          <div className="total-amount-text">{t("Total Amount")}</div>
            {error && <div className="text-danger">{error}</div>}
        </div>
        <div className="buttons">
          <button onClick={() => openModal('remove')}>{t("Remove")}</button>
          <button onClick={() => openModal('add')}>{t("Add")}</button>
        </div>
      </div>
    </div>

        {showModal && modalType === 'add' && (
         <BalanceAddModalForm onClose={handleClose} mode="add" />
        )}

      {showModal && modalType === 'remove' && (
        <div className="modal-overlay" onClick={handleClose}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>{t("Remove Amount")}</h3>
            <input
              type="number"
              min="0"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder={t("Enter amount")}
            />
            <div className="modal-buttons">
              <button onClick={handleConfirm}>{t("Confirm")}</button>
              <button onClick={handleClose}>{t("Cancel")}</button>
            </div>
          </div>
        </div>
      )}
      <div className=''>
        <h2>{t("Actual Exchange Rate")}</h2>
      </div>
      <div className='courseWrapper'>
        <RateCard title="USD/HRN" type="currency" base="usd" target="uah" />
        <RateCard title="EUR/HRN" type="currency" base="eur" target="uah" />
        <RateCard title="BTC/USD" type="crypto" symbol="BTCUSDT" />
        <RateCard title="ETH/USD" type="crypto" symbol="ETHUSDT" />
        <RateCard title="TON/USD" type="crypto" symbol="TONUSDT" />
      </div>
    </>
  );
}

export default Balances;
