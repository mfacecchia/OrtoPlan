document.onload = updateDropdownUserName();


async function updateDropdownUserName(){
    const userInfo = await getUserInfo();
    if(!userInfo) return;
    const userNameSurname = document.querySelectorAll('#userManagementDropdown .dropdown-content [role="definition"] span');
    userNameSurname[0].textContent = userInfo.firstName;
    userNameSurname[1].textContent = userInfo.lastName;
}