async function updateNotificationsDropdown(){
    const treatmentsList = await getTreatmentsList();
    const upcomingTreatments = getUpcomingTreatments(treatmentsList);
    await removeAllNotifications();
    upcomingTreatments.forEach(async treatment => {
        const newNotificationData = await addTreatmentNotification(treatment);
        if(newNotificationData){
            const notificationElement = createNotificationDropdownElement(newNotificationData);
            addNotificationDropdownElement(notificationElement);
        }
    });
}

function createNotificationDropdownElement(notificationData){
    const container = createElement('li', {'tabindex': 0});
    const notification = createElement('a');
    const icon = createElement('img', {'src': `/assets/icons/${notificationData.notificationIcon}`, 'onerror': 'this.src="/assets/icons/info_green.svg"'});
    const text = createElement('p');
    text.textContent = notificationData.message.split(' ').slice(1).join(' ');
    const boldText = createElement('b');
    boldText.textContent = notificationData.message.split(' ')[0] + ' ';
    // Appending before text content
    text.insertBefore(boldText, text.firstChild);
    notification.appendChild(icon);
    notification.appendChild(text);
    container.appendChild(notification);
    return container;
}

function addNotificationDropdownElement(notificationElement){
    const notificationsDropdown = document.querySelector('#notificationsDropdown');
    notificationsDropdown.insertBefore(notificationElement, notificationsDropdown.querySelector('header').nextSibling);
    notificationsDropdown.insertBefore(createElement('hr'), notificationsDropdown.querySelector('li[tabindex="0"]').nextSibling);
}