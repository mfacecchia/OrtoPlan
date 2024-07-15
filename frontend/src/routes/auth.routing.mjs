export default function userAuth(app){
    app.get('/login', (req, res) => {
        res.render('pages/login');
    });
    
    app.get('/signup', (req, res) => {
        res.render('pages/signup');
    });
}