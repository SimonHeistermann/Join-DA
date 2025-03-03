/**
 * Initializes the login process.
 * Checks if the login animation should be skipped based on a URL parameter
 * and starts the logo animation accordingly. Then, it fetches the user data.
 */
async function initLogin() {
    try {
        let skipAnimation = getQueryParam("skipAnimation") === "true";
        logoAnimation(skipAnimation);
        await fetchUsers();
        getCurrentUser();
        if(currentUser) {
            openSummaryWebsite();
        }
    } catch (error) {
        console.error("Error initializing app:", error);
    }
}

/**
 * Controls the logo animation flow based on whether it should be skipped or not.
 * @param {boolean} skipAnimation - Indicates whether to skip the animation.
 */
function logoAnimation(skipAnimation) {
    const overlay = document.getElementById('overlay');
    const bigLogoDiv = document.getElementById('biglogo_div'); 
    if (skipAnimation) {
        skipLogoAnimation(overlay, bigLogoDiv); 
    } else {
        startLogoAnimation(overlay, bigLogoDiv);
    }
}

/**
 * Skips the logo animation by immediately hiding the overlay and the big logo.
 * @param {HTMLElement} overlay - The overlay element.
 * @param {HTMLElement} bigLogoDiv - The large logo container element.
 */
function skipLogoAnimation(overlay, bigLogoDiv) {
    overlay.classList.add("d__none");
    bigLogoDiv.classList.add("d__none");
    const smallLogo = document.getElementById('small_logo');
    smallLogo.classList.add("visible");
}

/**
 * Starts the logo animation by transitioning the elements over time.
 * @param {HTMLElement} overlay - The overlay element.
 * @param {HTMLElement} bigLogoDiv - The large logo container element.
 */
function startLogoAnimation(overlay, bigLogoDiv) {
    setTimeout(() => {
        overlay.classList.add("hidden");
    }, 500); 
    setTimeout(() => {
        bigLogoDiv.classList.add("move__to__corner"); 
    }, 100);
    endLogoAnimation(overlay, bigLogoDiv);
}

/**
 * Completes the logo animation by hiding the overlay and big logo, and showing the small logo.
 * @param {HTMLElement} overlay - The overlay element.
 * @param {HTMLElement} bigLogoDiv - The large logo container element.
 */
function endLogoAnimation(overlay, bigLogoDiv) {
    const smallLogo = document.getElementById('small_logo');
    setTimeout(() => {
        overlay.classList.add("d__none"); 
        bigLogoDiv.classList.add("d__none"); 
        smallLogo.classList.add("visible");
    }, 1000);
}

/**
 * Handles the login form submission.
 * Prevents default form submission, validates inputs, updates the error box,
 * and processes the form if no errors are found.
 * 
 * @param {Event} event - The form submission event.
 */
async function handleLoginForm(event) {
    if (event) event.preventDefault();
    const error = validateInputs();
    updateErrorBox(error);
    if (!error) await processForm();
}

/**
 * Validates all input fields for the login form.
 * Checks both email and password fields and returns the first encountered error.
 * 
 * @returns {string|null} Error message if validation fails, otherwise null.
 */
function validateInputs() {
    return (
        validateEmail("email_input_login", "email_container_login") ||
        validatePasswordInput("password_input_login", "password_container_login")
    );
}

/**
 * Validates the email input field.
 * Ensures the email follows a standard format.
 * 
 * @param {string} id - The ID of the email input field.
 * @param {string} containerID - The ID of the container to highlight on error.
 * @returns {string|null} Error message if validation fails, otherwise null.
 */
function validateEmail(id, containerID) {
    const email = document.getElementById(id).value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const container = document.getElementById(`${containerID}`);
    removeAllErorrInputStyling();
    if (!emailRegex.test(email)) {
        container.classList.add('error__inputs');
        return "Check your email. Please try again.";
    } else return null;
}

