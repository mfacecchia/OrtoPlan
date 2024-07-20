const resetPasswordForm = document.querySelector('#resetPasswordForm');

resetPasswordForm.onsubmit = async e => {
    e.preventDefault();
    let userData = formDataToObject(new FormData(resetPasswordForm));
    try{
        await validatePasswordResetEmailInput(userData);
    }catch(err){
        clearFormErrorMessages(resetPasswordForm, false);
        for(const key of Object.keys(err)){
            // Element to display the error to can be either an input element, and an input container
            const fieldError = resetPasswordForm.querySelector(`:is(.inputStyleContainer, .inputBoxContainer):has(:is(input, select, textarea)[name="${key}"])`) || resetPasswordForm.querySelector(`:is(input, select, textarea)[name="${key}"]`);
            showErrorMessage(fieldError, err[key]);
        }
        return;
    }
    try{
        displayMessage('Generating password reset link. Please wait.', 'info');
        const res = await fetch(`${BACKEND_ADDRESS}/user/reset/generate`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(userData),
            credentials: 'include'
        });
        clearFormErrorMessages(resetPasswordForm, false);
        const jsonRes = await res.json();
        // Backend validation not passed
        if(res.status === 403 && jsonRes.validationErrors){
            for(const key of Object.keys(jsonRes.validationErrors)){
                /*
                    * Element to display the error to can be either an input element, and an input container
                    * NOTE: `.inputBoxContainer` is an alternative class used just for error displaying purposes
                    * in order to place the item exactly below the whole input row
                */
                const fieldError = resetPasswordForm.querySelector(`:is(.inputStyleContainer, .inputBoxContainer):has(:is(input, select, textarea)[name="${key}"])`) || resetPasswordForm.querySelector(`:is(input, select, textarea)[name="${key}"]`);
                showErrorMessage(fieldError, jsonRes.validationErrors[key]);
            }
            return;
        }
        else if(!res.ok) throw new Error(jsonRes.message);
        localStorage.clear();
        displayMessage(jsonRes.message, 'success');
    }catch(err){
        displayMessage(`Could not generate password reset link. ${err.message}`, 'error');
        return
    }
}

async function requestNewCode(userEmail){
    displayMessage('Generating a new password reset link. Please wait', 'info');
    try{
        const res = await fetch(`${BACKEND_ADDRESS}/user/reset/generate`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.parse({email: userEmail}),
            credentials: 'include'
        });
        const jsonRes = await res.json();
        if(!res.ok) throw new Error(jsonRes.message);
        displayMessage(jsonRes.message, 'success');
    }catch(err){
        displayMessage(err instanceof Error? `Could not generate the verification link. ${err.message}`: `Unknown error while generating the verification link. Please try again.`, 'error');
        return;
    }
}