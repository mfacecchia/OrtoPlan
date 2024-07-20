import { connectToRedis } from "../redis/connect.redis.js";
import Tokens from "csrf";
import jwt from "jsonwebtoken";


export default function isCsrfTokenValid(){
    return async (req, res, next) => {
        const tokens = new Tokens();
        const token = req.headers.authorization;
        const decodedToken = jwt.decode(token.replace('Bearer ', ''));
        const tokenUserID = decodedToken.userID;
        try{
            const secret = await getSecretFromRedis(tokenUserID);
            if(tokens.verify(secret, req.cookies? req.cookies.csrf || req.body.csrf: req.body.csrf)) next();
            else throw new Error();
        }catch(err){
            res.status(401).json({
                status: 401,
                message: "CSRF token not found or invalid."
            });
            return;
        }
    }
}

function getSecretFromRedis(userID){
    return new Promise(async (resolve, reject) => {
        let redis;
        try{
            redis = await connectToRedis();
        }catch(err){
            reject(false);
        }
        const secret = await redis.get(`csrfSecret:${userID}`);
        if(secret) resolve(secret);
        else reject(false);
    });
}