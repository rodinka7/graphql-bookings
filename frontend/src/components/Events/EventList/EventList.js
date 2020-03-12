import React from 'react';
import EventItem from './EventItem/EventItem';
import './EventList.css';

const EventList = props => {
    const list = props.events.map(event =>
        <EventItem
            key={event._id}
            userId={props.authUserId}
            onDetail={props.onViewDetail}
            event={event}
        />
    )
    return (
        <ul className="event__list">
            {list}
        </ul>
    )
};

export default EventList;