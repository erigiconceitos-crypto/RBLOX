import * as THREE from 'three';
import { PlayerAvatarConfig } from '../types/roblox';
import { getRobloxFaceTexture } from '../utils/studTexture';

export interface R6CharacterInstance {
  root: THREE.Group;
  head: THREE.Mesh;
  torso: THREE.Mesh;
  leftArm: THREE.Group;
  rightArm: THREE.Group;
  leftLeg: THREE.Group;
  rightLeg: THREE.Group;
  hatGroup: THREE.Group;
  backGroup: THREE.Group;
  toolHolder: THREE.Group;
  nameBillboard: THREE.Sprite;
  chatBubble: THREE.Sprite;
  currentEmote: string | null;
  emoteTimer: number;
}

/**
 * Creates a classic Roblox R6 blocky character
 */
export function createR6Character(config: PlayerAvatarConfig): R6CharacterInstance {
  const root = new THREE.Group();
  root.name = 'R6Player';

  // Common materials
  const createPlasticMat = (color: string) => {
    return new THREE.MeshStandardMaterial({
      color,
      roughness: 0.4,
      metalness: 0.1,
    });
  };

  // 1. Torso (2 x 2 x 1)
  const torsoGeo = new THREE.BoxGeometry(2, 2, 1);
  const torsoMat = createPlasticMat(config.torsoColor);
  const torso = new THREE.Mesh(torsoGeo, torsoMat);
  torso.position.set(0, 3, 0);
  torso.castShadow = true;
  torso.receiveShadow = true;
  root.add(torso);

  // 2. Head (1.25 x 1.25 x 1.25)
  const headGeo = new THREE.BoxGeometry(1.25, 1.25, 1.25);
  const faceTexture = getRobloxFaceTexture(config.face);
  
  // Materials for 6 faces: +X, -X, +Y, -Y, +Z (Front), -Z
  const skinMat = createPlasticMat(config.headColor);
  const faceMat = new THREE.MeshStandardMaterial({
    map: faceTexture,
    color: config.headColor,
    roughness: 0.4,
    metalness: 0.1,
  });

  const headMaterials = [skinMat, skinMat, skinMat, skinMat, faceMat, skinMat];
  const head = new THREE.Mesh(headGeo, headMaterials);
  head.position.set(0, 1.6, 0); // on top of torso
  head.castShadow = true;
  torso.add(head);

  // 3. Left Arm (1 x 2 x 1) pivoted at shoulder
  const leftArmGroup = new THREE.Group();
  leftArmGroup.position.set(-1.5, 0.9, 0);
  const armGeo = new THREE.BoxGeometry(1, 2, 1);
  armGeo.translate(0, -0.9, 0); // move pivot to top of arm
  const leftArmMesh = new THREE.Mesh(armGeo, createPlasticMat(config.leftArmColor));
  leftArmMesh.castShadow = true;
  leftArmGroup.add(leftArmMesh);
  torso.add(leftArmGroup);

  // 4. Right Arm (1 x 2 x 1) pivoted at shoulder
  const rightArmGroup = new THREE.Group();
  rightArmGroup.position.set(1.5, 0.9, 0);
  const rightArmMesh = new THREE.Mesh(armGeo, createPlasticMat(config.rightArmColor));
  rightArmMesh.castShadow = true;
  rightArmGroup.add(rightArmMesh);
  torso.add(rightArmGroup);

  // Tool holder at hand position (bottom of right arm)
  const toolHolder = new THREE.Group();
  toolHolder.position.set(0, -1.8, 0.5);
  rightArmGroup.add(toolHolder);

  // 5. Left Leg (1 x 2 x 1) pivoted at hip
  const leftLegGroup = new THREE.Group();
  leftLegGroup.position.set(-0.5, -1.0, 0);
  const legGeo = new THREE.BoxGeometry(1, 2, 1);
  legGeo.translate(0, -1.0, 0); // move pivot to top of leg
  const leftLegMesh = new THREE.Mesh(legGeo, createPlasticMat(config.leftLegColor));
  leftLegMesh.castShadow = true;
  leftLegGroup.add(leftLegMesh);
  torso.add(leftLegGroup);

  // 6. Right Leg (1 x 2 x 1) pivoted at hip
  const rightLegGroup = new THREE.Group();
  rightLegGroup.position.set(0.5, -1.0, 0);
  const rightLegMesh = new THREE.Mesh(legGeo, createPlasticMat(config.rightLegColor));
  rightLegMesh.castShadow = true;
  rightLegGroup.add(rightLegMesh);
  torso.add(rightLegGroup);

  // 7. Hats & Accessories
  const hatGroup = new THREE.Group();
  hatGroup.position.set(0, 0.7, 0);
  head.add(hatGroup);
  buildHat(hatGroup, config.hat, config.equippedCatalogItems);

  // 8. Back Accessories
  const backGroup = new THREE.Group();
  backGroup.position.set(0, 0, -0.55);
  torso.add(backGroup);
  buildBackAccessory(backGroup, config.backAccessory, config.equippedCatalogItems);

  // 9. Name Billboard & Chat Bubble
  const nameBillboard = createNameBillboard(config.name);
  nameBillboard.position.set(0, 3.4, 0);
  torso.add(nameBillboard);

  const chatBubble = createChatBubbleSprite('');
  chatBubble.position.set(0, 4.4, 0);
  chatBubble.visible = false;
  torso.add(chatBubble);

  return {
    root,
    head,
    torso,
    leftArm: leftArmGroup,
    rightArm: rightArmGroup,
    leftLeg: leftLegGroup,
    rightLeg: rightLegGroup,
    hatGroup,
    backGroup,
    toolHolder,
    nameBillboard,
    chatBubble,
    currentEmote: null,
    emoteTimer: 0,
  };
}

