async function logout(){
    displayMessage('Logging out. Please wait', 'info');
    try{
        const res = await fetch(`${BACKEND_ADDRESS}/user/logout`, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('OPToken')}`
            }
        });
        if(!res.ok){
            const jsonRes = await res.json();
            throw new Error(jsonRes.message);
        }
    }catch(err){
        displayMessage(`Error while logging out. ${err.message}`, 'error');
        return;
    }
    displayMessage('Logged out successfully. You will be redirected to the homepage in 5 seconds.', 'success');
    localStorage.clear();
    setTimeout(() => {
        window.location.pathname = '/';
    }, 5000);
}