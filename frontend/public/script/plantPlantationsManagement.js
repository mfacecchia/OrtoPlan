// TODO: Update dialog title/subtitle
function newElement(type, plantationID = undefined){
    const newElementDialog = document.querySelector('#newPlantPlantation');
    const newElementForm = document.querySelector('#newPlantPlantationForm');
    
    newElementDialog.onclose = e => {
        newElementForm.reset();
        newElementForm.onsubmit = undefined;
    };
    newElementForm.onsubmit = async e => {
        e.preventDefault();
        try{
            // NOTE: Set fetch endpoint based on `type` parameter content
            const response = await fetch();
            const jsonResponse = await response.json();
            addElementToList(jsonResponse, type);
        }catch(err){
            displayError(`Unknown error while adding the ${type}. Please try again.`);
        }
        newElementDialog.close();
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
    card.querySelector(`figure`).style.backgroundImage = `url(${elementData.imageURL})`;
    card.querySelector(`.cardContent p`).textContent = type === 'plant'? elementData.plantFamily: elementData.location;
    card.querySelector(`.cardContent h2`).textContent = type === 'plant'? elementData.plantName: elementData.plantationName;
    dropdownOptions.querySelector('[role="Remove"]').setAttribute('onclick', `confirmRemoval(${type === 'plant'? elementData.plantID: elementData.plantationID}, '${type}')`)
    dropdownOptions.querySelector('[role="Modify"]').setAttribute('onclick', `modify(${type === 'plant'? elementData.plantID: elementData.plantationID}, '${type}')`)
    if(type === 'plant'){
        card.setAttribute('data-plant-id', elementData.plantID);
        dropdownOptions.querySelector('[role="Plan"]').setAttribute('onclick', `getPlantTreatments(${elementData.plantID})`);
        dropdownOptions.querySelector('[role="Information"]').setAttribute('onclick', `showPlantInformation(${elementData.plantID})`);
    }
    else{
        card.setAttribute('data-plantation-id', elementData.plantationID);
        card.querySelector('.cardContent').href = `./${elementData.plantationID}`;
        dropdownOptions.querySelector('[role="Modify"]').setAttribute('onclick', `modify(${elementData.plantationID}, 'plantation')`);
    }
    return card;
}

function modify(elementID, type){
    const updateElementDialog = document.querySelector('#newPlantPlantation');
    const updateElementForm = document.querySelector('#newPlantPlantationForm');
    const element = document.querySelector(`[data-${type}-id="${elementID}"]`);
    const elementName = element.querySelector('h2').textContent;
    const elementFamilyLocation = element.querySelector('p').textContent;

    updateElementForm.querySelector('header b').textContent = `Update ${type}`;
    updateElementForm.querySelector('header h1').textContent = `Update ${elementName}`;
    if(type === 'plant'){

    }
    else{
        updateElementForm.querySelector('[name="plantationName"]').value = elementName;
        updateElementForm.querySelector('[name="plantationLocation"]').value = elementFamilyLocation;
    }
    updateElementDialog.onclose = e => {
        updateElementForm.reset();
        updateElementForm.onsubmit = undefined;
    }
    updateElementForm.onsubmit = async e => {
        e.preventDefault();
        const newElementInfo = new FormData(updateElementForm);
        try{
            if(await fetch()){
                modifyCardData(newElementInfo, element, type);
            }
        }
        catch(err){
            console.log(err);
            displayError(`Could not update ${type} information. Please reload the page and try again.`);
            updateElementDialog.close();
            return;
        }
        elementName.textContent = newElementInfo.get(type === 'plantation'? newElementInfo.get('plantationName'):newElementInfo.get('plantName'));
        elementFamilyLocation.textContent = newElementInfo.get(type === 'plantation'? newElementInfo.get('plantationLocation'):newElementInfo.get('plantFamily'));
        updateElementDialog.close();
    }
    updateElementDialog.showModal();
}

function modifyCardData(newCardData, cardElement, type){
    const cardFamilyLocation = newCardData.get(type === 'plant'? 'plantFamily': 'plantationLocation');
    const cardName = newCardData.get(type === 'plant'? 'plantName': 'plantationName');

    cardElement.querySelector('.cardContent p').textContent = cardFamilyLocation;
    cardElement.querySelector('.cardContent h2').textContent = cardName;
}