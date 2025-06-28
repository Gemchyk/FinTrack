import React, { useState } from 'react';
import './Balances.scss';
import cardLogo from '../components/TotalBalance/imgs/cardLogo.png';
import { useSelector, useDispatch } from 'react-redux';
import { addAmount, removeAmount } from '../features/balance/balanceSlice';
import { useTranslation } from 'react-i18next';

function Balances() {
  const sum = useSelector(state => state.balance.sum);
  const dispatch = useDispatch();
  const {t} = useTranslation();

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null); // 'add' | 'remove'
  const [inputValue, setInputValue] = useState('');

  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  const handleConfirm = () => {
    const value = parseFloat(inputValue);
    if (!isNaN(value) && value > 0) {
      if (modalType === 'add') {
        dispatch(addAmount(value));
      } else if (modalType === 'remove') {
        dispatch(removeAmount(value));
      }
    }
    setInputValue('');
    setShowModal(false);
    setModalType(null);
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
          <div className="card-num">3388 4556  8860 8***</div>
          <div className="acc-num">{t("Account Number")}</div>
        </div>
        <div className="total-amount">
          <div className="total-sum">${sum}</div>
          <div className="total-amount-text">{t("Total Amount")}</div>
        </div>
        <div className="buttons">
          <button onClick={() => openModal('remove')}>{t("Remove")}</button>
          <button onClick={() => openModal('add')}>{t("Add")}</button>
        </div>
      </div>
    </div>

    {showModal && 
      <div className="modal-overlay" onClick={handleClose}>
        <div className="modal" onClick={e => e.stopPropagation()}>
          <h3>
            {modalType === 'add' ? t("Add Amount") : t("Remove Amount")}
          </h3>
          <input
            name="test"
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
    }
    </>
  );
}

export default Balances;
