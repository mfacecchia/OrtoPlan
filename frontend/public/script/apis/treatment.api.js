async function getTreatmentsList(plantID = undefined){
    try{
        const res = await fetch(`${BACKEND_ADDRESS}/api/treatments/all?plantationPlantID=${plantID}`, {
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
        return err.message;
    }
}