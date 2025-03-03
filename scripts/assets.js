/**
 * Reloads the current website by reassigning the location.
 */
function reloadWebsite() {
    location.href = location.href;
}

/**
 * Redirects the user to the login page with an animation.
 */
function openLoginWithAnimation() {
    window.location.href = 'login.html';
}

/**
 * Redirects the user to the login page without playing the animation.
 * Adds a query parameter to indicate that the animation should be skipped.
 */
function openLoginWithoutAnimation() {
    window.location.href = 'login.html?skipAnimation=true';
}

/**
 * Redirects the user to the registration page.
 */
function openSignUpWebsite() {
    window.location.href = 'register.html';
}

/**
 * Redirects the user to the summary page.
 */
function openSummaryWebsite() {
    window.location.href = 'summary.html';
}

/**
 * Redirects the user to the summary page without playing the mobile animation.
 * Adds a query parameter to indicate that the mobile animation should be skipped.
 */
function openSummaryWebsiteWithoutMobileAnimation() {
    window.location.href = 'summary.html?skipMobileAnimation=true';
}

/**
 * Redirects the user to the add task page.
 */
function openAddTaskWebsite() {
    window.location.href = 'add_task.html';
}

/**
 * Redirects the user to the board page.
 */
function openBoardWebsite() {
    window.location.href = 'board.html';
}

/**
 * Redirects the user to the contacts page.
 */
function openContactsWebsite() {
    window.location.href = 'contacts.html';
}

/**
 * Redirects the user to the privacy policy page.
 */
function openPrivacyPolicyWebsite() {
    window.location.href = 'privacy_policy.html';
}

/**
 * Redirects the user to the legal notice page.
 */
function openLegalNoticeWebsite() {
    window.location.href = 'legal_notice.html';
}

/**
 * Redirects the user to the privacy policy page without login requirements.
 */
function openPrivacyPolicyWebsiteNoLogin() {
    window.location.href = 'privacy_policy_nologin.html';
}

/**
 * Redirects the user to the legal notice page without login requirements.
 */
function openLegalNoticeWebsiteNoLogin() {
    window.location.href = 'legal_notice_nologin.html';
}

/**
 * Redirects the user to the help page.
 */
function openHelpWebsite(from) {
    if(from) lastPage = from;
    localStorage.setItem('lastPage', JSON.stringify(lastPage));
    window.location.href = 'help.html';
}

/**
 * Toggles the visibility of the submenu by adding or removing the 'd__none' class.
 */
function toggleSubMenu() {
    const subMenuRef = document.getElementById('submenu');
    subMenuRef.classList.toggle('d__none');
    const overlaySubMenuRef = document.getElementById('overlay_submenu');
    overlaySubMenuRef.classList.toggle('d__none');
}

/**
 * Prevents scrolling on the body by fixing its position and storing the scroll position.
 */
function fixateScrollingOnBody() {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    let scrollY = window.scrollY;
    if (scrollY > 0) {
        document.documentElement.style.scrollBehavior = 'unset';
        document.body.style.top = `-${scrollY}px`;
    }
}

/**
 * Restores scrolling on the body and resets the stored scroll position.
 */
function releaseScrollOnBody() {
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";
    const scrollY = document.body.style.top;
    document.body.style.position = '';
    document.body.style.top = '';
    window.scrollTo(0, parseInt(scrollY || '0') * -1);
}

/**
 * Toggles the "d__none" class on the contact overlay element to show or hide it.
 */
function toggleDnoneFromOverlay() {
    const overlayRef = document.getElementById('contact_overlay');
    if (overlayRef) overlayRef.classList.toggle('d__none');
}

/**
 * Generates the initials of a given name.
 * @param {string} name - The full name of the contact.
 * @returns {string} The initials of the name (e.g., "John Doe" -> "JD").
 */
function getInitials(name) {
    const nameParts = name.trim().split(" ");
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    const firstNameInitial = nameParts[0].charAt(0).toUpperCase();
    const lastNameInitial = nameParts[nameParts.length - 1].charAt(0).toUpperCase();
    return firstNameInitial + lastNameInitial;
}

/**
 * Determines the badge color based on the contact name.
 * @param {string} name - The contact's name.
 * @returns {string} - The badge color class.
 */
function getBadgeColor(name) {
    const totalColors = 15;
    const index = (name.charCodeAt(0) + name.charCodeAt(name.length - 1)) % totalColors;
    return `bgcolor__${index + 1}`;
}

/**
 * Masks the password input by hiding the original input field and displaying masked asterisks.
 *
 * @param {string} id1 - The ID of the input element containing the password to be hidden.
 * @param {string} id2 - The ID of the element where the masked password (asterisks) will be displayed.
 */
function maskPassword(id1, id2){
    let hidePasswordInput = document.getElementById(id1);
    let maskPassword = document.getElementById(id2);
    hidePasswordInput.classList.add('zero__opacity');
    maskPassword.classList.remove('zero__opacity');
    maskPassword.innerHTML = '';
    for(let i = 0; i < hidePasswordInput.value.length; i++){
        maskPassword.innerHTML += '*';
    }
    if(maskPassword.innerHTML == "") hidePasswordInput.classList.remove('zero__opacity');
}

/**
 * Logs out the current user by clearing the local storage entry and resetting the currentUser variable.
 * Redirects to the login page with a URL parameter to skip animation.
 */
