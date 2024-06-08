function validateTreatment(treatmentData){
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
    return new Promise(async (resolve, reject) => {
        try{
            await validate.async(treatmentData, validators);
            // Sanitizing the input and passing it to the corresponding `req.body` Object key
            treatmentData.treatmentRecurrence = parseInt(treatmentData.treatmentRecurrence) || 0;
            treatmentData.treatmentDate = moment(treatmentData.treatmentDate, true)
            resolve(treatmentData);
        }catch(validationErrors){
            reject(validationErrors);
        }
    });
}