import * as constants from '../constants.js'

document.querySelector('#userSignup').onsubmit = async e => {
    e.preventDefault();
    const newUser = new FormData(e.target);
    const newUserData = formDataToObject(newUser);
    if(!await validateForm(newUserData, false)) return;
    try{
        const res = await fetch(`${constants.BACKEND_ADDRESS}/user/signup`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(newUserData)
        });
        const jsonRes = await res.json();
        if(jsonRes.status !== 201) displayMessage(jsonRes.message, 'error')
        else window.location.pathname = '/login';
    }catch(err){
        displayMessage('Unknown error. Please try again later.', 'error');
    }
}