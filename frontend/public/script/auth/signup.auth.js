const userSignupForm = document.querySelector('#userSignup');

userSignupForm.onsubmit = async e => {
    e.preventDefault();
    let newUserData = formDataToObject(new FormData(userSignupForm));
    try{
        const validationResult = await validateLoginSignup(newUserData, false);
        // Overwriting the Object with the sanitized data version
        newUserData = validationResult;
    }catch(err){
        clearFormErrorMessages(userSignupForm, false);
        for(const key of Object.keys(err)){
            // Element to display the error to can be either an input element, and an input container
            const fieldError = userSignupForm.querySelector(`:is(.inputStyleContainer, .inputBoxContainer, .join):has(:is(input, select, textarea)[name="${key}"])`) || userSignupForm.querySelector(`:is(input, select, textarea)[name="${key}"]`);
            showErrorMessage(fieldError, err[key]);
        }
        return;
    }
    displayMessage('Signing you up. Please wait.', 'info');
    try{
        const res = await fetch(`${BACKEND_ADDRESS}/user/signup`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(newUserData)
        });
        const jsonRes = await res.json();
        if(res.status === 403){
            clearFormErrorMessages(userSignupForm, false);
            for(const key of Object.keys(jsonRes.validationErrors)){
                /*
                    * Element to display the error to can be either an input element, and an input container
                    * NOTE: `.inputBoxContainer` is an alternative class used just for error displaying purposes
                    * in order to place the item exactly below the whole input row
                */
                const fieldError = userSignupForm.querySelector(`:is(.inputStyleContainer, .inputBoxContainer, .join):has(:is(input, select, textarea)[name="${key}"])`) || userSignupForm.querySelector(`:is(input, select, textarea)[name="${key}"]`);
                showErrorMessage(fieldError, jsonRes.validationErrors[key]);
            }
            return;
        }
        if(jsonRes.status !== 201) throw new Error(jsonRes.message)
        else window.location.pathname = '/login';
    }catch(err){
        displayMessage(err.message, 'error');
    }
}