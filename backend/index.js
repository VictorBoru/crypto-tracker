const express = require('express');
const bodyParser = require('body-parser');
const cryptoRoutes = require('./routes/crypto');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = 3002;

app.use(cors());

app.use(bodyParser.json());

app.use('/', cryptoRoutes);

const MONGO_URI = 'mongodb+srv://borunovasviktoras:borunovas1@cluster0.60ilsjj.mongodb.net/crypto-tracker?retryWrites=true&w=majority'; 
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});