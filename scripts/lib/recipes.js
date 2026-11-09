import { readdirSync, readFileSync, existsSync } from 'fs'
import { join, basename, extname } from 'path'
import { parse } from 'yaml'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'

export const recipesDir = 'recipes'
export const imageSourceDir = 'images/source'
const schemaPath = 'schemas/recipe-schema.json'

const ajv = new Ajv({ allErrors: true })
addFormats(ajv)
const validate = ajv.compile(JSON.parse(readFileSync(schemaPath, 'utf8')))

const IMAGE_EXT = /\.(png|jpe?g|webp)$/i

/** Find `<name>.<ext>` in a source image folder, or undefined. */
export function findImageSource(folder, name) {
    if (!existsSync(folder)) return undefined
    return readdirSync(folder).find(f => f.startsWith(`${name}.`) && IMAGE_EXT.test(f))
}

// Recipe ids become URL segments, so keep them to the same shape the image paths use
const ID_PATTERN = /^[a-z0-9-]+$/

/**
 * Parse and validate every recipe file.
 * Returns { recipes, errors, warnings } where recipes maps id -> recipe for valid files only.
 */
export function loadRecipes() {
    const recipes = {}
    const errors = []
    const warnings = []

    const files = readdirSync(recipesDir)
        .filter(f => /\.ya?ml$/i.test(f))
        .sort()

    if (files.length === 0) {
        errors.push({ file: recipesDir, messages: ['No recipe files found'] })
    }

    for (const file of files) {
        const id = basename(file, extname(file))
        const messages = []

        if (!ID_PATTERN.test(id)) {
            messages.push(`filename must match ${ID_PATTERN} (it becomes the URL)`)
        }
        if (recipes[id]) {
            messages.push(`duplicate recipe id "${id}"`)
        }

        let recipe
        try {
            recipe = parse(readFileSync(join(recipesDir, file), 'utf8'))
        } catch (error) {
            messages.push(`YAML parse error: ${error.message}`)
        }

        if (recipe !== undefined && !validate(recipe)) {
            for (const error of validate.errors) {
                const detail = error.params?.additionalProperty
                    ? ` (${error.params.additionalProperty})`
                    : error.params?.allowedValues
                        ? ` (${error.params.allowedValues.join(', ')})`
                        : ''
                messages.push(`${error.instancePath || '/'}: ${error.message}${detail}`)
            }
        }

        if (messages.length > 0) {
            errors.push({ file, messages })
            continue
        }

        if (recipe.image) {
            const folder = join(imageSourceDir, recipe.image.replace(/^img\//, ''))
            if (!findImageSource(folder, 'detail')) {
                warnings.push({ file, message: `image "${recipe.image}" has no detail image in ${folder}/, showing fallback` })
                delete recipe.image
            }
        }

        recipes[id] = recipe
    }

    return { recipes, errors, warnings }
}

export function report({ errors, warnings }) {
    for (const { file, message } of warnings) {
        console.warn(`WARN: ${file}: ${message}`)
    }
    for (const { file, messages } of errors) {
        console.error(`INVALID: ${file}`)
        for (const message of messages) console.error(`  ${message}`)
    }
}
