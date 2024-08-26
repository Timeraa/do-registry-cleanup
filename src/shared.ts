import { execSync } from 'node:child_process'
import semver from 'semver'
import minimatch from 'minimatch'

export function runCommand(cmd: string): string {
  return execSync(cmd, { encoding: 'utf8' }).trim()
}

export function shouldProcessRepo(repoName: string, includePatterns: string[], excludePatterns: string[]): boolean {
  if (includePatterns.length > 0)
    return includePatterns.some(pattern => minimatch(repoName, pattern))

  if (excludePatterns.length > 0)
    return !excludePatterns.some(pattern => minimatch(repoName, pattern))

  return true
}

export function compareTags(a: string, b: string): number {
  const cleanA = a.startsWith('v') ? a.slice(1) : a
  const cleanB = b.startsWith('v') ? b.slice(1) : b

  const isASemver = semver.valid(cleanA)
  const isBSemver = semver.valid(cleanB)

  if (isASemver && isBSemver)
    return semver.rcompare(cleanA, cleanB)
  else if (isASemver)
    return -1
  else if (isBSemver)
    return 1
  else
    return cleanB.localeCompare(cleanA)
}

export async function processRepositories(
  registryName: string,
  keepVersions: number,
  keepSemver: number,
  retentionDays: number,
  dryRun: boolean,
  includePatterns: string[],
  excludePatterns: string[],
  logInfo: (message: string) => void,
  executeCommand: (cmd: string) => void,
): Promise<{ tagsDeletedSummary: { [key: string]: string[] }, totalTagsDeleted: number }> {
  const repos = JSON.parse(
    runCommand(`doctl registry repository list-v2 ${registryName} -o json`),
  ) as { name: string }[]

  const tagsToDeleteSummary: { [key: string]: string[] } = {}

  repos.forEach((repo) => {
    if (!shouldProcessRepo(repo.name, includePatterns, excludePatterns))
      return

    const tags = JSON.parse(
      runCommand(`doctl registry repository list-tags ${repo.name} -o json`),
    ) as { tag: string, updated_at: string }[]

    const versionTags = tags
      .filter(tag => tag.tag !== 'latest')
      .sort((a, b) => compareTags(a.tag, b.tag))

    const uniqueSemverVersions = new Set<string>()
    const tagsToKeep = versionTags.filter((tag) => {
      const cleanTag = tag.tag.startsWith('v') ? tag.tag.slice(1) : tag.tag
      if (semver.valid(cleanTag)) {
        const majorMinorPatch = `${semver.major(cleanTag)}.${semver.minor(cleanTag)}.${semver.patch(cleanTag)}`
        if (uniqueSemverVersions.size < keepSemver || uniqueSemverVersions.has(majorMinorPatch)) {
          uniqueSemverVersions.add(majorMinorPatch)
          return true
        }
      }
      return false
    })

    const now = new Date()
    const tagsToDelete = versionTags.filter((tag, index) => {
      if (tagsToKeep.includes(tag))
        return false
      const tagDate = new Date(tag.updated_at)
      const daysSinceUpdate = (now.getTime() - tagDate.getTime()) / (1000 * 3600 * 24)
      return index >= keepVersions && daysSinceUpdate > retentionDays
    })

    if (tagsToDelete.length > 0)
      tagsToDeleteSummary[repo.name] = tagsToDelete.map(tag => tag.tag)
  })

  const tagsDeletedSummary: { [key: string]: string[] } = {}
  let totalTagsDeleted = 0

  for (const [repo, tags] of Object.entries(tagsToDeleteSummary)) {
    tagsDeletedSummary[repo] = []
    tags.forEach((tag) => {
      if (dryRun) {
        logInfo(`[DRY RUN] Would delete tag: ${repo}:${tag}`)
      }
      else {
        logInfo(`Deleting tag: ${repo}:${tag}`)
        executeCommand(`doctl registry repository delete-tag ${repo} ${tag} -f`)
      }
      tagsDeletedSummary[repo]!.push(tag)
      totalTagsDeleted++
    })
  }

  logInfo(dryRun ? 'Dry run completed.' : 'Tag cleanup completed.')

  return { tagsDeletedSummary, totalTagsDeleted }
}