/**
 * Builds hats (Fedora, Classic Hair, Valkyrie Helmet, Cap, Horns, Dominus, Top Hat, Crown, Shades)
 */
function buildHat(parent: THREE.Group, hatType: string, catalogItems?: any[]) {
  while (parent.children.length > 0) {
    parent.remove(parent.children[0]);
  }

  // Check if any specific catalog hat is equipped
  const catalogHat = catalogItems?.find((it) => it.itemType === 'Hat' || it.itemType === 'Hair');
  const activeType = catalogHat?.modelType || hatType;
  const primColor = catalogHat?.colorHex || '#222222';
  const secColor = catalogHat?.secondaryColorHex || '#f5cd30';

  if (activeType === 'fedora') {
    // Fedora hat: wide brim + crown + band
    const brimGeo = new THREE.CylinderGeometry(1.2, 1.25, 0.08, 16);
    const darkMat = new THREE.MeshStandardMaterial({ color: primColor, roughness: 0.8 });
    const brim = new THREE.Mesh(brimGeo, darkMat);
    parent.add(brim);

    const crownGeo = new THREE.CylinderGeometry(0.7, 0.75, 0.6, 16);
    const crown = new THREE.Mesh(crownGeo, darkMat);
    crown.position.set(0, 0.3, 0);
    parent.add(crown);

    const bandGeo = new THREE.CylinderGeometry(0.76, 0.76, 0.12, 16);
    const redMat = new THREE.MeshStandardMaterial({ color: secColor, roughness: 0.5 });
    const band = new THREE.Mesh(bandGeo, redMat);
    band.position.set(0, 0.12, 0);
    parent.add(band);
  } else if (activeType === 'tophat') {
    // Top Hat: tall cylinder with silk ribbon
    const darkMat = new THREE.MeshStandardMaterial({ color: primColor, roughness: 0.5 });
    const brim = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.05, 0.08, 16), darkMat);
    parent.add(brim);

    const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 1.1, 16), darkMat);
    crown.position.set(0, 0.55, 0);
    parent.add(crown);

    const ribbon = new THREE.Mesh(new THREE.CylinderGeometry(0.67, 0.67, 0.15, 16), new THREE.MeshStandardMaterial({ color: secColor }));
    ribbon.position.set(0, 0.15, 0);
    parent.add(ribbon);
  } else if (activeType === 'dominus') {
    // Dominus Hood: draped hood with hollow face opening and glowing eyes
    const hoodMat = new THREE.MeshStandardMaterial({ color: primColor, roughness: 0.7 });
    const hood = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.4, 1.4), hoodMat);
    hood.position.set(0, 0.2, -0.05);
    parent.add(hood);

    // Glowing twin eyes
    const eyeMat = new THREE.MeshStandardMaterial({
      color: secColor,
      emissive: secColor,
      emissiveIntensity: 1.5,
      roughness: 0.1,
    });
    [-1, 1].forEach((dir) => {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), eyeMat);
      eye.position.set(dir * 0.25, 0.2, 0.62);
      parent.add(eye);
    });

    // Buckle rings
    const ringMat = new THREE.MeshStandardMaterial({ color: '#f5cd30', metalness: 0.9 });
    [-1, 1].forEach((dir) => {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.04, 8, 16), ringMat);
      ring.position.set(dir * 0.45, -0.4, 0.5);
      ring.rotation.y = dir * 0.2;
      parent.add(ring);
    });
  } else if (activeType === 'crown') {
    // Wanwood Crown
    const goldMat = new THREE.MeshStandardMaterial({ color: secColor, metalness: 0.9, roughness: 0.2 });
    const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.8, 0.2, 16), goldMat);
    parent.add(ring);

    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI * 2) / 6;
      const spike = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.5, 8), goldMat);
      spike.position.set(Math.cos(angle) * 0.75, 0.35, Math.sin(angle) * 0.75);
      parent.add(spike);
    }
  } else if (activeType === 'shades') {
    // Clockwork's Shades
    const frameMat = new THREE.MeshStandardMaterial({ color: secColor, metalness: 0.8 });
    const lensMat = new THREE.MeshStandardMaterial({ color: '#111111', roughness: 0.1 });

    [-1, 1].forEach((dir) => {
      const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.08, 16), frameMat);
      rim.rotation.x = Math.PI / 2;
      rim.position.set(dir * 0.32, -0.1, 0.68);
      parent.add(rim);

      const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.09, 16), lensMat);
      lens.rotation.x = Math.PI / 2;
      lens.position.set(dir * 0.32, -0.1, 0.68);
      parent.add(lens);
    });

    const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.05, 0.05), frameMat);
    bridge.position.set(0, -0.1, 0.68);
    parent.add(bridge);
  } else if (activeType === 'classic_hair' || activeType === 'shaggy') {
    // Classic Hair
    const hairMat = new THREE.MeshStandardMaterial({ color: primColor || '#f5cd30', roughness: 0.7 });
    const topHair = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.35, 1.35), hairMat);
    topHair.position.set(0, 0.1, 0);
    parent.add(topHair);

    const frontBangs = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.5, 0.3), hairMat);
    frontBangs.position.set(0, -0.15, 0.6);
    parent.add(frontBangs);

    const sideL = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.6, 1.2), hairMat);
    sideL.position.set(-0.65, -0.2, 0);
    parent.add(sideL);

    const sideR = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.6, 1.2), hairMat);
    sideR.position.set(0.65, -0.2, 0);
    parent.add(sideR);
  } else if (activeType === 'valkyrie') {
    // Valkyrie Helm
    const helmMat = new THREE.MeshStandardMaterial({ color: primColor || '#e0e0e0', metalness: 0.8, roughness: 0.2 });
    const goldMat = new THREE.MeshStandardMaterial({ color: secColor || '#f5cd30', metalness: 0.9, roughness: 0.15 });

    const circlet = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.85, 0.3, 16), goldMat);
    parent.add(circlet);

    // Left and Right Wing
    [-1, 1].forEach((dir) => {
      const wingGeo = new THREE.BoxGeometry(0.1, 1.0, 0.6);
      const wing = new THREE.Mesh(wingGeo, helmMat);
      wing.position.set(dir * 0.9, 0.5, -0.1);
      wing.rotation.z = dir * -0.25;
      parent.add(wing);
    });
  } else if (activeType === 'cap') {
    // Baseball Cap
    const capMat = new THREE.MeshStandardMaterial({ color: primColor || '#0d69ac', roughness: 0.6 });
    const dome = new THREE.Mesh(new THREE.SphereGeometry(0.75, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), capMat);
    parent.add(dome);

    const visor = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.08, 0.7), capMat);
    visor.position.set(0, 0.05, 0.85);
    visor.rotation.x = 0.1;
    parent.add(visor);
  } else if (activeType === 'horns') {
    // Neon Horns
    const hornMat = new THREE.MeshStandardMaterial({ color: '#ff0055', emissive: '#ff0055', emissiveIntensity: 0.6 });
    [-1, 1].forEach((dir) => {
      const horn = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.8, 8), hornMat);
      horn.position.set(dir * 0.5, 0.4, 0.3);
      horn.rotation.z = dir * -0.35;
      horn.rotation.x = -0.2;
      parent.add(horn);
    });
  }
}

