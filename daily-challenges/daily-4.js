/* =========================================================================
   Day 4: Rewrite Callbacks with Async/Await
   The classic loadUser callback example rewritten using async/await.
   Author: Stephen Ndungu
   ========================================================================= */

// --- Original callback-based version ---
function loadUserCallback(userId, callback) {
    setTimeout(() => {
        callback({ id: userId, name: "Alice", email: "alice@example.com" });
    }, 1500);
}

// --- Promise wrapper ---
function loadUser(userId) {
    return new Promise((resolve) =>
        setTimeout(() => resolve({ id: userId, name: "Alice", email: "alice@example.com" }), 1500)
    );
}

// --- Async/await version ---
async function loadUserAsync(userId) {
    const user = await loadUser(userId);
    console.log("User (async):", user);
    return user;
}

// Run with: node daily-4.js
loadUserAsync(42);
