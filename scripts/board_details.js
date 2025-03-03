/**
 * Renders the task details overlay content.
 * 
 * @param {HTMLElement} contentRef - The container where the task details should be displayed.
 * @param {Object} task - The task object containing task details.
 */
function renderTaskDetailsOverlayContent(contentRef, task) {
    contentRef.innerHTML = "";
    contentRef.innerHTML += renderHTMLTaskDetails(task);
}

/**
 * Renders the assigned-to section in the task details.
 * 
 * @param {Object} task - The task object containing assigned user details.
 */
function renderTaskDetailsAssignedTo(task) {
    const contentRef = document.getElementById('details_assigned_to');
    if (contentRef) {
        contentRef.innerHTML = "";
        for (let i = 0; i < task.assigned_to.length; i++) {
        contentRef.innerHTML += renderHTMLTaskDetailsAssignedTo(task.assigned_to[i]);
        }
    }
}

/**
 * Renders the subtasks section in the task details.
 * 
 * @param {Object} task - The task object containing subtask details.
 */
function renderTaskDetailsSubTasks(task) {
    const contentRef = document.getElementById('details_subtasks');
    if (contentRef) {
        contentRef.innerHTML = "";
        for (let i = 0; i < task.subtasks.length; i++) {
        contentRef.innerHTML += renderHTMLTaskDetailsSubTask(task.subtasks[i], task);
        }
    }
}

/**
 * Adds active styling to a given content container.
 * @param {HTMLElement} contentRef - The container element.
 */
function addActiveOverviewStyling(contentRef, skip) {
    if(skip) {
        contentRef.classList.add('add__task__overlay__content__active');
    } else {
        setTimeout(() => {
        contentRef.classList.add('add__task__overlay__content__active');
    }, 125); 
    }
}

/**
 * Closes the contact overlay and resets styles.
 */
function closeTaskDetailsOverlay() {
    if(assignedToContacts) assignedToContacts.length = 0;
    if(currentSubTasks) currentSubTasks.length = 0;
    toggleDnoneFromTaskDetailsOverlay();
    const containerRef = document.getElementById('task_details_overlay');
    removeActiveOverviewStyling(containerRef);
    releaseScrollOnBody();
}

/**
 * Removes active styling from a given content container.
 * @param {HTMLElement} contentRef - The container element.
 */
function removeActiveOverviewStyling(contentRef) {
    if(contentRef) contentRef.classList.remove('add__task__overlay__content__active');
}

/**
 * Formats an ISO date string (YYYY-MM-DD) into a readable format (DD/MM/YYYY).
 * 
 * @param {string} isoDate - The ISO date string.
 * @returns {string} - The formatted date or an empty string if invalid.
 */
function formatTaskDueDateBoard(isoDate) {
    if (!isoDate) return "";
    const [year, month, day] = isoDate.split("-");
    return `${day}/${month}/${year}`;
}

/**
 * Returns the priority text based on the priority level.
 * 
 * @param {number} prio - The priority level (1: Low, 2: Medium, 3: Urgent).
 * @returns {string} - The corresponding priority label.
 */
function getPrioText(prio) {
    if(prio === 1) return "Low";
    if(prio === 2) return "Medium";
    if(prio === 3) return "Urgent";
    else return "";
}

/**
 * Updates the status of a subtask and saves the changes.
 * 
 * @param {HTMLElement} taskElement - The task element containing the subtask.
 * @param {string} subTaskID - The ID of the subtask to update.
 * @returns {Promise<void>}
 */
async function updateSubTask(taskElement, subTaskID) {
    const taskData = getTaskData(taskElement);
    if (!taskData) return;
    toggleSubTaskStatus(taskData, subTaskID);
    const task = findMatchingTask(taskData);
    if (!task) return;
    task.subtasks = taskData.subtasks;
    await saveAndUpdate(taskData);
}

/**
 * Toggles the completion status of a subtask.
 * 
 * @param {Object} taskData - The task object containing subtasks.
 * @param {string} subTaskID - The ID of the subtask to toggle.
 */
function toggleSubTaskStatus(taskData, subTaskID) {
    const subTask = taskData.subtasks.find(sub => sub.id === subTaskID);
    if (subTask) subTask.status = subTask.status === 0 ? 1 : 0;
}

/**
 * Finds a matching task in the global task list based on its unique ID.
 * 
 * @param {Object} taskData - The task data containing the ID to search for.
 * @returns {Object|null} - The matching task object or null if not found.
 */
function findMatchingTask(taskData) {
    return tasks.find(task => task.id === taskData.id) || null;
}

/**
 * Saves the updated task list and refreshes the board.
 * 
 * @param {Object} taskData - The updated task data.
 * @returns {Promise<void>}
 */
