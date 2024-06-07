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

function confirmRemoval(elementID, type, printError = true){
    /*
        * Manages the plant/plantation removal based on the modal selection
        * Takes as parameter the plant/plantation id and uses it to process all the relative removal confirmation mechanism
        * The `elementType` parameter accepts a string value and is used to determine the element to remove (the element should contain a `data-elementType-id` attribute)
        * The `printError` prameter allows to choose whetever to display an erorr message to the user or not
    */
    const elementSelector = `[data-${type}-id="${elementID}"]`;
    const dialog = document.querySelector('#confirmRemoval');
    let elementName = undefined
    try{
        elementName = document.querySelector(`${elementSelector} [role="definition"] [selected]`)?.value || document.querySelector(`${elementSelector} [role="definition"]`).textContent || document.querySelector(`${elementSelector} [role="definition"]`).value;
    }catch(err){
        if(printError) displayMessage("Element not found.", "error");
        return;
    }
    dialog.querySelector('p span').textContent = elementName;
    dialog.showModal();
    setTabIndexToZero(dialog);
    dialog.onclose = () => setTabIndexToMinusOne(dialog);
    dialog.querySelector('form').onsubmit = async e => {
        // NOTE: Backend endpoints use `type` but in plural
        const pluralType = type + 's';
        // Defining the key to pass to the backend (representing the PK)
        let keyValue = {};
        if(type === 'plant') keyValue = {plantationPlantID: elementID};
        else if(type === 'plantation') keyValue = {plantationID: elementID};
        else keyValue = {treatmentID: elementID}
        try{
            const res = await fetch(`${BACKEND_ADDRESS}/api/${pluralType}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('OPToken')}`
                },
                body: JSON.stringify(keyValue)
            });
            const jsonRes = await res.json();
            if(!res.ok) throw new Error(jsonRes.message);
            else displayMessage(jsonRes.message, 'success');
        }catch(err){
            // Outputting an error message in case the plant is not found from the provided ID
            if(printError) displayMessage(err instanceof Error? `Could not remove the ${type}. ${err.message}`: "Couldn't remove the selected element, please reload the page and try again.", "error");
            return;
        }
        document.querySelector(elementSelector).remove();
        if(type === 'treatment'){
            // Removing the excessive dividers in case the element to be removed is a plant's treatment
            try{
                document.querySelector('#treatments .modal-box > hr').remove();
                document.querySelector('#treatments .modal-box hr + hr').remove();
            }catch(err){}
            finally{
                if(printError && !document.querySelectorAll('[data-treatment-id]:not(.hidden)').length) showNotice();
            }
        }
    }
}

function displayMessage(message, type){
    const errorMessageContainer = createElement('div', null, ['alert', `alert-${type}`, 'animate-disappear', 'text-base-100']);
    const errorMessage = createElement('span')
    errorMessage.textContent = message;
    errorMessageContainer.onanimationend = e => {
        e.target.remove();
    }
    errorMessageContainer.appendChild(errorMessage);
    document.querySelector('.toast').appendChild(errorMessageContainer);
}

function formDataToObject(formDataElement, fieldsFilterArr = undefined){
    const obj = {}
    if(Array.isArray(fieldsFilterArr)){
        fieldsFilterArr.forEach(field => {
            obj[field] = formDataElement.get(field);
        });
    }
    else{
        for(const field of formDataElement.keys()){
            obj[field] = formDataElement.get(field);
        }
    }
    return obj;
}