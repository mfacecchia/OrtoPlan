document.onload = updateDropdownUserName();


async function updateDropdownUserName(){
    const userInfo = await getUserInfo();
    if(!userInfo) return;
    const userNameSurname = document.querySelectorAll('#userManagementDropdown .dropdown-content [role="definition"] span');
    userNameSurname[0].textContent = userInfo.firstName;
    userNameSurname[1].textContent = userInfo.lastName;
}

async function updateUser(keyPressed = undefined){
    if(keyPressed !== undefined && keyPressed !== 'Enter') return;
    const updateUserDialog = document.querySelector('#updateUser');
    const updateUserForm = updateUserDialog.querySelector('#updateUserForm');
    
    const userInfo = await getUserInfo();
    if(!userInfo){
        updateUserDialog.close();
        displayMessage('Could not gather user information.', 'error');
        return;
    }
    // Compiling the form with the already obtained information from the backend
    updateUserForm.querySelector('[name="firstName"]').value = userInfo.firstName;
    updateUserForm.querySelector('[name="lastName"]').value = userInfo.lastName;
    updateUserForm.querySelector('[name="email"]').value = userInfo.credential[0].email;

    updateUserDialog.onclose = () =>{
        // Setting all password fields to their initial state
        // NOTE: The `i` in `querySelectorAll()` is used for case-insensitive attribute filtering
        updateUserForm.querySelectorAll('.inputStyleContainer:has(input[name*="password" i])').forEach(passwordField => {
            passwordField.querySelector('input').setAttribute('type', 'password');
            passwordField.querySelector('img').setAttribute('src', '/assets/icons/eye.svg');
        });
        clearFormErrorMessages(updateUserForm, true);
        disableDialogFocus(updateUserDialog);
    }
    updateUserForm.onsubmit = async e => {
        e.preventDefault();
        let newUserFormData = formDataToObject(new FormData(updateUserForm));
        try{
            const validationResult = await validateUserUpdate(newUserFormData);
            // Overwriting the Object with the sanitized data version
            newUserFormData = validationResult;
        }catch(err){
            clearFormErrorMessages(updateUserForm, false);
            for(const key of Object.keys(err)){
                // Element to display the error to can be either an input element, and an input container
                const fieldError = updateUserForm.querySelector(`:is(.inputStyleContainer, .inputBoxContainer):has(:is(input, select, textarea)[name="${key}"])`) || updateUserForm.querySelector(`:is(input, select, textarea)[name="${key}"]`);
                showErrorMessage(fieldError, err[key]);
            }
            return;
        }
        try{
            const res = await fetch(`${BACKEND_ADDRESS}/api/user`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify(newUserFormData),
                credentials: 'include'
            });
            const jsonRes = await res.json();
            if(res.status === 403){
                clearFormErrorMessages(updateUserForm, false);
                for(const key of Object.keys(jsonRes.validationErrors)){
                    /*
                        * Element to display the error to can be either an input element, and an input container
                        * NOTE: `.inputBoxContainer` is an alternative class used just for error displaying purposes
                        * in order to place the item exactly below the whole input row
                    */
                    const fieldError = updateUserForm.querySelector(`:is(.inputStyleContainer, .inputBoxContainer):has(:is(input, select, textarea)[name="${key}"])`) || updateUserForm.querySelector(`:is(input, select, textarea)[name="${key}"]`);
                    showErrorMessage(fieldError, jsonRes.validationErrors[key]);
                }
                return;
            }
            if(!res.ok) throw new Error(jsonRes.message);
            if(newUserFormData.password){
                displayMessage(`You're getting redirected to the homepage in 5 seconds.`, 'success');
                localStorage.clear();
                setTimeout(() => {
                    window.location.pathname = '/';
                }, 5000);
            }
        }catch(err){
            updateUserDialog.close();
            displayMessage(`Could not update user information. ${err.message}`, 'error');
            return;
        }
        updateUserDialog.close();
        displayMessage('User information updated successfully.', 'success');
    }
    updateUserDialog.showModal();
    enableDialogFocus(updateUserDialog);
}

function confirmUserRemoval(keyPressed){
    /*
        * Opens the dialog and checks for submit event to process the DELETE request
    */
    if(keyPressed !== undefined && keyPressed !== 'Enter') return;
    const confirmUserRemovalDialog = document.querySelector('#confirmUserRemoval');
    const confirmRemovalForm = confirmUserRemovalDialog.querySelector('form');
    confirmUserRemovalDialog.onclose = () => disableDialogFocus(confirmUserRemovalDialog);
    confirmRemovalForm.onsubmit = async e => {
        e.preventDefault();
        try{
            const res = await fetch(`${BACKEND_ADDRESS}/api/user`, {
                method: 'DELETE',
                headers: {
                    "Accept": "application/json",
                },
                credentials: 'include'
            });
            const jsonRes = await res.json();
            if(!res.ok) throw new Error(jsonRes.message);
            confirmUserRemovalDialog.close();
            displayMessage(`${jsonRes.message}. You're getting redirected to the homepage in 5 seconds.`, 'success');
            localStorage.clear();
            setTimeout(() => {
                window.location.pathname = '/';
            }, 5000);
        }catch(err){
            confirmUserRemovalDialog.close();
            displayMessage(`Could not complete the request. ${err.message}`, 'error');
        }
    }
    confirmUserRemovalDialog.showModal();
    enableDialogFocus(confirmUserRemovalDialog);
}

async function checkEmailVerification(updateLocalStorage = true){
    const user = await getUserInfo();
    isEmailVerified = user.credential[0].verified;
    if(!isEmailVerified) document.querySelector('#notVerifiedNotice').style.display = 'block';
    if(updateLocalStorage) updateUserSettings({verified: isEmailVerified});
}

function updateUserSettings(options){
    /*
        * Updates the user settings located in user's LocalStorage
        * from a given `options` parameter (MUST be an Object)
    */
    for(const key of Object.keys(options)){
        USER_SETTINGS[key] = options[key];
    }
    localStorage.setItem('OPUserSettings', JSON.stringify(USER_SETTINGS));
}