function logOut() {
    getCurrentUser();
    currentUser = null;
    localStorage.removeItem("currentUser");
    localStorage.removeItem("lastPage");
    window.location.href = "login.html?skipAnimation=true";
}

/**
 * Checks if the current device is a mobile device based on screen width.
 * @returns {boolean} True if the screen width is 768px or less, otherwise false.
 */
function isMobile() {
    return window.matchMedia("(max-width: 768px)").matches;
}

/**
 * Generates the next available ID for a new contact.
 * Finds the lowest unused numerical ID in the contacts list.
 * @returns {string} The next available ID as a string.
 */
function getNextAvailableId() {
    const usedIds = new Set(contacts.map(contact => Number(contact.id)));
    let id = 0;
    while (usedIds.has(id)) {
        id++;
    }
    return id.toString();
}

/**
 * Retrieves a specific query parameter from the URL.
 * @param {string} param - The name of the query parameter to retrieve.
 * @returns {string|null} The value of the query parameter, or null if not found.
 */
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

/**
 * Prevents the default behavior of the "Enter" key when pressed.
 * @param {KeyboardEvent} event - The keydown event object.
 */
function handleKeyDown(event) {
    if (event.key === "Enter") {
        event.preventDefault();
    }
} 

/**
 * Navigates back to the last visited page.
 * Retrieves the last page from storage and redirects to it.
 */
function backToLastPage() {
    lastPage = getLastpage();
    if (lastPage) window.location.href = `${lastPage}.html`;
    if (lastPage && lastPage === "summary") openSummaryWebsiteWithoutMobileAnimation();
}

/**
 * Initializes an event listener to check the screen orientation and display a message if the device is in landscape mode with a small height.
 * The message is shown only if the viewport height is less than 500 pixels.
 */
document.addEventListener("DOMContentLoaded", function () {
    /**
     * Checks the current screen orientation and toggles the visibility of the rotation message.
     * If the screen is in landscape mode and the height is below 500px, the message is displayed.
     */
    function checkOrientation() {
        const rotateMessage = document.getElementById("rotate_message");
        if (!rotateMessage) return;

        if (window.innerHeight < 500 && window.matchMedia("(orientation: landscape)").matches) {
            rotateMessage.classList.remove("d__none");
        } else {
            rotateMessage.classList.add("d__none");
        }
    }
    window.addEventListener("resize", checkOrientation);
    window.addEventListener("orientationchange", checkOrientation);
    checkOrientation();
});

/**
 * Trims a text to a maximum of 44 characters and appends "..." if truncated.
 * @param {string} text - The input text to be truncated.
 * @returns {string} - The processed text with a maximum length of 44 characters.
 */
function truncateText(text) {
    return text.length > 44 ? text.substring(0, 44) + "..." : text;
}

/**
 * Trims a text to a maximum of 44 characters and appends "..." if truncated.
 * @param {string} text - The input text to be truncated.
 * @returns {string} - The processed text with a maximum length of 44 characters.
 */
function truncateTextShorter(text) {
    return text.length > 31 ? text.substring(0, 31) + "..." : text;
}

/**
 * Returns the formatted category abbreviation.
 * @param {string} category - The category name.
 * @returns {string|null} The formatted category abbreviation or null if not found.
 */
function getCategoryInFormat(category) {
    if (category === "Technical Task") return "tt";
    if (category === "User Story") return "us";
    return null;
}

/**
 * Retrieves the task data from a given task element.
 * @param {HTMLElement} taskElement - The task element containing the data-task attribute.
 * @returns {Object|null} The parsed task data object or null if not found.
 */
function getTaskData(taskElement) {
    return JSON.parse(taskElement.getAttribute('data-task')) || null;
}

/**
 * Handles the resize event and closes the overlay if on mobile.
 */
function handleResize() {
    if (isMobile()) {
        closeAddTaskOverlay();
        openAddTaskWebsite();
    }
}

/**
 * Generates a unique task ID that does not already exist in the provided list of tasks.
 * Ensures uniqueness by checking against existing task IDs.
 * 
 * @param {Array} existingTasks - The list of existing tasks to check for duplicate IDs.
 * @returns {string} A unique task ID.
 */
function generateUniqueTaskId(existingTasks) {
    let newId;
    do {
        newId = generateUniqueId();
    } while (existingTasks.some(task => task.id === newId));
    return newId;
}

/**
 * Generates a unique identifier using the current timestamp and a random string.
 * 
 * @returns {string} A unique identifier string.
 */
function generateUniqueId() {
    return `${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Sets the priority level for the task.
 * @param {string} value - The priority value to set.
 */
function setTaskPrio(value) {
    if (value) taskPrio = value;
}

/**
 * Returns the provided information if it is not empty or null; otherwise, returns an empty string.
 * 
 * @param {*} information - The input value to check.
 * @returns {*} The original information if valid, otherwise an empty string.
 */
function getInformationTheRight(information) {
    if(information) return information;
    else return "";
}

/**
 * Returns the provided array if it contains elements; otherwise, returns an empty string.
 * 
 * @param {Array} array - The array to check.
 * @returns {Array|string} The original array if it is not empty, otherwise an empty string.
 */
function getArraysTheRightWay(array) {
    if(array.length > 0) return array;
    else return "";
}





