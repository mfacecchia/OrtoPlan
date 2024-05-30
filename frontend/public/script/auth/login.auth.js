document.querySelector('#userLogin').onsubmit = async e => {
    e.preventDefault();
    const user = new FormData(e.target);

    try{
        const res = await fetch(`${BACKEND_ADDRESS}/user/login`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                email: user.get('email'),
                password: user.get('password')
            })
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