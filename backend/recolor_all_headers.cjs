const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const assetsDir = 'c:/Users/LENOVO/OneDrive/Desktop/Internahip_project/testproject/frontend/src/assets';

const filesToProcess = [
  'industry-header.png',
  'about-header.png',
  'solution-header.png',
  'contact-header.png',
  'About_background_image.png',
  'our_work_background.png',
  'faq_hero_illustration.png',
];

// Helper RGB to HSL
function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [h * 360, s, l];
}

// Helper HSL to RGB
function hslToRgb(h, s, l) {
  h /= 360;
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

async function recolorFile(filename) {
  const filePath = path.join(assetsDir, filename);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }

  console.log(`Processing ${filename}...`);
  const image = sharp(filePath);
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  let modifiedCount = 0;

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const [h, s, l] = rgbToHsl(r, g, b);

    // Green to Cyan/Teal range: 50° to 195°
    if (h >= 50 && h <= 195 && s > 0.04 && l > 0.02) {
      // Map green/cyan (50°-195°) to royal/sky blue (205°-225°)
      let newH = 215 + (h - 135) * 0.4;
      if (newH < 200) newH = 200;
      if (newH > 230) newH = 230;

      let newS = Math.min(1.0, s * 1.15);
      let newL = l;

      const [newR, newG, newB] = hslToRgb(newH, newS, newL);
      data[i] = newR;
      data[i + 1] = newG;
      data[i + 2] = newB;
      modifiedCount++;
    }
  }

  const tempPath = path.join(assetsDir, `temp_${filename}`);
  await sharp(data, { raw: { width, height, channels } })
    .png()
    .toFile(tempPath);

  fs.renameSync(tempPath, filePath);
  console.log(`Successfully recolored ${filename} (${modifiedCount} pixels modified).`);
}

async function main() {
  for (const file of filesToProcess) {
    await recolorFile(file);
  }
  console.log('All header images recolored to corporate blue!');
}

main().catch(console.error);
