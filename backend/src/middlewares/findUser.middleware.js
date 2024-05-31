import prisma from '../../db/prisma.db.js'


export async function findUserByEmail(userEmail, throwOnFound = false){
    /*
        * Finds a user from the database by a given valid `userEmail`
        * Returns a `Promise` that `reject`s if the `throwOnFound` param is set to `true`, otherwise `resolve`s
    */
    return new Promise(async (resolve, reject) => {
        let userExists = undefined;
        try{
            userExists = await prisma.credentials.findUniqueOrThrow({
                where: {
                    email: userEmail
                }
            });
            throwOnFound? reject(false): resolve(userExists);
        }catch(err){
            throwOnFound? resolve(userExists): reject(false);
        }
    });
}