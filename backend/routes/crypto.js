const express = require('express');
const router = express.Router();
const crypto = require('../controllers/crypto');

router.post('/log/searched', crypto.logSearchTerm);
router.post('/log/selected', crypto.logSelectedCrypto);

module.exports = router;
