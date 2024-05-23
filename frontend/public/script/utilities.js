function resetModalForm(modal, index = 1){
    try{
        modal.querySelectorAll('form')[index].reset();
    } catch(err){ }
}