#!/usr/bin/env node
import { Command } from "commander";
import { loadConfig, isWithinQuietHours, CONFIG_PATH } from "../src/config.js";
import { getIdleSeconds } from "../src/idle.js";
import { nudge } from "../src/nudge.js";

const program = new Command();

program
  .name("teams-nudge")
  .description("A tiny nudge to keep your Teams status accurate while you work quietly.")
  .option("-i, --interval <seconds>", "how often to check idle time", parseInt)
  .option("-t, --threshold <seconds>", "idle seconds before nudging", parseInt)
  .option("--once", "perform a single nudge immediately and exit (for testing)")
  .parse();

const opts = program.opts();

const config = loadConfig({
  ...(opts.interval && { checkIntervalSeconds: opts.interval }),
  ...(opts.threshold && { idleThresholdSeconds: opts.threshold })
});

function log(message) {
  const time = new Date().toLocaleTimeString();
  console.log(`[${time}] ${message}`);
}

async function runOnce() {
  await nudge();
  log("Nudged.");
}

async function tick() {
  try {
    const idleSeconds = getIdleSeconds();

    if (idleSeconds < config.idleThresholdSeconds) {
      return;
    }

    if (isWithinQuietHours(config)) {
      log(`Idle for ${Math.round(idleSeconds)}s, but within quiet hours — skipping.`);
      return;
    }

    await nudge();
    log(`Idle for ${Math.round(idleSeconds)}s — nudged.`);
  } catch (err) {
    console.error(`teams-nudge error: ${err.message}`);
  }
}

if (opts.once) {
  runOnce();
} else {
  log(`teams-nudge started. Config: ${CONFIG_PATH}`);
  log(
    `Checking every ${config.checkIntervalSeconds}s, nudging after ${config.idleThresholdSeconds}s idle.`
  );
  setInterval(tick, config.checkIntervalSeconds * 1000);
}
