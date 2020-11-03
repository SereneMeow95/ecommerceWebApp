//import express and store it in variable called app
const express = require('express');
const app = express();
require('dotenv').config();

//handle the request from the homepage
app.get('/', (req, res) => {
    res.send("hello from node ily");
});

//port that run the server
const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})