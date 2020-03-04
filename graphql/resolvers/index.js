const auth = require('./auth');
const booking = require('./booking');
const events = require('./events');

module.exports = {
    ...auth,
    ...booking,
    ...events
}