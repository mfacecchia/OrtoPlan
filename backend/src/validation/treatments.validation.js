import validate from 'validate.js';
import { defaultPresenceValidator } from './customDefaultValidators.validation.js';
import moment from 'moment';


export function validateTreatment(){
    return async (req, res, next) => {
        const validators = {
            treatmentType: {
                ...defaultPresenceValidator,
                inclusion: {
                    within: ['Irrigation', 'Sowing', 'Pruning', 'Fertilization'],
                    message: '^Must be \'Irrigation\', \'Sowing\', \'Pruning\', or \'Fertilization\''
                }
            },
            notes: {
                length: {
                    maximum: 300,
                    tooLong: '^Too long (maximum length is %{count} characters).'
                }
            },
            treatmentDate: {
                ...defaultPresenceValidator,
                datetime: {
                    earliest: moment.utc().subtract(1, 'days'),
                    tooEarly: '^Planned date must be today or later'
                }
            },
            treatmentRecurrence: {
                ...defaultPresenceValidator,
                numericality: {
                    greaterThanOrEqualTo: 0,
                    onlyInteger: true,
                    notInteger: '^Must be an integer',
                    notGreaterThanOrEqualTo: '^Must be equal or greater than 0'
                }
            }
        };
        validate.extend(validate.validators.datetime, {
            // Parsing date for validation
            parse: value => {
                return +moment.utc(value, true)
            },
            // Parsing date to display in the message in case of validation errors
            format: value => {
                return moment(value).format('YYYY-MM-DD');
            }
        });
        try{
            await validate.async(req.body, validators);
            req.body.treatmentID = parseInt(req.body.treatmentID) || 0;
            req.body.plantationPlantID = parseInt(req.body.plantationPlantID) || 0;
            req.body.treatmentRecurrence = parseInt(req.body.treatmentRecurrence) || 0;
            req.body.treatmentDate = moment(req.body.treatmentDate, true)
            next();
        }catch(validationErrors){
            res.status(403).json({
                status: 403,
                message: 'Invalid values. Please try again.',
                validationErrors: validationErrors
            });
        };
    };
}