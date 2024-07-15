export default function plants(app){
    app.get('/user/plantations/:plantationID', (req, res) => {
        // NOTE: Place in `plantsList` option all the query returned plants
        res.render('pages/plantation', {plantationID: req.params.plantationID});
    });
}