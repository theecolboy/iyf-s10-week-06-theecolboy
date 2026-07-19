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

   Data providers:
   - OpenWeatherMap (primary) when a real API key is supplied.
   - Open-Meteo (keyless fallback) so the dashboard works out of the box.
   ========================================================================= */

/* ----------------------------- API Key ---------------------------------- */
// Resolution order (no secrets hardcoded in source):
//   1. window.__OWM_API_KEY__  (set in index.html before app.js)
//   2. process.env.OPENWEATHER_API_KEY (Node / bundler)
//   3. user-entered key saved in localStorage ("owm_api_key")
// If none present, the app automatically falls back to Open-Meteo (no key).
function getApiKey() {
    if (typeof window !== "undefined" && window.__OWM_API_KEY__) return window.__OWM_API_KEY__;
    if (typeof process !== "undefined" && process.env && process.env.OPENWEATHER_API_KEY)
        return process.env.OPENWEATHER_API_KEY;
    try {
        return localStorage.getItem("owm_api_key") || "";
    } catch {
        return "";
    }
}

const OWM_BASE = "https://api.openweathermap.org/data/2.5";
const OWM_ICON = "https://openweathermap.org/img/wn/";
const OM_BASE = "https://api.open-meteo.com/v1/forecast";
const OM_GEO = "https://geocoding-api.open-meteo.com/v1/search";

/* ----------------------------- DOM Elements ----------------------------- */
const form = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const geoBtn = document.getElementById("geo-btn");
const unitToggle = document.getElementById("unit-toggle");
const settingsBtn = document.getElementById("settings-btn");
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

/* --------------------------- Provider Layer ----------------------------- */
// Returns normalized weather: { name, country, icon, temp, description,
//   feelsLike, humidity, wind, pressure, main }
async function fetchWeather({ city, lat, lon }) {
    const key = getApiKey();
    if (key && key !== "your_api_key_here") {
        try {
            return await fetchOwm({ city, lat, lon, key });
        } catch (err) {
            // If the key is invalid, surface the error instead of silently
            // switching providers (user explicitly supplied a key).
            if (/API key|401|403/.test(err.message)) throw err;
            // Otherwise fall through to the keyless provider.
        }
    }
    return fetchOpenMeteo({ city, lat, lon });
}

async function fetchOwm({ city, lat, lon, key }) {
    const params = lat != null ? `lat=${lat}&lon=${lon}` : `q=${encodeURIComponent(city)}`;
    const url = `${OWM_BASE}/weather?${params}&appid=${key}&units=${unit}`;
    const res = await fetch(url);
    if (res.status === 401) throw new Error("Invalid OpenWeatherMap API key. Check your key.");
    if (res.status === 404) throw new Error("City not found. Please check the spelling.");
    if (!res.ok) throw new Error("Failed to fetch weather data. Try again later.");
    const d = await res.json();
    return {
        name: d.name,
        country: d.sys.country,
        icon: `${OWM_ICON}${d.weather[0].icon}@2x.png`,
        temp: Math.round(d.main.temp),
        description: d.weather[0].description,
        feelsLike: Math.round(d.main.feels_like),
        humidity: `${d.main.humidity}%`,
        wind: `${d.wind.speed} ${unit === "metric" ? "m/s" : "mph"}`,
        pressure: `${d.main.pressure} hPa`,
        main: d.weather[0].main,
    };
}

