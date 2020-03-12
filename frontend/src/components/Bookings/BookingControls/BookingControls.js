import React from 'react';
import './BookingControls.css';

const BookingControls = props => (
    <div className="booking__controls">
        <button
            className={props.activeOutputType === 'list' ? 'active' : ''}
            onClick={props.changeOutput.bind(this, 'list')}
        >
            List
        </button>
        <button
            className={props.activeOutputType === 'chart' ? 'active' : ''}
            onClick={props.changeOutput.bind(this, 'chart')}
        >
            Chart
        </button>
    </div>
);

export default BookingControls;