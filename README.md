# teams-nudge

[![npm version](https://img.shields.io/npm/v/teams-nudge.svg)](https://www.npmjs.com/package/teams-nudge)
[![license](https://img.shields.io/npm/l/teams-nudge.svg)](./LICENSE)

A tiny CLI that keeps your chat status accurate while you work quietly.

Microsoft Teams flips your status to "Away" after a few minutes without
keyboard or mouse input — even if you're heads-down reading, thinking, or
sitting in a meeting off-camera. `teams-nudge` watches your real system idle
time and, right before you'd flip to Away, sends one imperceptible input event
(a 1px cursor nudge and back) to keep your presence accurate.

It does nothing while you're actually active. It only acts in the narrow window
right before you'd otherwise go idle.

## Works with

Despite the name, this isn't Teams-specific. It reads **OS-level idle time** —
it never talks to any chat app directly — so it works the same way for anything
that sets your status from system idle:

- Microsoft Teams
- Slack
- Discord
- Zoom

**Requires macOS.** Idle detection uses `ioreg`, which is macOS-only. Windows
support is on the roadmap.

## Install

```bash
npm install -g teams-nudge
```

## Usage

```bash
teams-nudge
```

That's it — it runs in the foreground, checking your idle time every 15 seconds
by default, and nudging after 4 minutes idle.

Options:

```bash
teams-nudge --interval 10       # check idle time every 10s
teams-nudge --threshold 180     # nudge after 3 minutes idle
teams-nudge --once              # fire a single nudge immediately, then exit (useful for testing)
```

## Why not just a mouse jiggler?

Mouse jigglers move your cursor on a fixed timer, whether or not you're there.
They're constantly active, they interfere with you while you're genuinely
working, and they keep running when you've gone home.

`teams-nudge` is idle-aware. It checks your actual system idle time and acts
only in the seconds before you'd cross the threshold. If you're typing, it does
nothing at all. With quiet hours enabled, it stops outside your working day.

## Config

On first run, a config file is created at `~/.teams-nudge/config.json`:

```json
{
  "checkIntervalSeconds": 15,
  "idleThresholdSeconds": 240,
  "quietHours": {
    "enabled": false,
    "start": "19:00",
    "end": "08:00"
  }
}
```

Set `quietHours.enabled` to `true` and adjust `start`/`end` if you want nudging
to pause overnight or outside work hours.

Set `idleThresholdSeconds` a little below your app's own Away threshold. Teams
and Slack both go idle at around 5 minutes, so the 240s default leaves a small
margin.

## Running in the background

To keep it running without a terminal window open, use a process manager like
[`pm2`](https://pm2.keymetrics.io/) or a macOS `launchd` agent. A `launchd`
plist example will be added in a future release.

## Roadmap

- [ ] Windows support
- [ ] Menu bar app (no terminal required)
- [ ] `launchd` plist for auto-start on login

## A note on use

This tool doesn't fabricate activity, meetings, or work you didn't do. All it
does is stop a few minutes of stillness from being reported as absence.

Be aware of the flip side: if you walk away from your desk while it's running,
your status will stay Available even though you aren't. That's a real
limitation, not a feature — set quiet hours, and quit it when you're done for
the day.

How this fits your employer's policies is worth checking for yourself. This is
a tool, not a guarantee.

## License

MIT
