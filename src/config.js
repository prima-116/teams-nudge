import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const CONFIG_DIR = join(homedir(), ".teams-nudge");
const CONFIG_PATH = join(CONFIG_DIR, "config.json");

const DEFAULTS = {
  // How often (seconds) to check how long you've been idle.
  checkIntervalSeconds: 15,
  // How long (seconds) you can be idle before a nudge fires.
  // Teams marks you "Away" at ~5 minutes, so we nudge a bit before that.
  idleThresholdSeconds: 240,
  // Optional quiet hours (24h "HH:MM") where nudging is paused,
  // e.g. so it doesn't run overnight and give the game away.
  quietHours: {
    enabled: false,
    start: "19:00",
    end: "08:00"
  }
};

export function loadConfig(overrides = {}) {
  let fileConfig = {};

  if (!existsSync(CONFIG_DIR)) {
    mkdirSync(CONFIG_DIR, { recursive: true });
  }

  if (existsSync(CONFIG_PATH)) {
    try {
      fileConfig = JSON.parse(readFileSync(CONFIG_PATH, "utf-8"));
    } catch {
      console.warn(`Could not parse ${CONFIG_PATH}, falling back to defaults.`);
    }
  } else {
    writeFileSync(CONFIG_PATH, JSON.stringify(DEFAULTS, null, 2));
  }

  return {
    ...DEFAULTS,
    ...fileConfig,
    ...overrides,
    quietHours: {
      ...DEFAULTS.quietHours,
      ...(fileConfig.quietHours || {}),
      ...(overrides.quietHours || {})
    }
  };
}

export function isWithinQuietHours(config, now = new Date()) {
  const { enabled, start, end } = config.quietHours;
  if (!enabled) return false;

  const [startH, startM] = start.split(":").map(Number);
  const [endH, endM] = end.split(":").map(Number);

  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  if (startMinutes === endMinutes) return false;

  // Handles overnight ranges like 19:00 -> 08:00
  if (startMinutes < endMinutes) {
    return nowMinutes >= startMinutes && nowMinutes < endMinutes;
  }
  return nowMinutes >= startMinutes || nowMinutes < endMinutes;
}

export { CONFIG_PATH };
