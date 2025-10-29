import { readdirSync, readFileSync } from 'fs'
import { parse } from 'yaml'
import { join } from 'path'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'

const recipesDir = 'recipes'
const schemaPath = 'schemas/recipe-schema.json'

// Initialize AJV with formats
const ajv = new Ajv({ allErrors: true, verbose: true })
addFormats(ajv)

// Load schema
const schema = JSON.parse(readFileSync(schemaPath, 'utf8'))
const validate = ajv.compile(schema)

let hasErrors = false
let validCount = 0
let errorCount = 0

// Get all YAML files
const files = readdirSync(recipesDir).filter(f => f.endsWith('.yaml'))

if (files.length === 0) {
    console.error('ERROR: No recipe files found in recipes/ directory')
    process.exit(1)
}

// Validate each file
for (const file of files) {
    const filePath = join(recipesDir, file)

    try {
        // Parse YAML
        const content = readFileSync(filePath, 'utf8')
        const recipe = parse(content)

        // Validate against schema
        const valid = validate(recipe)

        if (valid) {
            validCount++
        } else {
            console.log(`INVALID: ${file}`)
            hasErrors = true
            errorCount++

            // Print detailed errors
            if (validate.errors) {
                validate.errors.forEach(error => {
                    const path = error.instancePath || 'root'
                    console.log(`  ${path}: ${error.message}`)
                    if (error.params) {
                        Object.entries(error.params).forEach(([key, value]) => {
                            console.log(`    ${key}: ${JSON.stringify(value)}`)
                        })
                    }
                })
            }
            console.log()
        }
    } catch (error) {
        console.log(`ERROR: ${file}`)
        console.log(`  Parse error: ${error.message}\n`)
        hasErrors = true
        errorCount++
    }
}

if (hasErrors) {
    console.error(`Validation failed: ${errorCount} error(s), ${validCount} valid`)
    process.exit(1)
} else {
    console.log(`Validated ${validCount} recipe(s)`)
    process.exit(0)
}
