import prisma from '../../db/prisma.db.js';
import decodeToken from '../jwt/decode.jwt.js';

export default function treatments(app){
    app.route('/api/treatments')
        .get(async (req, res) => {
            /*
                * Gets a single treatment from a given `treatmentID` (in request body) and userID (in JWT payload)
                * Returns all treatment's information as well as all relative plant and plantation's treatment
            */
            try{
                const decodedToken = decodeToken(req.headers.authorization.replace('Bearer ', ''));
                const treatment = await getPlantTreatment(parseInt(req.query.treatmentID) || 0, decodedToken.userID);
                res.status(200).json({
                    status: 200,
                    message: "Treatment found",
                    treatments: treatment
                });
            }catch(err){
                res.status(404).json({
                    status: 404,
                    message: err
                });
            }
        })
}

function getPlantTreatment(treatmentID, userID){
    return new Promise(async (resolve, reject) => {
        try{
            const treatment = await prisma.plannedTreatment.findUniqueOrThrow({
                include: {
                    plantationPlant: {
                        include: {
                            plant: true,
                            plantation: true
                        }
                    }
                },
                where: {
                    treatmentID: treatmentID,
                    plantationPlant: {
                        plantation: {
                            userID: userID
                        }
                    }
                }
            });
            resolve(treatment);
        }catch(err){
            if(err.name === 'PrismaClientValidationError') reject('Invalid values');
            else if(err.code === 'P2025') reject('Treatment not found or invalid request values.');
            else reject('Unknown error.');
        }
    });
}