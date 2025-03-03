// Contacts:

/**
 * Renders the "Add Contact" button HTML.
 * @returns {string} HTML string for the "Add Contact" button.
 */
function renderHTMLAddContactButton() {
    return `
        <div class="add__contact__button__container">
            <button onclick="openAddNewContact()" class="add__contact__button" id="add_contact_button">
                Add new contact
                <img src="./assets/icons/person_add_icon_white.png" alt="Add Contact Icon">
            </button>
        </div>
    `;
}

/**
 * Generates a contact section grouped by the first letter of the contacts' names.
 * @param {string} letter - The first letter of the contact group.
 * @param {Object[]} contacts - Array of contact objects belonging to the group.
 * @returns {string} HTML string for the contact section.
 */
function generateHTMLContactSection(letter, contacts) {
    return `
        <div class="contacts__sections">
            <h3 class="contacts__lettertext">${letter}</h3>
            <div class="contacts__seperator"></div>
            <div class="contact__boxes">
                ${contacts.map(generateHTMLContactBox).join("")}
            </div>
        </div>
    `;
}

/**
 * Generates an individual contact box.
 * @param {Object} contact - Contact object containing details like name, email, and initials.
 * @returns {string} HTML string for the contact box.
 */
function generateHTMLContactBox(contact) {
    return `
        <div onclick="openContactDetails(this)" class="contact" data-contact='${JSON.stringify(contact)}'>
            <div class="contacts__profilebadge ${getBadgeColor(contact.name)}">${contact.initials}</div>
            <div class="contact__informationbox">
                <h3>${formatContactName(contact.name)}</h3>
                <span class="contact__mailtext">${contact.email}</span>
            </div>
        </div>
    `;
}


/**
 * Renders the contact details section.
 * @param {Object} contact - Contact object containing name, email, phone, and initials.
 * @returns {string} HTML string for the contact details.
 */
function renderHTMLContactDetails(contact) {
    return  `
            <div class="contact__name__box">
                <div class="contacts__profilebadge__big ${getBadgeColor(contact.name)}">${contact.initials}</div>
                <div class="contacts__name__box__right">
                    <span class="contact__name__bigtext">${contact.name}</span>
                    <div class="contact__buttons__container">
                        <button onclick="${isCurrentUser(contact) ? 'openEditCurrentUser()' : `openEditContact(this)`}" class="edit__contact__button" data-contact='${JSON.stringify(contact)}'>
                            <img class="edit__icon__default" src="./assets/icons/edit_icon_blue.png" alt="Edit Icon">
                            <img class="edit__icon__hover" src="./assets/icons/edit_icon_lightblue.png" alt="Edit Icon">
                            Edit
                        </button>
                        ${isCurrentUser(contact) ? "" : `
                            <button onclick="deleteContact(this)" class="delete__contact__button" data-contact='${JSON.stringify(contact)}'>
                                <img class="delete__icon__default" src="./assets/icons/delete_icon_blue.png" alt="Delete Icon">
                                <img class="delete__icon__hover" src="./assets/icons/delete_icon_lightblue.png" alt="Delete Icon">
                                Delete
                            </button>
                        `}
                    </div>
                </div>
            </div>
            <h3>Contact Information</h3>
            <div class="contact__information__boxes">
                <div class="contact__information__containers">
                <span class="contact__information__headlines">Email</span>
                    <a class="contact__mailtext" href="mailto:${contact.email}" title="Send an email to ${contact.email}" aria-label="Email ${contact.email}">${contact.email}</a>
                </div>
                ${contact.tel ? 
                    `<div class="contact__information__containers">
                        <span class="contact__information__headlines">Phone</span>
                        <a class="contact__phonenumber" href="tel:${contact.tel}" title="Call ${contact.tel}1" aria-label="Phone number ${contact.tel}">${contact.tel}</a>
                    </div>` : 
                ""}
            </div>
            `;
}

/**
 * Renders the edit contact overlay with pre-filled data.
 * @param {Object} contact - Contact object containing name, email, phone, and initials.
 * @returns {string} HTML string for the edit contact overlay.
 */
