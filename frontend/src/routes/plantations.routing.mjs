export default function plantations(app){
    app.get('/user/plantations', (req, res) => {
        res.render('pages/plantationsScreening');
    });
}