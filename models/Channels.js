const mongoose = require('mongoose');

const channelSchema = new mongoose.Schema({
    'name': {
        type: String,
        require: false
    },
    'uses': {
        type: String,
        require: true
    }
});

module.exports = mongoose.model('Channels', channelSchema);