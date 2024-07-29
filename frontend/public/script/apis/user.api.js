async function getUserInfo(){
    try{
        const res = await fetch(`${BACKEND_ADDRESS}/api/user`, {
            method: 'GET',
            headers: {
                "Accept": "application/json",
            },
            credentials: 'include'
        });
        const jsonRes = await res.json();
        if(!res.ok) return false
        return jsonRes.user;
    }catch(err){
        return false;
    }
}