/**
 * Validates the password input field.
 * Ensures the password is not empty.
 * 
 * @param {string} id - The ID of the password input field.
 * @param {string} containerID - The ID of the container to highlight on error.
 * @returns {string|null} Error message if validation fails, otherwise null.
 */
function validatePasswordInput(id, containerID) {
    const field = document.getElementById(id);
    const container = document.getElementById(`${containerID}`);
    removeAllErorrInputStyling();
    if (field.value.trim() === "") {
        container.classList.add('error__inputs');
        return "Check your password. Please try again.";
    } else return null;
}

/**
 * Removes error styling from all input containers.
 */
function removeAllErorrInputStyling() {
    const inputContainers = ["email_container_login", "password_container_login"];
    for (let i = 0; i < inputContainers.length; i++) {
        if (inputContainers[i]) {
            const inputContainerRef = document.getElementById(`${inputContainers[i]}`);
            inputContainerRef.classList.remove('error__inputs');
        }
    }
}

/**
 * Updates the error message box with the given error message.
 * @param {string|null} error - The error message to display, or null to hide the box.
 */
function updateErrorBox(error) {
    const box = document.getElementById("error_message_box_login");
    box.innerText = error || "";
    box.style.display = error ? "block" : "none";
}

/**
 * Processes the login form by validating the email and checking the password.
 * If the email exists in the user database, it proceeds to verify the password.
 * Otherwise, it triggers an error message.
 */
async function processForm() {
    const emailRef = document.getElementById('email_input_login');
    const email = emailRef.value;
    const inputPw = document.getElementById('password_input_login').value;
    let userIndex = users.findIndex(user => user.email === email);
    if (userIndex !== -1) {
        testPasswordLogin(inputPw, userIndex);
    } else {
        const error = validateEmail("email_input_login", "email_container_login");
        updateErrorBox(error);
    }
}

/**
 * Compares the provided password with the stored password for the user at the given index.
 * If the passwords match, the user is redirected to the summary page.
 * If the passwords do not match, an error message is displayed, error styling is applied,
 * and the password input field is cleared.
 * 
 * @param {string} inputPw - The password input provided by the user.
 * @param {number} userIndex - The index of the user in the `users` array.
 */
function testPasswordLogin(inputPw, userIndex) {
    let storedPW = users[userIndex].pw;
    if(inputPw === storedPW) {
        correctPassword(userIndex);
    } else {
       wrongPassword();
    }
}

/**
 * Handles a successful login by storing user data in local storage
 * and redirecting to the summary page.
 * 
 * @param {number} userIndex - The index of the authenticated user in the users array.
 */
function correctPassword(userIndex) {
    currentUser = users[userIndex];
    const currentUserLocalStorage = {
        email: currentUser.email,
        initials: currentUser.initials,
        name: currentUser.name
    };
    if (currentUser.tel) currentUserLocalStorage.tel = currentUser.tel;
    localStorage.setItem('currentUser', JSON.stringify(currentUserLocalStorage));
    document.getElementById("login_form").reset();
    window.location.href = 'summary.html';
}

/**
 * Handles an incorrect password entry by clearing the input field
 * and displaying an error message.
 */
function wrongPassword() {
    const inputPwRef = document.getElementById('password_input_login');
    inputPwRef.value = "";
    const error = validatePasswordInput("password_input_login", "password_container_login");
    updateErrorBox(error);
}

/**
 * Handles the guest login process by preventing the default form submission,
 * using predefined guest credentials (email: 'guest', password: 'guest123'),
 * and checking if the guest user exists in the `users` array.
 * 
 * If the guest user is found, the function checks the password using the `testpPasswordLogin` function.
 * If the guest user is not found, an alert with the message 'Database error' is displayed.
 * 
 * @param {Event} event - The event object from the form submission.
 */
function guestLogIn(event){
    if(event) event.preventDefault();
    let email = 'guest';
    let inputPw = 'guest123'; 
    let userIndex = users.findIndex(user => user.email == email);
    if(userIndex !==-1){
        testPasswordLogin(inputPw, userIndex);        
    }
}