/**
 * Builds Back Accessories (Sword, Wings, Backpack, Swordpack)
 */
function buildBackAccessory(parent: THREE.Group, accType: string, catalogItems?: any[]) {
  while (parent.children.length > 0) {
    parent.remove(parent.children[0]);
  }

  const catalogBack = catalogItems?.find((it) => it.itemType === 'Back');
  const activeType = catalogBack?.modelType || accType;
  const primColor = catalogBack?.colorHex || '#ffffff';
  const secColor = catalogBack?.secondaryColorHex || '#f5cd30';

  if (activeType === 'sword' || activeType === 'swordpack') {
    const swordGroup = new THREE.Group();
    swordGroup.rotation.z = Math.PI / 4;

    const bladeGeo = new THREE.BoxGeometry(0.2, 2.8, 0.08);
    const bladeMat = new THREE.MeshStandardMaterial({ color: secColor || '#d0d8e0', metalness: 0.9, roughness: 0.2 });
    const blade = new THREE.Mesh(bladeGeo, bladeMat);
    blade.position.set(0, 0.5, 0);
    swordGroup.add(blade);

    const guardGeo = new THREE.BoxGeometry(0.8, 0.15, 0.15);
    const goldMat = new THREE.MeshStandardMaterial({ color: '#f5cd30', metalness: 0.8, roughness: 0.3 });
    const guard = new THREE.Mesh(guardGeo, goldMat);
    guard.position.set(0, -0.9, 0);
    swordGroup.add(guard);

    const gripGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.6, 8);
    const gripMat = new THREE.MeshStandardMaterial({ color: '#4a2c11' });
    const grip = new THREE.Mesh(gripGeo, gripMat);
    grip.position.set(0, -1.25, 0);
    swordGroup.add(grip);

    parent.add(swordGroup);

    // If dual swordpack, add secondary blade crossing
    if (activeType === 'swordpack') {
      const sword2 = swordGroup.clone();
      sword2.rotation.z = -Math.PI / 4;
      parent.add(sword2);
    }
  } else if (activeType === 'wings') {
    [-1, 1].forEach((dir) => {
      const wingGroup = new THREE.Group();
      wingGroup.position.set(dir * 0.4, 0.5, 0);
      wingGroup.rotation.y = dir * 0.3;

      const wingMat = new THREE.MeshStandardMaterial({ color: primColor, roughness: 0.3 });
      for (let f = 0; f < 3; f++) {
        const feather = new THREE.Mesh(new THREE.BoxGeometry(1.2 - f * 0.2, 0.3, 0.06), wingMat);
        feather.position.set(dir * (0.8 + f * 0.3), f * 0.35, 0);
        feather.rotation.z = dir * (0.3 + f * 0.15);
        wingGroup.add(feather);
      }
      parent.add(wingGroup);
    });
  } else if (activeType === 'backpack') {
    const packMat = new THREE.MeshStandardMaterial({ color: '#9c27b0', roughness: 0.7 });
    const pack = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.6, 0.6), packMat);
    parent.add(pack);

    const pocket = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.7, 0.3), new THREE.MeshStandardMaterial({ color: '#7b1fa2' }));
    pocket.position.set(0, -0.3, -0.35);
    parent.add(pocket);
  }
}

