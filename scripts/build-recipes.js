import { readdirSync, readFileSync, writeFileSync, watch } from 'fs'
import { parse } from 'yaml'
import { join } from 'path'

const recipesDir = 'recipes'
const outputFile = 'recipes.json'

function buildRecipes() {
    const recipes = {}

    readdirSync(recipesDir).forEach(file => {
        if (file.endsWith('.yaml')) {
            try {
                const content = readFileSync(join(recipesDir, file), 'utf8')
                const recipe = parse(content)
                const id = file.replace('.yaml', '')
                recipes[id] = recipe
            } catch (error) {
                console.error(`ERROR: ${file}:`, error.message)
                process.exit(1)
            }
        }
    })

    writeFileSync(outputFile, JSON.stringify(recipes, null, 2))
    console.log(`Built ${Object.keys(recipes).length} recipe(s)`)
}

// Build immediately
buildRecipes()

// Watch mode for development
if (process.argv.includes('--watch')) {
    console.log('Watching for changes...')
    watch(recipesDir, (eventType, filename) => {
        if (filename && filename.endsWith('.yaml')) {
            console.log(`Change detected: ${filename}`)
            buildRecipes()
        }
    })
}
