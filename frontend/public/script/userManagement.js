document.onload = getUserName();

async function getUserName(){
    try{
        const res = await fetch(`${BACKEND_ADDRESS}/api/user`, {
            method: 'GET',
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('OPToken')}`
            }
        });
        const jsonRes = await res.json();
        updateDropdownUserName(jsonRes.user);
    }catch(err){
        console.error(err);
    }
}

function updateDropdownUserName(userInfo){
    const userNameSurname = document.querySelectorAll('#userManagementDropdown .dropdown-content [role="definition"] span');
    userNameSurname[0].textContent = userInfo.firstName;
    userNameSurname[1].textContent = userInfo.lastName;
}