/**
 * Creates 3D tool models for the hand (Sword, Gravity Coil, Slingshot, Hammer, Paintbrush)
 */
export function buildHeldTool(toolHolder: THREE.Group, toolType: string) {
  while (toolHolder.children.length > 0) {
    toolHolder.remove(toolHolder.children[0]);
  }

  if (toolType === 'weapon') {
    // Classic Roblox Sword in hand
    const sword = new THREE.Group();
    sword.rotation.x = Math.PI / 2; // point forward

    const blade = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 2.5, 0.08),
      new THREE.MeshStandardMaterial({ color: '#dbeafe', metalness: 0.95, roughness: 0.15 })
    );
    blade.position.set(0, 1.2, 0);
    sword.add(blade);

    const guard = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 0.14, 0.14),
      new THREE.MeshStandardMaterial({ color: '#f5cd30', metalness: 0.8, roughness: 0.2 })
    );
    guard.position.set(0, 0, 0);
    sword.add(guard);

    const grip = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.6, 8),
      new THREE.MeshStandardMaterial({ color: '#333333' })
    );
    grip.position.set(0, -0.35, 0);
    sword.add(grip);

    toolHolder.add(sword);
  } else if (toolType === 'coil') {
    // Gravity Coil / Speed Coil
    const coil = new THREE.Group();
    const coilMat = new THREE.MeshStandardMaterial({
      color: '#00e5ff',
      emissive: '#00b0ff',
      emissiveIntensity: 0.5,
      roughness: 0.2,
      metalness: 0.5,
    });

    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 1.4, 12), coilMat);
    body.rotation.z = Math.PI / 4;
    coil.add(body);
    toolHolder.add(coil);
  } else if (toolType === 'builder') {
    // Build Tool Hammer
    const hammer = new THREE.Group();
    hammer.rotation.x = Math.PI / 2;

    const handle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 1.4, 8),
      new THREE.MeshStandardMaterial({ color: '#8d6e63' })
    );
    handle.position.set(0, 0.5, 0);
    hammer.add(handle);

    const head = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 0.35, 0.35),
      new THREE.MeshStandardMaterial({ color: '#455a64', metalness: 0.8 })
    );
    head.position.set(0, 1.1, 0);
    hammer.add(head);

    toolHolder.add(hammer);
  } else if (toolType === 'painter') {
    // Paint tool bucket / brush
    const brush = new THREE.Group();
    brush.rotation.x = Math.PI / 2;

    const handle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.06, 1.2, 8),
      new THREE.MeshStandardMaterial({ color: '#d7ccc8' })
    );
    handle.position.set(0, 0.4, 0);
    brush.add(handle);

    const tip = new THREE.Mesh(
      new THREE.ConeGeometry(0.18, 0.5, 8),
      new THREE.MeshStandardMaterial({ color: '#e91e63' })
    );
    tip.position.set(0, 1.05, 0);
    brush.add(tip);

    toolHolder.add(brush);
  } else if (toolType === 'rocket') {
    // Rocket Launcher tube
    const rLauncher = new THREE.Group();
    rLauncher.rotation.x = Math.PI / 2;

    const tube = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.2, 2.2, 16),
      new THREE.MeshStandardMaterial({ color: '#27272a', metalness: 0.8 })
    );
    tube.position.set(0, 0.5, 0);
    rLauncher.add(tube);

    const muzzle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.25, 0.22, 0.3, 16),
      new THREE.MeshStandardMaterial({ color: '#dc2626' })
    );
    muzzle.position.set(0, 1.6, 0);
    rLauncher.add(muzzle);

    toolHolder.add(rLauncher);
  } else if (toolType === 'speed_coil') {
    // Red Speed Coil
    const coil = new THREE.Group();
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(0.3, 0.3, 1.4, 12),
      new THREE.MeshStandardMaterial({
        color: '#ff1744',
        emissive: '#d50000',
        emissiveIntensity: 0.6,
        roughness: 0.2,
      })
    );
    body.rotation.z = Math.PI / 4;
    coil.add(body);
    toolHolder.add(coil);
  } else if (toolType === 'trowel') {
    // Bricklayer Trowel
    const trowel = new THREE.Group();
    trowel.rotation.x = Math.PI / 2;
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.9, 8), new THREE.MeshStandardMaterial({ color: '#795548' }));
    trowel.add(handle);
    const blade = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.7, 0.04), new THREE.MeshStandardMaterial({ color: '#cfd8dc', metalness: 0.9 }));
    blade.position.set(0, 0.6, 0);
    trowel.add(blade);
    toolHolder.add(trowel);
  }
}

