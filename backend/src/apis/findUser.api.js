import prisma from "../../db/prisma.db";


export async function findUser(userField, isID = false, throwOnFound = false){
    /*
        * Finds a user from the database by a given valid `userField`
        * The field to check must be either an ID (defined by a number) or an email (string type), defined by `isID` boolean parameter
        * Returns a `Promise` that `reject`s if the `throwOnFound` param is set to `true`, otherwise `resolve`s
        * Possible Promise returned values are `false` if not found or user credentials if found
    */
    return new Promise(async (resolve, reject) => {
        let userExists = undefined;
        try{
            userExists = await prisma.credentials.findUniqueOrThrow({
                where: isID? { userID: userField }: { email: userField }
            });
            throwOnFound? reject(userExists): resolve(userExists);
        }catch(err){
            throwOnFound? resolve(false): reject(false);
        }
    });
}