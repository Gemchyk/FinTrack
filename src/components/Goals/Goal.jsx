

import React from 'react';
import PiePart from './PiePart';
import './Goal.scss'
import { useTranslation } from 'react-i18next';

function Goal(props) {

    const {t} = useTranslation();

    return (
        <div>
            <h1 className='title'>{t("Spendings")}</h1>
            <div className='main'>
            <div className='goals-main-header'>
                <h4 className='main-title'>{t("Categories Spendings 2025")}</h4>
            </div>
            <div className='goals-details-div'>
                <PiePart />
            </div>
            </div>
            
        </div>
    );
}

export default Goal;