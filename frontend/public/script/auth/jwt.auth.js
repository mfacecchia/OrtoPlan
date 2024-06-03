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
            }
            if(['/login', '/signup'].includes(window.location.pathname)) window.location.pathname = '/user/plantations';
        }catch(err){ }
        return;
    }
    if(!['/login', '/signup'].includes(window.location.pathname)) window.location.pathname = '/login';
}

validateJWT();