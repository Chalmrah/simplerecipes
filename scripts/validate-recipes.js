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

console.log('🔍 Validating recipes against schema...\n')

let hasErrors = false
let validCount = 0
let errorCount = 0

// Get all YAML files
const files = readdirSync(recipesDir).filter(f => f.endsWith('.yaml'))

if (files.length === 0) {
    console.error('❌ No recipe files found in recipes/ directory')
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
            console.log(`✅ ${file}`)
            validCount++
        } else {
            console.log(`❌ ${file}`)
            hasErrors = true
            errorCount++

            // Print detailed errors
            if (validate.errors) {
                validate.errors.forEach(error => {
                    const path = error.instancePath || 'root'
                    console.log(`   └─ ${path}: ${error.message}`)
                    if (error.params) {
                        Object.entries(error.params).forEach(([key, value]) => {
                            console.log(`      ${key}: ${JSON.stringify(value)}`)
                        })
                    }
                })
            }
            console.log()
        }
    } catch (error) {
        console.log(`❌ ${file}`)
        console.log(`   └─ Parse error: ${error.message}\n`)
        hasErrors = true
        errorCount++
    }
}

// Summary
console.log('\n' + '─'.repeat(50))
console.log(`📊 Validation Summary:`)
console.log(`   Total files: ${files.length}`)
console.log(`   Valid: ${validCount}`)
console.log(`   Errors: ${errorCount}`)
console.log('─'.repeat(50) + '\n')

if (hasErrors) {
    console.error('❌ Validation failed! Please fix the errors above.\n')
    process.exit(1)
} else {
    console.log('✅ All recipes are valid!\n')
    process.exit(0)
}