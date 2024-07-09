import prisma from "../../db/prisma.db.js";

export async function blacklistToken(token){
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

export async function isTokenBlacklisted(token){
    if(token.includes('Bearer ')) token = token.replace('Bearer ', '');
    try{
        const blacklistedToken = await prisma.jWTBlacklist.findUniqueOrThrow({
            where: {
                token: token
            }
        });
        return blacklistedToken;
    }catch(err){
        return false;
    }
}