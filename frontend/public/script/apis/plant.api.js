async function getPlantInfo(plantID){
    const res = await fetch(`${BACKEND_ADDRESS}/api/plants?plantID=${plantID}`, {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${localStorage.getItem('OPToken')}`,
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    });
    if(!res.ok){
        return false;
    }
    const plantData = await res.json();
    return plantData;
}