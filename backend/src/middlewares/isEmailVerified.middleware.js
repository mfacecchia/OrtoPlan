export default function isEmailVerified(setHeaderOnValid = true){
    return (req, res, next) => {
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