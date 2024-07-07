function validatePasswordReset(formData){
    const validators = {
        password: {
            ...defaultPresenceValidator
        },
        passwordVerify: {
            ...defaultPresenceValidator,
            equality: {
                attribute: 'password',
                message: '^Passwords do not match'
            }
        }
    };
    return new Promise(async (resolve, reject) => {
        try{
            await validate.async(formData, validators);
            resolve(formData);
        }catch(validationErrors){
            reject(validationErrors);
        }
    });
}

function validatePasswordResetEmailInput(formData){
    const validators = {
        email: {
            ...defaultPresenceValidator,
            email: true
        }
    };
    validate.validators.email.message = '^Not a valid email';    
    return new Promise(async (resolve, reject) => {
        try{
            await validate.async(formData, validators);
            formData.email = formData.email.toLowerCase();
            resolve(formData);
        }catch(validationErrors){
            reject(validationErrors);
        }
    });
}