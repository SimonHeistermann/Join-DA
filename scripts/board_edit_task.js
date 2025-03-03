/**
 * Opens the contact dropdown list for editing task assignments.
 * 
 * @param {Event} event - The event object from the dropdown toggle action.
 */
function openDropdownListEdit(event) {
    event.preventDefault();
    renderContactListEdit(contacts);
    toggleDropdownEdit('dropdown');
    toggleDNoneInputAndButtonDropDownEdit('dropdown', 'dropdown_search');
    toggleDropDownListOverlayEdit();
}

/**
 * Toggles the visibility of the contact dropdown overlay.
 */
function toggleDropDownListOverlayEdit() {
    const overlayDropdownListAddTaskContacts = document.getElementById('overlay_dropdown_list_add_task_contacts_edit');
    overlayDropdownListAddTaskContacts.classList.toggle('d__none');
}

/**
 * Toggles the dropdown list visibility by modifying its class.
 * 
 * @param {string} type - The type of dropdown to be toggled.
 */
function toggleDropdownEdit(type) {
    const dropdownListWrapperRef = document.getElementById(type + '_list_wrapper_edit');
    dropdownListWrapperRef.classList.toggle('open');
}

/**
 * Toggles the visibility of the input field and button in the dropdown.
 * 
 * @param {string} button - The ID prefix of the dropdown button.
 * @param {string} input - The ID prefix of the dropdown input field.
 */
function toggleDNoneInputAndButtonDropDownEdit(button, input) {
    const dropDownButtonRef = document.getElementById(button + '_toggle_edit');
    const dropDownSearchRef = document.getElementById(input + '_container_edit');
    dropDownButtonRef.classList.toggle('d__none');
    dropDownSearchRef.classList.toggle('d__none');
    dropDownSearchRef.classList.toggle('dropdown__blue__border');
}

/**
 * Closes the dropdown list and re-renders the assigned contacts list.
 * 
 * @param {Event} event - The event object from the dropdown toggle action.
 */
function closeDropDownListEdit(event) {
    event.preventDefault();
    toggleDropdownEdit('dropdown');
    toggleDNoneInputAndButtonDropDownEdit('dropdown', 'dropdown_search');
    toggleDropDownListOverlayEdit();
    renderEditTaskDetailsAssignedTo(currentEditedTask);
}

/**
 * Updates the current user's selection status in the dropdown list.
 * 
 * @param {Event} event - The event object (optional).
 */
function updateCurrentUserChoosenEdit(event) {
    if (event) event.preventDefault();
    currentUserChoosenEdit = currentUserChoosenEdit ? false : true;
    toggleCurrentUserChoosenStylingEdit();
    updateCheckboxStateCurrentUserEdit();
    if (currentUser) {
        toggleChoosenUserToArrayEdit(currentUser);
        renderEditTaskDetailsAssignedTo(currentEditedTask);
    }
}

/**
 * Toggles the styling of the current user selection in the dropdown.
 */
function toggleCurrentUserChoosenStylingEdit() {
    const contactRef = document.getElementById('contact_' + currentUser.name + '_edit');
    contactRef.classList.toggle('dropdown__item__checked');
    const checkBoxBlueRef = document.getElementById('checkbox_blue_' + currentUser.name + '_edit');
    checkBoxBlueRef.classList.toggle('d__none');
    const checkBoxWhiteRef = document.getElementById('checkbox_white_' + currentUser.name + '_edit');
    checkBoxWhiteRef.classList.toggle('d__none');
}

/**
 * Updates the checkbox state of the current user selection.
 */
function updateCheckboxStateCurrentUserEdit() {
    const contactCheckBoxRef = document.getElementById('contact_checkbox_' + currentUser.name + '_edit');
    if (currentUserChoosenEdit) {
        contactCheckBoxRef.checked = true;
    } else {
        contactCheckBoxRef.checked = false;
    }
}

/**
 * Toggles the selection of a contact in the edit dropdown.
 * 
 * @param {number} contactID - The ID of the selected contact.
 */
function contactChoosenEdit(contactID) {
    const contact = contacts.find(contact => contact.id == contactID);
    toggleChoosenContactStylingEdit(contactID);
    if (contact) {
        toggleChoosenContactToArrayEdit(contact);
        renderEditTaskDetailsAssignedTo(currentEditedTask);
    }
}


/**
 * Toggles the styling of the selected contact in the dropdown list.
 * @param {string} contactID - The ID of the selected contact.
 */
