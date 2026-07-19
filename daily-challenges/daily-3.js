/* =========================================================================
   Day 3: Error Handling
   Fetch a user; if 404, return a default user instead of throwing.
   Author: Stephen Ndungu
   ========================================================================= */

const BASE = "https://jsonplaceholder.typicode.com";
const DEFAULT_USER = { id: 0, name: "Guest", email: "guest@example.com" };

async function fetchUserSafe(id) {
    try {
        const response = await fetch(`${BASE}/users/${id}`);
        if (response.status === 404) {
            console.log("User not found - returning default user.");
            return DEFAULT_USER;
        }
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Network/other error:", error.message);
        return DEFAULT_USER;
    }
}

// Run with: node daily-3.js
fetchUserSafe(9999).then((u) => console.log("Result:", u));
