// require("dotenv").config();
// const http = require("http");
// const app = require("./app");
// const MealService = require("./services/mealdb.service");

// const PORT = Number(process.env.PORT || 5000);
// const server = http.createServer(app);

// (async function bootstrap() {
//   try {
//     console.log("Preloading aggregated meals (this may take a few seconds)...");
//     await MealService.preloadAll();
//     console.log("Preload complete.");
//   } catch (err) {
//     console.warn("Preload failed (continuing). Error:", err && err.message ? err.message : err);
//   }

//   server.listen(PORT, () => {
//     console.log(`Backend running → http://localhost:${PORT}`);
//   });
// })();

// // Graceful shutdown
// function shutdown(signal) {
//   console.log(`Received ${signal}. Shutting down server...`);
//   server.close((err) => {
//     if (err) {
//       console.error("Error during server close:", err);
//       process.exit(1);
//     }
//     console.log("Server closed. Exiting process.");
//     process.exit(0);
//   });

//   setTimeout(() => {
//     console.warn("Forcing shutdown.");
//     process.exit(1);
//   }, 10_000).unref();
// }

// process.on("SIGINT", () => shutdown("SIGINT"));
// process.on("SIGTERM", () => shutdown("SIGTERM"));

// process.on("unhandledRejection", (reason, promise) => {
//   console.error("Unhandled Rejection at:", promise, "reason:", reason);
// });

// process.on("uncaughtException", (err) => {
//   console.error("Uncaught Exception:", err);
//   process.exit(1);
// });


// backend/src/server.js
require("dotenv").config();
const http = require("http");
const app = require("./app");
const MealService = require("./services/mealdb.service");

const PORT = Number(process.env.PORT || 5000);
const server = http.createServer(app);

(async function bootstrap() {
  try {
    console.log("Preloading aggregated meals (this may take a few seconds)...");
    await MealService.preloadAll();    // only place preload runs
    console.log("Preload complete.");
  } catch (err) {
    console.warn("Preload failed (continuing). Error:", err?.message || err);
  }

  server.listen(PORT, () => {
    console.log(`Backend running → http://localhost:${PORT}`);
  });
})();
