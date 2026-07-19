/* =========================================================================
   Weather Dashboard - Asynchronous JavaScript (Week 6 Mini-Project)
   Author: Stephen Ndungu
   -------------------------------------------------------------------------
   Demonstrates:
   - Fetch API with async/await
   - Loading / error states
   - DOM rendering of API data
   - localStorage persistence (recent searches)
   - Promise.all / parallel fetches
   - Bonus: 5-day forecast, °C/°F toggle, geolocation, dynamic background
   ========================================================================= */

// NOTE: Replace with your own OpenWeatherMap API key.
const API_KEY = "your_api_key_here";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";
const ICON_BASE = "https://openweathermap.org/img/wn/";

/* ----------------------------- DOM Elements ----------------------------- */
const form = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const geoBtn = document.getElementById("geo-btn");
const unitToggle = document.getElementById("unit-toggle");
const loading = document.getElementById("loading");
const error = document.getElementById("error");
const weatherDisplay = document.getElementById("weather-display");
const forecastSection = document.getElementById("forecast-section");
const forecastContainer = document.getElementById("forecast-container");

const cityName = document.getElementById("city-name");
const weatherIcon = document.getElementById("weather-icon");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const feelsLike = document.getElementById("feels-like");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const pressure = document.getElementById("pressure");
const searchHistory = document.getElementById("search-history");

/* ------------------------------- State ---------------------------------- */
let unit = "metric"; // "metric" = Celsius, "imperial" = Fahrenheit

/* ----------------------- Core Async Functions --------------------------- */
async function getWeather(query, isCoords = false) {
    const params = isCoords
        ? `lat=${query.lat}&lon=${query.lon}`
        : `q=${encodeURIComponent(query)}`;
    const url = `${BASE_URL}?${params}&appid=${API_KEY}&units=${unit}`;

    try {
        showLoading();
        hideError();

        const response = await fetch(url);

        if (!response.ok) {
            if (response.status === 404) throw new Error("City not found. Please check the spelling.");
            if (response.status === 401) throw new Error("Invalid API key. Add your key in app.js.");
            throw new Error("Failed to fetch weather data. Try again later.");
        }

        const data = await response.json();
        displayWeather(data);
        if (!isCoords) saveToHistory(query);
        applyBackground(data.weather[0].main);
    } catch (err) {
        showError(err.message);
        weatherDisplay.classList.add("hidden");
        forecastSection.classList.add("hidden");
    } finally {
        hideLoading();
    }
}

async function getForecast(query, isCoords = false) {
    const params = isCoords
        ? `lat=${query.lat}&lon=${query.lon}`
        : `q=${encodeURIComponent(query)}`;
    const url = `${FORECAST_URL}?${params}&appid=${API_KEY}&units=${unit}`;

    try {
        const response = await fetch(url);
        if (!response.ok) return;
        const data = await response.json();
        displayForecast(data);
    } catch {
        /* forecast is optional - fail silently */
    }
}

/* --------------------------- Display Logic ------------------------------ */
function displayWeather(data) {
    cityName.textContent = `${data.name}, ${data.sys.country}`;
    weatherIcon.src = `${ICON_BASE}${data.weather[0].icon}@2x.png`;
    weatherIcon.alt = data.weather[0].description;
    temperature.textContent = `${Math.round(data.main.temp)}°`;
    description.textContent = data.weather[0].description;
    feelsLike.textContent = `${Math.round(data.main.feels_like)}°`;
    humidity.textContent = `${data.main.humidity}%`;
    wind.textContent = `${data.wind.speed} ${unit === "metric" ? "m/s" : "mph"}`;
    pressure.textContent = `${data.main.pressure} hPa`;

    weatherDisplay.classList.remove("hidden");
}

