// Generate placeholder assets for 3D portfolio
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');

// Create placeholder SVG image
const createPlaceholderImage = (
  width = 256,
  height = 256,
  color = '#00FFFF',
  name = 'placeholder'
) => {
  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
        <path d="M 32 0 L 0 0 0 32" fill="none" stroke="${color}" stroke-width="1" opacity="0.3"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid)"/>
    <rect x="10%" y="10%" width="80%" height="80%" fill="${color}" opacity="0.2"/>
    <text x="50%" y="50%" font-family="monospace" font-size="14" fill="${color}" text-anchor="middle" dominant-baseline="central">${name}</text>
  </svg>`;
};

// Cyberpunk colors
const colors = {
  cyan: '#00FFFF',
  magenta: '#FF00FF',
  blue: '#0080FF',
  green: '#00FF80',
  red: '#FF0080',
};

// Create texture files
const textures = [
  { name: 'hologram-material.svg', color: colors.cyan, label: 'HOLOGRAM' },
  { name: 'cyberpunk-metal.svg', color: colors.blue, label: 'METAL' },
  { name: 'neon-glow.svg', color: colors.magenta, label: 'NEON' },
  { name: 'futuristic-glass.svg', color: colors.cyan, label: 'GLASS' },
  {
    name: 'particle-sprite.svg',
    color: colors.green,
    label: 'PARTICLE',
    width: 64,
    height: 64,
  },
];

textures.forEach(texture => {
  const svg = createPlaceholderImage(
    texture.width || 512,
    texture.height || 512,
    texture.color,
    texture.label
  );
  fs.writeFileSync(
    path.join(__dirname, '../public/textures', texture.name),
    svg
  );
  console.log(`✅ Created texture: ${texture.name}`);
});

// Create image assets
const images = [
  {
    name: 'cyberpunk-hero-bg.svg',
    color: colors.blue,
    label: 'HERO BG',
    width: 1920,
    height: 1080,
  },
  {
    name: 'denward-avatar.svg',
    color: colors.cyan,
    label: 'AVATAR',
    width: 256,
    height: 256,
  },
];

images.forEach(image => {
  const svg = createPlaceholderImage(
    image.width,
    image.height,
    image.color,
    image.label
  );
  fs.writeFileSync(path.join(__dirname, '../public/images', image.name), svg);
  console.log(`✅ Created image: ${image.name}`);
});

// Create project previews
const projects = [
  { name: 'project-1-preview.svg', color: colors.cyan, label: 'PROJECT 1' },
  { name: 'project-2-preview.svg', color: colors.magenta, label: 'PROJECT 2' },
  { name: 'project-3-preview.svg', color: colors.green, label: 'PROJECT 3' },
];

projects.forEach(project => {
  const svg = createPlaceholderImage(800, 600, project.color, project.label);
  fs.writeFileSync(
    path.join(__dirname, '../public/images/projects', project.name),
    svg
  );
  console.log(`✅ Created project: ${project.name}`);
});

// Create icons
const icons = [
  { name: 'loading-spinner.svg', color: colors.cyan, label: '⟳' },
  { name: 'error-indicator.svg', color: colors.red, label: '⚠' },
];

icons.forEach(icon => {
  const svg = createPlaceholderImage(64, 64, icon.color, icon.label);
  fs.writeFileSync(
    path.join(__dirname, '../public/images/icons', icon.name),
    svg
  );
  console.log(`✅ Created icon: ${icon.name}`);
});

console.log('\n🚀 All placeholder assets created successfully!');
console.log('The 3D portfolio should now load without asset errors.');
