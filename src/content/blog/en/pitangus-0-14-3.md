---
title: 'Pitangus 0.14.3: full MITRE ATT&CK in threat models, movable flow labels, and a lockfile fix'
description: 'Pitangus 0.14.3 brings the whole MITRE ATT&CK Enterprise catalog into threat models, lets you move flow labels in the diagram, and stops reporting generated lockfiles as unused dependencies. Released on October 16, 2026.'
lang: en
translationKey: release-0-14-3
category: news
tags: ['release', 'threat-modeling', 'dependencies']
published: 2026-10-16
draft: false
---

Pitangus 0.14.3 was released on October 16, 2026. Two changes to threat models and one fix to the unused-dependencies review.

## The full MITRE ATT&CK catalog in threat models

The hand-made technique list is gone. Threat models now use MITRE ATT&CK Enterprise v19.2, pinned by SHA-256: 697 current techniques (222 techniques and 475 sub-techniques) with their platforms.

- **Map a technique** opens the whole catalog, filtered by tactic and searchable by ID or by name, in English or Spanish. The total and the source stay in view.
- **Suggestions come from the component's platform, and say why.** One documented table ties each component type to MITRE platforms and tactics. A component exposed to the internet also gets Initial Access, and containers get the Containers platform. The picker groups the suggestions under the component, with the platforms and tactics that justify them, and the suggestions panel lists each technique once with the components it applies to and an **Add to all** button. Actors and custom types get no suggestions, and the panel says so.
- **Spanish names under MITRE's.** Every technique and tactic shows MITRE's official English name with its Spanish translation below, in the panel and in the reports.

## Movable flow labels in the diagram

A flow's label no longer has to sit where the layout puts it. Drag it with the pointer, or move it with the keyboard (arrows, Shift for big steps, Escape to cancel). Double-click, **Reset label** or **Tidy up** put it back.

The position is kept relative to the middle of the flow's curve, so the label follows its line when you move the nodes, and a thin line joins them when it is far. The panel, the SVG, the PDF and the Markdown place it the same way. It also travels in the portable JSON; Threat Dragon and pytm ignore it, and an invalid or out-of-range value is dropped with a warning.

## Unused dependencies: a lockfile is not proof of use

Pull request review reported the transitive packages of generated `requirements.txt` files as unused: 79 of them in Pitangus's own repository, now 0.

- A `requirements*.txt` is treated as a lockfile when it carries `# via` comments, when every entry has a hash, or when its header says pip-compile, uv, pdm or poetry made it. With a `.in` sibling, the declared dependencies are read from there.
- The lockfiles of npm, pnpm, yarn, bun, Poetry, uv, pdm and Pipenv no longer count as proof that a package is used. In pnpm projects, every dependency used to look used.
- A direct dependency that really is unused is still reported, on its own line.

## Upgrade

Take a backup before upgrading. There are no new data migrations.

```bash
make backup
git fetch --tags && git checkout v0.14.3 && make update
```

The full list of changes is in the [changelog](https://github.com/Pitangus-Dev/pitangus/blob/main/CHANGELOG.md).
