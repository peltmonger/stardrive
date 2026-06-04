// This script processes header images from articles to match specs for Open Graph (OG) and X/Twitter.

import sharp from 'sharp';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

// Needed to handle __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const processImages = async (srcDir, outDir) => {
  try {
    // Ensure the output directory exists
    await fs.ensureDir(outDir);

    // Read all image files from the source directory
    const files = await fs.readdir(srcDir);

    // Filter files to include only .png, .webp, and .jpg (mind that .webp is not supported by x/Twitter and while it is supported by Facebook/Meta, others using OG may not support it!)
    const imageFiles = files.filter((file) => ['.png', '.webp', '.jpg'].includes(path.extname(file).toLowerCase()));

    // Process each image
    await Promise.all(
      imageFiles.map(async (file) => {
        const inputPath = path.join(srcDir, file);
        const outputPathOG = path.join(outDir, `og_${path.basename(file, path.extname(file))}.jpg`);
        const outputPathX = path.join(outDir, `x_${path.basename(file, path.extname(file))}.jpg`);
        // Resize and crop the image for OG/Meta using JPG format
        await sharp(inputPath).resize(1200, 630).toFormat('jpg').toFile(outputPathOG);
        // Resize and crop the image for X/Twitter using JPG format
        await sharp(inputPath).resize(1600, 900).toFormat('jpg').toFile(outputPathX);
      }),
    );

    console.log('✅ Social images processed for:', srcDir);
  } catch (error) {
    console.error('❌ Error processing images:', error);
  }
};

const processSocialImages = async () => {
  const srcDir = path.join(__dirname, '../src/images/content');
  const outDir = path.join(__dirname, '../dist/images/content'); // which would merge with the `public` folder in the root of the project, so that the images are available at /images/content/og_*.jpg and /images/content/x_*.jpg
  await processImages(srcDir, outDir);
  // find sub directories
  const subDirs = (await fs.readdir(srcDir, { withFileTypes: true })).filter((dirent) => dirent.isDirectory()).map((dirent) => dirent.name);
  await Promise.all(
    subDirs.map(async (subDir) => {
      const name = path.basename(subDir);
      const srcSubDir = path.join(srcDir, name);
      const outSubDir = path.join(outDir, name);
      await processImages(srcSubDir, outSubDir);
    }),
  );
};

// run
processSocialImages();
