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
    /* 
        * TODO: validate the plantation id by making a requesto to the backend
        * before rendering the actual page 
    */
    res.render('pages/plantation');
});

app.listen(5500, () => {
    console.log("Pong.");
});