async function saveAndUpdate(taskData) {
    await putData("tasks", tasks);
    await fetchTasks();
    getAllTasksIn();
    closeTaskDetailsOverlay();
    renderBoardContent();
    openTaskDetails(null, true, taskData);
}

/**
 * Deletes a task from the global task list and updates the UI.
 * 
 * @param {HTMLElement} taskElement - The task element to delete.
 * @returns {Promise<void>}
 */
async function deleteTask(taskElement) {
    const taskData = getTaskData(taskElement);
    if (!taskData) return;
    const task = findMatchingTask(taskData);
    if (!task) return;
    tasks = tasks.filter(t => t !== task);
    await saveAndReload();
}

/**
 * Saves the updated task list and refreshes the board.
 * 
 * @returns {Promise<void>}
 */
async function saveAndReload() {
    await putData("tasks", tasks);
    await fetchTasks();
    getAllTasksIn();
    closeTaskDetailsOverlay();
    renderBoardContent();
}

/**
 * Initiates the task editing process by retrieving task data and opening the edit modal.
 * 
 * @param {HTMLElement} taskElement - The HTML element representing the task.
 */
async function editTask(taskElement) {
    const taskData = getTaskData(taskElement);
    if (!taskData) return;
    const task = findMatchingTask(taskData);
    if (!task) return;
    openEditTask(task);
}

/**
 * Opens the task editing interface and initializes relevant UI components.
 * 
 * @param {Object} task - The task object containing all relevant task details.
 */
function openEditTask(task) {
    currentEditedTask = task;
    const contentRef = document.getElementById('task_details_overlay_content_board');
    renderEditTaskDetailsOverlayContent(contentRef, task);
    initFlatpickrEdit();
    if(task.assigned_to !== "") task.assigned_to.forEach(contact => addAssignedContactIfNotExists(contact));
    if(task.subtasks !== "")task.subtasks.forEach(subTask => addSubTaskIfNotExists(subTask));
    if (currentSubTasks.length > 0) subTasksIdCounterEdit = currentSubTasks.length;
    renderEditTaskDetailsAssignedTo(task);
    renderEditTaskDetailsSubTasks(task);
}

/**
 * Renders the task details in the edit overlay.
 * 
 * @param {HTMLElement} contentRef - The reference to the overlay container.
 * @param {Object} task - The task object containing details to be displayed.
 */
function renderEditTaskDetailsOverlayContent(contentRef, task) {
    contentRef.innerHTML = "";
    contentRef.innerHTML += renderHTMLEditTaskDetails(task);
}

/**
 * Renders the assigned contacts in the task editing view.
 */
function renderEditTaskDetailsAssignedTo() {
    const contentRef = document.getElementById('choosen_contacts_container_edit');
    if (contentRef) {
        contentRef.innerHTML = "";
        for (let i = 0; i < assignedToContacts.length; i++) {
            contentRef.innerHTML += renderHTMLEditTaskDetailsAssignedTo(assignedToContacts[i]);
        }
    }
}

/**
 * Adds a contact to the assigned contacts list if it is not already included.
 * 
 * @param {Object} contact - The contact object to be assigned to the task.
 */
function addAssignedContactIfNotExists(contact) {
    const isAlreadyAssigned = assignedToContacts.some(c => c === contact);
    if (!isAlreadyAssigned) {
        assignedToContacts.push(contact);
    }
}

/**
 * Adds a subtask to the current subtasks list if it is not already included.
 * 
 * @param {Object} subTask - The subtask object to be added.
 */
function addSubTaskIfNotExists(subTask) {
    const isAlreadyAssigned = currentSubTasks.some(s => s.id === subTask.id);
    if (!isAlreadyAssigned) {
        currentSubTasks.push(subTask);
    }
}

/**
 * Renders the subtasks in the task editing view.
 */
function renderEditTaskDetailsSubTasks() {
    const contentRef = document.getElementById('added_subtasks_container_edit');
    if (contentRef) {
        contentRef.innerHTML = "";
        for (let i = 0; i < currentSubTasks.length; i++) {
            contentRef.innerHTML += renderHTMLEditTaskDetailsSubTask(currentSubTasks[i]);
        }
    }
}

/**
 * Renders the contact list for editing task assignments.
 * 
 * @param {Array} currentContacts - The array of contacts available for assignment.
 */
function renderContactListEdit(currentContacts) {
    const sortedContacts = sortContactsByName(currentContacts);
    const contactHTML = generateContactHTMLEdit(sortedContacts);
    const dropDownRef = document.getElementById("dropdown_list_edit");
    dropDownRef.innerHTML = "";
    dropDownRef.innerHTML += renderHTMLYouInContactListEdit();
    dropDownRef.innerHTML += contactHTML;
}

