/* =========================================================================
   Lesson 12.2 - Display API Data in DOM
   Lesson 12.4 - Search / Sort / Filter
   Lesson 12.3 - POST requests
   Author: Stephen Ndungu
   ========================================================================= */

const BASE = "https://jsonplaceholder.typicode.com";

const loading = document.getElementById("loading");
const errorDiv = document.getElementById("error");
const container = document.getElementById("users-container");
const searchInput = document.getElementById("search");
const sortSelect = document.getElementById("sort");
const cityFilter = document.getElementById("city-filter");

let allUsers = [];

/* ----------------------------- Load users ------------------------------- */
async function loadUsers() {
    try {
        showLoading();
        const response = await fetch(`${BASE}/users`);
        if (!response.ok) throw new Error("Failed to fetch users");
        allUsers = await response.json();
        populateCityFilter();
        applyControls();
    } catch (error) {
        showError(error.message);
    } finally {
        hideLoading();
    }
}

function populateCityFilter() {
    const cities = [...new Set(allUsers.map((u) => u.address.city))].sort();
    cityFilter.innerHTML =
        '<option value="">All cities</option>' +
        cities.map((c) => `<option value="${c}">${c}</option>`).join("");
}

/* ------------------------------ Rendering ------------------------------- */
function applyControls() {
    const query = searchInput.value.toLowerCase();
    const sortDir = sortSelect.value;
    const city = cityFilter.value;

    let result = allUsers;
    if (query) {
        result = result.filter(
            (u) => u.name.toLowerCase().includes(query) || u.email.toLowerCase().includes(query)
        );
    }
    if (city) result = result.filter((u) => u.address.city === city);
    result = [...result].sort((a, b) =>
        sortDir === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );

    displayUsers(result);
}

function displayUsers(users) {
    if (users.length === 0) {
        container.innerHTML = "<p>No users found.</p>";
        return;
    }
    container.innerHTML = users
        .map(
            (user) => `
        <div class="user-card">
            <h2>${user.name}</h2>
            <p>📧 ${user.email}</p>
            <p>🏢 ${user.company.name}</p>
            <p>📍 ${user.address.city}</p>
        </div>`
        )
        .join("");
}

function showLoading() {
    loading.classList.remove("hidden");
    container.innerHTML = "";
}
function hideLoading() {
    loading.classList.add("hidden");
}
function showError(message) {
    errorDiv.textContent = `Error: ${message}`;
    errorDiv.classList.remove("hidden");
}

/* ------------------------------ Events ---------------------------------- */
searchInput.addEventListener("input", applyControls);
sortSelect.addEventListener("change", applyControls);
cityFilter.addEventListener("change", applyControls);

/* --------------------------- POST request ------------------------------- */
const postForm = document.getElementById("post-form");
const postResult = document.getElementById("post-result");

postForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = document.getElementById("post-title").value;
    const body = document.getElementById("post-body").value;
    const userId = Number(document.getElementById("post-user").value);

    try {
        const response = await fetch(`${BASE}/posts`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, body, userId }),
        });
        if (!response.ok) throw new Error("Failed to create post");
        const created = await response.json();
        postResult.textContent = "Created: " + JSON.stringify(created, null, 2);
        postResult.classList.remove("hidden");
    } catch (err) {
        postResult.textContent = "Error: " + err.message;
        postResult.classList.remove("hidden");
    }
});

/* ------------------------------- Init ----------------------------------- */
loadUsers();
