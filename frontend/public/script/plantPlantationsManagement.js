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
    dropdownOptions.querySelector('[role="Remove"]').setAttribute('onclick', confirmRemoval(type === 'plant'? elementData.plantID: elementData.plantationID, type))
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