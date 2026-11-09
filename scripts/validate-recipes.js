import { loadRecipes, report } from './lib/recipes.js'

const result = loadRecipes()
report(result)

const validCount = Object.keys(result.recipes).length
if (result.errors.length > 0) {
    console.error(`Validation failed: ${result.errors.length} invalid, ${validCount} valid`)
    process.exit(1)
}
console.log(`Validated ${validCount} recipe(s)`)
