async function getNotificationsList(){
    try{
        const res = await fetch(`${BACKEND_ADDRESS}/api/notifications/all`, {
            method: 'GET',
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('OPToken')}`
            }
        });
        const jsonRes = await res.json();
        if(!res.ok) throw new Error(jsonRes.message);
        return jsonRes.treatments;
    }catch(err){
        return false;
    }
}

async function removeAllNotifications(){
    try{
        const res = await fetch(`${BACKEND_ADDRESS}/api/notifications/all`, {
            method: 'DELETE',
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('OPToken')}`
            }
        });
        const jsonRes = await res.json();
        if(!res.ok) throw new Error(jsonRes.message);
        return jsonRes.treatments;
    }catch(err){
        return false;
    }
}