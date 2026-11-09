import { readdirSync, existsSync, mkdirSync, statSync } from 'fs'
import { join } from 'path'
import sharp from 'sharp'
import { imageSourceDir, findImageSource } from './lib/recipes.js'

const outputDir = 'public/img'

const variants = [
    // Detail: 16:9 hero
    { name: 'detail', width: 1200, height: 675, quality: 82, source: 'detail' },
    // Thumbnail: 4:3 card image, served at up to ~2x a 300px card
    { name: 'thumbnail', width: 640, height: 480, quality: 78, source: 'thumbnail' },
]

function isFresh(sourcePath, outputPath) {
    return existsSync(outputPath) && statSync(outputPath).mtimeMs >= statSync(sourcePath).mtimeMs
}

async function buildImages() {
    if (!existsSync(imageSourceDir)) {
        console.log('No source images directory found')
        return
    }

    const folders = readdirSync(imageSourceDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)

    let built = 0
    let skipped = 0
    let failed = 0

    for (const folder of folders) {
        const sourceFolder = join(imageSourceDir, folder)
        const outputFolder = join(outputDir, folder)
        const detail = findImageSource(sourceFolder, 'detail')

        if (!detail) {
            console.warn(`WARN: ${folder}: no detail image, skipping`)
            continue
        }

        mkdirSync(outputFolder, { recursive: true })

        for (const variant of variants) {
            // Thumbnail falls back to the detail source when no dedicated crop exists
            const source = join(sourceFolder, findImageSource(sourceFolder, variant.source) ?? detail)
            const output = join(outputFolder, `${variant.name}.webp`)

            if (isFresh(source, output)) {
                skipped++
                continue
            }

            try {
                await sharp(source)
                    .rotate() // honour EXIF orientation from phone photos
                    .resize(variant.width, variant.height, { fit: 'cover', position: 'attention' })
                    .webp({ quality: variant.quality })
                    .toFile(output)
                built++
            } catch (error) {
                console.error(`ERROR: ${folder}/${variant.name}:`, error.message)
                failed++
            }
        }
    }

    console.log(`Images: ${built} built, ${skipped} up to date${failed ? `, ${failed} failed` : ''}`)
    if (failed > 0) process.exit(1)
}

buildImages().catch(error => {
    console.error(error)
    process.exit(1)
})
