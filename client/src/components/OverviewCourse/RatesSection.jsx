import React from 'react';
import RateCard, { CurrencyRateCards } from '../Balance/RateCard';
import './RatesSection.scss'
import { useTranslation } from 'react-i18next';

const RatesSection = () => {
    const {t} = useTranslation();
  return (
    <div>
        <h1 className='title'>{t("Actual Exchange Rate")}</h1>
        <div className="RatesSectionWrapper">
            <CurrencyRateCards />
            <RateCard title="BTC/USD" type="crypto" symbol="BTCUSDT" />
        </div>
    </div>
  );
};

export default RatesSection;
