// Add Task: 

/**
 * Generates the HTML template for displaying a contact in the dropdown.
 * The contact's styling (e.g., selected state) is dynamically applied based on whether it is chosen.
 * @param {Object} contact - The contact to render.
 * @returns {string} The HTML string for the contact item.
 */
function generateContactTemplate(contact) {
    const isSelected = choosenContacts.some(c => c.id === contact.id);
    return `
        <li onclick="contactChoosen(${contact.id})" class="dropdown__item ${isSelected ? 'dropdown__item__checked' : ''}" id="contact_${contact.id}">
            <div class="dropdown__item__left">
                <div class="dropdown__avatar ${getBadgeColor(contact.name)}">${contact.initials}</div>
                <h3>${contact.name}</h3>
            </div>
            <label class="contact__checkbox__container">
                <input onclick="contactChoosen(${contact.id})" class="contact__checkbox" type="checkbox" id="contact_checkbox_${contact.id}" ${isSelected ? 'checked' : ''}>
                <span class="custom__checkbox ${isSelected ? 'd__none' : ''}" id="checkbox_blue_${contact.id}"></span>
                <span class="custom__checkbox__white ${isSelected ? '' : 'd__none'}" id="checkbox_white_${contact.id}"></span>
            </label>
        </li>
    `;
}

/**
 * Generates the HTML markup for displaying the current user in the contact list.
 * The current user has a unique label "(You)" and can be selected via a checkbox.
 * 
 * @returns {string} The generated HTML string for the current user in the contact list.
 */
function renderHTMLYouInContactList() {
    return `
        <li onclick="updateCurrentUserChoosen(event)" class="dropdown__item ${currentUserChoosen ? 'dropdown__item__checked' : ''}" id="contact_${currentUser.name}">
            <div class="dropdown__item__left">
                <div class="dropdown__avatar ${getBadgeColor(currentUser.name)}">${currentUser.initials}</div>
                <h3>${currentUser.name} (You)</h3>
            </div>
            <label class="contact__checkbox__container">
                <input onclick="updateCurrentUserChoosen(event)" class="contact__checkbox" type="checkbox" id="contact_checkbox_${currentUser.name}" ${currentUserChoosen ? 'checked' : ''}>
                <span class="custom__checkbox ${currentUserChoosen ? 'd__none' : ''}" id="checkbox_blue_${currentUser.name}"></span>
                <span class="custom__checkbox__white ${currentUserChoosen ? '' : 'd__none'}" id="checkbox_white_${currentUser.name}"></span>
            </label>
        </li>
    `;
}

/**
 * Generates the HTML markup for a task category in the dropdown menu.
 * When clicked, the selected category is set.
 * 
 * @param {string} category - The name of the task category.
 * @returns {string} The generated HTML string for a task category item.
 */
function generateTaskCategoryTemplate(category) {
    return `
        <li onclick="taskCategorySelected('${category}', event)" class="dropdown__item__category">
            <h3>${category}</h3>
        </li>
    `;
}

/**
 * Generates the HTML for a chosen contact to be displayed in the chosen contacts container.
 * The contact's avatar (including the badge color) and initials are rendered.
 * 
 * @param {Object} contact - The chosen contact to render.
 * @param {string} contact.name - The name of the contact (used to determine the badge color).
 * @param {string} contact.initials - The initials of the contact (displayed in the avatar).
 * 
 * @returns {string} The HTML string for displaying the chosen contact's avatar.
 */
function renderHTMLChoosenContact(contact) {
    return  `
            <div class="dropdown__avatar ${getBadgeColor(contact.name)}">${contact.initials}</div>
            `;
}

/**
 * Generates the HTML markup for displaying the currently chosen user.
 * This includes the user's avatar with the assigned badge color.
 * 
 * @returns {string} The generated HTML string for the chosen user avatar.
 */
function renderHTMLChoosenUser() {
    return  `
            <div class="dropdown__avatar ${getBadgeColor(currentUser.name)}">${currentUser.initials}</div>
            `;
}

/**
 * Generates the HTML markup for a subtask item.
 * Each subtask includes a name, an edit button, and a delete button.
 * 
 * @param {Object} subTask - The subtask object containing its ID and name.
 * @returns {string} The generated HTML string for the subtask.
 */
function renderHTMLSubtask(subTask) {
    return `
        <div ondblclick="openEditSubTask(${subTask.id}, event)" class="subtask__item" id="subtask_${subTask.id}">
            <div class="subtask__item__left">
                <span>•</span>
                ${subTask.name}
            </div>
            <div class="edit__and__delete__subtask__box">
                <button onclick="openEditSubTask(${subTask.id}, event)" class="edit__subtask__box__hover">
                    <img class="edit__subtask__icon" src="./assets/icons/edit_icon_subtask_blue.png" alt="Edit">
                    <img class="edit__subtask__icon__hover" src="./assets/icons/edit_icon_subtask_blue_hover.png" alt="Edit">
                </button>
                <div class="add__subtask__seperator"></div>
                <button onclick="deleteSubTask(${subTask.id}, event)" class="delete__subtask__box__hover">
                    <img class="delete__subtask__icon" src="./assets/icons/delete_icon_subtask_blue.png" alt="Delete">
                    <img class="delete__subtask__icon__hover" src="./assets/icons/delete_icon_subtask_blue_hover.png" alt="Delete">
                </button>
            </div>
        </div>
    `;
}

/**
 * Generates the HTML markup for editing a subtask.
 * Allows the user to modify the subtask name and provides buttons for saving or deleting.
 * 
 * @param {Object} subTask - The subtask object containing its ID and name.
 * @returns {string} The generated HTML string for editing a subtask.
 */
function renderHTMLEditSubTask(subTask) {
    return  `   
            <div class="subtask__item__edited" id="subtask_${subTask.id}">
                <input onkeydown="handleKeyDownEditedSubTask(${subTask.id}, event)" class="subtask__edit__input" type="text" id="subtask_edit_input" value="${subTask.name}">
              <label for="subtask_edit_input">
                <button onclick="deleteSubTask(${subTask.id}, event)" class="delete__subtask__box__hover">
                    <img class="delete__subtask__icon" src="./assets/icons/delete_icon_subtask_blue.png" alt="Delete">
                    <img class="delete__subtask__icon__hover" src="./assets/icons/delete_icon_subtask_blue_hover.png" alt="Delete">
                </button>
                <div class="add__subtask__seperator"></div>
                <button onclick="saveEditedSubTask(${subTask.id}, event)" class="check__subtask__box__hover">
                  <img class="check__subtask__icon" src="./assets/icons/hook_icon_subtask_blue.png" alt="Hook">
                  <img class="check__subtask__icon__hover" src="./assets/icons/hook_icon_subtask_blue_hover.png" alt="Hook">
                </button>
              </label>
            </div>
            `;
}
