async function getPlantInfo(plantID){
    const res = await fetch(`${BACKEND_ADDRESS}/api/plants?plantID=${plantID}`, {
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
    const plantData = await res.json();
    return plantData;
}