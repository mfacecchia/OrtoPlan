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

function confirmRemoval(id, isPlant, printError = true){
    /*
        * Manages the plant/plantation removal based on the modal selection
        * Takes as parameter the plant/plantation id and uses it to process all the relative removal confirmation mechanism
        * The `isPlant` parameter accepts a boolean value and is used to determine the element to remove
        * The `printError` prameter allows to choose whetever to display an erorr message to the user or not
    */
    const elementSelector = isPlant? `[data-plant-id="${id}"]`: `[data-plantation-id="${id}"]`;
    const dialog = document.querySelector('#confirmRemoval');
    let elementName = undefined
    try{
        elementName = document.querySelector(`${elementSelector} [role="definition"]`).textContent;
    }catch(err){
        if(printError) displayError("Element not found.");
        return;
    }
    dialog.querySelector('p span').textContent = elementName;
    dialog.showModal();
    const confirmRemovalForm = dialog.querySelector('form').onsubmit = e => {
        try{
            document.querySelector(elementSelector).remove();
        }catch(err){
            // Outputting an error message in case the plant is not found from the provided ID
            if(printError) displayError("Couldn't remove the selected element, please try again.");
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