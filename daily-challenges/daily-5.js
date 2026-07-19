/* =========================================================================
   Day 5: Parallel Fetches
   Fetch 3 endpoints at once; show results as each settles (Promise.allSettled).
   Author: Stephen Ndungu
   ========================================================================= */

const BASE = "https://jsonplaceholder.typicode.com";

async function fetchParallel() {
    const endpoints = [`${BASE}/users/1`, `${BASE}/users/2`, `${BASE}/users/3`];

    const results = await Promise.allSettled(
        endpoints.map(async (url) => {
            const res = await fetch(url);
            if (!res.ok) throw new Error(`Failed ${url}`);
            return res.json();
        })
    );

    results.forEach((result, i) => {
        if (result.status === "fulfilled") {
            console.log(`Endpoint ${i + 1} OK:`, result.value.name);
        } else {
            console.log(`Endpoint ${i + 1} FAILED:`, result.reason.message);
        }
    });
}

// Run with: node daily-5.js
fetchParallel();
