---
title: 'Pitangus 0.14.0: nothing marked fixed without proof, Betterleaks and one command to start'
description: 'Pitangus 0.14.0, released on October 13, 2026: an engine that is off or a configuration change never marks a finding fixed, the pull request gate counts copies, secrets move to Betterleaks, and it adds an exposure check, rules for AI-written code and a one-command start.'
lang: en
translationKey: release-0-14-0
category: news
tags: ['release', 'secrets', 'AI-written code']
published: 2026-10-13
draft: false
---

Pitangus 0.14.0 was released on October 13, 2026. Pitangus is a self-hosted, open-source (AGPL-3.0) application security tool for small teams: it scans code, dependencies, secrets, infrastructure as code and container images with open-source engines on your own machine, and counts a fix only when a later scan proves it.

This release is about trusting the results. A finding is no longer marked fixed just because it disappeared: an engine that is off or didn't run, or a change of configuration, never fixes anything, and a pull request is judged by counting copies. Proof per engine and an identity that survives moved code are on by default. It also switches secret detection to Betterleaks, scans credential files, adds an exposure check for verified domains and rules for what AI-written code gets wrong, and starts with one `docker run`. The upgrade notes are at the end.

## Nothing is marked fixed without proof

A finding that disappears from a scan is not necessarily fixed: the engine may have failed, been turned off, skipped the file or been blocked by a firewall. Pitangus now asks for proof before it says "fixed":

- **An engine that is off, or didn't run, never fixes anything.** Its step says "not run (disabled)", the scan isn't shown as clean, and what it reported before stays open until an engine that looks again proves it gone.
- **Changing the configuration never fixes.** Turning off a rule or an engine, changing an allowlist or updating the rule set leaves those findings as not checked, with the reason, instead of fixed. Jira and notifications get nothing for them.
- **A tool that didn't finish neither opens nor closes findings**, and a SARIF from a failed run fixes nothing.
- **Only where the scan looked.** A finding in a file an engine skipped (too large, out of time) stays open, and a web finding is only fixed if its page was really reached this time.

The coverage contract, on by default, makes every engine run go through one contract (exit code, the output it always writes, a mark that it ran) and declares which files or pages it examined and which not, and why. A finding is then fixed only when the engine that owns it proved it looked where the finding was, an open finding a scan couldn't check shows as unverified since that scan, and a scan that would fix too much at once holds those fixes until the next complete scan confirms them.

## One identity per problem

A finding's identity now comes from its content, never from its line or the order an engine lists it: the code without comments or formatting, a resource's address, a dependency's advisory, package and normalized version, a secret's keyed hash, a web rule's path template. Adding a line above a problem doesn't make it new, and identical problems are one family with a count: a new copy reopens a triaged finding, and one fewer is a partial fix.

Triage follows the family conservatively. When copies had different decisions, or one had none, the family goes back to pending with the history of all of them, keeping expiry dates and tickets.

The coverage contract and the new identity are **on by default** (`PITANGUS_COVERAGE_MODE=on`, `PITANGUS_IDENTITY_MODE=v2`). Before shipping them that way we scanned the same commit twice on five real repositories: nothing opened, nothing fixed. On the first scan after upgrading, the identity change itself opens and fixes nothing, and a scan that would fix too much at once holds those fixes until a second scan confirms them. If you'd rather check first, set both to `shadow`: each scan then records what they would change, and `pitangus identity-gate` tells you when switching changes nothing on your repositories. The upgrade guide explains the first scan.

## A pull request gate that counts copies

The pull request gate, on the server and in `pitangus scan --base`, uses the same identity as the registry. Pasting a second copy of a problem next to an identical one introduces it; moving a copy doesn't; adding only a comment on a vulnerable line doesn't block the merge. Reviewing a pull request never changes the counts of the main branch.

## Betterleaks for secrets, and credential files

