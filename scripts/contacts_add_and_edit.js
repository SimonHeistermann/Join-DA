/**
 * Validates a phone number input field.
 * @param {string} id - The ID of the phone input field.
 * @param {string} containerClass - The CSS class of the input container.
 * @returns {string|null} Error message if validation fails, otherwise null.
 */
function validatePhone(id, containerClass) {
    const phone = document.getElementById(id).value.trim().replace(/\s+/g, '');
    const phoneRegex = /^(?:\+?[0-9]{1,3})?[1-9][0-9]{4,14}$/;
    const container = document.querySelector(`.${containerClass}`);
    if (!phoneRegex.test(phone)) {
        removeAllErorrInputStyling();
        container.classList.add('error__inputs');
        return "Check your Phonenumber. Please try again.";
    } else {
        removeAllErorrInputStyling();
        return null;
    }
}

/**
 * Removes error styling from all input containers.
 */
function removeAllErorrInputStyling() {
    const inputContainers = ["person__container", "email__container", "phone__container"];
    for (let i = 0; i < inputContainers.length; i++) {
        if (inputContainers[i]) {
            const inputContainerRef = document.querySelector(`.${inputContainers[i]}`);
            inputContainerRef.classList.remove('error__inputs');
        }
    }
}

/**
 * Updates the error message box with the given error message.
 * @param {string|null} error - The error message to display, or null to hide the box.
 */
function updateErrorBox(error) {
    const box = document.getElementById("errormessage_box");
    box.innerText = error || "";
    box.style.display = error ? "block" : "none";
}

/**
 * Processes the form submission for adding or editing a contact.
 * @param {string} type - The type of form action ("add" or "edit").
 */
async function processForm(type) {
    let newContact = null;
    let updatedContact = null;
    if(type === 'add') newContact = await addNewContact();
    else if(type === 'edit') updatedContact = await editContact();
    document.querySelector(".add__contact__form").reset();
    closeContactOverlay();
    await initContacts();
    if (newContact) {
        openNewlyAddedContact(newContact);
        displayContactSuccNotification("created");
    }
    if(updatedContact) {
        openUpdatedContact(updatedContact);
        displayContactSuccNotification("edited");
    } 
}

/**
 * Creates and adds a new contact to the contacts list.
 * @returns {Promise<Object>} The newly created contact object.
 */
async function addNewContact() {
    const newContact = {
        name: document.getElementById("person_input_add_contact").value,
        email: document.getElementById("email_input_add_contact").value,
        tel: document.getElementById("phone_input_add_contact").value,
        initials: getInitials(document.getElementById("person_input_add_contact").value),
        id: getNextAvailableId()
    };
    contacts.push(newContact);
    await putData("contacts", contacts);
    return newContact;
}

/**
 * Edits an existing contact in the contacts list.
 * @returns {Promise<Object>} The updated contact object.
 */
async function editContact() {
    const contactId = currentContactID;
    const updatedContact = {
        name: document.getElementById("person_input_add_contact").value,
        email: document.getElementById("email_input_add_contact").value,
        tel: document.getElementById("phone_input_add_contact").value,
        initials: getInitials(document.getElementById("person_input_add_contact").value),
        id: contactId
    };
    contacts = contacts.map(contact => 
        contact.id === contactId ? updatedContact : contact
    );
    await putData(`contacts/${contactId}`, updatedContact);
    return updatedContact;
}

/**
 * Opens the details of a newly added contact.
 * @param {Object} newContact - The newly added contact object.
 */
function openNewlyAddedContact(newContact) {
    setTimeout(() => {
        const contactElements = document.querySelectorAll(".contact");
        contactElements.forEach(contactElement => {
            const contactData = JSON.parse(contactElement.getAttribute("data-contact"));
            if (contactData.email === newContact.email) {
                openContactDetails(contactElement);
            }
        });
    }, 300);
}

/**
 * Displays a success notification after creating or editing a contact.
 * @param {string} type - The action type ("created" or "edited").
 */
