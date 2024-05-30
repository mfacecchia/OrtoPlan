async function validateJWT(){
    if(localStorage.getItem('OPToken')){
        const isTokenValid = await fetch(`${BACKEND_ADDRESS}/user/login`, {
            method: 'POST',
            headers: {
                authorization: `Bearer ${localStorage.getItem('OPToken')}`
            }
        });
        if(isTokenValid.ok) window.location.href = '/user/plantations';
    }
}