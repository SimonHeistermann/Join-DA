/**
 * Opens the calendar input for selecting a date.
 */
function openCalendar() {
    if (flatpickrInstance) flatpickrInstance.open();
}

/**
 * Opens the task category dropdown list.
 * @param {Event} event - The event object to prevent default behavior.
 */
function openTaskCategoryList(event) {
    if (event) event.preventDefault();
    toggleDropdown('category_dropdown');
    toggleDNoneInputAndButtonDropDown('category_dropdown', 'category_dropdown');
    toggleDropDownListOverlayCategory();
}


function toggleDropDownListOverlayCategory() {
    const overlayDropdownListAddTaskContacts = document.getElementById('overlay_dropdown_list_add_task_category');
    overlayDropdownListAddTaskContacts.classList.toggle('d__none');
}

/**
 * Closes the task category dropdown list.
 * @param {Event} event - The event object to prevent default behavior.
 */
function closeTaskCategoryList(event) {
    if (event) event.preventDefault();
    toggleDropdown('category_dropdown');
    toggleDNoneInputAndButtonDropDown('category_dropdown', 'category_dropdown');
    toggleDropDownListOverlayCategory();
}

/**
 * Sets the selected task category and updates the UI.
 * @param {string} category - The selected category.
 * @param {Event} event - The event object to prevent default behavior.
 */
function taskCategorySelected(category, event) {
    if (event) event.preventDefault();
    if (category) selectedTaskCategory = category;
    const selectedCategoryRef = document.getElementById('selected_category_ref');
    selectedCategoryRef.innerHTML = `${selectedTaskCategory}`;
    validateCategory("selected_category_ref", "Category is required.", "category_dropdown_toggle", "category_dropdown_error_box");
    closeTaskCategoryList();
}

/**
 * Resets the selected task category to its default state.
 */
function resetSelectedCategory() {
    selectedTaskCategory = "";
    const selectedCategoryRef = document.getElementById('selected_category_ref');
    selectedCategoryRef.innerHTML = `Select task category`;
}

/**
 * Adds a new subtask to the subtask list.
 * @param {Event} event - The event object to prevent default behavior.
 */
function addSubtask(event) {
    if (event) event.preventDefault();
    const subTaskRef = document.getElementById('input_subtasks');
    const subTaskName = subTaskRef.value.trim();
    if (subTaskName) {
        const newSubTask = {
            id: subtaskIdCounter++,
            name: subTaskName,
            status: 0
        };
        addedSubtasks.push(newSubTask);
        subTaskRef.value = "";
        renderSubtasks();
        removeAddSubTaskButtons();
    }
}

/**
 * Renders all subtasks in the UI.
 */
function renderSubtasks() {
    const subTasksRef = document.getElementById('added_subtasks_container');
    subTasksRef.innerHTML = "";
    addedSubtasks.forEach(subTask => {
        subTasksRef.innerHTML += renderHTMLSubtask(subTask);
    });
}

/**
 * Displays the input field and buttons for adding a subtask.
 * @param {Event} event - The event object to prevent default behavior.
 */
function displayAddSubtaskButtons(event) {
    if (event) event.preventDefault();
    const addSubtaskBoxRef = document.getElementById('add_subtask_box');
    const activeAddSubtaskBoxRef = document.getElementById('active_add_subtask_box');
    const subTaskInputContainerRef = document.getElementById('subtask_input_container');
    addSubtaskBoxRef.classList.add('d__none');
    activeAddSubtaskBoxRef.classList.remove('d__none');
    subTaskInputContainerRef.classList.add('blue__border');
}

/**
 * Hides the input field and buttons for adding a subtask.
 */
function removeAddSubTaskButtons() {
    const addSubtaskBoxRef = document.getElementById('add_subtask_box');
    const activeAddSubtaskBoxRef = document.getElementById('active_add_subtask_box');
    const subTaskInputContainerRef = document.getElementById('subtask_input_container');
    addSubtaskBoxRef.classList.remove('d__none');
    activeAddSubtaskBoxRef.classList.add('d__none');
    subTaskInputContainerRef.classList.remove('blue__border');
}

/**
 * Closes the subtask input field and clears its value.
 * @param {Event} event - The event object to prevent default behavior.
 */
function closeAddSubTask(event) {
    if (event) event.preventDefault();
    const subTaskRef = document.getElementById('input_subtasks');
    subTaskRef.value = "";
    removeAddSubTaskButtons();
}

/**
 * Deletes a subtask from the list and updates the UI.
 * @param {number} subTaskId - The ID of the subtask to delete.
 * @param {Event} event - The event object to prevent default behavior and propagation.
 */
