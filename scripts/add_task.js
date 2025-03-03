let flatpickrInstance;
let choosenContacts = [];
let taskPrio = 2;
let taskCategories = ['Technical Task', 'User Story'];
let selectedTaskCategory = "";
let addedSubtasks = [];
let subtaskIdCounter = 0;
let currentUserChoosen = false;


/**
 * Initializes the task-related functionalities, including the date picker and fetching contacts.
 */
async function initAddTasks() {
    try {
        initFlatpickr();
        await init();
        renderContactList(contacts);
        renderTaskCategoryList();
        renderSubtasks();
    } catch (error) {
        console.error("Error initializing app:", error);
    }
}

/**
 * Initializes the Flatpickr date picker with specific configurations.
 */
function initFlatpickr() {
    flatpickrInstance = flatpickr("#task_due_date", {
        dateFormat: "d/m/Y", altInput: true, altFormat: "d/m/Y", allowInput: true, disableMobile: true, locale: "de", placeholder: "dd/mm/yyyy",
        onReady: function() {
            this.input.setAttribute('name', 'task_due_date');
            this.input.setAttribute('id', 'task_due_date_hidden');
            if (this.altInput) { this.altInput.setAttribute('name', 'task_due_date'); this.altInput.setAttribute('id', 'task_due_date'); }
            const calendar = this.calendarContainer;
            calendar.querySelector('.flatpickr-monthDropdown-months')?.setAttribute('name', 'task_due_month');
            calendar.querySelector('.cur-year')?.setAttribute('name', 'task_due_year');
        },
        onChange: function(selectedDates, dateStr, instance) { validateDate(dateStr, 'date_container_input', 'errormessage_box_date');}
    });
}

/**
 * Validates a given date input and checks if it is in the past.
 * Displays an error message if the date is invalid.
 * @param {string} dateStr - The date string in "DD/MM/YYYY" format.
 * @param {string} inputContainerId - The ID of the input container.
 * @param {string} errorBoxId - The ID of the error message box.
 */
function validateDate(dateStr, inputContainerId, errorBoxId) {
    const inputContainerRef = document.getElementById(inputContainerId);
    const errorBox = document.getElementById(errorBoxId);
    const selectedDate = parseDate(dateStr);
    const today = getTodayDate();

    if (isPastDate(selectedDate, today)) {
        showDateError(inputContainerRef, errorBox);
    } else {
        clearDateError(inputContainerRef, errorBox);
    }
}

/**
 * Parses a date string in "DD/MM/YYYY" format and returns a Date object.
 * @param {string} dateStr - The date string to parse.
 * @returns {Date} The parsed Date object.
 */
function parseDate(dateStr) {
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
}

/**
 * Gets today's date with the time set to midnight.
 * @returns {Date} The current date with hours, minutes, and seconds set to zero.
 */
function getTodayDate() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
}

/**
 * Checks if a given date is in the past.
 * @param {Date} selectedDate - The date to compare.
 * @param {Date} today - The current date.
 * @returns {boolean} True if the selected date is before today, otherwise false.
 */
function isPastDate(selectedDate, today) {
    return selectedDate < today;
}

/**
 * Displays an error message for an invalid date input.
 * @param {HTMLElement} inputContainerRef - The container element of the date input.
 * @param {HTMLElement} errorBox - The element where the error message will be displayed.
 */
function showDateError(inputContainerRef, errorBox) {
    inputContainerRef.classList.add('error__inputs');
    errorBox.innerHTML = "Please choose a current date!";
}

/**
 * Clears the error message for the date input.
 * @param {HTMLElement} inputContainerRef - The container element of the date input.
 * @param {HTMLElement} errorBox - The element where the error message is displayed.
 */
function clearDateError(inputContainerRef, errorBox) {
    inputContainerRef.classList.remove('error__inputs');
    errorBox.innerHTML = "";
}

/**
 * Renders the contact list in the dropdown.
 * @param {Array} currentContacts - The list of contacts to display.
 */
function renderContactList(currentContacts) {
    const sortedContacts = sortContactsByName(currentContacts);
    const contactHTML = generateContactHTML(sortedContacts);
    const dropDownRef = document.getElementById("dropdown_list");
    dropDownRef.innerHTML = "";
    dropDownRef.innerHTML += renderHTMLYouInContactList();
    dropDownRef.innerHTML += contactHTML;
}

