async function validateJWT(){
    if(localStorage.getItem('OPToken')){
        try{
            const isTokenValid = await fetch(`${BACKEND_ADDRESS}/user/login`, {
                method: 'POST',
                headers: {
                    authorization: `Bearer ${localStorage.getItem('OPToken')}`
                }
            });
            if(!isTokenValid.ok){
                localStorage.removeItem('OPToken');
                window.location.pathname = '/login';
                return;
            }
            if(['/login', '/signup'].includes(window.location.pathname)) window.location.pathname = '/user/plantations';
        }catch(err){
            displayMessage('Unknown error. Please try again later.', 'error');
            setTimeout(() => {
                window.location.pathname = '/';
            }, 1000);
            return;
        }
        setTimeout(() => {
            removeLoadingScreen();
        }, 500);
        return;
    }
    if(!['/login', '/signup'].includes(window.location.pathname)) window.location.pathname = '/login';
    setTimeout(() => {
        removeLoadingScreen();
    }, 500);
}

validateJWT();