import prisma from "../../db/prisma.db.js";


export function getUserNotification(notificationID, userID){
    /*
        * Obtains a specific notification delivered to an user
        * NOTE: The `notificationID` and `userID` params MUST be integers
    */
    return new Promise(async (resolve, reject) => {
        try{
            const notification = await prisma.notification.findUniqueOrThrow({
                where: {
                    notificationID: notificationID,
                    userID: userID
                }
            });
            resolve(notification);
        }catch(err){
            reject('No notifications found.');
        }
    });
}