/**
 * Creates 3D text name tag sprite above avatar's head
 */
function createNameBillboard(name: string): THREE.Sprite {
  const canvas = document.createElement('canvas');
  canvas.width = 384;
  canvas.height = 96;
  const ctx = canvas.getContext('2d')!;

  // Background rounded pill
  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
  ctx.beginPath();
  ctx.roundRect(16, 12, 352, 72, 36);
  ctx.fill();

  // Name text
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 36px "Segoe UI", system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(name, 192, 48);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(3.5, 0.88, 1);
  return sprite;
}

/**
 * Creates speech chat bubble sprite
 */
export function createChatBubbleSprite(text: string): THREE.Sprite {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 144;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (text) {
    // Speech bubble background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.beginPath();
    ctx.roundRect(16, 12, 480, 96, 24);
    ctx.fill();

    // Bubble pointer down
    ctx.beginPath();
    ctx.moveTo(236, 108);
    ctx.lineTo(256, 132);
    ctx.lineTo(276, 108);
    ctx.closePath();
    ctx.fill();

    // Bubble border
    ctx.strokeStyle = '#cccccc';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Message text
    ctx.fillStyle = '#111111';
    ctx.font = 'bold 32px "Segoe UI", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const displayMsg = text.length > 28 ? text.slice(0, 26) + '...' : text;
    ctx.fillText(displayMsg, 256, 60);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(4.5, 1.25, 1);
  return sprite;
}

/**
 * Updates speech bubble text dynamically
 */
export function updateChatBubble(sprite: THREE.Sprite, text: string) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 144;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (text) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.beginPath();
    ctx.roundRect(16, 12, 480, 96, 24);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(236, 108);
    ctx.lineTo(256, 132);
    ctx.lineTo(276, 108);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#111111';
    ctx.font = 'bold 32px "Segoe UI", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const displayMsg = text.length > 28 ? text.slice(0, 26) + '...' : text;
    ctx.fillText(displayMsg, 256, 60);

    sprite.visible = true;
  } else {
    sprite.visible = false;
  }

  sprite.material.map?.dispose();
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  sprite.material.map = texture;
  sprite.material.needsUpdate = true;
}

