import prisma from '../../db/prisma.db.js'


export default async function findUser(userEmailOrID, throwOnFound = false){
    /*
        * Finds a user from the database by a given valid `userEmailOrID`
        * Returns a `Promise` that `reject`s if the `throwOnFound` param is set to `true`, otherwise `resolve`s
    */
    return new Promise(async (resolve, reject) => {
        let userExists = undefined;
        let dbSelector = undefined
        // Defining the right database field to get the value from based on the `userEmailOrID` param type to allow selection between userID or email
        if(typeof userEmailOrID === 'string'){
            dbSelector = { email: userEmailOrID }
        }
        else{
            dbSelector = { userID: userEmailOrID }
        }
        try{
            userExists = await prisma.credentials.findUniqueOrThrow({
                where: {
                    ...dbSelector
                }
            });
            throwOnFound? reject(false): resolve(userExists);
        }catch(err){
            console.log(err);
            throwOnFound? resolve(userExists): reject(false);
        }
    });
}