function renderHTMLEditContactOverlay(contact) {
    return  `
            <div onclick="event.stopPropagation();" class="add__contact__overlay" id="add_contact_container">
                <div class="add__contact__overlay__left">
                    <div class="add__contact__overlay__left__content">
                        <img src="./assets/icons/logo_add_contact_overlay.png" alt="Join Logo">
                        <h1>Edit contact</h1>
                        <div class="add__contact__overlay__seperator"></div>
                    </div>
                </div>
                <div class="add__contact__overlay__right">
                    <div class="contacts__profilebadge__big contacts__profilebadge__big__mobile ${getBadgeColor(contact.name)}">
                        ${contact.initials}
                    </div>
                    <div class="close__button__box">  
                        <button onclick="closeContactOverlay()" class="close__button">
                            <img class="close__button__img" src="./assets/icons/close_icon_blue.png" alt="Close Icon">
                            <img class="close__button__hover__img" src="./assets/icons/close_icon_blue_hover.png" alt="Close Icon Hover">
                        </button>
                    </div>
                    <form onsubmit="handleFormSubmit(event, 'edit')" class="add__contact__form">
                        <div class="add__contact__container">
                            <div class="contacts__profilebadge__big contacts__profilebadge__big__mobile__dnone ${getBadgeColor(contact.name)}">
                                ${contact.initials}
                            </div>
                            <div class="add__contact__inputbox">
                                <div class="person__container">
                                    <input class="person__input" id="person_input_add_contact" type="text" name="name" placeholder="Name" value="${contact.name}" autocomplete="name">
                                    <label for="person_input_add_contact">
                                        <img class="person__logo" src="./assets/icons/person_icon_gray.png" alt="Person Icon">
                                    </label>
                                </div>
                                <div class="email__container">
                                    <input class="email__input" id="email_input_add_contact" type="text" name ="email" placeholder="Email" autocomplete="email" value="${contact.email}"> 
                                    <label for="email_input_add_contact">
                                        <img class="email__logo" src="./assets/icons/mail_icon_gray.png" alt="Email Icon">
                                    </label>
                                </div>
                                <div class="phone__box">
                                    <div class="phone__container">
                                        <input class="phone__input" id="phone_input_add_contact" type="text" name ="phone" placeholder="Phone" autocomplete="tel" value="${contact.tel}">
                                        <label for="phone_input_add_contact">
                                            <img class="phone__logo" src="./assets/icons/phone_icon_gray.png" alt="Phone Icon">
                                        </label>
                                    </div>
                                    <div class="errormessage__box" id="errormessage_box">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="edit__contact__buttonbox">
                            <button type="button" onclick="deleteContact(this, event, 'edit_contact')" class="delete__button" data-contact='${JSON.stringify(contact)}'>Delete</button>
                            <button type="submit" class="save__button" id="create_edit_contact_button">
                                Save
                                <img src="./assets/icons/hook_icon_white.png" alt="Hook Icon">
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            `;
}

/**
 * Renders the add contact overlay.
 * @returns {string} HTML string for the add contact overlay.
 */
function renderHTMLAddContactOverlay() {
    return  `
            <div onclick="event.stopPropagation();" class="add__contact__overlay" id="add_contact_container">
                <div class="add__contact__overlay__left">
                    <div class="add__contact__overlay__left__content">
                        <img src="./assets/icons/logo_add_contact_overlay.png" alt="Join Logo">
                        <h1>Add contact</h1>
                        <h2>Tasks are better with a team!</h2>
                        <div class="add__contact__overlay__seperator"></div>
                    </div>
                </div>
                <div class="add__contact__overlay__right">
                    <div class="default__profilebadge default__profilebadge__mobile">
                                <img src="./assets/icons/person_icon_white.png" alt="Person">
                    </div>
                    <div class="close__button__box">  
                        <button onclick="closeContactOverlay()" class="close__button">
                            <img class="close__button__img" src="./assets/icons/close_icon_blue.png" alt="Close Icon">
                            <img class="close__button__hover__img" src="./assets/icons/close_icon_blue_hover.png" alt="Close Icon Hover">
                        </button>
                    </div>
                    <form onsubmit="handleFormSubmit(event, 'add')" class="add__contact__form">
                        <div class="add__contact__container">
                            <div class="default__profilebadge">
                                <img src="./assets/icons/person_icon_white.png" alt="Person">
                            </div>
                            <div class="add__contact__inputbox">
                                <div class="person__container">
                                    <input class="person__input" id="person_input_add_contact" type="text" name="name" placeholder="Name" autocomplete="name">
                                    <label for="person_input_add_contact">
                                        <img class="person__logo" src="./assets/icons/person_icon_gray.png" alt="Person Icon">
                                    </label>
                                </div>
                                <div class="email__container">
                                    <input class="email__input" id="email_input_add_contact" type="text" name="email" placeholder="Email" autocomplete="email">
                                    <label for="email_input_add_contact">
                                        <img class="email__logo" src="./assets/icons/mail_icon_gray.png" alt="Email Icon">
                                    </label>
                                </div>
                                <div class="phone__box">
                                    <div class="phone__container">
                                        <input class="phone__input" id="phone_input_add_contact" type="text" name ="phone" placeholder="Phone" autocomplete="tel">
                                        <label for="phone_input_add_contact">
                                            <img class="phone__logo" src="./assets/icons/phone_icon_gray.png" alt="Phone Icon">
                                        </label>
                                    </div>
                                    <div class="errormessage__box" id="errormessage_box">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="add__contact__buttonbox">
                            <button onclick="cancelForm(event)" class="cancel__button">
                                Cancel
                                <img class="cancel__button__img" src="./assets/icons/cancel_icon_blue.png" alt="Cancel Icon">
                                <img class="cancel__button__img__hover" src="./assets/icons/cancel_icon_lightblue.png" alt="Cancel Icon">
                            </button>
                            <button type="submit" class="create__contact__button" id="create_edit_contact_button">
                                Create contact
                                <img src="./assets/icons/hook_icon_white.png" alt="Hook Icon">
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            `;
}