// Open-Meteo: keyless. Needs lat/lon, so geocode the city name first.
async function fetchOpenMeteo({ city, lat, lon }) {
    if (lat == null) {
        const geo = await geocodeCity(city);
        lat = geo.lat;
        lon = geo.lon;
        city = geo.name;
    }
    const isC = unit === "metric";
    const url =
        `${OM_BASE}?latitude=${lat}&longitude=${lon}` +
        `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,surface_pressure` +
        `&temperature_unit=${isC ? "celsius" : "fahrenheit"}` +
        `&wind_speed_unit=${isC ? "ms" : "mph"}` +
        `&forecast_days=5&daily=weather_code,temperature_2m_max,temperature_2m_min`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch weather data. Try again later.");
    const d = await res.json();
    const code = d.current.weather_code;
    return {
        name: city,
        country: "",
        icon: wmoIcon(code),
        temp: Math.round(d.current.temperature_2m),
        description: wmoDescription(code),
        feelsLike: Math.round(d.current.apparent_temperature),
        humidity: `${d.current.relative_humidity_2m}%`,
        wind: `${Math.round(d.current.wind_speed_10m)} ${isC ? "m/s" : "mph"}`,
        pressure: `${Math.round(d.current.surface_pressure)} hPa`,
        main: wmoDescription(code).split(" ")[0],
        daily: d.daily,
    };
}

async function geocodeCity(city) {
    const url = `${OM_GEO}?name=${encodeURIComponent(city)}&count=1`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("City lookup failed.");
    const d = await res.json();
    if (!d.results || d.results.length === 0)
        throw new Error("City not found. Please check the spelling.");
    const r = d.results[0];
    return { lat: r.latitude, lon: r.longitude, name: r.name };
}

/* -------------------- WMO weather-code helpers (OM) --------------------- */
function wmoDescription(code) {
    const map = {
        0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
        45: "Fog", 48: "Rime fog", 51: "Light drizzle", 53: "Drizzle", 55: "Dense drizzle",
        56: "Freezing drizzle", 57: "Freezing drizzle",
        61: "Light rain", 63: "Rain", 65: "Heavy rain", 66: "Freezing rain", 67: "Freezing rain",
        71: "Light snow", 73: "Snow", 75: "Heavy snow", 77: "Snow grains",
        80: "Rain showers", 81: "Rain showers", 82: "Violent rain showers",
        85: "Snow showers", 86: "Snow showers", 95: "Thunderstorm",
        96: "Thunderstorm with hail", 99: "Thunderstorm with hail",
    };
    return map[code] || "Unknown";
}

function wmoIcon(code) {
    // Use Open-Meteo's own emoji-style icon set.
    if (code === 0 || code === 1) return "https://open-meteo.com/icons/rain-micro/100.svg";
    if (code === 2) return "https://open-meteo.com/icons/rain-micro/102.svg";
    if (code === 3) return "https://open-meteo.com/icons/rain-micro/103.svg";
    if (code >= 45 && code <= 48) return "https://open-meteo.com/icons/rain-micro/104.svg";
    if (code >= 51 && code <= 57) return "https://open-meteo.com/icons/rain-micro/111.svg";
    if (code >= 61 && code <= 67) return "https://open-meteo.com/icons/rain-micro/121.svg";
    if (code >= 71 && code <= 77) return "https://open-meteo.com/icons/rain-micro/131.svg";
    if (code >= 80 && code <= 82) return "https://open-meteo.com/icons/rain-micro/121.svg";
    if (code >= 85 && code <= 86) return "https://open-meteo.com/icons/rain-micro/131.svg";
    if (code >= 95) return "https://open-meteo.com/icons/rain-micro/141.svg";
    return "https://open-meteo.com/icons/rain-micro/103.svg";
}

/* --------------------------- Display Logic ------------------------------ */
function displayWeather(data) {
    cityName.textContent = data.country ? `${data.name}, ${data.country}` : data.name;
    weatherIcon.src = data.icon;
    weatherIcon.alt = data.description;
    temperature.textContent = `${data.temp}°`;
    description.textContent = data.description;
    feelsLike.textContent = `${data.feelsLike}°`;
    humidity.textContent = data.humidity;
    wind.textContent = data.wind;
    pressure.textContent = data.pressure;

    weatherDisplay.classList.remove("hidden");
    applyBackground(data.main);
}