Secrets are now found by [Betterleaks](https://github.com/betterleaks/betterleaks) 1.9.0 (MIT, from the maintainers of Gitleaks) instead of Gitleaks. It takes the same configuration (your detectors, disabled rules and allowlists) and brings 463 built-in rules instead of 222. A secret keeps its identity across the switch, and what Gitleaks found is Betterleaks' to prove gone: nothing is fixed by the change.

Credential files (`.env*`, `.npmrc`, `.pypirc`, `.netrc`, `id_*` SSH keys, `credentials`, `.git-credentials`, `.dockercfg`, `.s3cfg`, `.boto`, `.htpasswd`) were left out of every scan. Now Betterleaks and Trivy's secret scanner read them, from a separate copy no other engine sees, deleted as soon as they finish.

A secret's or a password's value never appears in what Pitangus stores or shows, however it's written (quoted or not, in a config file, a connection call or a URL): not in the finding, the AI prompt, SARIF, the reports or a Jira issue. Findings from earlier versions are cleaned on upgrade.

Checking whether a secret still works is opt-in (`PITANGUS_SECRET_VALIDATION=1`): it sends each secret to its own provider to ask. An active secret is handled first and a revoked one is tracked; none is hidden.

## An exposure check for verified domains

A verified domain gets an **exposure check**, built in: each host's root and a list of known paths (exposed files such as `.git` or `.env`, debug and status consoles, TLS, response headers) with httpx, testssl.sh and nuclei's detection-only templates. It doesn't crawl, and no tool sends more than 10 requests a second. The paths earlier findings were on are checked again, so a 404 there proves the file gone; a 401, 403, 429 or server error never counts as checked, and a host that refuses almost everything (a WAF) leaves the check incomplete.

## Rules for what AI-written code gets wrong

New rules aim at the slips generated code makes most: a Supabase `service_role` key in the code (found by what the key says, not by its variable's name) or read in a `"use client"` file; a secret in a variable the bundler makes public (`NEXT_PUBLIC_`, `VITE_`, `REACT_APP_`, `EXPO_PUBLIC_`…); CORS open to any origin with credentials; a route without the authentication its siblings have; and a JWT decoded without checking its signature. A small reader of our own flags Supabase tables without row level security and open or test-mode Firebase rules, and says when it couldn't read a file.

Each finding can also be copied as a prompt for Claude, Cursor or Copilot (**Copy prompt for your AI** in the panel, `pitangus scan --format prompt` in the terminal): the rule, the place, the matched code and the fix, never a secret's value. Pitangus itself calls no AI.

## One command to start, and a faster pre-commit hook

All a developer needs is Docker. From the project's folder:

```bash
docker run --rm -v "$PWD":/src:ro -v pitangus-cache:/data \
  ghcr.io/pitangus-dev/pitangus-worker:0.14 \
  python -m pitangus --data-dir /data scan /src
```

Append `--base origin/main` to see only what your change adds. The same image runs as a pre-commit hook at pre-push (`id: pitangus`, `rev: v0.14.0`; install it with `pre-commit install --hook-type pre-push`) and in the GitHub Action. The hook scans the commit you push, not your working folder: a file you haven't committed can't block the push. The [developer quickstart](https://docs.pitangus.dev/quickstart-developer/) has all three.

The first run downloads the engines' advisory databases into the `pitangus-cache` volume, and later runs reuse them. On a small repository with the pre-commit hook, a run went from about 35 seconds to about 20. In the Action, the databases are kept for the day with `actions/cache`.

## What is experimental, and what is off

- **The full web scan is experimental** and stays off unless `PITANGUS_DAST_ENABLED=1`: ZAP, katana and subfinder crawling the site. The exposure check doesn't need it. Turning the full scan off fixes nothing it found before.
- **GitLab's sast-rules stay off.** The 259 optional rules (`PITANGUS_THIRD_PARTY_RULES`) were measured on a public corpus of intentionally vulnerable and real-world repositories, and none reached 85% precision with at least three hits.
- **`generic-credential-uri` stays off.** Betterleaks' generic rule for credentials in URLs flags documentation and examples far more often than real secrets. `generic-password` is on, behind a filter that drops test, documentation and translation files, templates and references, placeholders and weak values. On 18 public repositories it kept 23 of 1,525 matches, including all 12 an independent review labeled real.
- **Checkov and Grype are optional and off by default.** Trivy and zizmor already cover infrastructure, pipelines and images; turn them back on with `PITANGUS_CHECKOV_ENABLED=1` and `PITANGUS_GRYPE_ENABLED=1`.

## Other changes

- Malicious packages are recognized by the kind of advisory (a `MAL-` id or a database's malware type) or by two agreeing signals among a malicious-code CWE, the title and the description, never one alone, in Trivy, OSV-Scanner and Grype: critical, removed rather than upgraded.
- A transitive dependency's fix says which package brings it in and what to update if it stays below, in every ecosystem Trivy resolves.
- Jira issues say what to do and where in the title, and get a label when a scan verifies the fix.
- A domain can have a session check page: a scan with saved headers whose session expired is incomplete instead of fixing what was behind the login.
- Threat model import keeps every field, shows it and exports it back, and the full MITRE ATT&CK v19.2 catalog is bundled offline.

## Upgrading

```sh
git fetch --tags
git checkout v0.14.0
make update
```

`make update` takes a backup, pulls the new images (Betterleaks among them) and applies the database migrations (0015 and 0016) and data conversions on start. Expect some new secret findings on the first scan, from Betterleaks' larger rule set and credential files. If you rely on Checkov or Grype, turn them back on in `.env`. A finding whose rule changed in 0.14 and that disappears on the first scan shows as unverified (configuration) rather than fixed: mark it fixed by hand if it's really gone. If you upload SARIF to GitHub code scanning, existing alerts show once as new, because their fingerprints now carry the identity. The [upgrade guide](https://docs.pitangus.dev/upgrading/) covers the identity switch and what to expect from the first scan. The full list of changes is in the [changelog](https://github.com/Pitangus-Dev/pitangus/blob/main/CHANGELOG.md), and the release is on [GitHub](https://github.com/Pitangus-Dev/pitangus/releases/tag/v0.14.0).
