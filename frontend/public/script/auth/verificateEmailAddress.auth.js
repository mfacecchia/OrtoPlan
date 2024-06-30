async function requestNewCode(){
    displayMessage('Generating a new verification link. Please wait', 'info');
    try{
        const res = await fetch(`${BACKEND_ADDRESS}/user/verify/generate`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('OPToken')}`
            }
        });
        const jsonRes = await res.json();
        if(!res.ok) throw new Error(jsonRes.message);
        displayMessage(jsonRes.message, 'success');
    }catch(err){
        displayMessage(err instanceof Error? `Could not add generate the verification link. ${err.message}`: `Unknown error while generating the verification link. Please try again.`, 'error');
        return;
    }
}