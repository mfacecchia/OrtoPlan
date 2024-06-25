import jwt from 'jsonwebtoken'
import 'dotenv/config'

export function generateJWT(payload, rememberMe = false){
    return new Promise((resolve, reject) => {
        const options = {};
        if(!rememberMe) options.expiresIn = '60d'
        const token = jwt.sign(payload, process.env.JWT_SECRET, options);
        resolve(token);
    });
}

export function validateJWT(token, secret){
    return new Promise(async (resolve, reject) => {
        try{
            const decodedToken = jwt.verify(token, secret);
            resolve(decodedToken);
        }catch(err){
            if(err.name === 'TokenExpiredError') reject('Token expired.');
            else if(err.name === 'JsonWebTokenError') reject('Invalid token.');
            else reject('Unknown error');
        }
    });
}