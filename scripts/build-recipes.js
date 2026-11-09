import { writeFileSync, watch } from 'fs'
import { loadRecipes, report, recipesDir } from './lib/recipes.js'

const outputFile = 'recipes.json'
const watching = process.argv.includes('--watch')

function buildRecipes() {
    const result = loadRecipes()
    report(result)

    if (result.errors.length > 0) {
        // In watch mode keep the last good recipes.json so the dev server stays up
        if (watching) {
            console.error('Build skipped, keeping previous recipes.json')
            return
        }
        process.exit(1)
    }

    writeFileSync(outputFile, JSON.stringify(result.recipes, null, 2) + '\n')
    console.log(`Built ${Object.keys(result.recipes).length} recipe(s)`)
}

buildRecipes()

if (watching) {
    console.log('Watching for changes...')
    // Editors fire several events per save; collapse them into one rebuild
    let timer
    watch(recipesDir, (_eventType, filename) => {
        if (!filename || !/\.ya?ml$/i.test(filename)) return
        clearTimeout(timer)
        timer = setTimeout(() => {
            console.log(`Change detected: ${filename}`)
            buildRecipes()
        }, 100)
    })
}
