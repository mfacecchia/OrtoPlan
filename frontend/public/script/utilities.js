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

function confirmRemoval(elementID, type, printError = true, keyPressed = undefined){
    /*
        * Manages the plant/plantation removal based on the modal selection
        * Takes as parameter the plant/plantation id and uses it to process all the relative removal confirmation mechanism
        * The `elementType` parameter accepts a string value and is used to determine the element to remove (the element should contain a `data-elementType-id` attribute)
        * The `printError` prameter allows to choose whetever to display an erorr message to the user or not
    */
    if(keyPressed !== undefined && keyPressed !== 'Enter') return;
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
    enableDialogFocus(dialog);
    dialog.onclose = () => disableDialogFocus(dialog);
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
                body: JSON.stringify(keyValue),
                credentials: 'include'
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

function showErrorMessage(field, messages){
    /*
        * Shows an error message based below the passed `field` element
        * Supposed to work with form validation functionalities
        * which require to display validation errors after form submission
    */
    field.classList.add('input-error');
    const errorMessagesContainer = createElement('div', null, ['space-y-1', 'mb-4', 'self-start', 'error-messages-container'])
    // Iterating through each error message and adding it below the relative field
    messages.forEach(message => {
        // Creating the paragraph and adding message and classes
        const p = document.createElement('p');
        p.classList.add('text-error', 'error-message', 'leading-tight');
        p.textContent = message;
        errorMessagesContainer.appendChild(p);
    });
    // Adding the paragraph below the input field
    field.parentNode.insertBefore(errorMessagesContainer, field.nextSibling);
}

function clearFormErrorMessages(formElement, clearInputValues = false){
    /*
        * Clears all the form from error messages and input values (if `clearInputValues` is set to `true` (default `false`))
        * NOTE: in order for this function to correctly clear the form from errors, the error messages container
        * should contain the class `error-messages-container`
        * and the field errors the class `input-error`
    */
    formElement.querySelectorAll(`.error-messages-container`).forEach(element => {
        element.remove();
    });
    // Removing error classes and relative value from all input fields and possible input containers (defined by `inputStyleContainer` class)
    formElement.querySelectorAll(`input`).forEach(field => {
        field.classList.remove('input-error');
    });
    formElement.querySelectorAll(`.inputStyleContainer:has(input)`).forEach(field => {
        field.classList.remove('input-error');
    });
    // Removing input data if `removeData` variable is set to `true`, otherwise just removing error classes
    if(clearInputValues) formElement.reset();
}