/**
 * Sets the priority for the currently edited task.
 * 
 * @param {number} prio - The priority level to be set.
 */
function setTaskPrioEdit(prio) {
    if (prio) currentEditedTask.prio = prio;
}

/**
 * Opens the date picker (Flatpickr) for selecting a due date.
 */
function openCalendarEdit() {
    if (flatpickrInstanceEdit) flatpickrInstanceEdit.open();
}

/**
 * Removes error styling from all input containers.
 */
function removeAllErorrInputStylingEdit() {
    const inputContainers = ["add_task_title_input_edit", "date_container_input_edit"];
    for (let i = 0; i < inputContainers.length; i++) {
        if (inputContainers[i]) {
            const inputContainerRef = document.getElementById(inputContainers[i]);
            inputContainerRef.classList.remove('error__inputs');
        }
    }
}

/**
 * Removes all displayed error messages from the form.
 */
function removeAllErrorMessagesEdit() {
    const errorContainers = ["add_task_title_input_box_error_box_edit", "errormessage_box_date_edit"];
    for (let i = 0; i < errorContainers.length; i++) {
        if (errorContainers[i]) {
            const errorContainerRef = document.getElementById(errorContainers[i]);
            errorContainerRef.innerHTML = "";
        }
    }
}

/**
 * Adds a new subtask to the subtask list.
 * @param {Event} event - The event object to prevent default behavior.
 */
function addSubtaskEdit(event) {
    if (event) event.preventDefault();
    const subTaskRef = document.getElementById('input_subtasks_edit');
    const subTaskName = subTaskRef.value.trim();
    if (subTaskName) {
        const newSubTask = {
            id: subTasksIdCounterEdit++,
            name: subTaskName,
            status: 0
        };
        currentSubTasks.push(newSubTask);
        subTaskRef.value = "";
        renderEditTaskDetailsSubTasks();
        removeAddSubTaskButtonsEdit();
    }
}

/**
 * Displays the input field and buttons for adding a subtask.
 * @param {Event} event - The event object to prevent default behavior.
 */
function displayAddSubtaskButtonsEdit(event) {
    if (event) event.preventDefault();
    const addSubtaskBoxRef = document.getElementById('add_subtask_box_edit');
    const activeAddSubtaskBoxRef = document.getElementById('active_add_subtask_box_edit');
    const subTaskInputContainerRef = document.getElementById('subtask_input_container_edit');
    addSubtaskBoxRef.classList.add('d__none');
    activeAddSubtaskBoxRef.classList.remove('d__none');
    subTaskInputContainerRef.classList.add('blue__border');
}

/**
 * Hides the input field and buttons for adding a subtask.
 */
function removeAddSubTaskButtonsEdit() {
    const addSubtaskBoxRef = document.getElementById('add_subtask_box_edit');
    const activeAddSubtaskBoxRef = document.getElementById('active_add_subtask_box_edit');
    const subTaskInputContainerRef = document.getElementById('subtask_input_container_edit');
    addSubtaskBoxRef.classList.remove('d__none');
    activeAddSubtaskBoxRef.classList.add('d__none');
    subTaskInputContainerRef.classList.remove('blue__border');
}

/**
 * Closes the subtask input field and clears its value.
 * @param {Event} event - The event object to prevent default behavior.
 */
function closeAddSubTaskEdit(event) {
    if (event) event.preventDefault();
    const subTaskRef = document.getElementById('input_subtasks_edit');
    subTaskRef.value = "";
    removeAddSubTaskButtonsEdit();
}

/**
 * Deletes a subtask from the list and updates the UI.
 * @param {number} subTaskId - The ID of the subtask to delete.
 * @param {Event} event - The event object to prevent default behavior and propagation.
 */
function deleteSubTaskEdit(subTaskId, event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    } 
    const index = currentSubTasks.findIndex(subTask => subTask.id === subTaskId);
    if (index > -1) {
        currentSubTasks.splice(index, 1);
        renderEditTaskDetailsSubTasks();
    }
}

/**
 * Opens the subtask editing mode by replacing the subtask element with an input field.
 * @param {number} subTaskId - The ID of the subtask to edit.
 * @param {Event} event - The event object to prevent default behavior and propagation.
 */
function openEditSubTaskEdit(subTaskId, event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    let subTask = currentSubTasks.find(task => task.id === subTaskId);
    if (!subTask) return;
    let subTaskElement = document.getElementById(`subtask_${subTaskId}_edit`);
    if (!subTaskElement) return;
    subTaskElement.outerHTML = renderHTMLEditSubTaskEdit(subTask);
}

