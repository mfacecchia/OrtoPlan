async function validateLoginSignup(formData, isLogin = true){
    // Default validator for empty values, defined to simplify code readability
    const defaultPresenceValidator = { presence: { allowEmpty: false } };
    const fieldsValidations = {
        email: {
            ...defaultPresenceValidator,
            email: true
        },
        password: {
            ...defaultPresenceValidator
        }
    };
    // Additional validators in case of user sign-up
    if(!isLogin){
        fieldsValidations.password.length = {
            minimum: 15,
            tooShort: '^Too short (minimum length is %{count} characters).'
        }
        fieldsValidations.firstName = {
            ...defaultPresenceValidator,
            length: {
                maximum: 191,
                tooLong: '^Too long (max length is %{count} characters).'
            },
        };
        fieldsValidations.lastName = fieldsValidations.firstName;
        fieldsValidations.passwordVerify = {
            ...defaultPresenceValidator,
            equality: {
                attribute: 'password',
                message: '^Passwords do not match'
            }
        };
    }
    validate.validators.email.message = '^Not a valid email';    
    return new Promise(async (resolve, reject) => {
        try{
            await validate.async({...formData}, {...fieldsValidations});
            formData.email = formData.email.trim().toLowerCase();
            resolve(formData);
        }catch(validationErrors){
            reject(validationErrors);
        }
    })
}