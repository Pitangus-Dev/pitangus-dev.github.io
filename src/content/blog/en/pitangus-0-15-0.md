---
title: 'Pitangus 0.15.0: turn each analysis engine on or off from the panel'
description: 'Pitangus 0.15.0 lets administrators turn every analysis engine on or off in Settings, with a confirmation, a history of changes and engine images prepared by the worker. Released on October 16, 2026.'
lang: en
translationKey: release-0-15-0
category: news
tags: ['release', 'engines', 'settings']
published: 2026-10-16
draft: false
---

Pitangus 0.15.0 was released on October 16, 2026. Every analysis engine can now be turned on or off from the panel, and the worker takes care of having their images ready.

## Analysis engines, from Settings

Administrators find the switches in **Settings → Analysis engines**: Opengrep, Trivy, OSV-Scanner, Betterleaks, Checkov, zizmor, Grype, httpx, testssl.sh, nuclei, katana and the full web scan. Defaults don't change: every engine is on except Checkov, Grype and the full web scan.

- **Grouped by what they check.** Code and dependencies, secrets, infrastructure and CI, images, and web. Each engine says what it adds and whether its images are on the server.
- **Turning one off asks first.** The confirmation says what goes unchecked. If a kind of review is left with no engine (every secrets engine off, say), the panel warns about it and each scan says so.
- **A history of changes.** Every change is kept with who made it and when, and it is also logged.
- **The server environment wins.** `PITANGUS_<ENGINE>_ENABLED`, set on both the API and the worker, locks the switch and names the variable. `PITANGUS_CHECKOV_ENABLED`, `PITANGUS_GRYPE_ENABLED` and `PITANGUS_DAST_ENABLED` keep working as before; unset, the panel decides.

## An engine that didn't run says so

Turning an engine off hides nothing. Its step in every scan reads **not run (disabled)** with where to turn it back on, and what it found stays open: nothing it found is marked fixed.

## Engine images, prepared on their own

An analysis run by the server no longer downloads a missing image halfway through. The worker pulls, by digest, the images of every engine that is on and missing them. It does so every 5 minutes and at once when you turn an engine on, in a lane of its own so queued analyses keep moving. **Prepare engine** retries by hand.

While an image isn't ready, the engine is declared as not run (being prepared) and nothing it found before is marked fixed; the next scan runs it. One-shot scans (`pitangus scan`, the GitHub Action and the pre-commit hook) still download a missing image as they start.

The Action and the pre-commit hook now point at the 0.15 worker image.

## Upgrade

Take a backup before upgrading. There are no database migrations: the switches are kept as settings in the existing database, created when an administrator first changes one.

```bash
make backup
git fetch --tags && git checkout v0.15.0 && make update
```

The full list of changes is in the [changelog](https://github.com/Pitangus-Dev/pitangus/blob/main/CHANGELOG.md).