function displayForecast(data) {
    if (!data || !data.daily) return;
    const { time, weather_code, temperature_2m_max, temperature_2m_min } = data.daily;
    const cards = time.slice(0, 5).map((t, i) => {
        const date = new Date(t).toLocaleDateString(undefined, {
            weekday: "short", month: "short", day: "numeric",
        });
        const isOwm = data.omIcons && data.omIcons[i];
        const icon = isOwm ? data.omIcons[i] : wmoIcon(weather_code[i]);
        const desc = isOwm ? data.omDescs[i] : wmoDescription(weather_code[i]);
        return `
            <div class="forecast-card">
                <p>${date}</p>
                <img src="${icon}" alt="${desc}">
                <p>${Math.round(temperature_2m_max[i])}° / ${Math.round(temperature_2m_min[i])}°</p>
                <p>${desc}</p>
            </div>`;
    }).join("");
    forecastContainer.innerHTML = cards;
    forecastSection.classList.remove("hidden");
}

/* ----------------------- Core Async Functions --------------------------- */
async function getWeather(city, isCoords = false) {
    const target = isCoords ? { lat: city.lat, lon: city.lon } : { city };
    try {
        showLoading();
        hideError();

        const data = await fetchWeather(target);

        if (isCoords) {
            displayWeather(data);
        } else {
            displayWeather(data);
            saveToHistory(city);
        }
        // Forecast (uses coords when available; OM geocodes for city mode)
        try {
            const fc = await fetchForecast(target);
            displayForecast(fc);
        } catch {
            /* forecast optional */
        }
    } catch (err) {
        showError(err.message);
        weatherDisplay.classList.add("hidden");
        forecastSection.classList.add("hidden");
    } finally {
        hideLoading();
    }
}

async function fetchForecast(target) {
    const key = getApiKey();
    if (key && key !== "your_api_key_here") {
        const params = target.lat != null
            ? `lat=${target.lat}&lon=${target.lon}`
            : `q=${encodeURIComponent(target.city)}`;
        const res = await fetch(`${OWM_BASE}/forecast?${params}&appid=${key}&units=${unit}`);
        if (!res.ok) return null;
        return transformOwmForecast(await res.json());
    }
    // Open-Meteo forecast comes bundled in the weather response via daily.
    const w = await fetchOpenMeteo(target);
    return w.daily ? { daily: w.daily } : null;
}

function transformOwmForecast(data) {
    const daily = {};
    data.list.forEach((e) => {
        const day = e.dt_txt.split(" ")[0];
        if (!daily[day]) daily[day] = e;
    });
    const days = Object.values(daily).slice(0, 5).map((e) => ({
        time: e.dt_txt.split(" ")[0],
        weather_code: e.weather[0].id,
        temperature_2m_max: [e.main.temp_max],
        temperature_2m_min: [e.main.temp_min],
        omIcon: `${OWM_ICON}${e.weather[0].icon}@2x.png`,
        omDesc: e.weather[0].description,
    }));
    return {
        daily: {
            time: days.map((d) => d.time),
            weather_code: days.map((d) => d.weather_code),
            temperature_2m_max: days.map((d) => d.temperature_2m_max[0]),
            temperature_2m_min: days.map((d) => d.temperature_2m_min[0]),
        },
        omIcons: days.map((d) => d.omIcon),
        omDescs: days.map((d) => d.omDesc),
    };
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
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify(history)); } catch {}
    renderHistory();
}

function loadHistoryRaw() {
    try {
        return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
    } catch {
        return [];
    }
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
    Fog: "linear-gradient(135deg, #757f9a, #d7dde8)",
    Overcast: "linear-gradient(135deg, #bdc3c7, #2c3e50)",
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

/* --------------------------- Settings: set key -------------------------- */
function openSettings() {
    const current = getApiKey();
    const input = prompt(
        "Optional: paste an OpenWeatherMap API key to use that provider.\n" +
        "Leave blank to keep using the free keyless provider (Open-Meteo).",
        current && current !== "your_api_key_here" ? current : ""
    );
    if (input === null) return; // cancelled
    try {
        localStorage.setItem("owm_api_key", input.trim());
    } catch {}
    const lastCity = cityInput.value.trim();
    if (lastCity) getWeather(lastCity);
    else { hideError(); }
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
if (settingsBtn) settingsBtn.addEventListener("click", openSettings);

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
