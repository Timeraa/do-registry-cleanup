#!/usr/bin/env node

import process from 'node:process'
import { Command } from 'commander'
import { processRepositories, runCommand } from './shared'

//* Check if doctl is installed
try {
  runCommand('doctl version')
}
catch {
  console.error('doctl is not installed. Please make sure to install it before running this script.')
  process.exit(1)
}

//* Check if doctl is authenticated
try {
  runCommand('doctl account get')
}
catch {
  console.error('doctl is not authenticated. Please make sure to authenticate before running this script.')
  process.exit(1)
}

const program = new Command()

program
  .name('delete-docker-tags')
  .description('Delete old Docker tags from DigitalOcean container registry')
  .requiredOption('-r, --registry-name <name>', 'Name of the DigitalOcean container registry')
  .requiredOption('-k, --keep-versions <number>', 'Number of recent versions to keep', '5')
  .option('-s, --keep-semver <number>', 'Number of unique semver versions to keep', '0')
  .option('-d, --retention-days <number>', 'Number of days to retain tags regardless of keep-versions', '0')
  .option('--dry-run', 'Perform a dry run without actually deleting tags', false)
  .option('-i, --include-repos <patterns...>', 'Glob patterns to include specific repositories')
  .option('-e, --exclude-repos <patterns...>', 'Glob patterns to exclude specific repositories')
  .option('--repo-concurrency <number>', 'Number of repositories to process concurrently', '3')
  .option('--tag-concurrency <number>', 'Number of tags to delete concurrently per repository', '3')
  .parse(process.argv)

const options = program.opts()

async function main() {
  try {
    await processRepositories(
      options.registryName,
      Number.parseInt(options.keepVersions, 10),
      Number.parseInt(options.keepSemver, 10),
      Number.parseInt(options.retentionDays, 10),
      options.dryRun,
      options.includeRepos || [],
      options.excludeRepos || [],
      console.log,
      runCommand,
      Number.parseInt(options.repoConcurrency, 10),
      Number.parseInt(options.tagConcurrency, 10),
    )
  }
  catch (error) {
    console.error(`An error occurred: ${(error as Error).message}`)
    process.exit(1)
  }
}

main()
