async function getUserInfo(){
    try{
        const res = await fetch(`${BACKEND_ADDRESS}/api/user`, {
            method: 'GET',
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('OPToken')}`
            }
        });
        const jsonRes = await res.json();
        if(!res.ok) return false
        return jsonRes.user;
    }catch(err){
        return false;
    }
}