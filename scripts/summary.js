let guestIndicator;
let allTaskDueDates = [];
let earliestDueDate;
let tasksInStatusToDoAmount;
let tasksInStatusProgressAmount;
let tasksInStatusAwaitingFeedbackAmount;
let tasksInStatusDoneAmount;
let tasksInPrioUrgend;

/**
 * Initializes the summary view.
 * Fetches data, checks if the mobile animation should play, and renders the summary.
 */
async function initSummary() {
    try {
        await init();
        if (isMobile()) mobileAnimation();
        getTasksInformationsforSummary();
        renderSummary(currentUser);
    } catch (error) {
        console.error("Error initializing app:", error);
    }
}

/**
 * Handles the mobile animation during summary initialization.
 * Checks if the animation should be skipped based on the query parameter.
 */
function mobileAnimation() {
    let skipMobileAnimation = getQueryParam("skipMobileAnimation") === "true";
    if (!skipMobileAnimation) {
        renderMobileGreeting();
        startMobileAnimation();
    } else skipMobileAnimationSummary();
}

/**
 * Renders the greeting message for mobile users.
 */
function renderMobileGreeting() {
    const overlayRef = document.getElementById('greet_overlay_mobile');
    if (overlayRef) {
        overlayRef.innerHTML = "";
        overlayRef.innerHTML += renderHTMLMobileGreeting();
    }
}

/**
 * Starts the mobile greeting animation.
 */
function startMobileAnimation() {
    const overlayRef = document.getElementById('greet_overlay_mobile');
    const contentRef = document.getElementById('greet_box_mobile');
    overlayRef.classList.remove("d__none", "greet__overlay__mobile__deactive");
    setTimeout(() => {
        contentRef.classList.add("greet__box__mobile__active");
    }, 125);
    setTimeout(() => {
        endMobileAnimation(overlayRef, contentRef);
    }, 2000);
}

/**
 * Ends the mobile greeting animation.
 * @param {HTMLElement} overlayRef - The overlay element.
 * @param {HTMLElement} contentRef - The greeting content element.
 */
function endMobileAnimation(overlayRef, contentRef) {
    overlayRef.classList.add("greet__overlay__mobile__deactive");
    contentRef.classList.remove("greet__box__mobile__active");
    setTimeout(() => {
        overlayRef.classList.add("d__none");
    }, 125);
}

/**
 * Skips the mobile animation by hiding the greeting overlay.
 */
function skipMobileAnimationSummary() {
    const overlayRef = document.getElementById('greet_overlay_mobile');
    overlayRef.classList.add("d__none", "greet__overlay__mobile__deactive");
}

/**
 * Renders the summary content.
 * @param {Object} currentUser - The currently logged-in user.
 */
function renderSummary(currentUser) {
    const summaryHeadlineBoxRef = document.getElementById('summary_headlinebox');
    summaryHeadlineBoxRef.classList.remove('d__none');
    const summaryContentRef = document.getElementById("summary_content");
    summaryContentRef.innerHTML = renderHTMLSummary(currentUser);
    compareEarliestTaskDueDate(earliestDueDate);
}

/**
 * Retrieves and processes all task-related information needed for the summary.
 */
function getTasksInformationsforSummary() {
    getAllTasksDueDates();
    const earliestDate = sortAllTaskDueDates();
    transFormDate(earliestDate);
    howManyTasksInStatusToDo();
    howManyTasksInStatusProgress();
    howManyTasksInStatusAwaitingFeedback();
    howManyTasksInStatusDone();
    howManyTasksInPrioUrgend();
}

/**
 * Collects all due dates from tasks and sorts them in ascending order.
 */
function getAllTasksDueDates() {
    allTaskDueDates = tasks
        .filter(task => task && task.due_date)
        .map(task => task.due_date)
        .sort((a, b) => new Date(a) - new Date(b));
}

/**
 * Retrieves the earliest due date from the sorted list.
 * @returns {string|null} The earliest due date or null if no due dates exist.
 */
function sortAllTaskDueDates() {
    return allTaskDueDates.length > 0 ? allTaskDueDates[0] : null;
}

/**
 * Compares the earliest due date with today's date.
 * If the due date has passed, it applies an error styling.
 * @param {string} earliestDate - The earliest task due date.
 */
function compareEarliestTaskDueDate(earliestDate) {
    if (!earliestDate) return;
    let todayDate = new Date();
    let dueDate = new Date(earliestDate);
    todayDate.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);
    if (dueDate <= todayDate) {
        const elementRef = document.getElementById('urgent_date_container');
        if (elementRef) elementRef.classList.add('error__color');
    }
}

/**
 * Converts the earliest due date into a user-friendly format.
 * @param {string} earliestDate - The earliest due date.
 */
function transFormDate(earliestDate) {
    if (!earliestDate) earliestDate = "Invalid Date";
    let formattedDate = new Date(earliestDate).toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
    earliestDueDate = formattedDate;
}

/**
 * Counts the number of tasks with "to-do" status.
 */
function howManyTasksInStatusToDo() {
    tasksInStatusToDoAmount = tasks.filter(task => task.status === "to-do").length;
}

/**
 * Counts the number of tasks with "in-progress" status.
 */
function howManyTasksInStatusProgress() {
    tasksInStatusProgressAmount = tasks.filter(task => task.status === "in-progress").length;
}

/**
 * Counts the number of tasks with "awaiting feedback" status.
 */
function howManyTasksInStatusAwaitingFeedback() {
    tasksInStatusAwaitingFeedbackAmount = tasks.filter(task => task.status === "await-feedback").length;
}

/**
 * Counts the number of tasks marked as "done".
 */
function howManyTasksInStatusDone() {
    tasksInStatusDoneAmount = tasks.filter(task => task.status === "done").length;
}

/**
 * Counts the number of tasks with the highest priority level (urgent).
 */
function howManyTasksInPrioUrgend() {
    tasksInPrioUrgend = tasks.filter(task => task.prio === 3).length;
}

/**
 * Determines the appropriate greeting based on the current time.
 * @returns {string} The greeting message (Good morning, Good afternoon, or Good evening).
 */
function getGreeting() {
    const now = new Date();
    const hours = now.getHours();
    if (hours >= 5 && hours < 12) {
        return "Good morning";
    } else if (hours >= 12 && hours < 18) {
        return "Good afternoon";
    } else {
        return "Good evening";
    }
}


