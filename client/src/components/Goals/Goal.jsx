

import React from 'react';
import PiePart from './PiePart';
import './Goal.scss'
import { useTranslation } from 'react-i18next';

function Goal() {

    const {t} = useTranslation();

    return (
        <div>
            <h1 className='title'>{t("Spendings")}</h1>
            <div className='main goal-card'>
            <div className='goals-main-header'>
                <h4 className='main-title'>{t("Spending by category this month")}</h4>
            </div>
            <div className='goals-details-div'>
                <PiePart />
            </div>
            </div>

        </div>
    );
}

export default Goal;