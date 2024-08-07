function validateLoginSignup(formData, isLogin = true){
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
            if(!isLogin){
                formData.email = formData.email.toLowerCase();
                formData.firstName = validate.capitalize(formData.firstName.trim());
                formData.lastName = validate.capitalize(formData.lastName.trim());
            }
            resolve(formData);
        }catch(validationErrors){
            reject(validationErrors);
        }
    });
}

function validateUserUpdate(formData){
    const validators = {};
    if(formData.firstName){
        validators.firstName = {
            ...defaultPresenceValidator,
            ...defaultMaxLength
        };
    }
    if(formData.lastName){
        validators.lastName = {
            ...defaultPresenceValidator,
            ...defaultMaxLength
        };
    }
    if(formData.email){
        validators.email = {
            ...defaultPresenceValidator,
            ...defaultMaxLength,
            email: true
        };
    }
    if(formData.password){
        validators.oldPassword = {
            ...defaultPresenceValidator
        };
        validators.password = {
            ...defaultPresenceValidator,
            length: {
                minimum: 15,
                tooShort: '^Too short (minimum length is %{count} characters).'
            }
        };
        validators.passwordVerify = {
            ...defaultPresenceValidator,
            equality: {
                attribute: 'password',
                message: '^Passwords do not match'
            }
        };
    };
    validate.validators.email.message = '^Not a valid email';
    return new Promise(async (resolve, reject) => {
        try{
            await validate.async(formData, validators);
            if(formData.email) formData.email = formData.email.toLowerCase();
            if(formData.firstName) formData.firstName = validate.capitalize(formData.firstName.trim());
            if(formData.lastName) formData.lastName = validate.capitalize(formData.lastName.trim());
            resolve(formData);
        }catch(validationErrors){
            reject(validationErrors);
        }
    });
}