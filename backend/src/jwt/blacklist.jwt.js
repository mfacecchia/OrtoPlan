import prisma from "../../db/prisma.db.js";

export default async function blacklistToken(token){
    try{
        const token = await prisma.jWTBlacklist.create({
            data: {
                token: token
            }
        });
        return token;
    }catch(err){
        return false;
    }
}