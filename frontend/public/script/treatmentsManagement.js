/*
    * NOTE: Variable used to determine if the user wants to update the form's data
    * (since the default behaviour will be to call the submit function) automatically once clicked the "Edit button", this variable increments its value in order
    * to determine how many times the "edit" button has been clicked by the user (value `2` times means edited and then submit new changes)
*/
let editButtonClicksCount = 0;

function addTreatmentButtonEvents(form){
    const treatmentID = form.getAttribute('data-treatment-id');
    form.querySelector('button[data-btn-action="Remove"]').addEventListener('click', e => {
        if(editButtonClicksCount){
            editButtonClicksCount = 0;
            resetTreatmentsList(form);
            return
        }
        e.target.parentNode.setAttribute('type', 'button')
        confirmRemoval(treatmentID, 'treatment');
    });
    form.querySelector('button[data-btn-action="Edit"]').addEventListener('click', e => {
        editButtonClicksCount++;
        const treatmentID = form.getAttribute('data-treatment-id');
        const formFields = form.querySelectorAll('input, textarea, select');
        const resetTreatmentButton = form.querySelector('button[data-btn-action="Remove"]');
        // Giving the user the possibility of editing the selected treatment
        formFields.forEach(field => {
            field.removeAttribute('disabled');
        });
        // FIXME: Updating image only if target is button and not children `img` element
        // Setting buttons's icons
        e.target.src = "/assets/icons/check.svg";
        resetTreatmentButton.childNodes[0].src = "/assets/icons/cancel.svg";
        resetTreatmentButton.setAttribute('type', 'reset');
        // Getting all the other forms and disabling the buttons
        form.parentNode.querySelectorAll(`form:not([data-treatment-id="${treatmentID}"], [method="dialog"], .hidden)`).forEach(treatmentForm => {
            treatmentForm.querySelectorAll('button').forEach(button => button.setAttribute('disabled', undefined));
        });
        document.querySelector('#newTreatment').setAttribute('disabled', undefined);

        editButtonClicksCount >= 2? updateTreatmentInfo(e, form, treatmentID): editButtonClicksCount++;
    });
    /*
        * Managing form submit if the user press enter as well other than `button[data-btn-action="Edit"]` button click
        * (same behavior as form submit in this case)
    */
    form.addEventListener('submit', e => {
        updateTreatmentInfo(e, form, treatmentID)
    });
}

async function updateTreatmentInfo(e, form, treatmentID){
    e.preventDefault();
    editButtonClicksCount = 0;
    const updatedTreatmentFormData = formDataToObject(new FormData(form));
    updatedTreatmentFormData.treatmentID = treatmentID;
    try{
        const res = await fetch(`${BACKEND_ADDRESS}/api/treatments`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('OPToken')}`
            },
            body: JSON.stringify(updatedTreatmentFormData)
        });
        const jsonRes = await res.json();
        if(!res.ok) throw new Error(jsonRes.message);
        /*
            * Updating form with the latest treatment updates to avoid form reset to default information
            * in case of further form update and reset
        */
        setFormData(form, jsonRes.treatment);
        displayMessage(jsonRes.message, 'success');
    }catch(err){
        displayMessage(`Unknown error while updating the treatment. ${err.message}`, 'error');
        return;
    }
    // Resetting the buttons' default attributes and icons
    resetTreatmentsList(form);
}

function resetTreatmentsList(form){
    const resetTreatmentButton = form.querySelector('button[data-btn-action="Remove"]');
    const submitTreatmentButton = form.querySelector('button[data-btn-action="Edit"]');
    resetTreatmentButton.childNodes[0].src = "/assets/icons/erase.svg";
    submitTreatmentButton.setAttribute('type', 'button');
    submitTreatmentButton.childNodes[0].src = "/assets/icons/edit.svg";
    const formFields = form.querySelectorAll('input, textarea, select');
    // Disabling all fields and re-enabling edit and remove buttons
    formFields.forEach(field => {
        field.setAttribute('disabled', undefined);
    });
    form.parentNode.querySelectorAll(`form:not([method="dialog"])`).forEach(treatmentForm => {
        treatmentForm.querySelectorAll('button').forEach(button => button.removeAttribute('disabled'));
    });
    document.querySelector('#newTreatment').removeAttribute('disabled');
}

async function getPlantTreatments(plantID){
    const treatmentsModal = document.querySelector('#treatments');
    // Obtaining data from the API
    const treatmentsData = await makeTreatmentsRequest(plantID);
    if(!Array.isArray(treatmentsData)){
        // In this case `treatmentsData` is a `typeof string`, and it will represent an error message received from the `fetch` operation
        displayMessage(`Could not retrieve treatments data. ${treatmentsData}`, 'error');
        treatmentsModal.close();
        return;
    }
    // Obtaining all elements useful for treatments data management
    const formsContainer = treatmentsModal.querySelector('.modal-box');
    const treatmentFormTempate = treatmentsModal.querySelector('.treatmentForm').cloneNode(true);
    let separatorsList = formsContainer.querySelectorAll('hr:not(.green-line)');

    treatmentsModal.querySelector('#newTreatment').onclick = e => newTreatment(plantID);
    treatmentFormTempate.classList.remove('hidden');
    
    // Removing all the forms from the dialog in case it gets closed (e.g. setting it back to its initial state)
    treatmentsModal.onclose = (e) => {
        setTabIndexToMinusOne(treatmentsModal);
        // Resetting the edit button clicks count global variable to its initial state
        editButtonClicksCount = 0;
        // Updating the separators count to assert that all the separators get actually removed
        separatorsList = formsContainer.querySelectorAll('hr:not(.green-line)');
        try{
            formsContainer.querySelector('.noTreatmentsNotice').remove();
        }catch(err){};
        formsContainer.querySelectorAll('.treatmentForm:not(.hidden)').forEach(form => {
            form.remove();
        });
        for(let i = 0; i < separatorsList.length; i++){
            separatorsList[i].remove();
        }
    }
    // Removing the 1st separator in the list before adding all the forms to prevent separators to be one on top of the other
    try{
        separatorsList[0].remove();
    }catch(err){};
    if(treatmentsData.length){
        treatmentsData.forEach(treatment => {
            const finalFormData = setFormData(treatmentFormTempate.cloneNode(true), treatment);
            const treatmentForm = insertTreatmentInList(formsContainer, finalFormData);
            addTreatmentButtonEvents(treatmentForm[0]);
        });
    }
    else showNotice();
    treatmentsModal.showModal();
    setTabIndexToZero(treatmentsModal);
}

function newTreatment(plantID){
    const newTreatmentDialog = document.querySelector('#newTreatment');
    const newTreatmentForm = document.querySelector('#newTreatmentForm');
    newTreatmentDialog.querySelector('header span').textContent = document.querySelector(`[data-plant-id="${plantID}"] [role="definition"]`).textContent;
    newTreatmentDialog.querySelector('input[type="date"]').setAttribute('value', moment.utc().format('YYYY-MM-DD'));
    
    newTreatmentDialog.onclose = e => {
        setTabIndexToMinusOne(newTreatmentDialog);
        newTreatmentForm.onsubmit = undefined;
        newTreatmentForm.reset();
    };
    newTreatmentForm.onsubmit = async e => {
        e.preventDefault();
        const newTreatmentFormData = formDataToObject(new FormData(newTreatmentForm));
        newTreatmentFormData.plantationPlantID = plantID;
        try{
            const res = await fetch(`${BACKEND_ADDRESS}/api/treatments`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('OPToken')}`
                },
                body: JSON.stringify(newTreatmentFormData)
            });
            const jsonRes = await res.json();
            if(!res.ok) throw new Error(jsonRes.message);
            addToList(jsonRes.treatment);
        }catch(err){
            displayMessage(`Unknown error while planning the treatment. ${err.message}`, 'error');
            return;
        }
        finally{
            newTreatmentDialog.close();
        }
        displayMessage('Treatment successfully planned.', 'success');
    }
    newTreatmentDialog.showModal();
    setTabIndexToZero(newTreatmentDialog);
}

