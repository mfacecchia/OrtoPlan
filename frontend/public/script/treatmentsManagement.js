/*
    * NOTE: Variable used to determine if the user wants to update the form's data
    * (since the default behaviour will be to call the submit function) automatically once clicked the "Edit button", this variable increments its value in order
    * to determine how many times the "edit" button has been clicked by the user (value `2` times means edited and then submit new changes)
*/
let editButtonClicksCount = 0;

document.querySelectorAll('.treatmentForm').forEach(form => {
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
        const formFields = form.querySelectorAll('input, textarea');
        const resetTreatmentButton = form.querySelector('button[data-btn-action="Remove"]');
        // Giving the user the possibility of editing the selected treatment
        formFields.forEach(field => {
            field.removeAttribute('disabled');
        });
        // Setting buttons's icons
        e.target.src = "/assets/icons/check.svg";
        resetTreatmentButton.childNodes[0].src = "/assets/icons/cancel.svg";
        resetTreatmentButton.setAttribute('type', 'reset');
        // Getting all the other forms and disabling the buttons
        form.parentNode.querySelectorAll(`form:not([data-treatment-id="${treatmentID}"], [method="dialog"])`).forEach(treatmentForm => {
            treatmentForm.querySelectorAll('button').forEach(button => button.setAttribute('disabled', undefined));
        });
        document.querySelector('#newTreatment').setAttribute('disabled', undefined);

        formFields[0].focus();
        editButtonClicksCount >= 2? updateTreatmentInfo(e, form): editButtonClicksCount++;
    });
});

function updateTreatmentInfo(e, form){
    e.preventDefault();
    editButtonClicksCount = 0;
    // TODO: Update database information
    // NOTE: If response from server is `200 OK`, then all the form's fields default values must be updated to the new ones
    // Resetting the buttons' default attributes and icons
    resetTreatmentsList(form);
}

function resetTreatmentsList(form){
    const resetTreatmentButton = form.querySelector('button[data-btn-action="Remove"]');
    const submitTreatmentButton = form.querySelector('button[data-btn-action="Edit"]');
    resetTreatmentButton.childNodes[0].src = "/assets/icons/erase.svg";
    submitTreatmentButton.setAttribute('type', 'button');
    submitTreatmentButton.childNodes[0].src = "/assets/icons/edit.svg";
    const formFields = form.querySelectorAll('input, textarea');
    // Disabling all fields and re-enabling edit and remove buttons
    formFields.forEach(field => {
        field.setAttribute('disabled', undefined);
    });
    form.parentNode.querySelectorAll(`form:not([method="dialog"])`).forEach(treatmentForm => {
        treatmentForm.querySelectorAll('button').forEach(button => button.removeAttribute('disabled'));
    });
    document.querySelector('#newTreatment').removeAttribute('disabled');
}