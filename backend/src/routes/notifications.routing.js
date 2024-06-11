import decodeToken from '../jwt/decode.jwt.js';
import { getUserNotification } from '../apis/getUserNotifications.api.js';


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
        });
}