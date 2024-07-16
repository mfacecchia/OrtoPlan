import { createClient } from "redis";


let redis;

export async function connectToRedis(){
    /*
        * Connects to a local redis server.
        * Returns `redis` client if the connection end up successful,
        * otherwise `false` if the connection fails
    */
    if(redis && redis.isReady) return true
    try{
        redis = await createClient()
            .on('error', () => {
                console.log("Failed connection with redis.");
                throw new Error();
            })
            .connect();
    }catch(err){
        redis = null;
        return false;
    }
    return redis;
}

export async function disconnectToRedis(){
    if(!redis) return true;
    redis.quit();
    redis = null;
    return true;
}