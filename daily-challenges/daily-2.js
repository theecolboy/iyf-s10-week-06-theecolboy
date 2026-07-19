/* =========================================================================
   Day 2: Promise Chain
   3 functions, each resolves after a random delay. Chain them and time it.
   Author: Stephen Ndungu
   ========================================================================= */

function randomDelayTask(name) {
    const ms = Math.floor(Math.random() * 1000) + 500; // 500-1500ms
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`${name} resolved after ${ms}ms`);
            resolve(ms);
        }, ms);
    });
}

(async () => {
    const start = Date.now();
    // Sequential chaining -> total time ≈ sum of all delays
    await randomDelayTask("Task 1");
    await randomDelayTask("Task 2");
    await randomDelayTask("Task 3");
    console.log(`Total chained execution: ${Date.now() - start}ms`);
})();
