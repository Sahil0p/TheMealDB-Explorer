const NodeCache = require("node-cache");

const DEFAULT_TTL = Number(process.env.CACHE_TTL_SECONDS) || 60 * 60; // 1 hour
const MAX_ENTRIES = Number(process.env.CACHE_MAX_ENTRIES) || 1000;

const cache = new NodeCache({
  stdTTL: DEFAULT_TTL,
  checkperiod: Math.max(60, Math.floor(DEFAULT_TTL / 2)),
  useClones: false,
});

const keyOrder = [];

function saveWithLimit(key, value) {
  const exists = cache.has(key);
  cache.set(key, value);

  if (exists) {
    const idx = keyOrder.indexOf(key);
    if (idx !== -1) keyOrder.splice(idx, 1);
  }
  keyOrder.push(key);

  while (keyOrder.length > MAX_ENTRIES) {
    const removeKey = keyOrder.shift();
    cache.del(removeKey);
  }
}

module.exports = {
  cache,
  saveWithLimit,
  MAX_ENTRIES,
  DEFAULT_TTL,
};
