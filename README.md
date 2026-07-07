# teams-nudge

A tiny nudge to keep your Teams status accurate while you work quietly.

Microsoft Teams flips your status to "Away" after a few minutes without
keyboard/mouse input — even if you're heads-down reading, thinking, or in a
meeting off-camera. `teams-nudge` watches your real system idle time and, right
before you'd flip to Away, sends one imperceptible input event (a 1px cursor
nudge and back) to keep your presence accurate.

It does nothing while you're actually active. It only acts in the narrow
window right before you'd otherwise go idle.

## Install

```bash
npm install -g teams-nudge
```

Requires macOS. (Windows support is on the roadmap — see below.)

## Usage

```bash
teams-nudge
```

That's it — it runs in the foreground, checking your idle time every 15
seconds by default, and nudging after 4 minutes idle.

Options:

```bash
teams-nudge --interval 10       # check idle time every 10s
teams-nudge --threshold 180     # nudge after 3 minutes idle
teams-nudge --once              # fire a single nudge immediately, then exit (useful for testing)
```

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

Set `quietHours.enabled` to `true` and adjust `start`/`end` if you want
nudging to pause overnight or outside work hours.

## Running in the background

To keep it running without a terminal window open, use a process manager like
[`pm2`](https://pmpm2.keymetrics.io/) or a macOS `launchd` agent. A
`launchd` plist example will be added in a future release.

## Roadmap

- [ ] Windows support
- [ ] Menu bar app (no terminal required)
- [ ] `launchd` plist for auto-start on login

## A note on use

This tool reflects your real idle time back to Teams a little more
generously — it doesn't fabricate meetings or activity you didn't do. How
that fits your company's policies is worth checking for yourself; this is a
tool, not a guarantee.

## License

MIT
