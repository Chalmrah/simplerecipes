import { readdirSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'
import sharp from 'sharp'

const sourceDir = 'images/source'
const outputDir = 'public/img'

async function generatePlaceholder(width, height, outputPath) {
    // Create a simple gray placeholder with sharp
    await sharp({
        create: {
            width: width,
            height: height,
            channels: 4,
            background: { r: 200, g: 200, b: 200, alpha: 0.8 }
        }
    })
    .webp({ quality: 80 })
    .toFile(outputPath)
}

async function buildImages() {
    // Create output directory if it doesn't exist
    if (!existsSync(outputDir)) {
        mkdirSync(outputDir, { recursive: true })
    }

    // Generate global placeholder.webp for recipes with no image path in YAML
    try {
        await generatePlaceholder(1200, 675, join(outputDir, 'placeholder.webp'))
    } catch (error) {
        console.error('ERROR: Failed to create placeholder:', error.message)
    }

    if (!existsSync(sourceDir)) {
        console.log('No source images directory found')
        return
    }

    const folders = readdirSync(sourceDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)

    let processedCount = 0
    let placeholderCount = 0

    for (const folder of folders) {
        const sourcePath = join(sourceDir, folder)
        const outputPath = join(outputDir, folder)

        // Create output folder
        if (!existsSync(outputPath)) {
            mkdirSync(outputPath, { recursive: true })
        }

        // Find source files (support png, jpg, jpeg)
        const files = readdirSync(sourcePath)
        const detailSource = files.find(f =>
            f.startsWith('detail.') && /\.(png|jpg|jpeg)$/i.test(f)
        )
        const thumbnailSource = files.find(f =>
            f.startsWith('thumbnail.') && /\.(png|jpg|jpeg)$/i.test(f)
        )

        if (!detailSource) {
            try {
                // Generate placeholder detail.webp
                await generatePlaceholder(1200, 675, join(outputPath, 'detail.webp'))
                
                // Generate placeholder thumbnail.webp
                await generatePlaceholder(400, 300, join(outputPath, 'thumbnail.webp'))
                
                placeholderCount++
            } catch (error) {
                console.error(`ERROR: ${folder}:`, error.message)
            }
            continue
        }

        try {
            // Generate detail.webp (1200x675 landscape 16:9, cropped to fit)
            await sharp(join(sourcePath, detailSource))
                .resize(1200, 675, {
                    fit: 'cover',
                    position: 'center'
                })
                .webp({ quality: 85 })
                .toFile(join(outputPath, 'detail.webp'))

            // Generate thumbnail.webp (400x300 landscape 4:3, cropped to fit)
            const thumbSource = thumbnailSource || detailSource
            await sharp(join(sourcePath, thumbSource))
                .resize(400, 300, {
                    fit: 'cover',
                    position: 'center'
                })
                .webp({ quality: 80 })
                .toFile(join(outputPath, 'thumbnail.webp'))

            processedCount++
        } catch (error) {
            console.error(`ERROR: ${folder}:`, error.message)
        }
    }

    const total = processedCount + placeholderCount
    const placeholderMsg = placeholderCount > 0 ? ` (${placeholderCount} placeholder)` : ''
    console.log(`Processed ${total} image(s)${placeholderMsg}`)
}

buildImages().catch(console.error)