/**
 * Animates the R6 character based on movement and state
 */
export function animateR6Character(
  char: R6CharacterInstance,
  isMoving: boolean,
  isGrounded: boolean,
  hasToolEquipped: boolean,
  time: number,
  delta: number
) {
  // Check active emote
  if (char.currentEmote) {
    char.emoteTimer += delta;
    if (isMoving) {
      // Cancel emote if player walks
      char.currentEmote = null;
    } else {
      applyEmoteAnimation(char, char.currentEmote, char.emoteTimer);
      return;
    }
  }

  if (!isGrounded) {
    // Jump pose: arms up, legs back
    char.leftArm.rotation.x = THREE.MathUtils.lerp(char.leftArm.rotation.x, -Math.PI * 0.7, 0.2);
    char.leftArm.rotation.z = THREE.MathUtils.lerp(char.leftArm.rotation.z, -0.3, 0.2);

    char.rightArm.rotation.x = THREE.MathUtils.lerp(
      char.rightArm.rotation.x,
      hasToolEquipped ? -Math.PI * 0.4 : -Math.PI * 0.7,
      0.2
    );
    char.rightArm.rotation.z = THREE.MathUtils.lerp(char.rightArm.rotation.z, 0.3, 0.2);

    char.leftLeg.rotation.x = THREE.MathUtils.lerp(char.leftLeg.rotation.x, 0.5, 0.2);
    char.rightLeg.rotation.x = THREE.MathUtils.lerp(char.rightLeg.rotation.x, 0.3, 0.2);
  } else if (isMoving) {
    // Classic Roblox walk cycle: stiff limb swing
    const walkSpeed = 12;
    const swingAngle = Math.sin(time * walkSpeed) * 0.75;

    char.leftLeg.rotation.x = swingAngle;
    char.rightLeg.rotation.x = -swingAngle;
    char.leftLeg.rotation.z = 0;
    char.rightLeg.rotation.z = 0;

    char.leftArm.rotation.x = -swingAngle;
    char.leftArm.rotation.z = 0;

    if (hasToolEquipped) {
      // Right arm holds tool out
      char.rightArm.rotation.x = -Math.PI * 0.45 + Math.sin(time * 6) * 0.1;
      char.rightArm.rotation.z = 0;
    } else {
      char.rightArm.rotation.x = swingAngle;
      char.rightArm.rotation.z = 0;
    }

    char.head.rotation.y = Math.sin(time * (walkSpeed / 2)) * 0.08;
  } else {
    // Idle pose: slight breathing
    const breath = Math.sin(time * 2.5) * 0.04;
    char.leftLeg.rotation.x = THREE.MathUtils.lerp(char.leftLeg.rotation.x, 0, 0.15);
    char.rightLeg.rotation.x = THREE.MathUtils.lerp(char.rightLeg.rotation.x, 0, 0.15);
    char.leftLeg.rotation.z = 0;
    char.rightLeg.rotation.z = 0;

    char.leftArm.rotation.x = THREE.MathUtils.lerp(char.leftArm.rotation.x, 0, 0.15);
    char.leftArm.rotation.z = breath;

    if (hasToolEquipped) {
      char.rightArm.rotation.x = THREE.MathUtils.lerp(char.rightArm.rotation.x, -Math.PI * 0.45, 0.15);
      char.rightArm.rotation.z = 0;
    } else {
      char.rightArm.rotation.x = THREE.MathUtils.lerp(char.rightArm.rotation.x, 0, 0.15);
      char.rightArm.rotation.z = -breath;
    }

    char.head.rotation.y = THREE.MathUtils.lerp(char.head.rotation.y, 0, 0.1);
  }
}

