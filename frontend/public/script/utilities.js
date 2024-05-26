function createElement(elementName, attributes = null, classes = null){
    /*
        * Creates an element from the given `elementName` and possible `attributes` and `classes` names
        * The `attributes` parameter should be an Object with the attribute name as key and the relative value as Object value
        * The `classes` parameter should be an Array with all the classes names as values
        * Returns an instance of the chosen `elementName` element
    */
    const element = document.createElement(elementName);
    if(attributes){
        // Applying all attributes to the new element
        for(const attributeName in attributes){
            element.setAttribute(attributeName, attributes[attributeName]);
        }
    }
    if(classes){
        element.classList.add(...classes);
    }
    return element;
}

function resetModalForm(modal, index = 1){
    try{
        modal.querySelectorAll('form')[index].reset();
    } catch(err){ }
}

function confirmRemoval(id, elementType, printError = true){
    /*
        * Manages the plant/plantation removal based on the modal selection
        * Takes as parameter the plant/plantation id and uses it to process all the relative removal confirmation mechanism
        * The `elementType` parameter accepts a string value and is used to determine the element to remove (the element should contain a `data-elementType-id` attribute)
        * The `printError` prameter allows to choose whetever to display an erorr message to the user or not
    */
    const elementSelector = `[data-${elementType}-id="${id}"]`;
    const dialog = document.querySelector('#confirmRemoval');
    let elementName = undefined
    try{
        elementName = document.querySelector(`${elementSelector} [role="definition"] [selected]`).value || document.querySelector(`${elementSelector} [role="definition"]`).textContent || document.querySelector(`${elementSelector} [role="definition"]`).value;
    }catch(err){
        if(printError) displayError("Element not found.");
        return;
    }
    dialog.querySelector('p span').textContent = elementName;
    dialog.showModal();
    dialog.querySelector('form').onsubmit = async e => {
        try{
            if(await fetch()){
                document.querySelector(elementSelector).remove();
            }
        }catch(err){
            // Outputting an error message in case the plant is not found from the provided ID
            if(printError) displayError("Couldn't remove the selected element, please reload the page and try again.");
        }
        if(elementType === 'treatment'){
            // Removing the excessive dividers in case the element to be removed is a plant's treatment
            try{
                // TODO: Check if there are other treatments and show a "no treatments" notice if there aren't any.
                document.querySelector('#treatments .modal-box > hr').remove();
                document.querySelector('#treatments .modal-box hr + hr').remove();
            }catch(err){}
            finally{
                if(!document.querySelectorAll('[data-treatment-id]:not(.hidden)').length){
                    const noTreatmentsNotice = document.createElement('p');
                    noTreatmentsNotice.textContent = 'No treatments for this plant.';
                    noTreatmentsNotice.classList.add('noTreatmentsNotice');
                    insertTreatmentInList(document.querySelector('.treatmentForm').parentNode, noTreatmentsNotice);
                }
            }
        }
    }
}

function displayError(message){
    const errorMessageContainer = createElement('div', null, ['alert', 'alert-error', 'animate-disappear', 'text-base-100']);
    const errorMessage = createElement('span')
    errorMessage.textContent = message;
    errorMessageContainer.appendChild(errorMessage);
    document.querySelector('.toast').appendChild(errorMessageContainer);
}