/**
 * Renders the edit contact overlay with pre-filled data.
 * @param {Object} contact - Contact object containing name, email, phone, and initials.
 * @returns {string} HTML string for the edit contact overlay.
 */
function renderHTMLEditCurrentUserOverlay() {
    return  `
            <div onclick="event.stopPropagation();" class="add__contact__overlay" id="add_contact_container">
                <div class="add__contact__overlay__left">
                    <div class="add__contact__overlay__left__content">
                        <img src="./assets/icons/logo_add_contact_overlay.png" alt="Join Logo">
                        <h1>Edit contact</h1>
                        <div class="add__contact__overlay__seperator"></div>
                    </div>
                </div>
                <div class="add__contact__overlay__right">
                    <div class="contacts__profilebadge__big contacts__profilebadge__big__mobile ${getBadgeColor(currentUser.name)}">
                        ${currentUser.initials}
                    </div>
                    <div class="close__button__box">  
                        <button onclick="closeContactOverlay()" class="close__button">
                            <img class="close__button__img" src="./assets/icons/close_icon_blue.png" alt="Close Icon">
                            <img class="close__button__hover__img" src="./assets/icons/close_icon_blue_hover.png" alt="Close Icon Hover">
                        </button>
                    </div>
                    <form onsubmit="handleEditedCurrentUser(event)" class="add__contact__form">
                        <div class="add__contact__container">
                            <div class="contacts__profilebadge__big contacts__profilebadge__big__mobile__dnone ${getBadgeColor(currentUser.name)}">
                                ${currentUser.initials}
                            </div>
                            <div class="add__contact__inputbox">
                                <div class="person__container">
                                    <input class="person__input" id="person_input_add_contact" type="text" name="name" placeholder="Name" value="${currentUser.name}" autocomplete="name">
                                    <label for="person_input_add_contact">
                                        <img class="person__logo" src="./assets/icons/person_icon_gray.png" alt="Person Icon">
                                    </label>
                                </div>
                                <div class="email__container">
                                    <input class="email__input" id="email_input_add_contact" type="text" name ="email" placeholder="Email" autocomplete="email" value="${currentUser.email}"> 
                                    <label for="email_input_add_contact">
                                        <img class="email__logo" src="./assets/icons/mail_icon_gray.png" alt="Email Icon">
                                    </label>
                                </div>
                                <div class="phone__box">
                                    <div class="phone__container">
                                        <input class="phone__input" id="phone_input_add_contact" type="text" name ="phone" placeholder="Phone" autocomplete="tel" value="${currentUser.tel ? currentUser.tel : ""}">
                                        <label for="phone_input_add_contact">
                                            <img class="phone__logo" src="./assets/icons/phone_icon_gray.png" alt="Phone Icon">
                                        </label>
                                    </div>
                                    <div class="errormessage__box" id="errormessage_box">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="edit__current__user__buttonbox">
                            <button type="submit" class="save__button__current__user" id="create_edit_contact_button">
                                Save
                                <img src="./assets/icons/hook_icon_white.png" alt="Hook Icon">
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            `;
}

/**
 * Generates the HTML markup for the mobile contact details menu.
 * This menu allows users to edit or delete a contact.
 * 
 * @param {Object} contact - The contact object containing contact details.
 * @returns {string} The generated HTML string for the contact menu.
 */
function renderHTMLContactDetailsMobileMenu(contact) {
    return  `
            <div onclick="closeMenuContactOptions()" id="overlay_add_and_edit_fly_in" class="overlay__add__and__edit__fly__in d__none">
                <div id="add_and_edit_fly_in" class="add__and__edit__fly__in">
                    <button onclick="${isCurrentUser(contact) ? 'openEditCurrentUser()' : `openEditContact(this)`}" class="edit__contact__button" data-contact='${JSON.stringify(contact)}'>
                        <img class="edit__icon__default" src="./assets/icons/edit_icon_blue.png" alt="Edit Icon">
                        <img class="edit__icon__hover" src="./assets/icons/edit_icon_lightblue.png" alt="Edit Icon">
                        Edit
                    </button>
                    ${isCurrentUser(contact) ? "" : `
                        <button onclick="deleteContact(this)" class="delete__contact__button" data-contact='${JSON.stringify(contact)}'>
                            <img class="delete__icon__default" src="./assets/icons/delete_icon_blue.png" alt="Delete Icon">
                            <img class="delete__icon__hover" src="./assets/icons/delete_icon_lightblue.png" alt="Delete Icon">
                            Delete
                        </button>
                    `}
                </div>
            </div>
            `;
}


