/* =========================================================================
   Day 1: Delayed Promise
   Create a function `delay(ms)` that returns a promise resolving after ms.
   Author: Stephen Ndungu
   ========================================================================= */

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// Demo (run with: node daily-1.js)
(async () => {
    console.log("Waiting...");
    await delay(2000);
    console.log("This prints after 2 seconds");
})();
