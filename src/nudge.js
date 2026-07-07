import { mouse, Point } from "@nut-tree-fork/nut-js";

// Keep it fast and invisible: nudge the cursor one pixel and straight back.
mouse.config.mouseSpeed = 4000;

export async function nudge() {
  const pos = await mouse.getPosition();
  const nudged = new Point(pos.x + 1, pos.y);

  await mouse.setPosition(nudged);
  await mouse.setPosition(pos);
}
