const boardCategories = ["to_do", "in_progress", "awaiting_feedback", "done"];
let tasksInStatusToDo;
let tasksInStatusProgress;
let tasksInStatusAwaitingFeedback;
let tasksInStatusDone;
let flatpickrInstanceEdit;

let currentDraggedTask;
let draggedElement = null;
let longPressTimer = null;
let highlightElement = null;
let draggedElementSize = { width: 0, height: 0 };
let currentHighlightContainer = null;
let currentUserChoosenEdit;
let assignedToContacts = [];
let currentEditedTask;
let currentSubTasks = [];
let subTasksIdCounterEdit = 0;

/**
 * Initializes the board by loading tasks, rendering the UI, and setting up necessary components.
 * Handles any errors during initialization.
 */
async function initBoard() {
  try {
      await init();
      initFlatpickr();
      getAllTasksIn();
      renderBoardContent();
      renderContactList(contacts);
      renderTaskCategoryList();
      renderSubtasks();
  } catch (error) {
      console.error("Error initializing app:", error);
  }
}

/**
 * Initializes the Flatpickr date picker for task editing.
 */
function initFlatpickrEdit() {
  flatpickrInstanceEdit = flatpickr("#task_due_date_edit", {
    dateFormat: "d/m/Y", altInput: true, altFormat: "d/m/Y", allowInput: true, disableMobile: true, locale: "de", placeholder: "dd/mm/yyyy",
    onReady: function() {
        this.input.setAttribute('name', 'task_due_date_edit');
        this.input.setAttribute('id', 'task_due_date_edit_hidden');
        if (this.altInput) { this.altInput.setAttribute('name', 'task_due_date_edit'); this.altInput.setAttribute('id', 'task_due_date_edit'); }
        const calendar = this.calendarContainer;
        calendar.querySelector('.flatpickr-monthDropdown-months')?.setAttribute('name', 'task_due_month');
        calendar.querySelector('.cur-year')?.setAttribute('name', 'task_due_year');
    },
    onChange: function(selectedDates, dateStr, instance) { validateDate(dateStr, 'date_container_input_edit', 'errormessage_box_date_edit');}
  });
}

/**
 * Retrieves all tasks and categorizes them into their respective status lists.
 */
function getAllTasksIn() {
  getTasksInStatusToDo();
  getTasksInStatusProgress();
  getTasksInStatusAwaitingFeedback();
  getTasksInStatusDone();
}

/**
 * Filters and assigns tasks with "to-do" status to the corresponding list.
 */
function getTasksInStatusToDo() {
  tasksInStatusToDo = tasks.filter(task => task.status === "to-do");
}

/**
 * Filters and assigns tasks with "in-progress" status to the corresponding list.
 */
function getTasksInStatusProgress() {
  tasksInStatusProgress = tasks.filter(task => task.status === "in-progress");
}

/**
 * Filters and assigns tasks with "await-feedback" status to the corresponding list.
 */
function getTasksInStatusAwaitingFeedback() {
  tasksInStatusAwaitingFeedback = tasks.filter(task => task.status === "await-feedback");
}

/**
 * Filters and assigns tasks with "done" status to the corresponding list.
 */
function getTasksInStatusDone() {
  tasksInStatusDone = tasks.filter(task => task.status === "done");
}

/**
 * Renders the board content by looping through all board categories.
 * It clears and updates the corresponding task columns in the UI.
 */
function renderBoardContent() {
  boardCategories.forEach(element => {
    let currentTasks = getTasksIn(element);
    const columnRef = document.getElementById(`${element}_content`);
    columnRef.innerHTML = "";
    if (currentTasks.length > 0) {
      for (let i = 0; i < currentTasks.length; i++) {
        columnRef.innerHTML += renderHTMLBoardCard(currentTasks[i], i);
        renderBoardAssingedToBadges(currentTasks[i], i);
      }
    } else {
      columnRef.innerHTML = renderHTMLNoCardInBoard(element);
    }
  });
}

/**
 * Converts a board category identifier into a user-friendly format.
 * 
 * @param {string} category - The category identifier (e.g., "to_do", "in_progress").
 * @returns {string} - The formatted category name.
 */
function getBoardCategoryInFormat(category) {
  if (category === "to_do") return "To do";
  if (category === "in_progress") return "In progress";
  if (category === "awaiting_feedback") return "Await Feedback";
  if (category === "done") return "Done";
  return "Board";
}

/**
 * Retrieves the tasks for a given board category.
 * 
 * @param {string} element - The category name (e.g., "to_do", "in_progress", etc.).
 * @returns {Array} The list of tasks corresponding to the category, or an empty array if not found.
 */
function getTasksIn(element) {
  if (element === "to_do") return tasksInStatusToDo;
  if (element === "in_progress") return tasksInStatusProgress;
  if (element === "awaiting_feedback") return tasksInStatusAwaitingFeedback;
  if (element === "done") return tasksInStatusDone;
  return [];
}

