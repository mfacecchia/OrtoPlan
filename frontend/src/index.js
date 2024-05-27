const express = require('express');

const app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs');


app.get('/', (req, res) => {
    res.render('pages/index');
});

app.get('/login', (req, res) => {
    res.render('pages/login');
});

app.get('/signup', (req, res) => {
    res.render('pages/signup');
});

app.get('/user/plantations', (req, res) => {
    res.render('pages/plantationsScreening', {plantationsList: []});
});

app.get('/user/plantations/:plantationID', (req, res) => {
    /* 
        * TODO: validate the plantation id by making a request to the backend
        * before rendering the actual page 
    */
    // NOTE: Place in `plantsList` option all the query returned plants
    res.render('pages/plantation', {plantationID: req.params.plantationID, plantationName: plantationName, plantsList: []});
});

app.listen(5500, () => {
    console.log("Pong.");
});