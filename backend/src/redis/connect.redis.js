import { createClient } from "redis";


let redis;

export function connectToRedis(){
    /*
        * Connects to a local redis server.
        * Returns `redis` client if the connection end up successful,
        * otherwise `false` if the connection fails
    */
    return new Promise(async (resolve, reject) => {
        if(redis && redis.isReady) resolve(redis);
        try{
            redis = await createClient()
                // Failed connection to Redis server
                .on('error', () => {
                    throw new Error();
                })
                .connect();
        }catch(err){
            redis = null;
            reject(false);
        }
        resolve(redis);
    });
}

export async function disconnectToRedis(){
    if(!redis) return true;
    redis.quit();
    redis = null;
    return true;
}