function applyEmoteAnimation(char: R6CharacterInstance, emote: string, timer: number) {
  if (emote === 'dance') {
    // Classic Roblox /e dance
    const dTime = timer * 6;
    char.torso.rotation.y = Math.sin(dTime) * 0.4;
    char.leftArm.rotation.x = Math.sin(dTime) * 0.8;
    char.rightArm.rotation.x = -Math.sin(dTime) * 0.8;
    char.leftArm.rotation.z = -0.5 + Math.cos(dTime) * 0.3;
    char.rightArm.rotation.z = 0.5 - Math.cos(dTime) * 0.3;
    char.leftLeg.rotation.x = -Math.sin(dTime) * 0.3;
    char.rightLeg.rotation.x = Math.sin(dTime) * 0.3;
  } else if (emote === 'wave') {
    // /e wave
    char.rightArm.rotation.x = -Math.PI * 0.8;
    char.rightArm.rotation.z = 0.3 + Math.sin(timer * 10) * 0.4;
    char.leftArm.rotation.x = 0;
    char.leftArm.rotation.z = 0;
  } else if (emote === 'cheer') {
    // /e cheer
    char.leftArm.rotation.x = -Math.PI * 0.85;
    char.rightArm.rotation.x = -Math.PI * 0.85;
    char.leftArm.rotation.z = -0.4 + Math.sin(timer * 8) * 0.2;
    char.rightArm.rotation.z = 0.4 - Math.sin(timer * 8) * 0.2;
  }
}
