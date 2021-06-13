const createStore = require('../utils/createStore');
const counter = require('./models/counter');

module.exports = createStore({
    counter
});