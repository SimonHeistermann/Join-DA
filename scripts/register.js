/**
 * Initializes the registration process by fetching user data.
 * Handles any errors that occur during initialization.
 */
async function initRegister() {
    try {
        await fetchUsers();
    } catch (error) {
        console.error("Error initializing app:", error);
    }
}

/**
 * Handles the registration form submission.
 * Prevents default form submission, disables the signup button, validates inputs,
 * and processes the form if no errors are found.
 * 
 * @param {Event} event - The form submission event.
 */
async function handleRegisterForm(event) {
    if (event) event.preventDefault();
    document.getElementById('signup_button').onclick = false;
    const error = validateInputs();
    updateErrorBox(error);
    if (!error) {
        const checkBoxError = validateRegisterCheckBox();
        if (!checkBoxError) await processForm();
    }
}

/**
 * Redirects the user back to the login page.
 * Skips the login animation by adding a query parameter.
 * 
 * @param {Event} event - The event object to prevent default behavior.
 */
function backToLogin(event) {
    if (event) event.preventDefault();
    window.location.href = 'login.html?skipAnimation=true';
}

/**
 * Validates all input fields and returns the first encountered error.
 * @returns {string|null} Error message if validation fails, otherwise null.
 */
function validateInputs() {
    return (
        validateName("person_input_register", "person_container_register") ||
        validateEmail("email_input_register", "email_container_register") ||
        validatePasswordInput("password_input_register", "password_container_register") ||
        validateConfirmPasswordInput("confirm_password_input_register", "cofirm_password_container_register")
    );
}

/**
 * Validates the name input field.
 * Ensures that the field is not empty.
 * 
 * @param {string} id - The ID of the name input field.
 * @param {string} containerID - The ID of the container to highlight on error.
 * @returns {string|null} Error message if validation fails, otherwise null.
 */
function validateName(id, containerID) {
    const field = document.getElementById(id);
    const container = document.getElementById(containerID);
    removeAllErorrInputStyling();
    if (field.value.trim() === "") {
        container.classList.add('error__inputs');
        return "Check your name. Please try again.";
    } else return null;
}

/**
 * Validates the email input field.
 * Ensures that the email is in the correct format and not already in use.
 * 
 * @param {string} id - The ID of the email input field.
 * @param {string} containerID - The ID of the container to highlight on error.
 * @returns {string|null} Error message if validation fails, otherwise null.
 */
function validateEmail(id, containerID) {
    const email = document.getElementById(id).value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const container = document.getElementById(containerID);
    removeAllErorrInputStyling();
    if (!emailRegex.test(email)) {
        container.classList.add('error__inputs');
        return "Check your email. Please try again.";
    } else {
        if (emailExists()) {
            container.classList.add('error__inputs');
            return "Email already exists. Please try again.";
        } else return null;
    }
}

/**
 * Checks if the entered email is already registered.
 * If the email exists, it clears the input field.
 * 
 * @returns {boolean} True if the email already exists, otherwise false.
 */
function emailExists() {
    const emailInputRef = document.getElementById('email_input_register');
    const email = emailInputRef.value.trim();
    const doesEmailAlreadyExist = users.some(user => user.email === email);
    if (doesEmailAlreadyExist) emailInputRef.value = "";
    return doesEmailAlreadyExist;
}

/**
 * Validates the password input field.
 * Ensures that the field is not empty.
 * 
 * @param {string} id - The ID of the password input field.
 * @param {string} containerID - The ID of the container to highlight on error.
 * @returns {string|null} Error message if validation fails, otherwise null.
 */
function validatePasswordInput(id, containerID) {
    const field = document.getElementById(id);
    const container = document.getElementById(containerID);
    removeAllErorrInputStyling();
    if (field.value.trim() === "") {
        container.classList.add('error__inputs');
        return "Check your password. Please try again.";
    } else return null;
}

/**
 * Validates the password confirmation input field.
 * Ensures that the field is not empty and that both passwords match.
 * 
 * @param {string} id - The ID of the password confirmation input field.
 * @param {string} containerID - The ID of the container to highlight on error.
 * @returns {string|null} Error message if validation fails, otherwise null.
 */
