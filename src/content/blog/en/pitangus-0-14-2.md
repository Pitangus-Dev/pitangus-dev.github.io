---
title: 'Pitangus 0.14.1 and 0.14.2: your code is no longer stored, and dependency guidance says what to update first'
description: 'Pitangus 0.14.1 stops storing your code and declares what the repository suppresses in the engines; 0.14.2 says which direct dependency holds a vulnerable package back and in what order to update. Released on October 15, 2026.'
lang: en
translationKey: release-0-14-2
category: news
tags: ['release', 'dependencies', 'privacy']
published: 2026-10-15
draft: false
---

Pitangus 0.14.1 and 0.14.2 were released on October 15, 2026, the same day as 0.14.0. Both are maintenance releases: the first closes a class of problems at the root, and the second comes from the feedback of a developer who tried Pitangus on a real FastAPI and Poetry project.

## 0.14.1: Pitangus doesn't store your code

Pitangus stores each finding's location (file, lines, the scanned commit), its rule and hashes, but not the code. When you open a finding, the snippet is read from the repository at that moment, at the scanned commit, and it isn't cached or logged.

- Secrets are always masked. Secret findings, credential files, symlinks and findings imported from SARIF show only the location and a link.
- Jira, pull request comments, notifications and reports carry the location and a link to the line, not the code.
- The `drop_stored_code` data migration removes the snippets earlier versions stored, without changing any identity or status.

What a repository tells the engines to report less is still honored, but no longer silently: `# zizmor: ignore`, `.trivyignore`, `trivy:ignore`, `.checkov.yaml`, `checkov:skip` and OSV-Scanner filters show under **Excluded**, with the rule, file and line, and are never counted as fixed. The `PITANGUS_IGNORE_REPO_SUPPRESSIONS` setting ignores them all.

The pre-commit hook now runs the image pinned by digest and, if you have cosign, verifies its signature first.

## 0.14.2: which dependency to update first

The case behind it: starlette 0.37.2 had high-severity advisories and came in as a transitive dependency. Pitangus recommended `poetry update starlette`, and that command changed nothing, because fastapi only accepted starlette below 0.38.

The guidance now uses the dependency graph Trivy resolves and the range the lockfile declares to find which direct dependency holds the version back:

1. "starlette 0.37.2 comes in through fastapi 0.110.1, which only accepts starlette >=0.37.2,<0.38.0: fastapi has to move first."
2. The commands, in order: `poetry add fastapi@latest`, then `poetry update starlette` and, to check, `poetry show starlette`.
3. Finally, **Reverify** in Pitangus.

When the range already accepts the fixed version, updating the package is enough. If the lockfile doesn't record the range (Cargo, pnpm, uv, Composer or Go), the guidance says so instead of guessing.

Also in 0.14.2:

- **Clearer exclusions.** You can exclude a single rule inside a path (`tests/** generic-api-key`); the form explains each option with examples and shows what changes before saving. Excluded results stay visible under Excluded.
- **Counts that add up.** The status filter in Findings shows how many there are in each status, matching the header.
- **Jira.** Automatic rules say how many issues they will create and where before they're saved, and the description no longer loses its spacing when formatted.

## Upgrade

Take a backup before upgrading:

```bash
make backup
git fetch --tags && git checkout v0.14.2 && make update
```

The full list of changes is in the [changelog](https://github.com/Pitangus-Dev/pitangus/blob/main/CHANGELOG.md).
