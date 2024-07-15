import express from 'express';
import 'dotenv/config';
import userAuth from './routes/auth.routing.mjs';
import resetPassword from './routes/resetPassword.routing.mjs';
import emailAddressVerification from './routes/emailVerification.routing.mjs';
import plantations from './routes/plantations.routing.mjs';
import plants from './routes/plants.routing.mjs';


const app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs');


app.get('/', (req, res) => {
    res.render('pages/index');
});

plantations(app);
plants(app);
userAuth(app);
resetPassword(app);
emailAddressVerification(app);

app.use((req, res) => {
    res.status(404).render('pages/notFound');
});

app.listen(5500, () => {
    console.log("Pong.");
});