/**
 * Renders the assigned user badges for a given task in the board.
 * 
 * @param {Object} task - The task object containing assigned users.
 * @param {number} i - The index of the task in the current list.
 */
function renderBoardAssingedToBadges(task, i) {
  const badgesContainerRef = document.getElementById(`badges_container_${task.name}_${i}_${task.description}_${task.due_date}`);
  badgesContainerRef.innerHTML = "";
  if (task && task.assigned_to.length > 0) {
    const maxBadges = 4;
    for (let j = 0; j < Math.min(task.assigned_to.length, maxBadges); j++) {
      badgesContainerRef.innerHTML += renderHTMLBoardAssingedToBadges(task.assigned_to[j]);
    }
    if (task.assigned_to.length > maxBadges) {
      const remainingCount = task.assigned_to.length - maxBadges;
      badgesContainerRef.innerHTML += `<span class="more__badges">+${remainingCount}</span>`;
    }
  }
}

/**
 * Counts the number of subtasks with a status of 1.
 * @param {Array} subtasks - The list of subtasks.
 * @returns {number} - The number of completed subtasks.
 */
function countCompletedSubtasks(subtasks) {
  if (!Array.isArray(subtasks)) return 0;
  return subtasks.filter(subtask => subtask.status === 1).length;
}

/**
 * Calculates the percentage of completed subtasks.
 * @param {Array} subtasks - The list of subtasks.
 * @returns {number} - The completion percentage rounded to one decimal place.
 */
function calculateCompletionPercentage(subtasks) {
  if (!Array.isArray(subtasks) || subtasks.length === 0) return 0;
  const completed = countCompletedSubtasks(subtasks);
  return Math.round((completed / subtasks.length) * 1000) / 10;
}

/**
 * Returns the priority icon name based on the given priority level.
 * 
 * @param {number} prio - The priority level (1 = low, 2 = medium, 3 = urgent).
 * @returns {string} The corresponding icon name for the priority.
 */
function getPrioIcon(prio) {
  if (prio === 1) return 'low_icon_green';
  if (prio === 2) return 'medium_icon_orange';
  if (prio === 3) return 'urgent_icon_red';
}

/**
 * Returns the full category name based on the short category code.
 * 
 * @param {string} category - The category code ("us" or "tt").
 * @returns {string} The full category name.
 */
function getTaskCategory(category) {
  if (category === "us") return 'User Story';
  if (category === "tt") return 'Technical Task';
}

/**
 * Returns the CSS class name for the given category.
 * 
 * @param {string} category - The category code ("us" or "tt").
 * @returns {string} The corresponding CSS class name.
 */
function getTaskCategoryCSSClass(category) {
  if (category === "us") return 'user__story';
  if (category === "tt") return 'technical__task';
}

/**
 * Opens the "Add Task" overlay and updates UI elements accordingly.
 */
function openAddTask() {
  if (isMobile()) openAddTaskWebsite();
  toggleDnoneFromBoardOverlay();
  const buttonRef = document.getElementById('open_add_task_button');
  buttonRef.classList.add('add__contact__button__active');
  const containerRef = document.getElementById('add_task_overlay');
  addActiveOverviewStyling(containerRef);
  fixateScrollingOnBody();
  window.addEventListener("resize", handleResize);
}

/**
 * Toggles the "d__none" class on the board overlay element to show or hide it.
 */
function toggleDnoneFromBoardOverlay() {
  const overlayRef = document.getElementById('add_task_overlay_board');
  if (overlayRef) overlayRef.classList.toggle('d__none');
}

/**
 * Adds active styling to a given content container.
 * @param {HTMLElement} contentRef - The container element.
 */
function addActiveOverviewStyling(contentRef) {
  setTimeout(() => {
    contentRef.classList.add('add__task__overlay__content__active');
}, 125); 
}

/**
 * Closes the contact overlay and resets styles.
 */
function closeAddTaskOverlay() {
  toggleDnoneFromBoardOverlay();
  const containerRef = document.getElementById('add_task_overlay');
  removeActiveOverviewStyling(containerRef);
  releaseScrollOnBody();
  window.removeEventListener("resize", handleResize);
}

/**
 * Removes active styling from a given content container.
 * @param {HTMLElement} contentRef - The container element.
 */
function removeActiveOverviewStyling(contentRef) {
  contentRef.classList.remove('add__task__overlay__content__active');
}

/**
 * Prevents the default behavior of the drag event.
 * 
 * @param {DragEvent} event - The drag event.
 */
function allowDrop(event) {
  if (event) event.preventDefault();
}

/**
 * Highlights the given drop area by adding a visual indication.
 * 
 * @param {string} id - The ID of the drop area element.
 */
