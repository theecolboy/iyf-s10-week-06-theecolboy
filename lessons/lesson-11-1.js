/* =========================================================================
   Lesson 11.1 - Understanding Async: Callbacks & the Event Loop
   Author: Stephen Ndungu
   ========================================================================= */

/* --- Exercise 1: Predict the output -------------------------------------
   console.log("A");                 // 1st
   setTimeout(() => console.log("B"), 0);   // queued (after current stack)
   console.log("C");                 // 2nd
   setTimeout(() => console.log("D"), 100); // queued after 100ms
   console.log("E");                 // 3rd
   OUTPUT ORDER: A, C, E, B, D
   Even setTimeout(…, 0) waits for the call stack to clear.
------------------------------------------------------------------------ */
console.log("A");

setTimeout(() => console.log("B"), 0);

console.log("C");

setTimeout(() => console.log("D"), 100);

console.log("E");

/* --- Exercise 2: Callback Pattern --------------------------------------- */
function loadUser(userId, callback) {
    // Simulate a 1.5 second database lookup
    setTimeout(() => {
        const user = { id: userId, name: "Alice", email: "alice@example.com" };
        callback(user);
    }, 1500);
}

loadUser(42, (user) => {
    console.log("User loaded:", user);
});
