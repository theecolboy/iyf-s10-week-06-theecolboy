/* =========================================================================
   Lesson 12.1 - Fetch API Basics & Lesson 12.2/12.3/12.4 Helpers
   Author: Stephen Ndungu
   ========================================================================= */

const BASE = "https://jsonplaceholder.typicode.com";

/* --- Practice: fetch a single user, all users, posts -------------------- */
async function getUser(id) {
    try {
        const response = await fetch(`${BASE}/users/${id}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch user:", error);
    }
}

async function getUsers() {
    const response = await fetch(`${BASE}/users`);
    return response.json();
}

async function getUserPosts(id) {
    const response = await fetch(`${BASE}/users/${id}/posts`);
    return response.json();
}

/* --- Lesson 12.3: POST requests (create a resource) --------------------- */
async function createPost(title, body, userId) {
    const response = await fetch(`${BASE}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body, userId }),
    });
    if (!response.ok) throw new Error("Failed to create post");
    return response.json();
}

/* --- Lesson 12.4 helpers: search, sort, filter -------------------------- */
function searchUsers(users, query) {
    const q = query.toLowerCase();
    return users.filter(
        (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
}

function sortUsers(users, direction = "asc") {
    return [...users].sort((a, b) =>
        direction === "asc"
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name)
    );
}

function filterByCity(users, city) {
    if (!city) return users;
    return users.filter((u) => u.address.city === city);
}
