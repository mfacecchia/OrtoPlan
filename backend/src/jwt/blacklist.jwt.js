import prisma from "../../db/prisma.db.js";

export default async function blacklistToken(token){
    if(token.includes('Bearer ')) token = token.replace('Bearer ', '');
    try{
        const blacklistedToken = await prisma.jWTBlacklist.create({
            data: {
                token: token
            }
        });
        return blacklistedToken;
    }catch(err){
        return false;
    }
}