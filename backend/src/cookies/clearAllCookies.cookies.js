export default function clearAllCookies(req, res){
    for(const cookie of Object.keys(req.cookies)){
        res.clearCookie(cookie);
    }
}