---
title: 'Pitangus 0.13.1: a full demo organization, documentation for newcomers and panel fixes'
description: 'Pitangus 0.13.1, released on October 11, 2026, adds an offline demo organization (make demo FULL=1), new documentation with screenshots, and fixes in the panel. No migrations, no breaking changes.'
lang: en
translationKey: release-0-13-1
category: news
tags: ['release', 'demo', 'documentation']
published: 2026-10-11
draft: false
---

Pitangus 0.13.1 was released on October 11, 2026. It is a patch release of 0.13: no database migrations, no breaking changes and no new engine images.

## A demo organization you can explore offline

`make demo FULL=1` builds Lapis Labs, a made-up company, so every view of the panel has something to show: five repositories with a month of scans (trends, fixed findings, time to fix, due dates), a pull request review, a container image, a verified demo domain with its scope, schedule, test user and two passive web scans, two members and a few triage decisions.

It runs without a network connection. The findings are engine outputs recorded against the bundled samples and replayed through the same parsers, registry and triage as a real scan. Demo domains use names reserved for examples (`example.com`, `example.net`), and Pitangus never verifies or scans them: the API answers `409` if you try.

The demo writes next to the workspace's real data and nothing removes it, so use it on a trial install.

## Documentation for newcomers

[docs.pitangus.dev](https://docs.pitangus.dev/) was rewritten for people who have never used Pitangus, in English and Spanish: what it is, key concepts, a glossary and FAQ, scanning code, images and websites or APIs, findings, compliance, threat modeling and upgrading. Each guide shows the panel in light and dark, taken from the demo organization, and the architecture page has an up-to-date diagram.

## Fixes in the panel

- Day labels on chart axes no longer overlap.
- The heading of each step in the New scan wizard still receives focus for screen readers, without drawing a focus box.
- A link in the same tab, such as a domain's New scan, preselects the domain and the scan type.
- The OSV hint says that package names and versions also go to deps.dev when it is on, and that Trivy and OSV-Scanner check dependencies offline anyway.

## Upgrade

```bash
git fetch --tags && git checkout v0.13.1 && make update
```

The full list of changes is in the [changelog](https://github.com/Pitangus-Dev/pitangus/blob/main/CHANGELOG.md).
