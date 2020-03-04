import React from 'react';
import './EventItem.css';

const EventItem = props => {
    const { _id, title, price, date, creator } = props.event;
    return (
    <li
        key={_id}
        className="event__list-item"
    >
        <div>
            <h1>{title}</h1>
            <h2>${price} - {new Date(date).toLocaleDateString()}</h2>
        </div>
        <div>
            {props.userId === creator._id ? (
                <p>You're the Owner of This Event!</p>
            ) : (
                <button className="btn" onClick={props.onDetail.bind(this, _id)}>View Details</button>
            )}
        </div>
    </li>
)
};

export default EventItem;