function displayContactSuccNotification(type) {
    setTimeout(() => {
        const notificationRef = document.getElementById(`contact_notification`);
        notificationRef.innerHTML = `<h3>Contact successfully ${type}</h3>`;
        notificationRef.classList.remove('contact__created__notification__active');
        notificationRef.classList.remove('d__none');
        notificationRef.classList.add('contact__created__notification__active');
    }, 400);
    setTimeout(() => {
        const notificationRef = document.getElementById(`contact_notification`);
        notificationRef.classList.add('d__none');
        notificationRef.classList.remove('contact__created__notification__active');
    }, 2400);
}

/**
 * Opens the details of an updated contact.
 * @param {Object} updatedContact - The updated contact object.
 */
function openUpdatedContact(updatedContact) {
    setTimeout(() => {
        const contactElements = document.querySelectorAll(".contact");
        contactElements.forEach(contactElement => {
            const contactData = JSON.parse(contactElement.getAttribute("data-contact"));
            if (contactData.id === updatedContact.id) {
                openContactDetails(contactElement);
            }
        });
    }, 300);
}

/**
 * Deletes a contact from the contacts list.
 * @param {HTMLElement} contactElement - The contact element in the UI.
 * @param {Event} event - The event object to prevent default behavior.
 * @param {string} from - The source of deletion ("edit_contact" or other).
 */
async function deleteContact(contactElement, event, from) {
    if (event) event.preventDefault();
    const contactData = JSON.parse(contactElement.getAttribute('data-contact'));
    const contactId = contactData.id;
    try {
        await deleteData(`contacts/${contactId}`);
        contacts = contacts.filter(contact => contact.id !== contactId);
        await removeContactFromTasks(contactData.name);
        if(from === "edit_contact") closeContactOverlay();
        await initContacts();
        const contactDetailsRef = document.getElementById('contact_overview');
        contactDetailsRef.innerHTML = "";
    } catch (error) { console.error("Error while deleting contact:", error); }
}

/**
 * Removes a deleted contact from all assigned_to lists in tasks and updates the database.
 * @param {string} contactName - The name of the contact to remove.
 */
async function removeContactFromTasks(contactName) {
    let tasksUpdated = false;
    tasks.forEach(task => {
        if (task.assigned_to) {
            let assignedToArray = Object.values(task.assigned_to);
            if (assignedToArray.includes(contactName)) {
                let updatedAssignedTo = assignedToArray.filter(name => name !== contactName);
                task.assigned_to = Object.fromEntries(updatedAssignedTo.map((name, index) => [index.toString(), name]));
                tasksUpdated = true;
            }
        }
    });
    if (tasksUpdated) await putData("tasks", tasks);
}

/**
 * Navigates back to the contact table view.
 * Removes active styling from the contact box and resets mobile view styling.
 */
function backToContactTable() {
    removeAllContactBoxActiveStyling();
    removeActiveOverviewStylingMobile();
}

/**
 * Opens the menu for contact options by toggling the visibility of the fly-in menu.
 */
function openMenuContactOptions() {
    const addAndEditFlyInRef = document.getElementById('add_and_edit_fly_in');
    addAndEditFlyInRef.classList.toggle('add__and__edit__fly__in__active');
    const overlayAddAndEditFlyInRef = document.getElementById('overlay_add_and_edit_fly_in');
    overlayAddAndEditFlyInRef.classList.toggle('d__none');
}

/**
 * Closes the menu for contact options by toggling the visibility of the fly-in menu.
 */
function closeMenuContactOptions() {
    const addAndEditFlyInRef = document.getElementById('add_and_edit_fly_in');
    addAndEditFlyInRef.classList.toggle('add__and__edit__fly__in__active');
    const overlayAddAndEditFlyInRef = document.getElementById('overlay_add_and_edit_fly_in');
    overlayAddAndEditFlyInRef.classList.toggle('d__none');
}

