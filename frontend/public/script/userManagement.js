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

    updateUserForm.onsubmit = async e => {
        e.preventDefault();
        const newUserFormData = formDataToObject(new FormData(updateUserForm));
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
            if(!res.ok) throw new Error(jsonRes.message);
            displayMessage('User information updated successfully.', 'success');
        }catch(err){
            displayMessage(`Could not update user information. ${err.message}`, 'error');
            return;
        }
        finally{
            updateUserDialog.close();
        }
    }
    updateUserDialog.showModal();
}

function confirmUserRemoval(){
    /*
        * Opens the dialog and checks for submit event to process the DELETE request
    */
    const confirmUserRemovalDialog = document.querySelector('#confirmUserRemoval');
    const confirmRemovalForm = confirmUserRemovalDialog.querySelector('form');
    confirmRemovalForm.onsubmit = async e => {
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
}