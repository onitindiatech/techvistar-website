const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const assetsDir = 'c:/Users/LENOVO/OneDrive/Desktop/Internahip_project/testproject/frontend/src/assets';

// Read all image files in assets
const allFiles = fs.readdirSync(assetsDir).filter(f => /\.(png|jpg|jpeg|webp)$/i.test(f));

console.log(`Found ${allFiles.length} image files in assets directory.`);

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

  try {
    const image = sharp(filePath);
    const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
    const { width, height, channels } = info;

    let modifiedCount = 0;

    for (let i = 0; i < data.length; i += channels) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      const [h, s, l] = rgbToHsl(r, g, b);

      // Detect Green / Teal / Cyan (Hue 40° to 200° and also where green > blue * 0.9)
      if ((h >= 40 && h <= 200 && s > 0.03 && l > 0.01) || (g > b && g > r && g > 15)) {
        // Map directly to Screenshot 3's exact deep royal blue (Hue 222°)
        const newH = 222;
        const newS = Math.min(1.0, Math.max(0.7, s * 1.1));
        const newL = l;

        const [newR, newG, newB] = hslToRgb(newH, newS, newL);
        data[i] = newR;
        data[i + 1] = newG;
        data[i + 2] = newB;
        modifiedCount++;
      }
    }

    if (modifiedCount > 500) {
      const tempPath = path.join(assetsDir, `temp_${filename}`);
      const format = filename.endsWith('.jpg') || filename.endsWith('.jpeg') ? 'jpeg' : filename.endsWith('.webp') ? 'webp' : 'png';
      
      let builder = sharp(data, { raw: { width, height, channels } });
      if (format === 'jpeg') builder = builder.jpeg({ quality: 95 });
      else if (format === 'webp') builder = builder.webp({ quality: 95 });
      else builder = builder.png();

      await builder.toFile(tempPath);
      fs.renameSync(tempPath, filePath);
      console.log(`Successfully recolored ${filename} (${modifiedCount} pixels -> Royal Blue).`);
    } else {
      console.log(`Skipped ${filename} (${modifiedCount} green pixels).`);
    }
  } catch (err) {
    console.error(`Error processing ${filename}:`, err.message);
  }
}

async function main() {
  for (const file of allFiles) {
    await recolorFile(file);
  }
  console.log('All green/teal artwork images converted to deep royal blue matching Screenshot 3!');
}

main().catch(console.error);