function displayForecast(data) {
    // Group forecast entries by day, take the midday reading for each.
    const daily = {};
    data.list.forEach((entry) => {
        const day = entry.dt_txt.split(" ")[0];
        if (!daily[day]) daily[day] = entry;
    });

    const days = Object.values(daily).slice(0, 5);
    forecastContainer.innerHTML = days
        .map((entry) => {
            const date = new Date(entry.dt_txt).toLocaleDateString(undefined, {
                weekday: "short",
                month: "short",
                day: "numeric",
            });
            return `
                <div class="forecast-card">
                    <p>${date}</p>
                    <img src="${ICON_BASE}${entry.weather[0].icon}@2x.png" alt="${entry.weather[0].description}">
                    <p>${Math.round(entry.main.temp)}°</p>
                    <p>${entry.weather[0].main}</p>
                </div>`;
        })
        .join("");

    forecastSection.classList.remove("hidden");
}

/* ----------------------- Status / Error Helpers ------------------------- */
function showLoading() {
    loading.classList.remove("hidden");
    weatherDisplay.classList.add("hidden");
}

function hideLoading() {
    loading.classList.add("hidden");
}

function showError(message) {
    error.textContent = message;
    error.classList.remove("hidden");
}

function hideError() {
    error.classList.add("hidden");
}

/* ------------------------ Recent Searches ------------------------------- */
const HISTORY_KEY = "weather_recent_searches";
const MAX_HISTORY = 5;

function saveToHistory(city) {
    const normalized = city.trim().toLowerCase();
    let history = loadHistoryRaw();
    history = [normalized, ...history.filter((c) => c !== normalized)].slice(0, MAX_HISTORY);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    renderHistory();
}

function loadHistoryRaw() {
    try {
        return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
    } catch {
        return [];
    }
}

function loadHistory() {
    renderHistory();
}

function renderHistory() {
    const history = loadHistoryRaw();
    if (history.length === 0) {
        searchHistory.innerHTML = '<li class="empty">No recent searches yet</li>';
        return;
    }
    searchHistory.innerHTML = history
        .map((city) => `<li data-city="${city}">${city.charAt(0).toUpperCase() + city.slice(1)}</li>`)
        .join("");
}

/* ----------------------- Dynamic Background ----------------------------- */
const WEATHER_BG = {
    Clear: "linear-gradient(135deg, #f6d365, #fda085)",
    Clouds: "linear-gradient(135deg, #bdc3c7, #2c3e50)",
    Rain: "linear-gradient(135deg, #4b6cb7, #182848)",
    Drizzle: "linear-gradient(135deg, #4b6cb7, #182848)",
    Thunderstorm: "linear-gradient(135deg, #232526, #414345)",
    Snow: "linear-gradient(135deg, #e6dada, #274046)",
    Mist: "linear-gradient(135deg, #757f9a, #d7dde8)",
};

function applyBackground(main) {
    const bg = WEATHER_BG[main] || "linear-gradient(135deg, #6dd5ed, #2193b0)";
    document.body.style.background = bg;
}

/* -------------------------- Geolocation --------------------------------- */
function getLocationWeather() {
    if (!navigator.geolocation) {
        showError("Geolocation is not supported by your browser.");
        return;
    }
    showLoading();
    navigator.geolocation.getCurrentPosition(
        (pos) => getWeather({ lat: pos.coords.latitude, lon: pos.coords.longitude }, true),
        () => {
            hideLoading();
            showError("Unable to retrieve your location.");
        }
    );
}

/* ----------------------------- Events ----------------------------------- */
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (city) getWeather(city);
});

searchHistory.addEventListener("click", (e) => {
    const li = e.target.closest("li[data-city]");
    if (li) {
        const city = li.dataset.city;
        cityInput.value = city;
        getWeather(city);
    }
});

geoBtn.addEventListener("click", getLocationWeather);

unitToggle.addEventListener("click", () => {
    unit = unit === "metric" ? "imperial" : "metric";
    unitToggle.textContent = unit === "metric" ? "°F" : "°C";
    const lastCity = cityInput.value.trim();
    if (lastCity && !weatherDisplay.classList.contains("hidden")) {
        getWeather(lastCity);
    }
});

/* ----------------------------- Init ------------------------------------- */
loadHistory();
