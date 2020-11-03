//import express and store it in variable called app
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

//app
const app = express();

//db
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true
    //useCreateIndex: true
}).then(() => console.log("DB Connected"));

mongoose.connection.on('error', err => {
    console.log(`DB connection error: ${err.message}`)
});

//the routes to handle the request from the homepage
app.get('/', (req, res) => {
    res.send("hello from node yay");
});

//port that run the server
const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})