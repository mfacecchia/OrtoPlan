async function getPlantationInfo(plantationID){
    const res = await fetch(`${BACKEND_ADDRESS}/api/plantations?plantationID=${plantationID}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        credentials: 'include'
    });
    if(!res.ok){
        return false;
    }
    const plantationData = await res.json();
    return plantationData;
}