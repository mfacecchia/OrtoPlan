import express from 'express';
import fetch from 'node-fetch';
import 'dotenv/config';


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

app.get('/user/verify', async (req, res) => {
    const query = req.query.q;
    try{
        const verificationRes = await fetch(`${process.env.BACKEND_ADDRESS}:${process.env.BACKEND_PORT}/user/verify`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                verificationToken: query
            })
        });
        res.render('pages/verifyEmail', {successful: verificationRes.ok});
    }catch{
        res.render('pages/verifyEmail', {successful: false});
    }
});

app.get('/user/reset', async (req, res) => {
    const resetToken = req.query.q;
    if(!resetToken){
        res.render('pages/resetPasswordEmailInput');
        return;
    }
    res.render('pages/resetPassword', {resetToken: resetToken});
});

app.get('/user/plantations', (req, res) => {
    res.render('pages/plantationsScreening');
});

app.get('/user/plantations/:plantationID', (req, res) => {
    // NOTE: Place in `plantsList` option all the query returned plants
    res.render('pages/plantation', {plantationID: req.params.plantationID});
});

app.use((req, res) => {
    res.status(404).render('pages/notFound');
});

app.listen(5500, () => {
    console.log("Pong.");
});