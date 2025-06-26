

import React from 'react';
import PiePart from './PiePart';
import './Goal.scss'

function Goal(props) {
    return (
        <div>
            <h1 className='title'>Goals</h1>
                <div className='main'>
                    <div className='main-header'>
                        <h4 className='main-sec-title'>2025</h4>
                    </div>
                    <div className='goals-details-div'>
                        <div>
                        
                            
                        </div>
                        <div>
                            <PiePart /> 
                        </div>
                    </div>
                </div>
            
        </div>
    );
}

export default Goal;