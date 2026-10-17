---
title: 'Pitangus 0.15.1: signed releases you can verify, and the Action on the Marketplace'
description: 'Pitangus 0.15.1 attaches an SBOM, SLSA provenance and a cosign-signed manifest to every release, adds OpenSSF Scorecard and CodeQL, and brings the GitHub Action to the Marketplace as Pitangus Security Scan. Released on October 17, 2026.'
lang: en
translationKey: release-0-15-1
category: news
tags: ['release', 'security', 'supply-chain']
published: 2026-10-17
draft: false
---

Pitangus 0.15.1 was released on October 17, 2026. It is about trust: what you install can now be checked, and the project shows its own security work in the open.

## Signed files on every release

Each GitHub release now carries the SPDX SBOM of every image and platform, their SLSA provenance and a manifest of the image digests signed with cosign, keyless and with the same identity as the images themselves. They are attached after the images are built, signed and verified, so a release without them is one that didn't pass.

Before installing, you can check that the images are the ones the project built, from the commit you expect. The commands are in the [Supply chain](https://docs.pitangus.dev/supply-chain/) page, which also lists what is pinned by digest or commit.

## The project, checked in the open

- **OpenSSF Scorecard** runs on every push to `main`, weekly and when branch protection changes. It only reads the repository, and its badge is in the README.
- **OpenSSF Best Practices**: the project now holds the *passing* badge.
- **CodeQL** analyzes the Python, the TypeScript of the panel and the docs site, and the workflows, on every pull request and every week, with results in code scanning. It is a second opinion next to Pitangus scanning itself.
- **A complete security policy**: where to report privately, what to include, response targets, coordinated disclosure, supported versions and scope.

## The Action is on the GitHub Marketplace

The GitHub Action is now listed as [Pitangus Security Scan](https://github.com/marketplace/actions/pitangus-security-scan), by Arodium. Your workflows don't change: they keep `uses: Pitangus-Dev/pitangus@<version>`, and pinning the commit is still the better habit.

## Questions go to Discussions

GitHub Discussions is open. Questions and ideas have their own place there, and the issue chooser points to it instead of opening blank issues.

## A read-only demo, ready to deploy

`PITANGUS_PUBLIC_DEMO=1` turns an installation into a demo anyone can open with published credentials, on a made-up organization. The server enforces it: everything but reading, signing in and out and the evidence PDFs answers 403, nothing runs in the background and no connection leaves the API. The [deploy/demo](https://github.com/Pitangus-Dev/pitangus/blob/v0.15.1/deploy/demo/README.md) folder brings it up on any VPS. On a normal installation, leave it unset.

## Three fixes found by property-based tests

The panel now has property-based tests that check thousands of generated cases. They found three things, all fixed:

- The Jira routing preview could disagree with the server on a few patterns (`[]a]`, `[a-cz-a]`, an emoji under `?`), showing a different rule than the one that applied.
- A pattern full of stars could freeze that preview. It now answers at once.
- A link to Findings with a long organization name could split an emoji and make the request fail. The name is now cut by characters.

A malformed advisory link also no longer breaks a finding's detail: it is shown as text.

## Upgrade

Take a backup before upgrading. There are no database migrations.

```bash
make backup
git fetch --tags && git checkout v0.15.1 && make update
```

The full list of changes is in the [changelog](https://github.com/Pitangus-Dev/pitangus/blob/main/CHANGELOG.md).
