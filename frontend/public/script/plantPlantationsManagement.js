function newElement(type, plantationID = undefined){
    const newElementDialog = document.querySelector('#newPlantPlantation');
    const newElementForm = document.querySelector('#newPlantPlantationForm');
    
    newElementDialog.onclose = e => {
        newElementForm.reset();
        newElementForm.onsubmit = undefined;
    };
    newElementForm.onsubmit = async e => {
        e.preventDefault();
        const newElementData = formDataToObject(new FormData(newElementForm));
        if(type === 'plant') newElementData.plantationID = plantationID;
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
                body: JSON.stringify(newElementData)
            });
            const jsonResponse = await res.json();
            if(res.status !== 201) throw new Error(jsonResponse.message);
            addElementToList(jsonResponse[type], type);
        }catch(err){
            displayMessage(err instanceof Error? `Could not add ${type}. ${err.message}`: `Unknown error while adding the ${type}. Please try again.`, 'error');
            return;
        }
        finally{
            newElementDialog.close();
        }
        displayMessage(`${type} added successfully`, 'success');
    }
    newElementDialog.showModal();
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
    
    dropdownOptions.querySelector('[role="Remove"]').setAttribute('onclick', `confirmRemoval(${type === 'plant'? elementData.plantID: elementData.plantationID}, '${type}')`)
    dropdownOptions.querySelector('[role="Modify"]').setAttribute('onclick', `modify(${type === 'plant'? elementData.plantID: elementData.plantationID}, '${type}')`)
    if(type === 'plant'){
        card.setAttribute('data-plant-id', elementData.plantID);
        dropdownOptions.querySelector('[role="Plan"]').setAttribute('onclick', `getPlantTreatments(${elementData.plantID})`);
        dropdownOptions.querySelector('[role="Information"]').setAttribute('onclick', `showPlantInformation(${elementData.plantID})`);
        card.querySelector(`.cardContent p`).textContent = elementData.plant.plantName;
        card.querySelector(`.cardContent h2`).textContent = elementData.plant.plantFamily;
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

function modify(elementID, type){
    const pluralType = type + 's';
    const updateElementDialog = document.querySelector('#newPlantPlantation');
    const updateElementForm = document.querySelector('#newPlantPlantationForm');
    const element = document.querySelector(`[data-${type}-id="${elementID}"]`);
    const elementName = element.querySelector('.cardContent h2').textContent;
    const elementFamilyLocation = element.querySelector('.cardContent p').textContent;

    updateElementForm.querySelector('header b').textContent = `Update ${type}`;
    updateElementForm.querySelector('header h1').textContent = `Update ${elementName}`;
    if(type === 'plant'){

    }
    else{
        updateElementForm.querySelector('[name="plantationName"]').value = elementName;
        updateElementForm.querySelector('[name="locationName"]').value = elementFamilyLocation;
    }
    updateElementDialog.onclose = e => {
        updateElementForm.reset();
        updateElementForm.onsubmit = undefined;
    }
    updateElementForm.onsubmit = async e => {
        e.preventDefault();
        const newElementInfo = formDataToObject(new FormData(updateElementForm));
        try{
            const res = await fetch(`${BACKEND_ADDRESS}/api/${pluralType}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('OPToken')}`
                },
                body: JSON.stringify({
                    plantationID: elementID,
                    ...newElementInfo
                })
            });
            const jsonRes = await res.json();
            if(!res.ok) throw new Error(jsonRes.message);
            modifyCardData(jsonRes[type], element, type);
        }
        catch(err){
            console.log(err);
            displayMessage(`Could not update ${type} information. ${err}`, 'error');
            updateElementDialog.close();
            return;
        }
        finally{
            updateElementDialog.close();
        }
        displayMessage(`${type} successfully updated.`, 'success');
    }
    updateElementDialog.showModal();
}

function modifyCardData(newCardData, cardElement, type){
    const cardFamilyLocation = type === 'plant'? newCardData.plantFamily: newCardData.location.locationName;
    const cardName = type === 'plant'? newCardData.plantName: newCardData.plantationName;

    cardElement.querySelector('.cardContent p').textContent = cardFamilyLocation;
    cardElement.querySelector('.cardContent h2').textContent = cardName;
}

async function getUserList(type, plantationID = undefined){
    /*
        * Gets the list of `type` category from the backend and adds all element as cards in the UI
    */
    // NOTE: Backend endpoints use `type` but in plural
    const pluralType = type + 's';
    const res = await fetch(`${BACKEND_ADDRESS}/api/${pluralType}/all?plantationID=${plantationID}`, {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${localStorage.getItem('OPToken')}`,
            "Accept": 'application/json'
        }
    });
    const jsonRes = await res.json();
    const list = jsonRes[pluralType];
    if(list.length){
        list.forEach(listElement => {
            addElementToList(listElement, type);
        });
    }
}

async function updatePageData(plantationID){
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