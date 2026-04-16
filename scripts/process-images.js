const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const SIZES = {
  small: 640,
  medium: 1024,
  large: 1920
};

const QUALITY = {
  webp: 80,
  jpeg: 85
};

const SOURCE_DIRS = ['assets/images/posts', 'assets/images/fixed'];
const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png'];

async function findSourceImages(dir) {
  const images = [];

  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        const subImages = await findSourceImages(fullPath);
        images.push(...subImages);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        const basename = path.basename(entry.name, ext);

        const isProcessed = basename.includes('-thumbnail') ||
                           basename.includes('-small') ||
                           basename.includes('-medium') ||
                           basename.includes('-large');

        if (SUPPORTED_FORMATS.includes(ext) && !isProcessed) {
          images.push(fullPath);
        }
      }
    }
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log(`Directory ${dir} does not exist, skipping`);
      return images;
    }
    console.error(`Error reading directory ${dir}:`, error.message);
    process.exit(1);
  }

  return images;
}

async function processImage(sourcePath) {
  try {
    const image = sharp(sourcePath);
    const metadata = await image.metadata();
    const sourceWidth = metadata.width;

    const dir = path.dirname(sourcePath);
    const ext = path.extname(sourcePath);
    const basename = path.basename(sourcePath, ext);

    console.log(`Processing: ${sourcePath}`);
    console.log(`  Source dimensions: ${sourceWidth}x${metadata.height}`);

    let processedCount = 0;

    for (const [sizeName, targetWidth] of Object.entries(SIZES)) {
      const webpPath = path.join(dir, `${basename}-${sizeName}.webp`);
      await sharp(sourcePath)
        .resize(targetWidth, null, { withoutEnlargement: true })
        .webp({ quality: QUALITY.webp })
        .toFile(webpPath);

      const actualWidth = targetWidth > sourceWidth ? sourceWidth : targetWidth;
      console.log(`  Generated ${sizeName} WebP (${actualWidth}px)`);
      processedCount++;

      const jpegPath = path.join(dir, `${basename}-${sizeName}.jpg`);
      await sharp(sourcePath)
        .resize(targetWidth, null, { withoutEnlargement: true })
        .jpeg({ quality: QUALITY.jpeg })
        .toFile(jpegPath);
      console.log(`  Generated ${sizeName} JPEG (${actualWidth}px)`);
      processedCount++;
    }

    console.log(`  Total: ${processedCount} files generated\n`);
    return processedCount;

  } catch (error) {
    console.error(`Error processing ${sourcePath}:`, error.message);
    throw error;
  }
}

async function main() {
  console.log('Starting image processing...\n');

  let sourceImages = [];
  for (const dir of SOURCE_DIRS) {
    const images = await findSourceImages(dir);
    sourceImages.push(...images);
  }
  console.log(`Found ${sourceImages.length} source images\n`);

  if (sourceImages.length === 0) {
    console.log('No images to process');
    return;
  }

  let totalProcessed = 0;

  for (const imagePath of sourceImages) {
    const count = await processImage(imagePath);
    totalProcessed += count;
  }

  console.log(`\nProcessing complete: ${totalProcessed} files generated from ${sourceImages.length} source images`);
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
