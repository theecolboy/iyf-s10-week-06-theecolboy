/* =========================================================================
   Lesson 11.2 - Callback Hell & Introduction to Promises
   Author: Stephen Ndungu
   ========================================================================= */

/* --- Exercise 1: Callback Hell (the "Pyramid of Doom") ------------------ */
function getUserData(userId, callback) {
    setTimeout(() => callback({ id: userId, name: "John" }), 1000);
}
function getUserPosts(userId, callback) {
    setTimeout(() => callback([{ id: 1, title: "Post 1" }, { id: 2, title: "Post 2" }]), 1000);
}
function getPostComments(postId, callback) {
    setTimeout(() => callback([{ id: 1, text: "Great post!" }]), 1000);
}

// The nightmare (nested callbacks):
getUserData(1, (user) => {
    console.log("User:", user);
    getUserPosts(user.id, (posts) => {
        console.log("Posts:", posts);
        getPostComments(posts[0].id, (comments) => {
            console.log("Comments:", comments);
        });
    });
});

/* --- Exercise 2: Refactor to Promises ----------------------------------- */
function getUserDataPromise(userId) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (userId > 0) resolve({ id: userId, name: "John" });
            else reject("Invalid user ID");
        }, 1000);
    });
}

function getUserPostsPromise(userId) {
    return new Promise((resolve) => {
        setTimeout(() => resolve([{ id: 1, title: "Post 1" }, { id: 2, title: "Post 2" }]), 1000);
    });
}

function getPostCommentsPromise(postId) {
    return new Promise((resolve) => {
        setTimeout(() => resolve([{ id: 1, text: "Great post!" }]), 1000);
    });
}

getUserDataPromise(1)
    .then((user) => console.log("User (promise):", user))
    .catch((err) => console.error("Error:", err));
