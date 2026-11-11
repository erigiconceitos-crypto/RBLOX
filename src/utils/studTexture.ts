import * as THREE from 'three';

let cachedStudTexture: THREE.CanvasTexture | null = null;
let cachedInletTexture: THREE.CanvasTexture | null = null;
let cachedGridTexture: THREE.CanvasTexture | null = null;
const cachedFaces: Record<string, THREE.CanvasTexture> = {};

/**
 * Creates procedural Roblox stud texture for top of parts
 */
export function getRobloxStudTexture(): THREE.CanvasTexture {
  if (cachedStudTexture) return cachedStudTexture;

  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, size, size);

  // Stud circle center
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.32;

  // Outer ring / bevel shadow
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
  ctx.fill();

  // Top highlight
  ctx.beginPath();
  ctx.arc(cx - 2, cy - 2, r - 3, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.fill();

  // Main stud surface
  ctx.beginPath();
  ctx.arc(cx, cy, r - 5, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.fill();

  // Inner ring with subtle "ROBLOX" stylized stud marking
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.55, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.12)';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Square center diamond / stud mark
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(Math.PI / 4);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
  ctx.fillRect(-6, -6, 12, 12);
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  cachedStudTexture = texture;
  return texture;
}

/**
 * Creates procedural Roblox inlet texture for bottom of parts
 */
export function getRobloxInletTexture(): THREE.CanvasTexture {
  if (cachedInletTexture) return cachedInletTexture;

  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, size, size);

  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.32;

  // Recessed dark circle
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cx, cy, r - 4, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  cachedInletTexture = texture;
  return texture;
}

/**
 * Creates baseplate grid texture with coordinates / studs
 */
export function getBaseplateTexture(): THREE.CanvasTexture {
  if (cachedGridTexture) return cachedGridTexture;

  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Classic dark green or grey baseplate
  ctx.fillStyle = '#3a8e3a'; // classic Roblox baseplate grass green
  ctx.fillRect(0, 0, size, size);

  // Grid lines
  ctx.strokeStyle = '#2d722d';
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, size, size);

  // 4 studs in a 2x2 grid
  const sub = size / 2;
  for (let x = 0; x < 2; x++) {
    for (let y = 0; y < 2; y++) {
      const cx = x * sub + sub / 2;
      const cy = y * sub + sub / 2;
      const r = sub * 0.3;

      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cx, cy, r - 3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(100, 100);
  texture.colorSpace = THREE.SRGBColorSpace;
  cachedGridTexture = texture;
  return texture;
}

/**
 * Procedural Roblox avatar faces
 */
export function getRobloxFaceTexture(faceType: string): THREE.CanvasTexture {
  if (cachedFaces[faceType]) return cachedFaces[faceType];

  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Transparent background so skin tone shows through
  ctx.clearRect(0, 0, size, size);

  ctx.fillStyle = '#111111';
  ctx.strokeStyle = '#111111';
  ctx.lineWidth = 10;
  ctx.lineCap = 'round';

  if (faceType === 'smile' || !faceType) {
    // Classic Roblox default smile
    // Left eye (oval)
    ctx.beginPath();
    ctx.ellipse(85, 95, 14, 20, 0, 0, Math.PI * 2);
    ctx.fill();
    // Right eye
    ctx.beginPath();
    ctx.ellipse(171, 95, 14, 20, 0, 0, Math.PI * 2);
    ctx.fill();
    // Smile curve
    ctx.beginPath();
    ctx.arc(128, 115, 65, 0.25 * Math.PI, 0.75 * Math.PI, false);
    ctx.stroke();
  } else if (faceType === 'epic') {
    // Sunglasses / epic face
    // Sunglasses frame
    ctx.fillStyle = '#111111';
    ctx.fillRect(55, 80, 65, 45);
    ctx.fillRect(136, 80, 65, 45);
    ctx.fillRect(115, 85, 26, 12);
    // Glare reflection
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(60, 85);
    ctx.lineTo(85, 85);
    ctx.lineTo(70, 120);
    ctx.lineTo(60, 120);
    ctx.fill();
    // Smirk
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(140, 145, 45, 0.1 * Math.PI, 0.5 * Math.PI, false);
    ctx.stroke();
  } else if (faceType === 'silly') {
    // Goofy winking / tongue out
    // Left eye open
    ctx.beginPath();
    ctx.arc(85, 95, 18, 0, Math.PI * 2);
    ctx.fill();
    // Right eye wink
    ctx.beginPath();
    ctx.moveTo(150, 95);
    ctx.lineTo(190, 95);
    ctx.stroke();
    // Mouth open
    ctx.beginPath();
    ctx.arc(128, 140, 45, 0, Math.PI, false);
    ctx.fill();
    // Tongue
    ctx.fillStyle = '#e53935';
    ctx.beginPath();
    ctx.arc(135, 160, 22, 0, Math.PI, false);
    ctx.fill();
  } else if (faceType === 'determined') {
    // Fierce / warrior
    ctx.beginPath();
    ctx.moveTo(65, 75);
    ctx.lineTo(110, 95);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(191, 75);
    ctx.lineTo(146, 95);
    ctx.stroke();
    // Eyes
    ctx.beginPath();
    ctx.arc(88, 105, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(168, 105, 12, 0, Math.PI * 2);
    ctx.fill();
    // Determined mouth
    ctx.beginPath();
    ctx.moveTo(85, 170);
    ctx.lineTo(171, 165);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  cachedFaces[faceType] = texture;
  return texture;
}
