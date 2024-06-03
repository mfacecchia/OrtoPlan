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
    res.render('pages/plantationsScreening');
});

app.get('/user/plantations/:plantationID', (req, res) => {
    // NOTE: Place in `plantsList` option all the query returned plants
    res.render('pages/plantation', {plantationID: req.params.plantationID});
});

app.listen(5500, () => {
    console.log("Pong.");
});