---
title: 'Pitangus 0.13.0: passive web scans of verified domains, test users and OWASP guidance'
description: 'Pitangus 0.13.0, released on October 10, 2026, adds passive DAST of domains and APIs you verify (off by default), test users, a saved scope, schedules, OWASP guidance on every finding and a command palette. Two breaking changes.'
lang: en
translationKey: release-0-13-0
category: news
tags: ['release', 'DAST', 'OWASP']
published: 2026-10-10
draft: false
---

Pitangus 0.13.0 was released on October 10, 2026. Pitangus is a self-hosted, open-source (AGPL-3.0) application security tool for small teams: it scans code, dependencies, secrets, infrastructure as code and container images with open-source engines, and counts a fix only when a later scan proves it.

This release adds passive web scanning of the domains and APIs you prove you control, links every finding to the OWASP guidance that applies, and gives the panel and the reports their own visual identity. It has two breaking changes, listed at the end with the upgrade steps.

## Passive web scans of verified domains and APIs

Web scans are **off by default**. A server runs them only with `PITANGUS_DAST_ENABLED=1` and the engine images pulled with `make engines`.

- **Only on domains you prove you control.** Proof is a DNS TXT record, a file at `/.well-known/pitangus-verify.txt` or a `<meta name="pitangus-verify">` tag on the homepage. Only a DNS proof covers subdomains. The proof is checked again every day and before every scan.
- **Passive.** The tools browse the site like a visitor and read the responses: no injections, no fuzzing, no form submissions other than a test user's sign-in. In API mode, only the GET and HEAD operations of an OpenAPI 3.x or Swagger 2.0 definition are imported.
- **The tools**, each pinned by version and digest: ZAP 2.17 with its passive rules and a classic and AJAX spider that only follow links; katana 1.7.0; nuclei 3.11.1 with detection-only templates; testssl.sh 3.2 without its vulnerability checks; httpx 1.12.0; and subfinder 2.16.0 to discover related hosts.
- **Bounded.** Every tool runs in a hardened container that can only reach the scan's pinned public addresses, sends at most 10 requests a second and stops at a hard time limit.
- **Honest about gaps.** A tool that fails or can't reach a host leaves its step partial, and the findings it reported before are not marked fixed.
- **One problem, one finding.** When ZAP, nuclei and testssl.sh report the same problem at the same URL, it is one finding with each tool's evidence.
- **Versions a site exposes.** Versions of well-known packages that httpx reads (Flask, Django, Express, jQuery and others) are looked up offline with OSV-Scanner. The finding says the version was read, not verified.

A Pitangus web scan is not a pentest: it doesn't attack the site.

## Test users

A domain can keep reusable test accounts (username and password, optionally with a TOTP seed), encrypted at rest and never sent back by the API. A web scan or a schedule picks up to 3, and ZAP signs in with them. Each sign-in is checked on its own before crawling; a user who can't sign in is not crawled as, and the run is marked as partial coverage, so few findings never reads as a clean result. Secrets reach ZAP only on standard input: never on the command line, the host's disk or the logs.

## Scope and discovery

Adding a domain starts a discovery of related hosts with subfinder, using passive sources and no API keys. Names that resolve to private, loopback, link-local or metadata addresses are dropped. Discovered hosts start out of scope; you choose which ones to include in the domain's **Scope** tab, and scans and schedules use that saved scope.

## Scheduling

A domain's scan can follow a schedule: daily, on some weekdays or on some days of the month, at a time of day in your time zone, at most once a day. A scheduled scan can sign in as test users and send the domain's saved headers. If a user was deleted or a header is missing, the scan runs with the rest and says what it left out.

## OWASP guidance on every finding

Each finding now links to the OWASP pages that apply: Cheat Sheet Series pages, its OWASP Top 10:2025 category and, for code and web findings, the API Security Top 10 2023 risk and the WSTG v4.2 test. The mapping is curated and versioned, by rule, framework, file, CWE (100 of them) and scanner. The links appear after the tool's own guidance, which stays first and verbatim: Pitangus doesn't write remediation of its own. Findings from older scans get the links too.

## Command palette and shortcuts

`⌘K` or `Ctrl+K` searches pages, analyses, repositories, images and domains, and runs actions such as New analysis, Import SARIF and Add domain. `G` and a letter jump to a page, `N` starts a new analysis and `?` lists the shortcuts.

## A new identity

The panel, the PDF and Markdown reports and the threat diagram follow one identity manual: cool neutrals, sulphur yellow only for the brand and the main action, one meaning per colour (red critical, orange attention, green ok, slate info), IBM Plex type and the same rules in light and dark, checked for WCAG AA contrast. The New analysis flow is now a guided sequence of steps, and integrations are grouped in sections.

## Other changes

- Removing a domain keeps its history: analyses, findings, triage and tickets stay as evidence.
- "Affects you" in the latest CVEs no longer marks nearly every CVE; it now needs the CVE to name your package as a product.
- Domain verification asks the zone's own nameservers first, so a record published a moment ago is found.
- An organization batch uses every worker, and it is reported as finished only when its last scan ends.
- A scheduled scan is queued exactly once, even after a crash or with two rounds at the same time.

## Breaking changes

- **Domains API.** `DomainRow.schedule` is now an object (`frequency`, `weekdays`, `month_days`, `time`, `timezone`, `next_run_at`, `last_run_at`, `last_run_id`, `note`, `test_users`, `use_headers`); the flat `schedule_next_at`, `schedule_last_at`, `schedule_last_run` and `schedule_note` fields are gone. `POST /api/domains/remove` answers `runs_kept` instead of `runs_deleted`.
- **New engine images.** With `PITANGUS_DAST_ENABLED=1`, run `make engines` after upgrading: subfinder, katana, nuclei, httpx and testssl.sh join ZAP.

## Upgrading

```sh
git fetch --tags
git checkout v0.13.0
make update
# only with PITANGUS_DAST_ENABLED=1:
make engines
```

Database migrations run on start. The full list of changes is in the [changelog](https://github.com/Pitangus-Dev/pitangus/blob/main/CHANGELOG.md), and the release is on [GitHub](https://github.com/Pitangus-Dev/pitangus/releases/tag/v0.13.0).
