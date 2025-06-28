import React, { useEffect, useState } from 'react';
import './Balances.scss';
import cardLogo from '../components/TotalBalance/imgs/cardLogo.png';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBalance, addBalance, removeBalance } from '../features/balance/balanceSlice';

function Balances() {
  const dispatch = useDispatch();
  const sum = useSelector(state => state.balance.sum);
  const status = useSelector(state => state.balance.status);
  const error = useSelector(state => state.balance.error);

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
        <div className="balances">My Balance</div>
        <div className="credit-card">
          <div className="credit-card-header">
            <div className="credit-card-text">Credit Card</div>
            <div className="master-card">
              <div className="master-card-text">Master Card</div>
              <div className="icon">
                <img src={cardLogo} alt="Card logo" />
              </div>
            </div>
          </div>
          <div className="account-number">
            <div className="card-num">3388 4556 8860 8***</div>
            <div className="acc-num">Account Number</div>
          </div>
          <div className="total-amount">
            {status === 'loading' ? (
              <div className="total-sum">Loading...</div>
            ) : (
              <div className="total-sum">${sum}</div>
            )}
            <div className="total-amount-text">Total Amount</div>
            {/* {error && <div className="error">Ошибка: {error}</div>} */}
            {error && <div className="text-danger">{error}</div>}
          </div>
          <div className="buttons">
            <button onClick={() => openModal('remove')}>Remove</button>
            <button onClick={() => openModal('add')}>Add</button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={handleClose}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>{modalType === 'add' ? 'Add Amount' : 'Remove Amount'}</h3>
            <input
              type="number"
              min="0"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="Enter amount"
            />
            <div className="modal-buttons">
              <button onClick={handleConfirm}>Confirm</button>
              <button onClick={handleClose}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Balances;