function validateConfirmPasswordInput(id, containerID) {
    const field = document.getElementById(id);
    const container = document.getElementById(containerID);
    removeAllErorrInputStyling();
    if (field.value.trim() === "") {
        container.classList.add('error__inputs');
        return "Check your password. Please try again.";
    } else {
        if (passwordsMatch()) return null;
        else {
            container.classList.add('error__inputs');
            return "Your passwords don't match. Please try again.";
        }
    }
}

/**
 * Checks if the entered password and confirmation password match.
 * If they do not match, the fields are cleared and masked.
 * 
 * @returns {boolean} True if passwords match, otherwise false.
 */
function passwordsMatch() {
    const passwordRef = document.getElementById('password_input_register');
    const passwordConfirmationRef = document.getElementById('confirm_password_input_register');
    const password = passwordRef.value.trim();
    const passwordConfirmation = passwordConfirmationRef.value.trim();
    if (password === passwordConfirmation) return true;
    else {
        passwordRef.value = "";
        passwordConfirmationRef.value = "";
        maskPassword('password_input_register', 'mask_input_password');
        maskPassword('confirm_password_input_register', 'mask_input_confirmation');
        const container = document.getElementById('password_container_register');
        container.classList.add('error__inputs');
    }
}

/**
 * Removes error styling from all input containers.
 */
function removeAllErorrInputStyling() {
    const inputContainers = ["person_container_register", "email_container_register", "password_container_register", "cofirm_password_container_register"];
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
    const box = document.getElementById("register_errormessage_box");
    box.innerText = error || "";
    box.style.display = error ? "block" : "none";
}

/**
 * Validates the privacy policy checkbox in the registration form.
 * Displays an error message if the checkbox is not checked.
 * 
 * @returns {boolean} True if the checkbox is unchecked (error), otherwise false.
 */
function validateRegisterCheckBox() {
    const checkBoxRef = document.getElementById('agree_privacy_policy_register');
    if (checkBoxRef.checked) return false;
    else {
        updateErrorBox('Please agree to our privacy policy.');
        return true;
    }
}

/**
 * Processes the registration form by creating a new user, 
 * storing it in the database, and redirecting to the login page.
 */
async function processForm() {
    const newUser = setnewUser();
    resetRegisterForm();
    pushNewUserInArray(newUser);
    await putData("users", users);
    activateSuccSingedUpOverlay();
    setTimeout(() => {
        window.location.href = 'login.html?skipAnimation=true';
    }, 700);
}

/**
 * Creates a new user object with the provided registration details.
 * 
 * @returns {Object} The newly created user object.
 */
function setnewUser() {
    const inputEmail = document.getElementById('email_input_register').value.trim();
    const inputName = document.getElementById('person_input_register').value.trim();
    const inputPw = document.getElementById('password_input_register').value.trim();
    const newUser = {
        email: inputEmail,
        initials: getInitials(inputName),
        name: inputName,
        pw: inputPw
    };
    return newUser;
}

/**
 * Resets the registration form by clearing all input fields 
 * and resetting the password masking.
 */
function resetRegisterForm() {
    document.getElementById('sign_up_form').reset();
    document.getElementById('confirm_password_input_register').value = '';
    document.getElementById('agree_privacy_policy_register').checked = false;
    maskPassword('password_input_register', 'mask_input_password');
    maskPassword('confirm_password_input_register', 'mask_input_confirmation');
}

/**
 * Adds the newly registered user to the users array.
 * 
 * @param {Object} newUser - The newly created user object.
 */
function pushNewUserInArray(newUser) {
    if (users) users.push(newUser);
}

/**
 * Activates the success notification overlay after a successful sign-up.
 */
function activateSuccSingedUpOverlay() {
    document.getElementById('signed_up_notification').classList.add('signed__up__notification__active');
    document.getElementById('overlay_signed_up').classList.remove('d__none');
}



