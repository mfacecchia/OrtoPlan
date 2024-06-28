export default function isEmailVerified(setHeaderOnValid = true){
    return (req, res, next) => {
        // `req.userEmailStatus` is a value passed from the previous middleware (obtained from a query that gets user data from the DB)
        const userEmailStatus = req.userEmailStatus;
        if(!userEmailStatus){
            res.status(401).json({
                status: 401,
                message: "Email not verified."
            });
            return;
        }
        if(setHeaderOnValid){
            res.status(200).json({
                status: 200,
                message: "Email verified."
            });
            return;
        }
        next();
    }
}