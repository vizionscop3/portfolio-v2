#!/usr/bin/env node

/**
 * Asset Compression Script
 * Compresses build assets to reduce file sizes
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const distDir = path.join(__dirname, '..', 'dist');

console.log('🗜️  Starting asset compression...');

/**
 * Recursively get all files in a directory
 */
function getAllFiles(dir, files = []) {
  const fileList = fs.readdirSync(dir);

  for (const file of fileList) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      getAllFiles(filePath, files);
    } else {
      files.push(filePath);
    }
  }

  return files;
}

/**
 * Compress a file using gzip
 */
function compressFile(filePath) {
  return new Promise((resolve, reject) => {
    const originalSize = fs.statSync(filePath).size;
    const readStream = fs.createReadStream(filePath);
    const writeStream = fs.createWriteStream(filePath + '.gz');
    const gzip = zlib.createGzip({ level: 9 }); // Maximum compression

    readStream
      .pipe(gzip)
      .pipe(writeStream)
      .on('finish', () => {
        const compressedSize = fs.statSync(filePath + '.gz').size;
        const savings = Math.round((1 - compressedSize / originalSize) * 100);
        console.log(
          `✅ ${path.basename(filePath)}: ${originalSize}B → ${compressedSize}B (${savings}% smaller)`
        );
        resolve();
      })
      .on('error', reject);
  });
}

/**
 * Check if file should be compressed
 */
function shouldCompress(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const compressibleTypes = [
    '.js',
    '.css',
    '.html',
    '.json',
    '.svg',
    '.txt',
    '.xml',
  ];
  const minSize = 1024; // Only compress files larger than 1KB

  return (
    compressibleTypes.includes(ext) && fs.statSync(filePath).size > minSize
  );
}

/**
 * Remove debug code from JS files
 */
function removeDebugCode(filePath) {
  if (!filePath.endsWith('.js')) return;

  try {
    let content = fs.readFileSync(filePath, 'utf8');

    // Remove console statements that might have been missed
    content = content.replace(
      /console\.(log|debug|info|warn|error)\([^)]*\);?/g,
      ''
    );

    // Remove debug comments
    content = content.replace(/\/\*[\s\S]*?\*\//g, '');
    content = content.replace(/\/\/.*$/gm, '');

    // Remove unnecessary whitespace
    content = content.replace(/\s+/g, ' ').trim();

    fs.writeFileSync(filePath, content, 'utf8');
  } catch (error) {
    console.warn(`⚠️  Could not process ${filePath}: ${error.message}`);
  }
}

/**
 * Main compression function
 */
async function compressAssets() {
  try {
    if (!fs.existsSync(distDir)) {
      console.error('❌ Dist directory not found. Run build first.');
      process.exit(1);
    }

    const allFiles = getAllFiles(distDir);
    const compressibleFiles = allFiles.filter(shouldCompress);

    console.log(`📁 Found ${compressibleFiles.length} files to compress`);

    // Remove debug code first
    console.log('🧹 Removing debug code...');
    compressibleFiles.forEach(removeDebugCode);

    // Compress files
    console.log('🗜️  Compressing files...');
    await Promise.all(compressibleFiles.map(compressFile));

    // Calculate total savings
    let totalOriginal = 0;
    let totalCompressed = 0;

    for (const file of compressibleFiles) {
      totalOriginal += fs.statSync(file).size;
      const gzFile = file + '.gz';
      if (fs.existsSync(gzFile)) {
        totalCompressed += fs.statSync(gzFile).size;
      }
    }

    const totalSavings = Math.round(
      (1 - totalCompressed / totalOriginal) * 100
    );

    console.log('\n📊 Compression Summary:');
    console.log(
      `   Original size: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`
    );
    console.log(
      `   Compressed size: ${(totalCompressed / 1024 / 1024).toFixed(2)} MB`
    );
    console.log(`   Total savings: ${totalSavings}%`);
    console.log('\n✅ Asset compression complete!');
  } catch (error) {
    console.error('❌ Compression failed:', error);
    process.exit(1);
  }
}

// Run compression
compressAssets();
