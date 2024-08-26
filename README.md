# DigitalOcean Registry Cleanup

[![npm version](https://img.shields.io/npm/v/@timeraa/do-registry-cleanup.svg)](https://www.npmjs.com/package/@timeraa/do-registry-cleanup)
[![License](https://img.shields.io/github/license/timeraa/do-registry-cleanup.svg)](https://github.com/timeraa/do-registry-cleanup/blob/main/LICENSE)
[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/timeraa/do-registry-cleanup/ci.yml?branch=main)](https://github.com/timeraa/do-registry-cleanup/actions/workflows/ci.yml)

This GitHub Action and CLI tool helps you clean up old Docker tags from your DigitalOcean container registry. It allows you to keep a specified number of recent versions, unique semver versions, and tags within a certain retention period.

## Features

- Delete old Docker tags from DigitalOcean container registry
- Keep a specified number of recent versions
- Keep a specified number of unique semver versions
- Retain tags within a specified number of days
- Include or exclude repositories using glob patterns
- Perform a dry run without actually deleting tags
- Concurrent processing of repositories and tags for improved performance

## Usage

### GitHub Action

To use this action in your workflow, add the following step:
```yaml
- name: Setup DigitalOcean CLI
  uses: digitalocean/action-doctl@v2
  with:
    token: ${{ secrets.DIGITALOCEAN_ACCESS_TOKEN }}

- name: DigitalOcean Registry Cleanup
  uses: timeraa/do-registry-cleanup@v1
  with:
    # Required
    registry-name: ${{ secrets.DIGITALOCEAN_REGISTRY_NAME }}
    # Optional
    keep-versions: 3
    keep-semver: 2
    retention-days: 30
    dry-run: true
    include-repos: 'repo1, repo2'
    exclude-repos: 'repo3, repo4'
    repo-concurrency: 3
    tag-concurrency: 3
```

### CLI

Use the cli using the following command:
```bash
npx @timeraa/do-registry-cleanup -h
```
