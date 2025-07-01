import React from 'react';
import ExchangeRate from './RateParser'
import CryptoPrice from './CryptoParserBinance';
import './RateCard.scss'

function RateCard({ title, type, base, target, symbol }) {
  return (
    <div className="courseCard">
      <div className="courseName">{title}</div>
      <div className="course">
        {type === 'currency' && <ExchangeRate base={base} target={target} />}
        {type === 'crypto' && <CryptoPrice symbol={symbol} />}
      </div>
    </div>
  );
}

export default RateCard;