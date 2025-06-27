

import React from 'react';
import PiePart from './PiePart';
import './Goal.scss'

function Goal(props) {
    return (
        <div>
            <h1 className='title'>Spendings</h1>
                <div className='main'>
                    <div className='main-header'>
                        <h4 className='main-title'>Categories Spendings 2025</h4>
                    </div>
                    <div className='goals-details-div'>
                            <PiePart /> 
                    </div>
                </div>
            
        </div>
    );
}

export default Goal;