const mongoose = require('mongoose');

const selectSchema = new mongoose.Schema({
    crypto: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const SelectModel = mongoose.model('SelectedCrypto', selectSchema);

module.exports = SelectModel;
