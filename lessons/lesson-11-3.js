/* =========================================================================
   Lesson 11.3 - Promise Chaining, Promise.all & Promise.race
   Author: Stephen Ndungu
   ========================================================================= */

/* --- Exercise 1: Chain Promises ----------------------------------------- */
function getUserDataPromise(userId) {
    return new Promise((resolve) => setTimeout(() => resolve({ id: userId, name: "John" }), 1000));
}
function getUserPostsPromise(userId) {
    return new Promise((resolve) => setTimeout(() => resolve([{ id: 1, title: "Post 1" }]), 1000));
}
function getPostCommentsPromise(postId) {
    return new Promise((resolve) => setTimeout(() => resolve([{ id: 1, text: "Nice!" }]), 1000));
}

getUserDataPromise(1)
    .then((user) => {
        console.log("User:", user);
        return getUserPostsPromise(user.id);
    })
    .then((posts) => {
        console.log("Posts:", posts);
        return getPostCommentsPromise(posts[0].id);
    })
    .then((comments) => console.log("Comments:", comments))
    .catch((error) => console.error("Error:", error));

/* --- Exercise 2: Promise.all (parallel) -------------------------------- */
Promise.all([getUserDataPromise(1), getUserDataPromise(2), getUserDataPromise(3)])
    .then((results) => console.log("All users:", results))
    .catch((error) => console.error("One failed:", error));

/* --- Exercise 3: Promise.race (first wins) ----------------------------- */
const fast = new Promise((resolve) => setTimeout(() => resolve("Fast!"), 100));
const slow = new Promise((resolve) => setTimeout(() => resolve("Slow!"), 500));

Promise.race([fast, slow]).then((result) => console.log("Winner:", result));

/* --- Build: fetch 3 users simultaneously ------------------------------- */
async function fetchThreeUsers() {
    const [u1, u2, u3] = await Promise.all([
        getUserDataPromise(1),
        getUserDataPromise(2),
        getUserDataPromise(3),
    ]);
    console.log("Fetched all at once:", u1, u2, u3);
    return [u1, u2, u3];
}
