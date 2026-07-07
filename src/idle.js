import { execSync } from "node:child_process";

/**
 * Returns how many seconds since the last real keyboard/mouse input,
 * as reported by macOS itself (not by Teams). This is the same signal
 * Teams uses internally to decide when to flip you to "Away".
 */
export function getIdleSeconds() {
  if (process.platform !== "darwin") {
    throw new Error(
      "teams-nudge v0.1 only supports macOS. Windows/Linux support is on the roadmap."
    );
  }

  const output = execSync(
    "ioreg -c IOHIDSystem | awk '/HIDIdleTime/ {print $NF; exit}'"
  )
    .toString()
    .trim();

  const idleNanoseconds = Number(output);
  if (Number.isNaN(idleNanoseconds)) {
    throw new Error("Could not read idle time from ioreg.");
  }

  return idleNanoseconds / 1_000_000_000;
}
