// backend/src/utils/apiClient.js
const axios = require("axios");

const BASE =
  process.env.THEMEALDB_BASE ||
  "https://www.themealdb.com/api/json/v1/1/";

const client = axios.create({
  baseURL: BASE,
  timeout: Number(process.env.API_TIMEOUT_MS) || 12000,
});

// ---- GLOBAL RATE LIMIT PROTECTION ----
let lastCall = 0;
const MIN_DELAY = 180; // each request 180ms apart ≈ 55 req / 10s

async function throttle() {
  const now = Date.now();
  const diff = now - lastCall;
  if (diff < MIN_DELAY) {
    await new Promise((r) => setTimeout(r, MIN_DELAY - diff));
  }
  lastCall = Date.now();
}

/** Safe GET request */
async function request(path) {
  await throttle();
  try {
    const res = await client.get(path);
    return res;
  } catch (err) {
    const msg =
      err?.response?.data?.message ||
      err?.message ||
      "Unknown MealDB error";
    const e = new Error(msg);
    e.inner = err;
    throw e;
  }
}

module.exports = { request, client };
