function newElement(type, plantationID = undefined, keyPressed){
    if(keyPressed !== undefined && keyPressed !== 'Enter') return;
    if(!USER_SETTINGS.verified){
        displayMessage('Please verify your Email before.', 'error');
        return;
    }
    const newElementDialog = document.querySelector('#newPlantPlantation');
    const newElementForm = document.querySelector('#newPlantPlantationForm');
    
    newElementDialog.onclose = e => {
        clearFormErrorMessages(newElementForm, true);
        disableDialogFocus(newElementDialog);
        newElementForm.onsubmit = undefined;
    };
    newElementForm.onsubmit = async e => {
        e.preventDefault();
        let newElementData = formDataToObject(new FormData(newElementForm));
        if(type === 'plant') newElementData.plantationID = plantationID;
        try{
            let validationResult = undefined;
            if(type === 'plant'){
                validationResult = await validatePlant(newElementData);
            }
            else{
                validationResult = await validatePlantation(newElementData);
            }
            // Overwriting the Object with the sanitized data version
            newElementData = validationResult;
        }catch(err){
            clearFormErrorMessages(newElementForm, false);
            for(const key of Object.keys(err)){
                // Element to display the error to can be either an input element, and an input container
                const fieldError = newElementForm.querySelector(`.inputStyleContainer:has(:is(input, select, textarea)[name="${key}"])`) || newElementForm.querySelector(`:is(input, select, textarea)[name="${key}"]`);
                showErrorMessage(fieldError, err[key]);
            }
            return;
        }
        // NOTE: Backend endpoints use `type` but in plural
        const pluralType = type + 's';
        try{
            const res = await fetch(`${BACKEND_ADDRESS}/api/${pluralType}`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('OPToken')}`
                },
                body: JSON.stringify(newElementData),
                credentials: 'include'
            });
            const jsonRes = await res.json();
            // Backend validation not passed
            if(res.status === 403){
                clearFormErrorMessages(newElementForm, false);
                for(const key of Object.keys(jsonRes.validationErrors)){
                    // Element to display the error to can be either an input element, and an input container
                    const fieldError = newElementForm.querySelector(`.inputStyleContainer:has(:is(input, select, textarea)[name="${key}"])`) || newElementForm.querySelector(`:is(input, select, textarea)[name="${key}"]`);
                    showErrorMessage(fieldError, jsonRes.validationErrors[key]);
                }
                return;
            }
            if(res.status !== 201) throw new Error(jsonRes.message);
            addElementToList(jsonRes[type], type);
        }catch(err){
            displayMessage(err instanceof Error? `Could not add ${type}. ${err.message}`: `Unknown error while adding the ${type}. Please try again.`, 'error');
            newElementDialog.close();
            return;
        }
        displayMessage(`${type} added successfully`, 'success');
        newElementDialog.close();
    }
    newElementDialog.showModal();
    enableDialogFocus(newElementDialog);
}

function addElementToList(elementData, type){
    const elementCard = document.querySelector('.customCard');
    const elementCardParentNode = elementCard.parentNode;
    const newElementCard = setCardData(elementCard.cloneNode(true), elementData, type);
    newElementCard.classList.remove('hidden');
    insertElementInList(elementCardParentNode, newElementCard);
}

function insertElementInList(parentNode, elementCard){
    const elementsAdded = [];
    elementsAdded.push(parentNode.insertBefore(elementCard, parentNode.querySelector('.customCard')));
    return elementsAdded;
}

function setCardData(card, elementData, type){
    const dropdownOptions = card.querySelector('.dropdown-content');
    
    dropdownOptions.querySelector('[role="Remove"]').addEventListener('click', (e) => confirmRemoval(type === 'plant'? elementData.plantationPlantID: elementData.plantationID, type));
    dropdownOptions.querySelector('[role="Remove"]').addEventListener('keydown', (e) => confirmRemoval(type === 'plant'? elementData.plantationPlantID: elementData.plantationID, type, true, e.code));
    dropdownOptions.querySelector('[role="Modify"]').addEventListener('click', (e) => modify(type === 'plant'? elementData.plantationPlantID: elementData.plantationID, type));
    dropdownOptions.querySelector('[role="Modify"]').addEventListener('keydown', (e) => modify(type === 'plant'? elementData.plantationPlantID: elementData.plantationID, type, e.code));
    if(type === 'plant'){
        card.setAttribute('data-plant-id', elementData.plantationPlantID);
        dropdownOptions.querySelector('[role="Plan"]').addEventListener('click', (e) => getPlantTreatments(elementData.plantationPlantID));
        dropdownOptions.querySelector('[role="Plan"]').addEventListener('keydown', (e) => getPlantTreatments(elementData.plantationPlantID, e.code));
        dropdownOptions.querySelector('[role="Information"]').addEventListener('click', (e) => showPlantInformation(elementData.plantationPlantID));
        dropdownOptions.querySelector('[role="Information"]').addEventListener('keydown', (e) => showPlantInformation(elementData.plantationPlantID, e.code));
        card.querySelector(`.cardContent p`).textContent = elementData.plant.plantFamily;
        card.querySelector(`.cardContent h2`).textContent = elementData.plant.plantName;
        if(elementData.plant.imageURL.includes('https://'))
            card.querySelector(`figure`).style.backgroundImage = `url(${elementData.plant.imageURL})`;
        else
            card.querySelector(`figure`).style.backgroundImage = `url(/assets/icons/${elementData.plant.imageURL})`;
    }
    else{
        card.setAttribute('data-plantation-id', elementData.plantationID);
        card.querySelector('.cardContent').href = `/user/plantations/${elementData.plantationID}`;
        card.querySelector(`.cardContent p`).textContent = elementData.location.locationName;
        card.querySelector(`.cardContent h2`).textContent = elementData.plantationName;
        if(elementData.imageURL.includes('https://'))
            card.querySelector(`figure`).style.backgroundImage = `url(${elementData.imageURL})`;
        else
            card.querySelector(`figure`).style.backgroundImage = `url(/assets/icons/${elementData.imageURL})`;
    }
    return card;
}

async function modify(elementID, type, keyPressed = undefined){
    if(keyPressed !== undefined && keyPressed !== 'Enter') return;
    if(!USER_SETTINGS.verified){
        displayMessage('Please verify your Email before.', 'error');
        return;
    }
    const pluralType = type + 's';
    const updateElementDialog = document.querySelector('#newPlantPlantation');
    const updateElementForm = document.querySelector('#newPlantPlantationForm');
    const element = document.querySelector(`[data-${type}-id="${elementID}"]`);
    const elementName = element.querySelector('.cardContent h2').textContent;
    const elementFamilyLocation = element.querySelector('.cardContent p').textContent;

    updateElementForm.querySelector('header b').textContent = `Update ${type}`;
    updateElementForm.querySelector('header h1').textContent = `Update ${elementName}`;
    if(type === 'plant'){
        // Updating form fields with relative plant information (obtained from the API)
        try{
            const res = await fetch(`${BACKEND_ADDRESS}/api/plants?plantID=${elementID}`, {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('OPToken')}`,
                    "Accept": "application/json"
                }
            });
            const jsonRes = await res.json();
            const plantData = jsonRes.plants.plant;
            updateElementForm.querySelector('[name="plantName"]').value = plantData.plantName;
            ['plantFamily', 'scientificName'].forEach(field => {
                updateElementForm.querySelector(`[name="${field}"]`).placeholder = plantData[field];
            });
        // Fallback in case any error fom the fetch is triggered
        }catch(err){
            updateElementForm.querySelector('[name="plantName"]').value = elementName;
            updateElementForm.querySelector('[name="plantFamily"]').value = elementFamilyLocation;
        }
    }
    else{
        updateElementForm.querySelector('[name="plantationName"]').value = elementName;
        updateElementForm.querySelector('[name="locationName"]').value = elementFamilyLocation;
    }
    updateElementDialog.onclose = e => {
        clearFormErrorMessages(updateElementForm, true);
        disableDialogFocus(updateElementDialog);
        updateElementForm.onsubmit = undefined;
    }
    updateElementForm.onsubmit = async e => {
        e.preventDefault();
        let updateElementData = formDataToObject(new FormData(updateElementForm));
        // Defining the key to pass to the backend (representing the PK)
        const keyValue = type === 'plant'? {plantationPlantID: elementID}: {plantationID: elementID}
        try{
            let validationResult = undefined;
            if(type === 'plant'){
                validationResult = await validatePlant(updateElementData);
            }
            else{
                validationResult = await validatePlantation(updateElementData);
            }
            // Overwriting the Object with the sanitized data version
            updateElementData = validationResult;
        }catch(err){
            clearFormErrorMessages(updateElementForm, false);
            for(const key of Object.keys(err)){
                // Element to display the error to can be either an input element, and an input container
                const fieldError = updateElementForm.querySelector(`.inputStyleContainer:has(:is(input, select, textarea)[name="${key}"])`) || updateElementForm.querySelector(`:is(input, select, textarea)[name="${key}"]`);
                showErrorMessage(fieldError, err[key]);
            }
            return;
        }
        try{
            const res = await fetch(`${BACKEND_ADDRESS}/api/${pluralType}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('OPToken')}`
                },
                body: JSON.stringify({
                    ...keyValue,
                    ...updateElementData
                }),
                credentials: 'include'
            });
            const jsonRes = await res.json();
            // Backend validation not passed
            if(res.status === 403){
                clearFormErrorMessages(updateElementForm, false);
                for(const key of Object.keys(jsonRes.validationErrors)){
                    // Element to display the error to can be either an input element, and an input container
                    const fieldError = updateElementForm.querySelector(`.inputStyleContainer:has(:is(input, select, textarea)[name="${key}"])`) || updateElementForm.querySelector(`:is(input, select, textarea)[name="${key}"]`);
                    showErrorMessage(fieldError, jsonRes.validationErrors[key]);
                }
                return;
            }
            if(!res.ok) throw new Error(jsonRes.message);
            modifyCardData(jsonRes[type], element, type);
        }
        catch(err){
            displayMessage(`Could not update ${type} information. ${err.message}`, 'error');
            updateElementDialog.close();
            return;
        }
        displayMessage(`${type} successfully updated.`, 'success');
        updateElementDialog.close();
    }
    updateElementDialog.showModal();
    enableDialogFocus(updateElementDialog);
}

