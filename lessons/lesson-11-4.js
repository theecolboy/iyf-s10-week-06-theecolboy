/* =========================================================================
   Lesson 11.4 - Async/Await
   Author: Stephen Ndungu
   ========================================================================= */

function getUserDataPromise(userId) {
    return new Promise((resolve) => setTimeout(() => resolve({ id: userId, name: "John" }), 1000));
}
function getUserPostsPromise(userId) {
    return new Promise((resolve) => setTimeout(() => resolve([{ id: 1, title: "Post 1" }]), 1000));
}
function getPostCommentsPromise(postId) {
    return new Promise((resolve) => setTimeout(() => resolve([{ id: 1, text: "Nice!" }]), 1000));
}

/* --- Exercise 1: Promise chain -> async/await --------------------------- */
async function getDataWithAsync() {
    const user = await getUserDataPromise(1);
    const posts = await getUserPostsPromise(user.id);
    const comments = await getPostCommentsPromise(posts[0].id);
    return comments;
}

/* --- Exercise 2: Try/Catch error handling ------------------------------- */
async function fetchUserData(userId) {
    try {
        const user = await getUserDataPromise(userId);
        const posts = await getUserPostsPromise(user.id);
        return { user, posts };
    } catch (error) {
        console.error("Failed to fetch:", error);
        throw error;
    }
}

/* --- Exercise 3: Parallel with async/await ------------------------------ */
async function getAllUsers() {
    // Parallel (fast ~1s instead of ~3s):
    const [u1, u2, u3] = await Promise.all([
        getUserDataPromise(1),
        getUserDataPromise(2),
        getUserDataPromise(3),
    ]);
    return [u1, u2, u3];
}

/* --- Build: rewrite callback hell using async/await --------------------- */
async function fetchEverything() {
    const user = await getUserDataPromise(1);
    const posts = await getUserPostsPromise(user.id);
    const comments = await getPostCommentsPromise(posts[0].id);
    console.log("All data:", { user, posts, comments });
}

fetchEverything();