// Summary:

/**
 * Generates the HTML markup for the summary dashboard.
 * Displays key metrics such as tasks in progress, completed tasks, urgent tasks, and upcoming deadlines.
 * Also includes a greeting message based on the logged-in user.
 * 
 * @param {Object} currentUser - The currently logged-in user.
 * @returns {string} The generated HTML string for the summary dashboard.
 */
function renderHTMLSummary(currentUser) {
    if (currentUser.name === "Guest") guestIndicator = true;
    return  `
            <div class="keymetrics__container">
                <div class="firstrow__keymetrics">
                    <div class="firstrow__behindbox">
                        <div class="keymetrics__box keymetrics__todo" onclick="openBoardWebsite()">
                            <div class="todo__icon">
                                <img class="white__todoicon" src="./assets/icons/edit_icon_todo_white.png" alt="Edit">
                                <img class="blue__todoicon" src="./assets/icons/edit_icon_todo_blue.png" alt="Edit">
                            </div>
                            <div class="todo__textbox">
                                <span class="keymetrics__number">${tasksInStatusToDoAmount}</span>
                                <h3 class="keymetrics__text">To-do</h3>
                            </div>
                        </div>
                    </div>
                    <div class="firstrow__behindbox">
                        <div class="keymetrics__box keymetrics__done" onclick="openBoardWebsite()">
                            <div class="done__icon">
                                <img class="white__doneicon" src="./assets/icons/hook_icon_done_white.png" alt="Hook">
                                <img class="blue__doneicon" src="./assets/icons/hook_icon_done_blue.png" alt="Hook">
                            </div>
                            <div class="done__textbox">
                                <span class="keymetrics__number">${tasksInStatusDoneAmount}</span>
                                <h3 class="keymetrics__text">Done</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="secondrow__keymetrics">
                    <div class="secondrow__behindbox">
                        <div class="keymetrics__box keymetrics__urgent" onclick="openBoardWebsite()">
                            <div class="urgent__leftbox">
                                <div class="urgent__icon">
                                    <img src="./assets/icons/arrows_up_urgent_icon_white.png" alt="Arrows Up">
                                </div>
                                <div class="urgent__textbox">
                                    <span class="keymetrics__number">${tasksInPrioUrgend}</span>
                                    <h3 class="keymetrics__text">Urgent</h3>
                                </div>
                            </div>
                            <div class="urgent__seperator"></div>
                            <div class="urgent__textboxright">
                                <span id="urgent_date_container" class="urgent__date">${earliestDueDate}</span>
                                <span class="keymetrics__text">Upcoming Deadline</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="thirdrow__keymetrics">
                    <div class="thirdrow__behindbox">
                        <div class="keymetrics__box keymetrics__lastrow" onclick="openBoardWebsite()">
                            <span class="keymetrics__number">${tasks.length}</span>
                            <h3 class="keymetrics__textthirdrow">Tasks in Board</h3>
                        </div>
                    </div>
                    <div class="thirdrow__behindbox">
                        <div class="keymetrics__box keymetrics__lastrow" onclick="openBoardWebsite()">
                            <span class="keymetrics__number">${tasksInStatusProgressAmount}</span>
                            <h3 class="keymetrics__textthirdrow">Tasks in Progress</h3>
                        </div>
                    </div>
                    <div class="thirdrow__behindbox">
                        <div class="keymetrics__box keymetrics__lastrow" onclick="openBoardWebsite()">
                            <span class="keymetrics__number">${tasksInStatusAwaitingFeedbackAmount}</span>
                            <h3 class="keymetrics__textthirdrow">Awaiting Feedback</h3>
                        </div>
                    </div>
                </div>
            </div>
            <div class="greet__box">
                <span class="greeting">${getGreeting()}${guestIndicator ? "!" : ","}</span>
                <span class="greeting__name">${guestIndicator ? "" : currentUser.name}</span>
            </div>
            `;
}

/**
 * Generates the HTML markup for the mobile greeting box.
 * Displays a personalized greeting based on the logged-in user.
 * 
 * @returns {string} The generated HTML string for the mobile greeting box.
 */
function renderHTMLMobileGreeting() {
    if (currentUser.name === "Guest") guestIndicator = true;
    return  `
            <div class="greet__box__mobile" id="greet_box_mobile">
                <span class="greeting">${getGreeting()}${guestIndicator ? "!" : ","}</span>
                <span class="greeting__name">${guestIndicator ? "" : currentUser.name}</span>
            </div>
            `;
}
