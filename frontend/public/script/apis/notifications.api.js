async function getNotificationsList(){
    try{
        const res = await fetch(`${BACKEND_ADDRESS}/api/notifications/all`, {
            method: 'GET',
            headers: {
                "Accept": "application/json"
            },
            credentials: 'include'
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
                "Accept": "application/json"
            },
            credentials: 'include'
        });
        const jsonRes = await res.json();
        if(!res.ok) throw new Error(jsonRes.message);
        return jsonRes.treatments;
    }catch(err){
        return false;
    }
}

async function addTreatmentNotification(treatmentData){
    try{
        const res = await fetch(`${BACKEND_ADDRESS}/api/notifications`, {
            method: 'POST',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: `${treatmentData.treatmentType} scheduled for ${treatmentData.plantationName}'s ${treatmentData.plantName} ${treatmentData.dueInDays > 0? `in ${treatmentData.dueInDays} day(s)`: 'today'}.`,
                notificationType: 'treatment',
                notificationIcon: `${treatmentData.treatmentType.toLowerCase()}_green.svg`
            }),
            credentials: 'include'
        });
        const jsonRes = await res.json();
        if(!res.ok) throw new Error(jsonRes.message);
        return jsonRes.notification;
    }catch(err){
        return false;
    }
}