async function makeTreatmentsRequest(plantID){
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

function insertTreatmentInList(formsContainer, treatmentForm){
    /*
        * Inserting the treatment form as well as a simple divider (`<hr>` element) in the forms container (`formsContainer`)
        * Returns an Array with the newly added elements
    */
    const elementsAdded = [];
    elementsAdded.push(formsContainer.insertBefore(treatmentForm, formsContainer.querySelector('[role="definition"]').nextSibling));
    elementsAdded.push(formsContainer.insertBefore(document.createElement('hr'), elementsAdded[0].nextSibling));
    return elementsAdded;
}

function setFormData(form, treatmentData){
    form.setAttribute('data-treatment-id', treatmentData.treatmentID);
    form.querySelector(`select[name="treatmentType"] [value="${treatmentData.treatmentType}"]`).setAttribute('selected', '');
    treatmentData.treatmentDate = moment(treatmentData.treatmentDate).format("YYYY-MM-DD");
    ["treatmentDate", "treatmentRecurrence"].forEach(field => {
        form.querySelector(`[name="${field}"]`).setAttribute('value', treatmentData[field]);
    });
    // `notes` input field is a `textarea` so setting its `textContent` instead of `value`
    const notesTextarea = form.querySelector('[name="notes"]');
    if(treatmentData.notes === '') notesTextarea.placeholder = 'No notes available'
    else notesTextarea.textContent = treatmentData.notes;
    return form;
}

function addToList(treatmentData){
    /*
        * Takes all the necessary treatment's data and creates a new element to append to the treatments's list
    */
    const treatmentForm = document.querySelector('.treatmentForm');
    const formsContainer = treatmentForm.parentNode;
    const newTreatmentForm = setFormData(treatmentForm.cloneNode(true), treatmentData);
    newTreatmentForm.classList.remove('hidden');
    addTreatmentButtonEvents(newTreatmentForm);
    removeNotice(formsContainer);
    insertTreatmentInList(formsContainer, newTreatmentForm);
}

function removeNotice(formsContainer){
    try{
        const noTreatmentsNotice = formsContainer.querySelector('.noTreatmentsNotice');
        formsContainer.querySelector('.noTreatmentsNotice + hr').remove();
        noTreatmentsNotice.remove();
    }catch(err){};
}

function showNotice(){
    /*
        * Shows a notice in case there are no treatments for the selected plant
    */
    const formParentNode = document.querySelector('.treatmentForm').parentNode;
    const noTreatmentsNotice = document.createElement('p');
    noTreatmentsNotice.textContent = 'No treatments for this plant.';
    noTreatmentsNotice.classList.add('noTreatmentsNotice');
    insertTreatmentInList(formParentNode, noTreatmentsNotice);
}