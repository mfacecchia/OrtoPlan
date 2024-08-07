import prisma from '../../db/prisma.db.js';
import decodeToken from '../jwt/decode.jwt.js';
import { getUserNotification } from '../apis/getUserNotifications.api.js';
import { validateNotification } from '../validation/notification.validation.js';
import isCsrfTokenValid from '../middlewares/isCsrfTokenValid.middleware.js';


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
        .post(validateNotification(), isCsrfTokenValid(), async (req, res) => {
            const decodedToken = decodeToken(req.headers.authorization, false);
            req.body.userID = decodedToken.userID;
            try{
                const newNotification = await createNotification(req.body);
                res.status(201).json({
                    status: 201,
                    message: "Notification successfully created",
                    notification: newNotification
                });
            }catch(err){
                res.status(400).json({
                    status: 400,
                    message: "Unknown error while creating the notification. Please try again."
                });
                return;
            }
        })
        .delete(async (req, res) => {
            try{
                const decodedToken = decodeToken(req.headers.authorization, false);
                const userID = decodedToken.userID;
                const notification = await removeNotification(parseInt(req.body.notificationID) || 0, userID);
                res.status(200).json({
                    status: 200,
                    message: "Notification successfully removed",
                    notification: notification
                });
            }catch(err){
                res.status(404).json({
                    status: 404,
                    message: err
                });
            }
        });
    
    app.route('/api/notifications/all')
        .get(async (req, res) => {
            const decodedToken = decodeToken(req.headers.authorization.replace('Bearer ', ''));
            const notificationsList = await getNotificationsList(decodedToken.userID);
            res.status(200).json({
                status: 200,
                message: "Notifications found",
                notifications: notificationsList
            });
        })
        .delete(async (req, res) => {
            const decodedToken = decodeToken(req.headers.authorization.replace('Bearer ', ''));
            try{
                const notificationsList = await removeAllNotifications(decodedToken.userID);
                res.status(200).json({
                    status: 200,
                    message: "Notifications successfully removed",
                    notifications: notificationsList
                });
            }catch(err){
                res.status(404).json({
                    status: 404,
                    message: err
                });
            }
        });
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

function removeNotification(notificationID, userID){
    return new Promise(async (resolve, reject) => {
        try{
            const removedNotification = await prisma.notification.delete({
                where: {
                    notificationID: notificationID,
                    userID: userID
                }
            });
            resolve(removedNotification);
        }catch(err){
            reject(err.code === 'P2025'? 'Notification not found.': 'Unknown error.');
        }
    });
}

function removeAllNotifications(userID){
    return new Promise(async (resolve, reject) => {
        try{
            const removedNotification = await prisma.notification.deleteMany({
                where: {
                    userID: userID
                }
            });
            resolve(removedNotification);
        }catch(err){
            reject('Unknown error.');
        }
    });
}

function getNotificationsList(userID){
    return new Promise(async (resolve, reject) => {
        const notifications = await prisma.notification.findMany({
            where: {
                userID: userID
            }
        });
        resolve(notifications);
    });
}