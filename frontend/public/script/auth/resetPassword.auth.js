const resetPasswordForm = document.querySelector('#resetPasswordForm');

resetPasswordForm.onsubmit = async e => {
    e.preventDefault();
    let userData = formDataToObject(new FormData(resetPasswordForm));
    try{
        await validatePasswordReset(userData, true);
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
        displayMessage('Resetting your password. Please wait.', 'info');
        userData.resetToken = resetToken;
        const res = await fetch(`${BACKEND_ADDRESS}/user/reset`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(userData)
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
        setTimeout(() => {
            window.location.href = '/login';
        }, 3000);
    }catch(err){
        displayMessage(`Could not reset account password. ${err.message}`, 'error');
        return
    }
}