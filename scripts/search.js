let filteredTasks = [];
let filteredTasksInStatusToDo = [];
let filteredTasksInStatusProgress = [];
let filteredTasksInStatusAwaitingFeedback = [];
let filteredTasksInStatusDone = [];

/**
 * Filters tasks based on the search input and updates the board.
 * @param {Event} event - The event object (optional, used to prevent form submission).
 */
function filterBoard(event, inputRef) {
    if (event?.type === "submit") event.preventDefault();
    const input = document.getElementById(inputRef).value.toLowerCase();
    filteredTasks = [];
    if (input.length >= 3) {
        filteredTasks = tasks.filter(task =>
            task.name.toLowerCase().includes(input) ||
            task.description.toLowerCase().includes(input)
        );
        getAllFilteredTasksIn();
        renderFilteredBoardContent();
    }
    ifEmptySearch(input);
}

/**
 * Categorizes filtered tasks into different statuses.
 */
function getAllFilteredTasksIn() {
    filteredTasksInStatusToDo = filteredTasks.filter(task => task.status === "to-do");
    filteredTasksInStatusProgress = filteredTasks.filter(task => task.status === "in-progress");
    filteredTasksInStatusAwaitingFeedback = filteredTasks.filter(task => task.status === "await-feedback");
    filteredTasksInStatusDone = filteredTasks.filter(task => task.status === "done");
}

/**
 * Renders the filtered tasks on the board.
 */
function renderFilteredBoardContent() {
    boardCategories.forEach(element => {
        let currentTasks = getFilteredTasksIn(element);
        const columnRef = document.getElementById(`${element}_content`);
        columnRef.innerHTML = "";
        if (currentTasks.length > 0) {
            currentTasks.forEach((task, index) => {
                columnRef.innerHTML += renderHTMLBoardCard(task, index);
                renderBoardAssingedToBadges(task, index);
            });
        } else {
            columnRef.innerHTML = renderHTMLNoCardInBoard();
        }
    });
}

/**
 * Retrieves filtered tasks for a specific category.
 * @param {string} element - The category name.
 * @returns {Array} - Array of filtered tasks in the given category.
 */
function getFilteredTasksIn(element) {
    if (element === "to_do") return filteredTasksInStatusToDo;
    if (element === "in_progress") return filteredTasksInStatusProgress;
    if (element === "awaiting_feedback") return filteredTasksInStatusAwaitingFeedback;
    if (element === "done") return filteredTasksInStatusDone;
    return [];
}

/**
 * Resets filtering if the search input is empty.
 * @param {string} input - The search input value.
 */
function ifEmptySearch(input) {
    if (input === "") {
        filteredTasks = [];
        getAllTasksIn();
        renderBoardContent();
    }
}


