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

function getUpcomingTreatments(treatmentsList){
    /*
        * Filters all plant's treatments and returns the most upcoming ones (7 days from current date)
    */
    const upcomingTreatments = [];
    treatmentsList.forEach(treatment => {
        const dueInDays = moment.utc(treatment.treatmentDate).diff(moment.utc(), 'days');
        if(dueInDays >= 0 && dueInDays <= 7){
            upcomingTreatments.push({
                plantationName: treatment.plantationPlant.plantation.plantationName,
                plantName: treatment.plantationPlant.plant.plantName,
                treatmentType: treatment.plantationPlant.treatmentType,
                dueInDays: dueInDays
            });
        }
    });
    return upcomingTreatments;
}