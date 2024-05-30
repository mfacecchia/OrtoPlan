async function validateForm(formData, isLogin = true){
    // Default validator for empty values, defined to simplify code readability
    const defaultPresenceValidator = { presence: { allowEmpty: false } };
    const fieldsValidations = {
        email: {
            ...defaultPresenceValidator,
            email: true
        },
        password: {
            ...defaultPresenceValidator,
            length: {
                minimum: 15,
                tooShort: '^Too short (minimum length is %{count} characters).'
            }
        }
    };
    // Additional validators in case of user sign-up
    if(!isLogin){
        fieldsValidations.firstName = {
            ...defaultPresenceValidator,
            length: {
                maximum: 191,
                tooLong: '^Too long (max length is %{count} characters).'
            },
        };
        fieldsValidations.lastName = fieldsValidations.firstName
    }
    validate.validators.email.message = '^Not a valid email';    
    try{
        await validate.async({...formData}, {...fieldsValidations});
        return true;
    }catch(validationErrors){
        console.log(validationErrors);
        displayMessage('Error while validating form. Please try again.', 'error');
        return false;
    }
}