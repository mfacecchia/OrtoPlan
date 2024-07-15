import fetch from 'node-fetch';


export default function emailAddressVerification(app){
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
}