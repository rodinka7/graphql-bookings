const Booking = require('../../models/booking');
const Event = require('../../models/event');

const { transformBooking, transformEvent } = require('./merge');

module.exports = {
    bookings: async (args, req) => {
        if (!req.isAuth)
            throw new Error('You are not authentificated!');
        try {
            const bookings = await Booking.find({user: req.userId});
            return bookings.map(booking => transformBooking(booking));
        } catch(err) {
            throw err;
        }
    },
    bookEvent: async (args, req) => {
        if (!req.isAuth)
            throw new Error('You are not authentificated!');
        const event = await Event.findOne({_id: args.eventId});
        const booking = new Booking({
            user: req.userId,
            event
        });
        const response = await booking.save();
        return transformEvent(response);
    },
    cancelBooking: async (args, req) => {
        if (!req.isAuth)
            throw new Error('You are not authentificated!');
        try {
            const booking = await Booking.findById(args.bookingId);
            const event = transformEvent(booking.event);
            await Booking.deleteOne({_id: args.bookingId});
            return event;
        } catch(err) {
            throw err;
        }
    }
}