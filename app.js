const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
const PORT = process.env.PORT || 5400;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.get('/', (req, res) => {
    res.send('hello there!');
});
app.use(require('./routes/user'));

mongoose
    .connect(process.env.MONGO_URI, { dbName: 'dbName' })
    .then((result) => {
        app.listen(PORT, () =>
            console.log('server running on http://localhost:' + PORT)
        );
        console.log('mongodb connected');
    })
    .catch((err) => console.log(err));
