import process from 'node:process'
import * as core from '@actions/core'
import { processRepositories, runCommand } from './shared'

//* Check if doctl is installed
try {
  runCommand('doctl version')
}
catch {
  core.setFailed('doctl is not installed. Please make sure to install it before running this action.')
  process.exit(1)
}

//* Check if doctl is authenticated
try {
  runCommand('doctl account get')
}
catch {
  core.setFailed('doctl is not authenticated. Please make sure to authenticate before running this action.')
  process.exit(1)
}

async function main() {
  try {
    const result = await processRepositories(
      core.getInput('registry-name', { required: true }),
      Number.parseInt(core.getInput('keep-versions', { required: true }), 10),
      Number.parseInt(core.getInput('keep-semver') || '0', 10),
      Number.parseInt(core.getInput('retention-days') || '0', 10),
      core.getInput('dry-run').toLowerCase() === 'true',
      core.getMultilineInput('include-repos'),
      core.getMultilineInput('exclude-repos'),
      core.info,
      runCommand,
    )

    //* Add summary
    await core.summary
      .addHeading('Docker Tag Cleanup Summary')
      .addTable([
        [{ data: 'Repository', header: true }, { data: 'Tags Deleted', header: true }],
        ...Object.entries(result.tagsDeletedSummary).map(([repo, tags]) => [repo, tags.length.toString()]),
      ])
      .addHeading('Total Tags Deleted', 2)
      .addRaw(result.totalTagsDeleted.toString())
      .write()

    core.info('Summary added to the job.')
  }
  catch (error) {
    core.setFailed(`An error occurred: ${(error as Error).message}`)
  }
}

main()
