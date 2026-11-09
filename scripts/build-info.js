import { execSync } from 'child_process'
import { writeFileSync } from 'fs'

const outputFile = 'build-info.json'

function git(args) {
    try {
        return execSync(`git ${args}`, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim()
    } catch {
        return undefined
    }
}

const hash = git('rev-parse --short HEAD')
// Flag builds made from uncommitted changes so the footer doesn't claim a commit it isn't
const dirty = hash !== undefined && git('status --porcelain') !== ''

// BUILD_DATE (YYYY-MM-DD) pins the shown date, used by the local dev scripts.
// Noon UTC keeps the calendar day stable whatever timezone it's later formatted in.
function builtAt() {
    const override = process.env.BUILD_DATE
    if (!override) return new Date().toISOString()
    if (!/^\d{4}-\d{2}-\d{2}$/.test(override) || Number.isNaN(Date.parse(`${override}T12:00:00Z`))) {
        console.error(`ERROR: BUILD_DATE must be YYYY-MM-DD, got "${override}"`)
        process.exit(1)
    }
    return `${override}T12:00:00.000Z`
}

const info = {
    commit: hash ? `${hash}${dirty ? '-dirty' : ''}` : 'unknown',
    builtAt: builtAt(),
}

writeFileSync(outputFile, JSON.stringify(info, null, 2) + '\n')
console.log(`Build info: ${info.commit} at ${info.builtAt}`)
