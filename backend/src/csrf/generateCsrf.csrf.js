import { connectToRedis } from "../redis/connect.redis.js";
import Tokens from "csrf";


export default function generateCsrf(userID){
    return new Promise(async (resolve, reject) => {
        const tokens = new Tokens();
        const secret = await tokens.secret();
        const csrfToken = tokens.create(secret);
        try{
            addSecretToRedis(userID, secret);
            resolve(csrfToken);
        }catch(err){
            reject("Could not update Redis");
        }
    })
}

function addSecretToRedis(userID, secret){
    return new Promise(async (resolve, reject) => {
        let redis;
        try{
            redis = await connectToRedis();
        }catch(err){
            reject(false);
        }
        await redis.set(`csrfSecret:${userID}`, secret);
        resolve(true);
    });
}