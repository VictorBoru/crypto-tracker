const mongoose = require('mongoose');

const searchSchema = new mongoose.Schema({
    term: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const SearchModel = mongoose.model('SearchTerm', searchSchema);

module.exports = SearchModel;