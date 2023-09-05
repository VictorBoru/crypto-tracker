const SearchTermModel = require('../models/search');
const SelectedCryptoModel = require('../models/select');

exports.logSearchTerm = async (req, res) => {
    const { searchTerm } = req.body;
    if (searchTerm) {
        try {
            await new SearchTermModel({ term: searchTerm }).save();
            res.status(200).send({ message: 'Search term logged successfully!' });
        } catch (error) {
            res.status(500).send({ message: 'Error logging search term', error });
        }
    } else {
        res.status(400).send({ message: 'No search term provided!' });
    }
};

exports.logSelectedCrypto = async (req, res) => {
    const { selectedCrypto } = req.body;
    if (selectedCrypto) {
        try {
            await new SelectedCryptoModel({ crypto: selectedCrypto }).save();
            res.status(200).send({ message: 'Selected crypto logged successfully!' });
        } catch (error) {
            res.status(500).send({ message: 'Error logging selected crypto', error });
        }
    } else {
        res.status(400).send({ message: 'No selected crypto provided!' });
    }
};
