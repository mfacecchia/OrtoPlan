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