function toggleChoosenContactStylingEdit(contactID) {
    const contactRef = document.getElementById('contact_' + contactID + '_edit');
    contactRef.classList.toggle('dropdown__item__checked');
    const checkBoxBlueRef = document.getElementById('checkbox_blue_' + contactID + '_edit');
    checkBoxBlueRef.classList.toggle('d__none');
    const checkBoxWhiteRef = document.getElementById('checkbox_white_' + contactID + '_edit');
    checkBoxWhiteRef.classList.toggle('d__none');
}

/**
 * Adds or removes a contact from the chosen contacts array.
 * @param {Object} contact - The contact to add or remove.
 */
function toggleChoosenContactToArrayEdit(contact) {
    const isContactAlreadySelected = assignedToContacts.some(c => c === contact.name);
    if (isContactAlreadySelected) {
        removeContactFromArrayEdit(contact.name);
    } else {
        addContactToArrayEdit(contact.name);
    }
    updateCheckboxStateEdit(contact);
}

/**
 * Toggles the selection of a user in the assigned contacts array.
 * 
 * @param {Object} currentUser - The user object to be toggled.
 * @returns {void}
 * 
 * If the user is already in the assigned contacts array, they will be removed.  
 * Otherwise, the user will be added to the array.
 */
function toggleChoosenUserToArrayEdit(currentUser) {
    const isContactAlreadySelected = assignedToContacts.some(c => c === currentUser.name);
    if (isContactAlreadySelected) {
        removeContactFromArrayEdit(currentUser.name);
    } else {
        addContactToArrayEdit(currentUser.name);
    }
}

/**
 * Adds a contact to the chosen contacts array.
 * @param {Object} contact - The contact to add.
 */
function addContactToArrayEdit(contact) {
    assignedToContacts.push(contact);
}

/**
 * Removes a contact from the chosen contacts array.
 * @param {Object} contact - The contact to remove.
 */
function removeContactFromArrayEdit(contact) {
    const index = assignedToContacts.indexOf(contact);
    if (index > -1) {
        assignedToContacts.splice(index, 1);
    }
}

/**
 * Updates the checkbox state to reflect the selection of a contact.
 * @param {Object} contact - The contact to update the checkbox state for.
 */
function updateCheckboxStateEdit(contact) {
    const contactCheckBoxRef = document.getElementById('contact_checkbox_' + contact.id + '_edit');
    if (assignedToContacts.some(c => c === contact.name)) {
        contactCheckBoxRef.checked = true;
    } else {
        contactCheckBoxRef.checked = false;
    }
}

/**
 * Filters the contacts based on the search input and updates the contact list accordingly.
 */
function filterContactsEdit() {
    const searchInput = document.getElementById('assignee_search_input_edit').value.toLowerCase();
    let filteredContacts = contacts.filter(contact => {
        return contact.name.toLowerCase().includes(searchInput);
    });
    let includesCurrentUser;
    if (currentUser.name.toLowerCase().includes(searchInput)) {
        includesCurrentUser = true;
    }
    renderFilteredContactList(filteredContacts, includesCurrentUser); 
    if (searchInput === "") {
        renderContactListEdit(contacts);
    }
}

/**
 * Renders the filtered contact list in the dropdown menu.
 * Sorts the contacts, generates the HTML, and updates the dropdown.
 * Optionally includes the current user in the list.
 * 
 * @param {Array} filteredContacts - The list of contacts to be displayed.
 * @param {boolean} includesCurrentUser - Indicates whether the current user should be included in the list.
 */
function renderFilteredContactList(filteredContacts, includesCurrentUser) {
    const sortedContacts = sortContactsByName(filteredContacts);
    const contactHTML = generateContactHTMLEdit(sortedContacts);
    const dropDownRef = document.getElementById("dropdown_list_edit");
    dropDownRef.innerHTML = "";
    if (includesCurrentUser) {
        dropDownRef.innerHTML += renderHTMLYouInContactListEdit();
    }
    dropDownRef.innerHTML += contactHTML;
}

/**
 * Checks if a task has any subtasks with status 1.
 * 
 * @param {Object} task - The task object containing subtasks.
 * @returns {boolean} - True if at least one subtask has status 1, otherwise false.
 */
function hasSubtasksWithStatusOne(task) {
    if (!task || !Array.isArray(task.subtasks)) return false;
    return task.subtasks.some(subtask => subtask.status === 1);
}

  


