async function validateJWT(){
    try{
        const isTokenValid = await fetch(`${BACKEND_ADDRESS}/user/login`, {
            method: 'POST',
            credentials: 'include'
        });
        console.log(isTokenValid);
        if(!isTokenValid.ok){
            if(!['/login', '/signup'].includes(window.location.pathname)) window.location.pathname = '/login';
            setTimeout(() => {
                removeLoadingScreen();
            }, 500);
            return;
        }
    }catch(err){
        displayMessage('Unknown error. Please try again later.', 'error');
        setTimeout(() => {
            window.location.pathname = '/';
        }, 1000);
        return;
    }
    // Valid JWT
    if(['/login', '/signup'].includes(window.location.pathname)) window.location.pathname = '/user/plantations';
    setTimeout(() => {
        removeLoadingScreen();
    }, 500);
    return;
}

validateJWT();