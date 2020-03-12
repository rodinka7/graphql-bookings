import React, { Component } from 'react';
import Spinner from '../components/Spinner/Spinner';
import BookingList from '../components/Bookings/BookingList/BookingList';
import BookingChart from '../components/Bookings/BookingChart/BookingChart';
import BookingControls from '../components/Bookings/BookingControls/BookingControls';

import AuthContext from '../context/auth';

class BookingsPage extends Component {
    state = {
        isLoading: false,
        bookings: [],
        outputType: 'list'
    };

    static contextType = AuthContext;

    componentDidMount() {
        this.fetchBookings();
    };

    fetchBookings = () => {
        this.setState({isLoading: true});
        const requestBody = {
            query: `
                query {
                    bookings {
                        _id
                        createdAt
                        updatedAt
                        event {
                            _id
                            title
                            date
                            price
                        }
                    }
                }
            `
        };

        fetch('http://localhost:4000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.context.token
            }
        })
        .then(res => {
            if (res.status !== 200 && res.status !== 201)
                throw new Error('Failed!!!');
            return res.json();
        })
        .then(respData => {
            const bookings = respData.data.bookings;
            this.setState({bookings, isLoading: false});
        })
        .catch(err => {
            console.log(err);
            this.setState({ isLoading: false });
        });
    };

    deleteBookingHandler = bookingId => {
        this.setState({isLoading: true});
        const requestBody = {
            query: `
                mutation CancelBooking($id: ID!) {
                    cancelBooking(bookingId: $id) {
                        _id
                        title
                    }
                }
            `,
            variables: {
                id: bookingId
            }
        };

        fetch('http://localhost:4000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.context.token
            }
        })
        .then(res => {
            if (res.status !== 200 && res.status !== 201)
                throw new Error('Failed!!!');
            return res.json();
        })
        .then(respData => {
           this.setState(prevState => {
               const updatedBookings = prevState.bookings.filter(item => item._id !== bookingId);
               return { bookings: updatedBookings, isLoading: false };
           })
        })
        .catch(err => {
            console.log(err);
            this.setState({ isLoading: false });
        });
    };

    changeOutputTypeHandler = outputType => {
        const type = outputType === 'list' ? 'list' : 'chart';
        this.setState({outputType: type});
    };

    render() {
        const { bookings, isLoading, outputType } = this.state;
        let content = <Spinner />;

        if (!isLoading) {
            content = (
                <>
                    <BookingControls
                        changeOutput={this.changeOutputTypeHandler}
                        activeOutputType={outputType}
                    />
                    <div>
                        {outputType === 'list' ? (
                            <BookingList
                                bookings={bookings}
                                onDelete={this.deleteBookingHandler}
                            />
                        ) : (
                            <BookingChart bookings={bookings} />
                        )}
                    </div>
                </>
            );
        }
        return content;
    }
}

export default BookingsPage;