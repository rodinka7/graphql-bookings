import React, { Component } from 'react';
import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import EventList from '../components/Events/EventList/EventList';
import Spinner from '../components/Spinner/Spinner';
import AuthContext from '../context/auth';

import './Events.css';

class EventsPage extends Component {
    state = {
        creating: false,
        isLoading: false,
        events: [],
        selectedEvent: null
    };

    constructor(props) {
        super(props);
        this.titleElRef = React.createRef();
        this.priceElRef = React.createRef();
        this.dateElRef = React.createRef();
        this.descriptionElRef = React.createRef();
    };

    static contextType = AuthContext;

    isActive = true;

    componentDidMount() {
        this.fetchEvents();
    };

    startCreateEventHandler = evt => {
        this.setState({ creating: true });
    };

    modalConfirmHandler = () => {
        this.setState({creating: false});
        const title = this.titleElRef.current.value;
        const price = +this.priceElRef.current.value;
        const date = this.dateElRef.current.value;
        const description = this.descriptionElRef.current.value;

        if (!title.trim().length
            || price <= 0
            || !date.trim().length
            || !description.trim().length) {
                return;
        }

        const requestBody = {
            query: `
                mutation CreateEvent($title: String!, $price: Float!, $date: String!, $description: String!) {
                    createEvent(eventInput: {
                        title: $title,
                        price: $price,
                        date: $date,
                        description: $description
                    }) {
                        _id
                        title
                        price
                        date
                        description
                        creator {
                            _id
                            email
                        }
                    }
                }
            `,
            variables: {
                title,
                price,
                date,
                description
            }
        };

        const token = this.context.token;

        fetch('http://localhost:4000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
        .then(res => {
            if (res.status !== 200 && res.status !== 201)
                throw new Error('Failed!!!');
            return res.json();
        })
        .then(respData => {
            this.setState(prevState => {
                const updatedEvents = [...prevState.events];
                const {_id, title, price, date, description } = respData.data.createEvent;
                updatedEvents.push({
                    _id,
                    title,
                    price,
                    date,
                    description,
                    creator: {
                        _id: this.context.userId
                    }
                })
                return {events: updatedEvents};
            })
        })
        .catch(err => console.log(err));
    };

    modalCancelHandler = () => {
        this.setState({ creating: false, selectedEvent: null });
    };

    fetchEvents = () => {
        this.setState({isLoading: true});
        const requestBody = {
            query: `
                query {
                    events {
                        _id
                        title
                        price
                        date
                        description
                        creator {
                            _id
                            email
                        }
                    }
                }
            `
        };

        fetch('http://localhost:4000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            if (res.status !== 200 && res.status !== 201)
                throw new Error('Failed!!!');
            return res.json();
        })
        .then(respData => {
            const events = respData.data.events;
            if (this.isActive)
                this.setState({events, isLoading: false});
        })
        .catch(err => {
            console.log(err);
            if (this.isActive)
                this.setState({ isLoading: false });
        });
    };

    showDetailHandler = eventId => {
        this.setState(prevState => ({
            selectedEvent: prevState.events.find(e => e._id === eventId)
        }))
    };

    bookEventHandler = () => {
        const token = this.context.token;
        if (!token) {
            this.setState({ selectedEvent: null });
            return;
        }

        const requestBody = {
            query: `
                mutation BookEvent($id: ID!) {
                    bookEvent(eventId: $id) {
                        _id
                        createdAt
                        updatedAt
                    }
                }
            `,
            variables: {
                id: this.state.selectedEvent._id
            }
        };

        fetch('http://localhost:4000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
        .then(res => {
            if (res.status !== 200 && res.status !== 201)
                throw new Error('Failed!!!');
            return res.json();
        })
        .then(respData => {
            this.setState({ selectedEvent: null });
        })
        .catch(err => console.log(err));
    };

    componentWillUnmount() {
        this.isActive = false;
    };

    render() {
        const { selectedEvent, creating, isLoading, events } = this.state;
        return (
            <>
                {(creating || selectedEvent) && <Backdrop />}
                {creating &&
                    <Modal
                        title="Add Event"
                        canCancel
                        canConfirm
                        onCancel={this.modalCancelHandler}
                        onConfirm={this.modalConfirmHandler}
                        confirmText="Confirm"
                    >
                        <form>
                            <div className="form-control">
                                <label htmlFor="title">Title</label>
                                <input type="text" id="title" ref={this.titleElRef} />
                            </div>
                            <div className="form-control">
                                <label htmlFor="price">Price</label>
                                <input type="number" id="price" ref={this.priceElRef} />
                            </div>
                            <div className="form-control">
                                <label htmlFor="date">Date</label>
                                <input type="datetime-local" id="date" ref={this.dateElRef} />
                            </div>
                            <div className="form-control">
                                <label htmlFor="description">Description</label>
                                <textarea id="description" rows="4" ref={this.descriptionElRef}></textarea>
                            </div>
                        </form>
                    </Modal>
                }
                {selectedEvent && (
                    <Modal
                        title={selectedEvent.title}
                        canCancel
                        canConfirm
                        onCancel={this.modalCancelHandler}
                        onConfirm={this.bookEventHandler}
                        confirmText={this.context.token ? "Book" : "Confirm"}
                    >
                        <h1>{selectedEvent.title}</h1>
                        <h2>${selectedEvent.price} - {new Date(selectedEvent.date).toLocaleDateString()}</h2>
                        <p>{selectedEvent.description}</p>
                    </Modal>
                )}
                {this.context.token && (
                    <div className="events-control">
                        <p>Share Your Events!</p>
                        <button className="btn" onClick={this.startCreateEventHandler}>Create Event</button>
                    </div>
                )}
                {isLoading ? (
                    <Spinner />
                ) : (
                    <EventList
                        events={events}
                        authUserId={this.context.userId}
                        onViewDetail={this.showDetailHandler}
                    />
                )}
            </>
        )
    }
}

export default EventsPage;