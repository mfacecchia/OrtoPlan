async function getPlantationInfo(plantationID){
    const res = await fetch(`${BACKEND_ADDRESS}/api/plantations`, {
        method: 'POST',
        headers: {
            "Authorization": `Bearer ${localStorage.getItem('OPToken')}`,
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            "plantationID": plantationID
        })
    });
    if(!res.ok){
        return false;
    }
    const plantationData = await res.json();
    return plantationData;
}