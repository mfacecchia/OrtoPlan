export default function resetPassword(app){
    app.get('/user/reset', async (req, res) => {
        const resetToken = req.query.q;
        if(!resetToken){
            res.render('pages/resetPasswordEmailInput');
            return;
        }
        res.render('pages/resetPassword', {resetToken: resetToken});
    });
}