async function validateForm(formData, isLogin = true){
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
    try{
        await validate.async({...formData}, {...fieldsValidations});
        return true;
    }catch(validationErrors){
        console.log(validationErrors);
        // TODO: Display error messages below the corresponding form's textbox
        displayMessage('Error while validating form. Please try again.', 'error');
        return false;
    }
}