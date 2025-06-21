import React, { useState } from 'react';
import './Balances.scss';
import cardLogo from '../components/TotalBalance/imgs/cardLogo.png';
import { useSelector, useDispatch } from 'react-redux';
import { addAmount, removeAmount } from '../features/balance/balanceSlice';

function Balances() {
  const sum = useSelector(state => state.balance.sum);
  const dispatch = useDispatch();

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
      <div className={styles['wrapper-balances']}>
      <div className={styles['balances']}>My Balance</div>
      <div className={styles['credit-card']}>
        <div className={styles['credit-card-header']}>
          <div className={styles['credit-card-text']}>Credit Card</div>
          <div className={styles['master-card']}>
            <div className={styles['master-card-text']}>Master Card</div>
            <div className={styles['icon']}>
              <img src={cardLogo} alt="Card logo" />
            </div>
          </div>
        </div>
        <div className={styles['account-number']}>
          <div className={styles['card-num']}>3388 4556  8860 8***</div>
          <div className={styles['acc-num']}>Account Number</div>
        </div>
        <div className={styles['total-amount']}>
          <div className={styles['total-sum']}>${sum}</div>
          <div className={styles['total-amount-text']}>Total Amount</div>
        </div>
        <div className={styles['buttons']}>
          <button onClick={() => openModal('remove')}>Remove</button>
          <button onClick={() => openModal('add')}>Add</button>
        </div>
      </div>
    </div>

    {showModal && 
      <div className={styles['modal-overlay']} onClick={handleClose}>
        <div className={styles['modal']} onClick={e => e.stopPropagation()}>
          <h3>{modalType === 'add' ? 'Add Amount' : 'Remove Amount'}</h3>
          <input
            name="test"
            type="number"
            min="0"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder="Enter amount"
          />
          <div className={styles['modal-buttons']}>
            <button onClick={handleConfirm}>Confirm</button>
            <button onClick={handleClose}>Cancel</button>
          </div>
        </div>
      </div>
    }
    </>
  );
}

export default Balances;