/**
 * Generates the HTML for the contact list in the edit task view.
 * 
 * @param {Array} currentContacts - An array of contact objects.
 * @returns {string} - The generated HTML string.
 */
function generateContactHTMLEdit(currentContacts) {
    return currentContacts
        .map(contact => generateContactTemplateEdit(contact))
        .join("");
}

/**
 * Enables mobile drag-and-drop functionality for a task element.
 * @param {HTMLElement} taskElement - The task element to enable drag functionality on.
 */
function enableMobileDrag(taskElement) {
    taskElement.addEventListener("touchstart", (event) => startLongPress(event, taskElement), { passive: false });
    taskElement.addEventListener("touchmove", (event) => moveDraggedElement(event.touches[0]), { passive: true });
    taskElement.addEventListener("touchend", dropTaskMobile, { passive: true });
    taskElement.addEventListener("touchcancel", cleanupDrag, { passive: true });
}

/**
 * Initiates a long press action to start dragging.
 * @param {TouchEvent} event - The touch event that triggered the long press.
 * @param {HTMLElement} taskElement - The task element being dragged.
 */
function startLongPress(event, taskElement) {
    event.preventDefault();
    longPressTimer = setTimeout(() => {
        startDraggingMobile(taskElement);
    }, 10);
    event.target.addEventListener("touchend", () => clearTimeout(longPressTimer), { passive: true });
}

/**
 * Starts the dragging process by cloning the task element.
 * @param {HTMLElement} taskElement - The task element being dragged.
 */
function startDraggingMobile(taskElement) {
    if (draggedElement) return;
    currentDraggedTask = JSON.parse(taskElement.getAttribute('data-task'));
    draggedElement = taskElement.cloneNode(true);
    draggedElement.classList.add("dragging__mobile");
    document.body.appendChild(draggedElement);
    Object.assign(draggedElement.style, {
        position: "fixed",
        left: "-9999px", 
        top: "-9999px",
        pointerEvents: "none", 
        opacity: "0.8",
        zIndex: "1000"
    });
}

/**
 * Moves the dragged element to the current touch position.
 * @param {Touch} touch - The touch event object containing position data.
 */
function moveDraggedElement(touch) {
    if (draggedElement) {
        draggedElement.style.left = `${touch.clientX}px`;
        draggedElement.style.top = `${touch.clientY}px`;
    }
}

/**
 * Handles dropping the dragged task into the best-matching column.
 */
function dropTaskMobile() {
    if (!draggedElement) return;
    const targetColumn = getBestDropTarget();
    if (targetColumn) moveTo(formatStatus(targetColumn.id));
    cleanupDrag();
}

/**
 * Determines the best drop target by checking overlap with columns.
 * @returns {HTMLElement|null} The best-matching column or null if no valid target is found.
 */
function getBestDropTarget() {
    const draggedRect = draggedElement.getBoundingClientRect();
    const columns = document.querySelectorAll(".column__content");
    let bestTarget = null, maxOverlap = 0;
    columns.forEach(column => {
        const overlap = calculateOverlap(draggedRect, column.getBoundingClientRect());
        if (overlap > 0.1 && overlap > maxOverlap) {
            maxOverlap = overlap;
            bestTarget = column;
        }
    });
    return bestTarget;
}

/**
 * Calculates the overlap area between the dragged element and a column.
 * @param {DOMRect} draggedRect - The bounding rectangle of the dragged element.
 * @param {DOMRect} columnRect - The bounding rectangle of the target column.
 * @returns {number} The overlap percentage between the dragged element and the column.
 */
function calculateOverlap(draggedRect, columnRect) {
    const overlapX = Math.max(0, Math.min(draggedRect.right, columnRect.right) - Math.max(draggedRect.left, columnRect.left));
    const overlapY = Math.max(0, Math.min(draggedRect.bottom, columnRect.bottom) - Math.max(draggedRect.top, columnRect.top));
    return (overlapX * overlapY) / (draggedRect.width * draggedRect.height);
}

/**
 * Formats the column ID into a valid status string.
 * @param {string} id - The column ID.
 * @returns {string} The formatted status.
 */
function formatStatus(id) {
    let status = id.replace("_content", "").replaceAll("_", "-");
    return status === "awaiting-feedback" ? "await-feedback" : status;
}

/**
 * Cleans up the dragging process by removing the dragged element.
 */
function cleanupDrag() {
    if (draggedElement) {
        draggedElement.remove();
        draggedElement = null;
    }
    currentDraggedTask = null;
}









