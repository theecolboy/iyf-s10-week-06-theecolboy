# IYF S10 — Week 6: Asynchronous JavaScript

> **Student:** Stephen Ndungu
> **Repository:** `iyf-s10-week-06-theecolboy`
> **Track:** Intro to Programming — JavaScript Foundations

A hands-on week mastering **asynchronous JavaScript** — callbacks, promises,
async/await, the Fetch API, and building a real weather dashboard powered by
the OpenWeatherMap API.

---

## 📚 Table of Contents

- [Overview](#overview)
- [What I Learned](#what-i-learned)
- [Project Structure](#project-structure)
- [Lessons](#lessons)
- [Daily Challenges](#daily-challenges)
- [Mini-Project: Weather Dashboard](#mini-project-weather-dashboard)
- [How to Run](#how-to-run)
- [API Key Setup](#api-key-setup)
- [Live Demo](#live-demo)
- [Submission](#submission)

---

## 🧭 Overview

| Lesson | Topic |
| ------ | ----- |
| **Lesson 11** | Callbacks, Promises & Async/Await |
| **Lesson 12** | Working with APIs (Fetch) |
| **Mini-Project** | Weather Dashboard (OpenWeatherMap API) |

This week's milestone: **working comfortably with APIs and asynchronous flows.**

---

## ✅ What I Learned

- [x] Sync vs async execution and the event loop
- [x] The callback pattern & why "callback hell" is painful
- [x] Creating and consuming Promises (`resolve` / `reject`)
- [x] Chaining with `.then()`
- [x] `Promise.all` and `Promise.race`
- [x] Writing `async` / `await` functions
- [x] Error handling with `try` / `catch`
- [x] The Fetch API (`GET`, `POST`)
- [x] Loading & error UI states
- [x] Rendering API data into the DOM
- [x] Live search / sort / filter on fetched data
- [x] `localStorage` for recent searches
- [x] Bonus: 5-day forecast, °C/°F toggle, geolocation, dynamic backgrounds

---

## 📁 Project Structure

```
.
├── index.html              # Weather Dashboard markup
├── styles.css              # Weather Dashboard styling
├── app.js                  # Weather Dashboard logic (all features + bonuses)
├── lessons/
│   ├── lesson-11-1.js      # Sync vs async, callbacks
│   ├── lesson-11-2.js      # Callback hell + Promises
│   ├── lesson-11-3.js      # Promise chaining, all, race
│   ├── lesson-11-4.js      # Async/await + try/catch
│   ├── lesson-12-fetch.js  # Fetch helpers (GET/POST/search/sort/filter)
│   ├── user-directory.html # User Directory demo page
│   ├── user-directory.js   # User Directory logic
│   └── user-directory.css  # User Directory styling
├── daily-challenges/
│   ├── daily-1.js          # delay(ms) promise
│   ├── daily-2.js          # chained random-delay tasks + timing
│   ├── daily-3.js          # safe fetch with default fallback
│   ├── daily-4.js          # callbacks rewritten as async/await
│   └── daily-5.js          # parallel fetches with allSettled
└── README.md
```

---

## 📖 Lessons

### Lesson 11 — Callbacks, Promises & Async/Await
- **11.1** Predicted async output, built a `loadUser(id, callback)` simulator.
- **11.2** Experienced callback hell, then refactored `getUserData`,
  `getUserPosts`, `getPostComments` into Promises.
- **11.3** Chained promises; used `Promise.all` (parallel users) and
  `Promise.race` (fastest wins).
- **11.4** Rewrote promise chains as clean `async/await` with `try/catch` and
  parallel fetching via `Promise.all`.

### Lesson 12 — Working with APIs
- **12.1** First `fetch`, then `fetch` with `async/await` + status checks.
- **12.2** Rendered JSONPlaceholder users into the DOM with loading/error states.
- **12.3** `POST` request to create a post from a form.
- **12.4** Live search (name/email), sort (A-Z/Z-A), and city filter dropdown.

---

## 🌟 Daily Challenges

| Day | Challenge | File |
| --- | -------- | ---- |
| 1 | `delay(ms)` promise | `daily-challenges/daily-1.js` |
| 2 | Chain 3 random-delay tasks + time it | `daily-challenges/daily-2.js` |
| 3 | Fetch user, default fallback on 404 | `daily-challenges/daily-3.js` |
| 4 | Rewrite callbacks as async/await | `daily-challenges/daily-4.js` |
| 5 | Parallel fetches with `Promise.allSettled` | `daily-challenges/daily-5.js` |

Run any daily challenge with Node:
```bash
node daily-challenges/daily-1.js
```

---

## 🌤️ Mini-Project: Weather Dashboard

A complete weather app built with the **OpenWeatherMap API**.

**Features**
1. Search by city name → live weather data.
2. Displays: city, weather icon, temperature (°C), description, feels-like,
   humidity, wind speed, pressure.
3. Robust error handling (invalid city, network issues, bad API key) + loading spinner.
4. Recent searches saved to `localStorage` (last 5), click to re-search.
5. **Bonus**
   - 📅 5-day forecast (`/forecast` endpoint)
   - 🌡️ Toggle Celsius / Fahrenheit
   - 📍 Geolocation — weather for current location
   - 🎨 Background gradient changes based on weather condition

---

## 🚀 How to Run

The dashboard is a static site — no build step required.

1. Clone the repo:
   ```bash
   git clone https://github.com/theecolboy/iyf-s10-week-06-theecolboy.git
   cd iyf-s10-week-06-theecolboy
   ```
2. Add your API key (see below).
3. Open `index.html` in a browser, or serve it:
   ```bash
   npx serve .
   # or
   python -m http.server 8000
   ```

---

## 🔑 API Key Setup

1. Sign up at <https://openweathermap.org/api> and grab a free API key.
2. In `app.js`, replace:
   ```javascript
   const API_KEY = "your_api_key_here";
   ```
   with your real key.

> ⚠️ Never commit a real API key. Use environment variables in production.

---

## 🔗 Live Demo

> This static site is deployed with **GitHub Pages** (main branch → root).
>
> 🔗 **Live Demo:** https://theecolboy.github.io/iyf-s10-week-06-theecolboy/

---

## 📤 Submission

- **Repository name:** `iyf-s10-week-06-theecolboy`
- **Built by:** Stephen Ndungu
- Follows the course [Submission Guidelines](../SUBMISSION_GUIDELINES.md).

---

Made with ❤️ while learning asynchronous JavaScript.
