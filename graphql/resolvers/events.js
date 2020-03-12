const Event = require('../../models/event');
const User = require('../../models/user');

const { transformEvent } = require('./merge');

module.exports = {
    events: async () => {
        try {
            const events = await Event.find();
            // .populate('creator')
            return events.map(event => transformEvent(event))
        } catch(err) {
            console.log(err);
            throw err;
        }
    },
    createEvent: async (args, req) => {
        if (!req.isAuth)
            throw new Error('You are not authentificated!');

        const { title, description, price, date } = args.eventInput;
        const event = new Event({
            title,
            description,
            price: +price,
            date: new Date(date),
            creator: req.userId
        });

        let createdEvent;

        try {
            const savedEvent = await event.save();
            createdEvent = transformEvent(savedEvent);

            const creator = await User.findById(req.userId);
            if (!creator)
                throw new Error('User is not found!');

            creator.createdEvents.push(event);
            await creator.save();

            return createdEvent;
        } catch(err) {
            console.log(err);
            throw err;
        }
    }
};