/**
 * Saves the edited subtask name and updates the UI.
 * @param {number} subTaskId - The ID of the subtask being edited.
 * @param {Event} event - The event object to prevent default behavior and propagation.
 */
function saveEditedSubTaskEdit(subTaskId, event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    let inputRef = document.getElementById('subtask_edit_input_edit');
    let updatedName = inputRef.value.trim();
    if (!updatedName) return;
    let subTaskIndex = currentSubTasks.findIndex(task => task.id === subTaskId);
    if (subTaskIndex > -1) {
        currentSubTasks[subTaskIndex].name = updatedName;
    }
    renderEditTaskDetailsSubTasks();
}

/**
 * Handles form submission for adding or editing a task.
 * @param {Event} event - The form submission event.
 */
async function handleFormSubmitEdit(event) {
    if (event) event.preventDefault();
    document.getElementById('create_task_button_edit').onclick = false;
    removeAllErrorMessagesEdit();
    const error = validateInputsEdit();
    if (!error) {
        await processFormEdit();
        await saveAndReload();
    }
}

/**
 * Validates all input fields in the task creation form.
 * @returns {string|null} The first error message if validation fails, otherwise null.
 */
function validateInputsEdit() {
    return (
        validateTitleEdit("add_task_title_input_edit", "Title is required.", "add_task_title_input_box_error_box_edit") ||
        validateDateInputEdit("task_due_date_edit", "Due date is required.", "date_container_input_edit", "errormessage_box_date_edit")
    );
}

/**
 * Validates the task title input field.
 * @param {string} id - The ID of the input field to validate.
 * @param {string} message - The error message to display if validation fails.
 * @param {string} errorBoxID - The ID of the error box to display the error message.
 * @returns {string|null} The error message if validation fails, otherwise null.
 */
function validateTitleEdit(id, message, errorBoxID) {
    const field = document.getElementById(id);
    removeAllErorrInputStylingEdit();
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
function validateDateInputEdit(id, message, containerID, errorBoxID) {
    const field = document.getElementById(id);
    const container = document.getElementById(containerID);
    removeAllErorrInputStylingEdit();
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
 * Processes the form data and saves the task if all required fields are filled.
 */
async function processFormEdit() {
    const name = document.getElementById('add_task_title_input_edit').value;
    const description = getInformationTheRight(document.getElementById("task_description_edit").value);
    const assignedTo = getArraysTheRightWay(assignedToContacts);
    const dueDate = parseDateToDateBaseFormat(document.getElementById("task_due_date_edit").value);
    const prio = getInformationTheRight(currentEditedTask.prio);
    const subTasks = getArraysTheRightWay(currentSubTasks);
    await editTaskFinally(name, description, assignedTo, dueDate, prio, subTasks);
}

/**
 * Aktualisiert eine bestehende Aufgabe basierend auf currentEditedTask.id.
 * @param {string} name - Der aktualisierte Name der Aufgabe.
 * @param {string} description - Die aktualisierte Beschreibung.
 * @param {Array} assignedTo - Die aktualisierten zugewiesenen Kontakte.
 * @param {string} dueDate - Das aktualisierte Fälligkeitsdatum.
 * @param {number} prio - Die aktualisierte Priorität (1 = hoch, 2 = mittel, 3 = niedrig).
 * @param {string} category - Die aktualisierte Kategorie.
 * @param {Array} subTasks - Die aktualisierten Unteraufgaben.
 */
async function editTaskFinally(name, description, assignedTo, dueDate, prio, subTasks) {
    if (!currentEditedTask || !currentEditedTask.id) return;
    const taskIndex = tasks.findIndex(task => task.id === currentEditedTask.id);
    if (taskIndex !== -1) {
        tasks[taskIndex] = {
            ...tasks[taskIndex],
            name: name,
            description: description,
            assigned_to: assignedTo,
            due_date: dueDate,
            prio: prio,
            subtasks: subTasks
        };
    }
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
 * Handles the "Enter" key press event while adding a subtask.
 * @param {Event} event - The keydown event.
 */
function handleKeyDownAddSubTaskEdit(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        addSubtaskEdit(event);
    }
}

/**
 * Handles the "Enter" key press event while editing a subtask.
 * @param {number} subTaskID - The ID of the subtask being edited.
 * @param {Event} event - The keydown event.
 */
function handleKeyDownEditedSubTaskEdit(subTaskID, event) {
    if (event.key === "Enter") {
        event.preventDefault();
        saveEditedSubTaskEdit(subTaskID, event);
    }
}