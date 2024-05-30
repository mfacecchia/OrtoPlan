document.querySelector('#userSignup').onsubmit = async e => {
    e.preventDefault();
    const newUser = new FormData(e.target);
    const newUserData = {};
    ['firstName', 'lastName', 'email', 'password'].forEach(field => {
        newUserData[field] = newUser.get(field);
    });
    try{
        const res = await fetch(`${BACKEND_ADDRESS}/user/signup`, {
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