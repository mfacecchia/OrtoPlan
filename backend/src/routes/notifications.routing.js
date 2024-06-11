import prisma from '../../db/prisma.db.js';
import decodeToken from '../jwt/decode.jwt.js';
import { getUserNotification } from '../apis/getUserNotifications.api.js';
import { validateNotification } from '../validation/notification.validation.js';


export default function notifications(app){
    app.route('/api/notifications')
        .get(async (req, res) => {
            /*
                * Gets a single notification from a given `notificationID` (in request body) and userID (in JWT payload)
            */
            try{
                const decodedToken = decodeToken(req.headers.authorization.replace('Bearer ', ''));
                const notification = await getUserNotification(parseInt(req.query.notificationID) || 0, decodedToken.userID);
                res.status(200).json({
                    status: 200,
                    message: "Notification found",
                    notifications: notification
                });
            }catch(err){
                res.status(404).json({
                    status: 404,
                    message: "No notifications found"
                });
            }
        })
        .post(validateNotification(), async (req, res) => {
            const decodedToken = decodeToken(req.headers.authorization, false);
            req.body.userID = decodedToken.userID;
            try{
                const newPlantation = await createNotification(req.body);
                res.status(201).json({
                    status: 201,
                    message: "Plantation successfully created",
                    plantation: newPlantation
                });
            }catch(err){
                res.status(400).json({
                    status: 400,
                    message: "Unknown error while creating the notification. Please try again."
                });
                return;
            }
        })
}


function createNotification(notificationData){
    return new Promise(async (resolve, reject) => {
        try{
            const newNotification = await prisma.notification.create({
                data: notificationData
            });
            resolve(newNotification);
        }catch(err){
            reject(false);
        }
    });
}