/**
 * Sorts the contacts by their name alphabetically.
 * @param {Array} currentContacts - The list of contacts to sort.
 * @returns {Array} The sorted list of contacts.
 */
function sortContactsByName(currentContacts) {
    return currentContacts.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Generates the HTML structure for displaying the contacts.
 * @param {Array} currentContacts - The list of contacts to display.
 * @returns {string} The HTML string for the contact list.
 */
function generateContactHTML(currentContacts) {
    return currentContacts
        .map(contact => generateContactTemplate(contact))
        .join("");
}

/**
 * Renders the task category list in the dropdown menu.
 * Clears the existing content and inserts the updated category list.
 */
function renderTaskCategoryList() {
    const taskCategoryHTML = generateTaskCategoryHTML();
    const dropDownRef = document.getElementById("category_dropdown_list");
    dropDownRef.innerHTML = "";
    dropDownRef.innerHTML = taskCategoryHTML;
}

/**
 * Generates the HTML markup for the task category list.
 * @returns {string} The generated HTML string containing all task categories.
 */
function generateTaskCategoryHTML() {
    return taskCategories
        .map(category => generateTaskCategoryTemplate(category))
        .join("");
}

/**
 * Opens the dropdown list when the dropdown button is clicked.
 * @param {Event} event - The click event.
 */
function openDropdownList(event) {
    event.preventDefault();
    toggleDropdown('dropdown');
    toggleDNoneInputAndButtonDropDown('dropdown', 'dropdown_search');
    toggleDropDownListOverlay();
}

function toggleDropDownListOverlay() {
    const overlayDropdownListAddTaskContacts = document.getElementById('overlay_dropdown_list_add_task_contacts');
    overlayDropdownListAddTaskContacts.classList.toggle('d__none');
}

/**
 * Toggles the visibility of the dropdown list.
 */
function toggleDropdown(type) {
    const dropdownListWrapperRef = document.getElementById(type + '_list_wrapper');
    dropdownListWrapperRef.classList.toggle('open');
}

/**
 * Toggles the visibility of the search input and the dropdown button.
 */
function toggleDNoneInputAndButtonDropDown(button, input) {
    const dropDownButtonRef = document.getElementById(button + '_toggle');
    const dropDownSearchRef = document.getElementById(input + '_container');
    dropDownButtonRef.classList.toggle('d__none');
    dropDownSearchRef.classList.toggle('d__none');
    dropDownSearchRef.classList.toggle('dropdown__blue__border');
}

/**
 * Closes the dropdown list and renders the selected contacts list.
 * @param {Event} event - The click event.
 */
function closeDropDownList(event) {
    event.preventDefault();
    toggleDropdown('dropdown');
    toggleDNoneInputAndButtonDropDown('dropdown', 'dropdown_search');
    toggleDropDownListOverlay();
    renderChoosenContactList();
}

/**
 * Toggles the selection state of the current user when assigning tasks.
 * Updates the styling and checkbox state accordingly.
 * @param {Event} event - The event object to prevent default behavior.
 */
function updateCurrentUserChoosen(event) {
    if (event) event.preventDefault();
    currentUserChoosen = currentUserChoosen ? false : true;
    toggleCurrentUserChoosenStyling();
    updateCheckboxStateCurrentUser();
}

/**
 * Toggles the visual styling for the current user's selection.
 * Updates the dropdown item and checkbox visibility.
 */
function toggleCurrentUserChoosenStyling() {
    const contactRef = document.getElementById('contact_' + currentUser.name);
    contactRef.classList.toggle('dropdown__item__checked');

    const checkBoxBlueRef = document.getElementById('checkbox_blue_' + currentUser.name);
    checkBoxBlueRef.classList.toggle('d__none');

    const checkBoxWhiteRef = document.getElementById('checkbox_white_' + currentUser.name);
    checkBoxWhiteRef.classList.toggle('d__none');
}

/**
 * Updates the checkbox state for the current user.
 * Ensures the checkbox reflects whether the user is selected or not.
 */
function updateCheckboxStateCurrentUser() {
    const contactCheckBoxRef = document.getElementById('contact_checkbox_' + currentUser.name);
    if (currentUserChoosen) {
        contactCheckBoxRef.checked = true;
    } else {
        contactCheckBoxRef.checked = false;
    }
}

/**
 * Handles the selection of a contact.
 * @param {string} contactID - The ID of the selected contact.
 */
function contactChoosen(contactID) {
    const contact = contacts.find(contact => contact.id == contactID);
    toggleChoosenContactStyling(contactID);
    if(contact) {
        toggleChoosenContactToArray(contact);
        renderChoosenContactList();
    } 
}

/**
 * Toggles the styling of the selected contact in the dropdown list.
 * @param {string} contactID - The ID of the selected contact.
 */
function toggleChoosenContactStyling(contactID) {
    const contactRef = document.getElementById('contact_' + contactID);
    contactRef.classList.toggle('dropdown__item__checked');
    const checkBoxBlueRef = document.getElementById('checkbox_blue_' + contactID);
    checkBoxBlueRef.classList.toggle('d__none');
    const checkBoxWhiteRef = document.getElementById('checkbox_white_' + contactID);
    checkBoxWhiteRef.classList.toggle('d__none');
}

/**
 * Adds or removes a contact from the chosen contacts array.
 * @param {Object} contact - The contact to add or remove.
 */
function toggleChoosenContactToArray(contact) {
    const isContactAlreadySelected = choosenContacts.some(c => c.id === contact.id);
    if (isContactAlreadySelected) {
        removeContactFromArray(contact);
    } else {
        addContactToArray(contact);
    }
    updateCheckboxState(contact);
}

/**
 * Adds a contact to the chosen contacts array.
 * @param {Object} contact - The contact to add.
 */
function addContactToArray(contact) {
    choosenContacts.push(contact);
}

/**
 * Removes a contact from the chosen contacts array.
 * @param {Object} contact - The contact to remove.
 */
function removeContactFromArray(contact) {
    const index = choosenContacts.indexOf(contact);
    if (index > -1) {
        choosenContacts.splice(index, 1);
    }
}

/**
 * Updates the checkbox state to reflect the selection of a contact.
 * @param {Object} contact - The contact to update the checkbox state for.
 */
function updateCheckboxState(contact) {
    const contactCheckBoxRef = document.getElementById('contact_checkbox_' + contact.id);
    if (choosenContacts.some(c => c.id === contact.id)) {
        contactCheckBoxRef.checked = true;
    } else {
        contactCheckBoxRef.checked = false;
    }
}

/**
 * Renders the list of chosen contacts.
 */
function renderChoosenContactList() {
    const contentRef = document.getElementById('choosen_contacts_container');
    contentRef.innerHTML = "";
    if(currentUserChoosen) {
        contentRef.innerHTML += renderHTMLChoosenUser();
    }
    for (let i = 0; i < choosenContacts.length; i++) {
        contentRef.innerHTML += renderHTMLChoosenContact(choosenContacts[i]);
    }
}

/**
 * Filters the contacts based on the search input and updates the contact list accordingly.
 */
function filterContacts() {
    const searchInput = document.getElementById('assignee_search_input').value.toLowerCase();
    let filteredContacts = contacts.filter(contact => {
        return contact.name.toLowerCase().includes(searchInput);
    });
    let includesCurrentUser;
    if (currentUser.name.toLowerCase().includes(searchInput)) {
        includesCurrentUser = true;
    }
    renderFilteredContactList(filteredContacts, includesCurrentUser); 
    if (searchInput === "") {
        renderContactList(contacts);
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
    const contactHTML = generateContactHTML(sortedContacts);
    const dropDownRef = document.getElementById("dropdown_list");
    dropDownRef.innerHTML = "";
    if (includesCurrentUser) {
        dropDownRef.innerHTML += renderHTMLYouInContactList();
    }
    dropDownRef.innerHTML += contactHTML;
}

/**
 * Resets the add task form by clearing all input fields.
 */
function resetAddTaskForm() {
    const addTaskFormRef = document.getElementById('add_task_form');
    addTaskFormRef.reset();
    clearAddTaskForm();
}

/**
 * Handles the "Enter" key press event while adding a subtask.
 * @param {Event} event - The keydown event.
 */
function handleKeyDownAddSubTask(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        addSubtask(event);
    }
}

/**
 * Handles the "Enter" key press event while editing a subtask.
 * @param {number} subTaskID - The ID of the subtask being edited.
 * @param {Event} event - The keydown event.
 */
function handleKeyDownEditedSubTask(subTaskID, event) {
    if (event.key === "Enter") {
        event.preventDefault();
        saveEditedSubTask(subTaskID, event);
    }
}
