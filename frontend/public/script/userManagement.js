document.onload = updateDropdownUserName();


async function updateDropdownUserName(){
    const userInfo = await getUserInfo();
    if(!userInfo) return;
    const userNameSurname = document.querySelectorAll('#userManagementDropdown .dropdown-content [role="definition"] span');
    userNameSurname[0].textContent = userInfo.firstName;
    userNameSurname[1].textContent = userInfo.lastName;
}

async function updateUser(){
    const updateUserDialog = document.querySelector('#updateUser');
    const updateUserForm = updateUserDialog.querySelector('#updateUserForm');
    
    const userInfo = await getUserInfo();
    if(!userInfo){
        displayMessage('Could not gather user information.', 'error');
        updateUserDialog.close();
        return;
    }
    // Compiling the form with the already obtained information from the backend
    updateUserForm.querySelector('[name="firstName"]').value = userInfo.firstName;
    updateUserForm.querySelector('[name="lastName"]').value = userInfo.lastName;
    updateUserForm.querySelector('[name="email"]').value = userInfo.credential[0].email;

    updateUserDialog.onclose = () =>{
        clearFormErrorMessages(updateUserForm, true);
        setTabIndexToMinusOne(updateUserDialog);
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
                    "Authorization": `Bearer ${localStorage.getItem('OPToken')}`
                },
                body: JSON.stringify(newUserFormData)
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
        }catch(err){
            displayMessage(`Could not update user information. ${err.message}`, 'error');
            updateUserDialog.close();
            return;
        }
        displayMessage('User information updated successfully.', 'success');
        updateUserDialog.close();
    }
    updateUserDialog.showModal();
    setTabIndexToZero(updateUserDialog);
}

function confirmUserRemoval(){
    /*
        * Opens the dialog and checks for submit event to process the DELETE request
    */
    const confirmUserRemovalDialog = document.querySelector('#confirmUserRemoval');
    const confirmRemovalForm = confirmUserRemovalDialog.querySelector('form');
    confirmUserRemovalDialog.onclose = () => setTabIndexToMinusOne(confirmUserRemovalDialog);
    confirmRemovalForm.onsubmit = async e => {
        e.preventDefault();
        try{
            const res = await fetch(`${BACKEND_ADDRESS}/api/user`, {
                method: 'DELETE',
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('OPToken')}`
                }
            });
            const jsonRes = await res.json();
            if(!res.ok) throw new Error(jsonRes.message);
            displayMessage(`${jsonRes.message}. You're getting redirected to the homepage in 3 seconds.`, 'success');
            setTimeout(() => {
                logout();
            }, 3000);
        }catch(err){
            displayMessage(`Could not complete the request. ${err.message}`, 'error');
        }
    }
    confirmUserRemovalDialog.showModal();
    setTabIndexToZero(confirmUserRemovalDialog);
}