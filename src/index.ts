import { execSync } from 'node:child_process'
import process from 'node:process'
import semver from 'semver'
import * as core from '@actions/core'
import minimatch from 'minimatch'

function runCommand(cmd: string): string {
  try {
    return execSync(cmd, { encoding: 'utf8' }).trim()
  }
  catch (error) {
    core.setFailed(
      `Command failed: ${cmd}\nError: ${(error as Error).message}`,
    )
    process.exit(1)
  }
}

//* Check if doctl is installed
try {
  runCommand('doctl version')
}
catch {
  core.setFailed(
    'doctl is not installed. Please make sure to install it before running this action.',
  )
  process.exit(1)
}

//* Check if doctl is authenticated
try {
  runCommand('doctl account get')
}
catch {
  core.setFailed(
    'doctl is not authenticated. Please make sure to authenticate before running this action.',
  )
  process.exit(1)
}

const registryName = core.getInput('registry-name', { required: true })
const keepVersions = Number.parseInt(
  core.getInput('keep-versions', { required: true }),
  10,
)
const retentionDays = Number.parseInt(core.getInput('retention-days') || '0', 10)
const dryRun = core.getInput('dry-run').toLowerCase() === 'true'
const includePatterns = core.getMultilineInput('include-repos')
const excludePatterns = core.getMultilineInput('exclude-repos')

//* Helper function to check if a repo should be processed
function shouldProcessRepo(repoName: string): boolean {
  if (includePatterns.length > 0) {
    return includePatterns.some(pattern => minimatch(repoName, pattern))
  }
  if (excludePatterns.length > 0) {
    return !excludePatterns.some(pattern => minimatch(repoName, pattern))
  }
  return true
}

try {
  //* Get all repositories in the registry
  const repos = JSON.parse(
    runCommand(`doctl registry repository list-v2 ${registryName} -o json`),
  ) as { name: string }[]

  repos.forEach((repo) => {
    if (!shouldProcessRepo(repo.name)) {
      core.info(`Skipping repository: ${repo.name}`)
      return
    }

    //* Get all tags for the repository
    const tags = JSON.parse(
      runCommand(`doctl registry repository list-tags ${repo.name} -o json`),
    ) as { tag: string, updated_at: string }[]

    //* Filter out 'latest' tag and sort remaining by semver
    const versionTags = tags
      .filter(tag => tag.tag !== 'latest')
      .sort((a, b) => semver.rcompare(a.tag, b.tag))

    const now = new Date()
    const tagsToDelete = versionTags.filter((tag, index) => {
      const tagDate = new Date(tag.updated_at)
      const daysSinceUpdate = (now.getTime() - tagDate.getTime()) / (1000 * 3600 * 24)
      return index >= keepVersions && daysSinceUpdate > retentionDays
    })

    tagsToDelete.forEach((tag) => {
      if (dryRun) {
        core.info(`[DRY RUN] Would delete tag: ${repo.name}:${tag.tag}`)
      }
      else {
        core.info(`Deleting tag: ${repo.name}:${tag.tag}`)
        runCommand(
          `doctl registry repository delete-tag ${registryName}/${repo.name} ${tag.tag} -f`,
        )
      }
    })
  })

  core.info(dryRun ? 'Dry run completed.' : 'Tag cleanup completed.')
}
catch (error) {
  core.setFailed(`An error occurred: ${(error as Error).message}`)
}