function deleteSubTask(subTaskId, event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    } 
    const index = addedSubtasks.findIndex(subTask => subTask.id === subTaskId);
    if (index > -1) {
        addedSubtasks.splice(index, 1);
        renderSubtasks();
    }
}

/**
 * Opens the subtask editing mode by replacing the subtask element with an input field.
 * @param {number} subTaskId - The ID of the subtask to edit.
 * @param {Event} event - The event object to prevent default behavior and propagation.
 */
function openEditSubTask(subTaskId, event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    let subTask = addedSubtasks.find(task => task.id === subTaskId);
    if (!subTask) return;
    let subTaskElement = document.getElementById(`subtask_${subTaskId}`);
    if (!subTaskElement) return;
    subTaskElement.outerHTML = renderHTMLEditSubTask(subTask);
}

/**
 * Saves the edited subtask name and updates the UI.
 * @param {number} subTaskId - The ID of the subtask being edited.
 * @param {Event} event - The event object to prevent default behavior and propagation.
 */
function saveEditedSubTask(subTaskId, event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    let inputRef = document.getElementById('subtask_edit_input');
    let updatedName = inputRef.value.trim();
    if (!updatedName) return;
    let subTaskIndex = addedSubtasks.findIndex(task => task.id === subTaskId);
    if (subTaskIndex > -1) {
        addedSubtasks[subTaskIndex].name = updatedName;
    }
    renderSubtasks();
}

/**
 * Handles form submission for adding or editing a task.
 * @param {Event} event - The form submission event.
 */
async function handleFormSubmit(event) {
    if (event) event.preventDefault();
    document.getElementById('create_task_button').onclick = false;
    removeAllErrorMessages();
    const error = validateInputs();
    if (!error) await processForm();
}

/**
 * Cancels the form submission and resets the task creation form.
 * @param {Event} event - The event object to prevent default behavior.
 */
function cancelForm(event) {
    event.preventDefault();
    document.getElementById("add_task_form").reset();
    clearAddTaskForm();
}

/**
 * Clears the task creation form and resets selected values.
 */
function clearAddTaskForm() {
    choosenContacts = [];
    addedSubtasks = [];
    currentUserChoosen = false;
    renderContactList(contacts);
    renderTaskCategoryList();
    renderSubtasks();
    renderChoosenContactList();
    resetSelectedCategory();
}

/**
 * Validates all input fields in the task creation form.
 * @returns {string|null} The first error message if validation fails, otherwise null.
 */
function validateInputs() {
    return (
        validateTitle("add_task_title_input", "Title is required.", "add_task_title_input_box_error_box") ||
        validateDateInput("task_due_date", "Due date is required.", "date_container_input", "errormessage_box_date") ||
        validateCategory("selected_category_ref", "Category is required.", "category_dropdown_toggle", "category_dropdown_error_box")
    );
}

/**
 * Validates the task title input field.
 * @param {string} id - The ID of the input field to validate.
 * @param {string} message - The error message to display if validation fails.
 * @param {string} errorBoxID - The ID of the error box to display the error message.
 * @returns {string|null} The error message if validation fails, otherwise null.
 */
function validateTitle(id, message, errorBoxID) {
    const field = document.getElementById(id);
    removeAllErorrInputStyling();
    if (field.value.trim() === "") {
        field.classList.add('error__inputs');
        updateErrorBox(message, errorBoxID);
        return message;
    } else {
        updateErrorBox();
        return null;
    }
}

/**
 * Validates the date input field.
 * @param {string} id - The ID of the date input field.
 * @param {string} message - The error message to display if validation fails.
 * @param {string} containerID - The ID of the container to highlight on error.
 * @param {string} errorBoxID - The ID of the error box to display the error message.
 * @returns {string|null} The error message if validation fails, otherwise null.
 */
function validateDateInput(id, message, containerID, errorBoxID) {
    const field = document.getElementById(id);
    const container = document.getElementById(containerID);
    removeAllErorrInputStyling();
    if (field.value.trim() === "") {
        container.classList.add('error__inputs');
        updateErrorBox(message, errorBoxID);
        return message;
    } else {
        updateErrorBox();
        return null;
    }
}

/**
 * Validates the selected task category.
 * @param {string} id - The ID of the category element.
 * @param {string} message - The error message to display if validation fails.
 * @param {string} containerID - The ID of the container to highlight on error.
 * @param {string} errorBoxID - The ID of the error box to display the error message.
 * @returns {string|null} The error message if validation fails, otherwise null.
 */
function validateCategory(id, message, containerID, errorBoxID) {
    const field = document.getElementById(id).innerText;
    const container = document.getElementById(containerID);
    removeAllErorrInputStyling();
    if (field === "" || field === "Select task category") {
        container.classList.add('error__inputs');
        updateErrorBox(message, errorBoxID);
        return message;
    } else {
        updateErrorBox("", errorBoxID);
        return null;
    }
}

