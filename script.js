let tasks = [];
let contacts = [];
let users = [];
let currentUser;
let lastPage;
const BASE_URL = "https://backenjoin-default-rtdb.europe-west1.firebasedatabase.app/";


/**
 * Loads data from the specified endpoint.
 * @param {string} [path=""] - The API endpoint path to load data from.
 * @returns {Promise<Object|undefined>} A promise that resolves to the JSON response or undefined in case of an error.
 */
async function loadData(path = "") {
    try {
        let response = await fetch(BASE_URL + path + ".json");
        let responseToJson = await response.json();
        return responseToJson;
    } catch (error) {
        console.error("Error loading data:", error);
    }
}

/**
 * Sends data to the specified endpoint using a POST request.
 * @param {string} [path=""] - The API endpoint path to post data to.
 * @param {Object} [data={}] - The data object to send.
 * @returns {Promise<Object|undefined>} A promise that resolves to the JSON response or undefined in case of an error.
 */
async function postData(path = "", data = {}) {
    try {
        let response = await fetch(BASE_URL + path + ".json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        return await response.json();
    } catch (error) {
        console.error("Error posting data:", error);
    }
}

/**
 * Deletes data at the specified endpoint using a DELETE request.
 * @param {string} [path=""] - The API endpoint path to delete data from.
 * @returns {Promise<Object|undefined>} A promise that resolves to the JSON response or undefined in case of an error.
 */
async function deleteData(path = "") {
    try {
        let response = await fetch(BASE_URL + path + ".json", {
            method: "DELETE"
        });
        return await response.json();
    } catch (error) {
        console.error("Error deleting data:", error);
    }
}

/**
 * Updates data at the specified endpoint using a PUT request.
 * @param {string} [path=""] - The API endpoint path to update data.
 * @param {Object} [data={}] - The updated data object.
 * @returns {Promise<Object|undefined>} A promise that resolves to the JSON response or undefined in case of an error.
 */
async function putData(path = "", data = {}) {
    try {
        let response = await fetch(BASE_URL + path + ".json", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        return await response.json();
    } catch (error) {
        console.error("Error putting data:", error);
    }
}

/**
 * Fetches all contacts from the database.
 * Converts the fetched contacts into an array and filters out null or undefined values.
 * 
 * @async
 */
async function fetchContacts() {
    try {
        let fetchedContacts = await loadData("contacts");
        if (!fetchedContacts) fetchedContacts = [];
        contacts = Object.values(fetchedContacts).filter(contact => contact !== null && contact !== undefined);
    } catch (error) {
        console.error("Error getting contacts:", error);
    }
}

/**
 * Fetches all tasks from the database.
 * Converts the fetched tasks into an array and filters out null or undefined values.
 * 
 * @async
 */
async function fetchTasks() {
    try {
        let fetchedTasks = await loadData("tasks");
        if (!fetchedTasks) fetchedTasks = [];
        tasks = Object.values(fetchedTasks).filter(task => task !== null && task !== undefined);
    } catch (error) {
        console.error("Error getting tasks:", error);
    }
}

/**
 * Fetches all users from the database.
 * Converts the fetched users into an array and filters out null or undefined values.
 * 
 * @async
 */
async function fetchUsers() {
    try {
        let fetchedUsers = await loadData("users");
        if (!fetchedUsers) fetchedUsers = [];
        users = Object.values(fetchedUsers).filter(user => user !== null && user !== undefined);
    } catch (error) {
        console.error("Error getting users:", error);
    }
}

/**
 * Retrieves the currently logged-in user from local storage.
 * 
 * @returns {Object|null} The current user object if found, otherwise null.
 */
function getCurrentUser() {
    let storedCurrentUser = localStorage.getItem("currentUser");
    if (storedCurrentUser) currentUser = JSON.parse(storedCurrentUser);
    return currentUser;
}

/**
 * Retrieves the last visited page from local storage.
 * 
 * @returns {string|null} The last visited page URL if found, otherwise null.
 */
function getLastpage() {
    let storedLastPage = localStorage.getItem("lastPage");
    if (storedLastPage) lastPage = JSON.parse(storedLastPage);
    return lastPage;
}

/**
 * Checks if a user is logged in and updates the UI with the user's initials.
 * Redirects to the login page if no user is found.
 */
function fillTheTag() {
    currentUser = getCurrentUser();
    if (currentUser === null || currentUser === undefined) {
        window.location.href = "./login.html";
    } else {
        let currentUserInitials = currentUser.initials;
        const currentUserInitialsRef = document.getElementById('currentuser_initials_ref');
        currentUserInitialsRef.innerHTML = currentUserInitials;
    }
}

/**
 * Initializes the application by fetching contacts and tasks,
 * retrieving the current user, and updating the UI.
 * 
 * @async
 */
async function init() {
    try {
        await fetchContacts();
        await fetchTasks();
        getCurrentUser();
        fillTheTag();
    } catch (error) {
        console.error("Error initializing app:", error);
    }
}

/**
 * Initializes the index page.
 * Retrieves the current user and redirects to the summary page if the user is logged in.
 */
function initIndex() {
    getCurrentUser();
    if (currentUser) {
        openSummaryWebsiteWithoutMobileAnimation();
    }
}
