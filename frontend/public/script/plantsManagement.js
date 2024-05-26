function newPlant(plantationID){
    const newPlantDialog = document.querySelector('#newPlantPlantation');
    const newPlantForm = document.querySelector('#newPlantPlantationForm');
    
    newPlantDialog.onclose = e => {
        newPlantForm.reset();
        newPlantForm.onsubmit = undefined;
    };
    newPlantForm.onsubmit = async e => {
        e.preventDefault();
        try{
            const response = await fetch();
            const jsonResponse = await response.json();
            addPlantToList(jsonResponse);
        }catch(err){
            console.log(err);
            displayError('Unknown error while adding the plant. Please try again.');
        }
        newPlantDialog.close();
    }
    newPlantDialog.showModal();
}

function addPlantToList(plantData){
    const plantCard = document.querySelector('.customCard');
    const plantCardParentNode = plantCard.parentNode;
    const newPlantCard = setCardData(plantCard.cloneNode(true), plantData);
    newPlantCard.classList.remove('hidden');
    insertPlantInList(plantCardParentNode, newPlantCard);
}

function insertPlantInList(parentNode, plantCard){
    const elementsAdded = [];
    elementsAdded.push(parentNode.insertBefore(plantCard, parentNode.querySelector('.customCard')));
    return elementsAdded;
}

function setCardData(card, plantData){
    const dropdownOptions = card.querySelector('.dropdown-content');
    card.setAttribute('data-plant-id', plantData.plantID);
    card.querySelector(`figure`).style.backgroundImage = `url(${plantData.imageURL})`;
    card.querySelector(`.cardContent p`).textContent = plantData.plantFamily;
    card.querySelector(`.cardContent h2`).textContent = plantData.plantName;
    dropdownOptions.querySelector('[role="Plan"]').setAttribute('onclick', `getPlantTreatments(${plantData.plantID})`);
    dropdownOptions.querySelector('[role="Remove"]').setAttribute('onclick', `confirmRemoval(${plantData.plantID}, 'plant')`);
    dropdownOptions.querySelector('[role="Information"]').setAttribute('onclick', `showPlantInformation(${plantData.plantID})`);
    return card;
}