function modifyCardData(newCardData, cardElement, type){
    const cardFamilyLocation = type === 'plant'? newCardData.plant.plantFamily: newCardData.location.locationName;
    const cardName = type === 'plant'? newCardData.plant.plantName: newCardData.plantationName;

    cardElement.querySelector('.cardContent p').textContent = cardFamilyLocation;
    cardElement.querySelector('.cardContent h2').textContent = cardName;
    // Updating background image if the element `type` is a plant
    if(type === 'plant') cardElement.querySelector('figure').style.backgroundImage = `url("${newCardData.plant.imageURL}")`;
}

async function getUserList(type, plantationID = undefined){
    /*
        * Gets the list of `type` category from the backend and adds all element as cards in the UI
    */
    // NOTE: Backend endpoints use `type` but in plural
    const pluralType = type + 's';
    const res = await fetch(`${BACKEND_ADDRESS}/api/${pluralType}/all${type === 'plant'? `?plantationID=${plantationID}`: ''}`, {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${localStorage.getItem('OPToken')}`,
            "Accept": 'application/json'
        }
    });
    const jsonRes = await res.json();
    const list = jsonRes[pluralType];
    if(Array.isArray(list)){
        list.forEach(listElement => {
            addElementToList(listElement, type);
        });
    }
}

async function updatePageData(plantationID){
    /*
        * Updates the plantation page based on API response data
    */
    const plantationData = await getPlantationInfo(plantationID);
    if(!plantationData){
        displayMessage('Could not retrieve plantation data. You\'re getting redirected to the plantations screening page.', 'error');
        setTimeout(() => {
            window.location.pathname = '/user/plantations';
        }, 3000);
    }
    const plantation = plantationData.plantations;
    document.title = document.title.replace('plantationName', plantation.plantationName);
    const plantationMainData = document.querySelector('#plantationLocationAndName');
    const plantationBG = document.querySelector('#plantationBG');
    plantationBG.classList.remove('bg-defaultPlantation');
    if(plantation.imageURL.includes('https://')){
        plantationBG.style.backgroundImage = `url('${plantation.imageURL}')`;
    }
    else{
        plantationBG.style.backgroundImage = `url('/assets/icons/${plantation.imageURL}')`;
    }
    plantationMainData.querySelector('h1').textContent = plantation.plantationName;
    plantationMainData.querySelector('b').textContent = plantation.location.locationName;
}

async function showPlantInformation(plantID, keyPressed){
    if(keyPressed !== undefined && keyPressed !== 'Enter') return;
    const res = await getPlantInfo(plantID);
    if(!res){
        displayMessage('Plant not found.', 'error');
        return;
    }
    if(res.status !== 200){
        displayMessage(plantInfo.message, 'error');
        return;
    }
    const plantInfo = res.plants.plant;
    // Assigning data from JSON `plantDescription` field
    const plantDescriptionData = JSON.parse(plantInfo.plantDescription);
    plantInfo.category = plantDescriptionData['Category'];
    plantInfo.variety = plantDescriptionData['Variety'];
    plantInfo.preferredClimate = plantDescriptionData['Preferred Climate'];
    delete plantInfo.plantDescription;
    const plantInfoDialog = document.querySelector('#plantInfo');
    plantInfoDialog.querySelector('header h1 #plantName').textContent = plantInfo.plantName;
    ['plantName', 'plantFamily', 'scientificName', 'category', 'variety', 'preferredClimate'].forEach(key => {
        plantInfoDialog.querySelector(`[data-plant-info="${key}"]`).textContent = plantInfo[key];
    })
    plantInfoDialog.showModal();
}