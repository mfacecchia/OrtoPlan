const userLoginForm = document.querySelector('#userLogin');

userLoginForm.onsubmit = async e => {
    e.preventDefault();
    let userData = formDataToObject(new FormData(userLoginForm));
    try{
        const validationResult = await validateLoginSignup(userData, true);
        // Overwriting the Object with the sanitized data version
        userData = validationResult;
    }catch(err){
        clearFormErrorMessages(userLoginForm, false);
        for(const key of Object.keys(err)){
            // Element to display the error to can be either an input element, and an input container
            const fieldError = userLoginForm.querySelector(`:is(.inputStyleContainer, .inputBoxContainer):has(:is(input, select, textarea)[name="${key}"])`) || userLoginForm.querySelector(`:is(input, select, textarea)[name="${key}"]`);
            showErrorMessage(fieldError, err[key]);
        }
        return;
    }
    try{
        const res = await fetch(`${BACKEND_ADDRESS}/user/login`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(userData)
        });
        clearFormErrorMessages(userLoginForm, false);
        if(res.status === 404){
            displayMessage('Email/password combination is not correct. Please try again.', 'error');
            return;
        }
        const jsonRes = await res.json();
        // Backend validation not passed
        if(res.status === 403){
            for(const key of Object.keys(jsonRes.validationErrors)){
                /*
                    * Element to display the error to can be either an input element, and an input container
                    * NOTE: `.inputBoxContainer` is an alternative class used just for error displaying purposes
                    * in order to place the item exactly below the whole input row
                */
                const fieldError = userLoginForm.querySelector(`:is(.inputStyleContainer, .inputBoxContainer):has(:is(input, select, textarea)[name="${key}"])`) || userLoginForm.querySelector(`:is(input, select, textarea)[name="${key}"]`);
                showErrorMessage(fieldError, jsonRes.validationErrors[key]);
            }
            return;
        }
        localStorage.setItem('OPToken', jsonRes.token);
        window.location.href = '/user/plantations';
    }catch(err){
        displayMessage('Unknown error. Please try again.', 'error');
    }
}