function highlight(id) {
  const areaRef = document.getElementById(id);
  if (!areaRef) return;
  createHighlightElement();
  updateHighlightContainer(areaRef);
  setHighlightSize();
}

/**
 * Creates the highlight element if it does not exist.
 */
function createHighlightElement() {
  if (!highlightElement) {
    highlightElement = document.createElement("div");
    highlightElement.classList.add("area__highlight");
  }
}

/**
 * Updates the current highlight container by adding or removing the highlight element.
 * 
 * @param {HTMLElement} areaRef - The reference to the drop area element.
 */
function updateHighlightContainer(areaRef) {
  if (currentHighlightContainer !== areaRef) {
    currentHighlightContainer?.contains(highlightElement) && 
      currentHighlightContainer.removeChild(highlightElement);
    areaRef.appendChild(highlightElement);
    currentHighlightContainer = areaRef;
  }
}

/**
 * Sets the size of the highlight element based on the dragged task size.
 */
function setHighlightSize() {
  Object.assign(highlightElement.style, {
    width: `${draggedElementSize.width}px`,
    height: `${draggedElementSize.height}px`,
    display: "block"
  });
}

/**
 * Removes the highlight element from the current highlight container.
 */
function removeHighlight() {
  if (highlightElement && currentHighlightContainer) {
    currentHighlightContainer.removeChild(highlightElement);
    highlightElement = null;
    currentHighlightContainer = null;
  }
}

/**
 * Starts the dragging process for a task.
 * 
 * @param {HTMLElement} taskElement - The task element being dragged.
 */
function startDragging(taskElement) {
  const taskData = JSON.parse(taskElement.getAttribute('data-task'));
  currentDraggedTask = taskData;
  setDraggedElementSize(taskElement);
  taskElement.style.opacity = "0.8";
  taskElement.classList.add("dragging");
}

/**
 * Stores the size of the dragged element.
 * 
 * @param {HTMLElement} taskElement - The task element being dragged.
 */
function setDraggedElementSize(taskElement) {
  const rect = taskElement.getBoundingClientRect();
  draggedElementSize.width = rect.width;
  draggedElementSize.height = rect.height;
}

/**
 * Stops the dragging process and restores the original appearance of the task.
 * 
 * @param {HTMLElement} taskElement - The task element being dragged.
 */
function stopDragging(taskElement) {
  if (taskElement) {
    taskElement.style.opacity = "1";
    taskElement.classList.remove("dragging");
  }
}

/**
 * Moves the currently dragged task to a new status.
 * 
 * @param {string} status - The new status for the task.
 */
async function moveTo(status) {
  if (!currentDraggedTask || !status) return;
  const task = tasks.find(task => 
    task.name === currentDraggedTask.name &&
    task.description === currentDraggedTask.description &&
    task.due_date === currentDraggedTask.due_date
  );
  if (task) task.status = status;
  await putData("tasks", tasks);
  getAllTasksIn();
  renderBoardContent();
}

/**
 * Opens the task details overlay using either a task element or task data.
 * 
 * @param {HTMLElement} [taskElement] - The task element containing the data attribute.
 * @param {boolean} [skip] - Determines whether certain UI elements should be skipped.
 * @param {Object} [taskData] - The task data object if no task element is provided.
 */
function openTaskDetails(taskElement, skip, taskData) {
  if (taskElement) {
    openTaskDetailsWithElement(taskElement);
  }
  if (taskData) {
    openTaskDetailsWithData(taskData);
  }
  const containerRef = document.getElementById('task_details_overlay');
  addActiveOverviewStyling(containerRef, skip);
  fixateScrollingOnBody();
}

/**
 * Opens the task details using a task element.
 * 
 * @param {HTMLElement} taskElement - The task element containing the data attribute.
 */
function openTaskDetailsWithElement(taskElement) {
  const taskData = JSON.parse(taskElement.getAttribute('data-task'));
  const contentRef = document.getElementById('task_details_overlay_content_board');
  toggleDnoneFromTaskDetailsOverlay();
  renderTaskDetailsOverlayContent(contentRef, taskData);
  renderTaskDetailsAssignedTo(taskData);
  renderTaskDetailsSubTasks(taskData);
}

/**
 * Opens the task details using a task data object.
 * 
 * @param {Object} taskData - The task data object containing task information.
 */
function openTaskDetailsWithData(taskData) {
  const contentRef = document.getElementById('task_details_overlay_content_board');
  toggleDnoneFromTaskDetailsOverlay();
  renderTaskDetailsOverlayContent(contentRef, taskData);
  renderTaskDetailsAssignedTo(taskData);
  renderTaskDetailsSubTasks(taskData);
}

/**
 * Toggles the "d__none" class on the task details overlay element to show or hide it.
 */
function toggleDnoneFromTaskDetailsOverlay() {
  const overlayRef = document.getElementById('task_details_overlay_board');
  if (overlayRef) overlayRef.classList.toggle('d__none');
}


