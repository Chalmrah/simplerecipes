import { readdirSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'
import sharp from 'sharp'

const sourceDir = 'images/source'
const outputDir = 'public/img'

async function buildImages() {
    if (!existsSync(sourceDir)) {
        console.log('⚠️  No source images directory found, skipping image build')
        return
    }

    // Create output directory if it doesn't exist
    if (!existsSync(outputDir)) {
        mkdirSync(outputDir, { recursive: true })
    }

    const folders = readdirSync(sourceDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)

    console.log(`📸 Processing ${folders.length} recipe image folders...`)

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
            console.log(`⚠️  No detail image found for ${folder}`)
            continue
        }

        try {
            // Generate detail.webp (max 1200px wide, high quality)
            await sharp(join(sourcePath, detailSource))
                .resize(1200, null, {
                    withoutEnlargement: true,
                    fit: 'inside'
                })
                .webp({ quality: 85 })
                .toFile(join(outputPath, 'detail.webp'))

            // Generate thumbnail.webp from thumbnail source or detail image
            const thumbSource = thumbnailSource || detailSource
            await sharp(join(sourcePath, thumbSource))
                .resize(400, 300, {
                    fit: 'cover',
                    position: 'center'
                })
                .webp({ quality: 80 })
                .toFile(join(outputPath, 'thumbnail.webp'))

            console.log(`✅ ${folder}`)
        } catch (error) {
            console.error(`❌ Error processing ${folder}:`, error.message)
        }
    }

    console.log('📸 Image processing complete!')
}

buildImages().catch(console.error)