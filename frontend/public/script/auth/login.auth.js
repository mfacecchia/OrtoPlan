document.querySelector('#userLogin').onsubmit = async e => {
    e.preventDefault();
    const user = new FormData(e.target);
    const userData = {};
    // TODO: Improve this by placing it in an external function
    ['email', 'password'].forEach(field => {
        userData[field] = user.get(field);
    });
    if(!await validateForm(userData, true)) return;

    try{
        const res = await fetch(`${BACKEND_ADDRESS}/user/login`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(userData)
        });
        if(res.status === 404){
            displayMessage('Email/password combination is not correct. Please try again.', 'error');
            return;
        }
        const jsonRes = await res.json();
        localStorage.setItem('OPToken', jsonRes.token);
        window.location.href = '/user/plantations';
    }catch(err){
        displayMessage('Unknown error. Please try again.', 'error');
    }
}