/**
 * Checks if a given contact is the current user by comparing email, name, and initials.
 * @param {Object} contact - The contact object to check.
 * @param {Object} currentUser - The current user object.
 * @returns {boolean} - Returns true if the contact is the current user, otherwise false.
 */
function isCurrentUser(contact) {
    if (!contact || !currentUser) return false;
    return (
        contact.email === currentUser.email &&
        contact.name === currentUser.name &&
        contact.initials === currentUser.initials
    );
}

/**
 * Opens the edit overlay for the current user.
 */
function openEditCurrentUser() {
    const contentRef = document.getElementById('contact_overlay_content');
    toggleDnoneFromOverlay();
    renderCurrentUserOverlayContent(contentRef);
    const containerRef = document.getElementById('add_contact_container');
    addActiveOverviewStyling(containerRef);
    fixateScrollingOnBody();
}

/**
 * Renders the HTML content for editing the current user inside the overlay.
 * @param {HTMLElement} contentRef - The container element for the overlay content.
 */
function renderCurrentUserOverlayContent(contentRef) {
    contentRef.innerHTML = "";
    contentRef.innerHTML += renderHTMLEditCurrentUserOverlay();
}

/**
 * Handles the submission of the edited current user data.
 * @param {Event} event - The event triggered by form submission.
 */
async function handleEditedCurrentUser(event) {
    if (event) event.preventDefault();
    document.getElementById('create_edit_contact_button').onclick = false;
    const error = validateInputs();
    updateErrorBox(error);
    if (!error) await processFormCurrentUser();
}

/**
 * Processes the form data for the current user update.
 * Updates local storage and Firebase, then refreshes the UI.
 */
async function processFormCurrentUser() {
    updateCurrentUserLocalStorage();
    await updateCurrentUserFireBase();
    document.querySelector(".add__contact__form").reset();
    closeContactOverlay();
    await initContacts();
    openUpdatedCurrentUser();
    displayCurrentUserSuccNotification();
}

/**
 * Updates the current user data in local storage.
 */
function updateCurrentUserLocalStorage() {
    const updatedCurrentUser = {
        name: document.getElementById("person_input_add_contact").value,
        email: document.getElementById("email_input_add_contact").value,
        tel: document.getElementById("phone_input_add_contact").value,
        initials: getInitials(document.getElementById("person_input_add_contact").value),
    };
    if (updatedCurrentUser.email) currentUser = updatedCurrentUser;

    const currentUserLocalStorage = {
        email: currentUser.email,
        initials: currentUser.initials,
        name: currentUser.name,
        tel: currentUser.tel
    };
    localStorage.setItem('currentUser', JSON.stringify(currentUserLocalStorage));
}

/**
 * Updates the current user data in Firebase.
 * Finds the user in the database and updates their information.
 */
async function updateCurrentUserFireBase() {
    let userIndex = users.findIndex(user => user.email === currentUser.email);
    if (userIndex === -1) return;
    users[userIndex] = { ...users[userIndex], ...currentUser };
    await putData("users", users);
}

/**
 * Opens the details of the updated current user.
 */
function openUpdatedCurrentUser() {
    setTimeout(() => {
        const contactElements = document.querySelectorAll(".contact");
        contactElements.forEach(contactElement => {
            const contactData = JSON.parse(contactElement.getAttribute("data-contact"));
            if (contactData.email === currentUser.email) {
                openContactDetails(contactElement);
            }
        });
    }, 300);
}

/**
 * Displays a success notification after editing the current user.
 */
function displayCurrentUserSuccNotification() {
    setTimeout(() => {
        const notificationRef = document.getElementById(`contact_notification`);
        notificationRef.innerHTML = `<h3>User successfully edited</h3>`;
        notificationRef.classList.remove('contact__created__notification__active');
        notificationRef.classList.remove('d__none');
        notificationRef.classList.add('contact__created__notification__active');
    }, 400);

    setTimeout(() => {
        const notificationRef = document.getElementById(`contact_notification`);
        notificationRef.classList.add('d__none');
        notificationRef.classList.remove('contact__created__notification__active');
    }, 2400);
}



