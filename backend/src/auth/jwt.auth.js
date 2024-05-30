import jwt from 'jsonwebtoken'
import 'dotenv/config'

export function generateJWT(payload, rememberMe = false){
    return new Promise((resolve, reject) => {
        const options = {
            audience: `http://localhost:${process.env.PORT}`
        }
        if(!rememberMe) options.expiresIn = '60d'
        const token = jwt.sign(payload, process.env.JWT_SECRET, options);
        resolve(token);
    });
}