/**
 * Removes error styling from all input containers.
 */
function removeAllErorrInputStyling() {
    const inputContainers = ["add_task_title_input", "date_container_input", "category_dropdown_toggle"];
    for (let i = 0; i < inputContainers.length; i++) {
        if (inputContainers[i]) {
            const inputContainerRef = document.getElementById(inputContainers[i]);
            inputContainerRef.classList.remove('error__inputs');
        }
    }
}

/**
 * Updates the error message box with a new message or hides it if no error exists.
 * @param {string} error - The error message to display.
 * @param {string} errorBoxID - The ID of the error box to update.
 */
function updateErrorBox(error, errorBoxID) {
    if (errorBoxID && error !== undefined) { 
        const box = document.getElementById(errorBoxID);
        if (box) {
            box.innerText = error ? error : "";
            box.style.display = error ? "block" : "none";
        }
    }
}

/**
 * Removes all displayed error messages from the form.
 */
function removeAllErrorMessages() {
    const errorContainers = ["add_task_title_input_box_error_box", "errormessage_box_date", "category_dropdown_error_box"];
    for (let i = 0; i < errorContainers.length; i++) {
        if (errorContainers[i]) {
            const errorContainerRef = document.getElementById(errorContainers[i]);
            errorContainerRef.innerHTML = "";
        }
    }
}

/**
 * Processes the form data and saves the task if all required fields are filled.
 */
async function processForm() {
    const name = document.getElementById('add_task_title_input').value;
    const description = getInformationTheRight(document.getElementById("task_description").value);
    const assignedTo = getArraysTheRightWay(formatChoosenContactsToJSON());
    const dueDate = parseDateToDateBaseFormat(document.getElementById("task_due_date").value);
    const prio = getInformationTheRight(taskPrio);
    const category = getCategoryInFormat(selectedTaskCategory);
    const subTasks = getArraysTheRightWay(addedSubtasks);
    const id = generateUniqueTaskId(tasks);
    await saveTask(name, description, assignedTo, dueDate, prio, category, subTasks, id);
    resetAddTaskForm();
}

/**
 * Saves a task to the task list and updates the database.
 * @param {string} name - The task name.
 * @param {string} description - The task description.
 * @param {Object} assignedTo - The assigned contacts in JSON format.
 * @param {string} dueDate - The due date in database format.
 * @param {string} prio - The task priority.
 * @param {string} category - The selected category.
 * @param {Array} subTasks - The list of subtasks.
 */
async function saveTask(name, description, assignedTo, dueDate, prio, category, subTasks, id) {
    const newTask = {
        name: name,
        description: description,
        assigned_to: assignedTo,
        due_date: dueDate,
        prio: prio,
        category: category,
        subtasks: subTasks,
        status: "to-do",
        id: id
    };
    tasks.push(newTask);
    await putData("tasks", tasks);
    await displaySuccNotificationTaskAdded();
    openBoardWebsite();
}

/**
 * Formats the selected contacts into a JSON object.
 * @returns {Object} JSON object containing chosen contacts.
 */
function formatChoosenContactsToJSON() {
    let contactsArray = [...choosenContacts];
    if (currentUserChoosen && currentUser) {
        contactsArray.unshift(currentUser);
    }
    return Object.fromEntries(
        contactsArray.map((contact, index) => [index.toString(), contact.name])
    );
}

/**
 * Parses a date string from "DD/MM/YYYY" format to "YYYY-MM-DD" database format.
 * @param {string} dateStr - The date string in "DD/MM/YYYY" format.
 * @returns {string} The parsed date in "YYYY-MM-DD" format.
 */
function parseDateToDateBaseFormat(dateStr) {
    const [day, month, year] = dateStr.split('/').map(Number);
    const parsedDate = new Date(year, month - 1, day);
    return parsedDate.toISOString().split("T")[0];
}

/**
 * Displays a success notification after creating or editing a task.
 */
async function displaySuccNotificationTaskAdded() {
    return new Promise((resolve) => {
        setTimeout(() => {
            const overlayRef = document.getElementById('overlay_task_added');
            const notificationRef = document.getElementById('task_added_notification');
            overlayRef.classList.remove('d__none');
            notificationRef.classList.remove('task__added__notification__active', 'd__none');
            notificationRef.classList.add('task__added__notification__active');
        }, 400);
        setTimeout(() => {
            const notificationRef = document.getElementById('task_added_notification');
            notificationRef.classList.add('d__none');
            notificationRef.classList.remove('task__added__notification__active');
            resolve(); 
        }, 2400);
    });
}



