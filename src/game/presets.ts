import { RobloxPart } from '../types/roblox';

/**
 * Generates the full starter Roblox world (Baseplate + Obby course + Houses + Spawns + Props)
 */
export function getInitialRobloxWorld(): RobloxPart[] {
  const parts: RobloxPart[] = [];

  // 1. Massive Classic Baseplate (200 x 4 x 200)
  parts.push({
    id: 'baseplate',
    name: 'Baseplate',
    shape: 'Block',
    size: [240, 4, 240],
    position: [0, -2, 0], // Top is at y = 0
    rotation: [0, 0, 0],
    color: '#3a8e3a', // classic Roblox green
    material: 'Plastic',
    transparency: 0,
    reflectance: 0.1,
    anchored: true,
    canCollide: true,
  });

  // 2. Spawn Location (Classic neutral spawn pad)
  parts.push({
    id: 'spawn_location',
    name: 'SpawnLocation',
    shape: 'Block',
    size: [6, 0.4, 6],
    position: [0, 0.2, 0],
    rotation: [0, 0, 0],
    color: '#a3a2a5',
    material: 'SmoothPlastic',
    transparency: 0,
    reflectance: 0.2,
    anchored: true,
    canCollide: true,
    isCheckpoint: true,
    checkpointId: 0,
  });

  // 3. Welcome Signpost
  parts.push({
    id: 'sign_post',
    name: 'SignPost',
    shape: 'Cylinder',
    size: [0.6, 6, 0.6],
    position: [-5, 3, 3],
    rotation: [0, 0, 0],
    color: '#7c5c40',
    material: 'Wood',
    transparency: 0,
    reflectance: 0,
    anchored: true,
    canCollide: true,
  });
  parts.push({
    id: 'sign_board',
    name: 'SignBoard',
    shape: 'Block',
    size: [4.5, 2.2, 0.4],
    position: [-5, 5.2, 3],
    rotation: [0, 0, 0],
    color: '#f5cd30',
    material: 'WoodPlanks',
    transparency: 0,
    reflectance: 0,
    anchored: true,
    canCollide: true,
  });

  // 4. CLASSIC OBBY OBSTACLE COURSE (North quadrant, Z: -20 to -110)
  // Stage 1: Jump Blocks
  const stage1Pads = [
    { x: 0, y: 1.5, z: -15, c: '#0d69ac' },
    { x: 0, y: 3.0, z: -25, c: '#0d69ac' },
    { x: -4, y: 4.5, z: -35, c: '#0d69ac' },
    { x: 4, y: 6.0, z: -45, c: '#0d69ac' },
    { x: 0, y: 7.5, z: -55, c: '#0d69ac' },
  ];
  stage1Pads.forEach((p, idx) => {
    parts.push({
      id: `obby_s1_${idx}`,
      name: `StepBlock_${idx + 1}`,
      shape: 'Block',
      size: [4, 1, 4],
      position: [p.x, p.y, p.z],
      rotation: [0, 0, 0],
      color: p.c,
      material: 'Plastic',
      transparency: 0,
      reflectance: 0.1,
      anchored: true,
      canCollide: true,
    });
  });

  // Checkpoint 1 Island
  parts.push({
    id: 'cp_1',
    name: 'Checkpoint_1',
    shape: 'Block',
    size: [10, 1.2, 10],
    position: [0, 8.0, -68],
    rotation: [0, 0, 0],
    color: '#00e676', // neon green checkpoint
    material: 'Neon',
    transparency: 0,
    reflectance: 0.2,
    anchored: true,
    canCollide: true,
    isCheckpoint: true,
    checkpointId: 1,
  });

  // Stage 2: Neon Red Lava Kill Bricks (Avoid the lava!)
  // Long walking bridge with lava bars across
  parts.push({
    id: 'lava_bridge',
    name: 'LavaBridge',
    shape: 'Block',
    size: [6, 1, 40],
    position: [0, 8.0, -95],
    rotation: [0, 0, 0],
    color: '#757575',
    material: 'Plastic',
    transparency: 0,
    reflectance: 0,
    anchored: true,
    canCollide: true,
  });

  const lavaZ = [-82, -89, -96, -103, -110];
  lavaZ.forEach((z, idx) => {
    parts.push({
      id: `lava_bar_${idx}`,
      name: `LavaKillBrick_${idx + 1}`,
      shape: 'Block',
      size: [5.8, 0.8, 1.2],
      position: [0, 8.8, z],
      rotation: [0, 0, 0],
      color: '#ff1744',
      material: 'Neon',
      transparency: 0,
      reflectance: 0.5,
      anchored: true,
      canCollide: true,
      isKillBrick: true, // Fatal on touch
    });
  });

  // Checkpoint 2 Island
  parts.push({
    id: 'cp_2',
    name: 'Checkpoint_2',
    shape: 'Block',
    size: [10, 1.2, 10],
    position: [0, 8.0, -122],
    rotation: [0, 0, 0],
    color: '#00e676',
    material: 'Neon',
    transparency: 0,
    reflectance: 0.2,
    anchored: true,
    canCollide: true,
    isCheckpoint: true,
    checkpointId: 2,
  });

  // Stage 3: Super Bounce Spring Trampoline
  parts.push({
    id: 'spring_trampoline',
    name: 'SuperSpringPad',
    shape: 'Cylinder',
    size: [7, 0.8, 7],
    position: [0, 8.4, -135],
    rotation: [0, 0, 0],
    color: '#ffd600',
    material: 'Neon',
    transparency: 0,
    reflectance: 0.4,
    anchored: true,
    canCollide: true,
    isBouncePad: true,
    bounceForce: 42, // Launches player to sky platform!
  });

  // Sky Victory Island (reached via trampoline)
  parts.push({
    id: 'victory_island',
    name: 'VictoryIsland',
    shape: 'Block',
    size: [14, 2, 14],
    position: [0, 32, -155],
    rotation: [0, 0, 0],
    color: '#ffd700',
    material: 'DiamondPlate',
    transparency: 0,
    reflectance: 0.7,
    anchored: true,
    canCollide: true,
    isCheckpoint: true,
    checkpointId: 3,
  });

  // Golden Trophy on Victory Island
  parts.push({
    id: 'trophy_pedestal',
    name: 'TrophyPedestal',
    shape: 'Cylinder',
    size: [3, 2, 3],
    position: [0, 34, -155],
    rotation: [0, 0, 0],
    color: '#333333',
    material: 'SmoothPlastic',
    transparency: 0,
    reflectance: 0.2,
    anchored: true,
    canCollide: true,
  });
  parts.push({
    id: 'trophy_cup',
    name: 'GoldenTrophy',
    shape: 'Ball',
    size: [2.5, 2.5, 2.5],
    position: [0, 36.5, -155],
    rotation: [0, 0, 0],
    color: '#ffc107',
    material: 'Neon',
    transparency: 0,
    reflectance: 0.9,
    anchored: true,
    canCollide: true,
  });

  // 5. CLASSIC ROBLOX HOUSE (South-East quadrant, X: 35, Z: 25)
  const houseParts = buildClassicHouseParts(35, 25);
  parts.push(...houseParts);

  // 6. SPEEDWAY / RACETRACK WITH VEHICLE (South-West quadrant, X: -35, Z: 25)
  const carParts = buildClassicCarParts(-35, 1.2, 25);
  parts.push(...carParts);

  // 7. SWORD IN THE STONE MONUMENT (East, X: 30, Z: -10)
  const swordPedestal = buildSwordMonumentParts(30, -10);
  parts.push(...swordPedestal);

  // 8. PINE TREES (Foliage around the baseplate)
  const treeCoords = [
    [-20, 10], [-25, -15], [15, 20], [25, 40], [-40, -40], [45, -30], [-15, 35]
  ];
  treeCoords.forEach(([tx, tz], i) => {
    parts.push(...buildTreeParts(tx, tz, `tree_${i}`));
  });

  return parts;
}

/**
 * Builds Classic Roblox Happy Home
 */
export function buildClassicHouseParts(baseX: number, baseZ: number, prefix = 'house'): RobloxPart[] {
  const parts: RobloxPart[] = [];

  // Floor
  parts.push({
    id: `${prefix}_floor`,
    name: 'HouseFloor',
    shape: 'Block',
    size: [20, 0.8, 16],
    position: [baseX, 0.4, baseZ],
    rotation: [0, 0, 0],
    color: '#7c5c40',
    material: 'WoodPlanks',
    transparency: 0,
    reflectance: 0,
    anchored: true,
    canCollide: true,
  });

  // Back Wall
  parts.push({
    id: `${prefix}_wall_back`,
    name: 'WallBack',
    shape: 'Block',
    size: [20, 8, 1],
    position: [baseX, 4.8, baseZ - 7.5],
    rotation: [0, 0, 0],
    color: '#c4281c', // red brick
    material: 'Brick',
    transparency: 0,
    reflectance: 0,
    anchored: true,
    canCollide: true,
  });

  // Left Wall with Window
  parts.push({
    id: `${prefix}_wall_left`,
    name: 'WallLeft',
    shape: 'Block',
    size: [1, 8, 16],
    position: [baseX - 9.5, 4.8, baseZ],
    rotation: [0, 0, 0],
    color: '#c4281c',
    material: 'Brick',
    transparency: 0,
    reflectance: 0,
    anchored: true,
    canCollide: true,
  });

  // Right Wall
  parts.push({
    id: `${prefix}_wall_right`,
    name: 'WallRight',
    shape: 'Block',
    size: [1, 8, 16],
    position: [baseX + 9.5, 4.8, baseZ],
    rotation: [0, 0, 0],
    color: '#c4281c',
    material: 'Brick',
    transparency: 0,
    reflectance: 0,
    anchored: true,
    canCollide: true,
  });

  // Front Wall (Doorway opening)
  parts.push({
    id: `${prefix}_wall_front_l`,
    name: 'WallFrontLeft',
    shape: 'Block',
    size: [7.5, 8, 1],
    position: [baseX - 5.75, 4.8, baseZ + 7.5],
    rotation: [0, 0, 0],
    color: '#c4281c',
    material: 'Brick',
    transparency: 0,
    reflectance: 0,
    anchored: true,
    canCollide: true,
  });
  parts.push({
    id: `${prefix}_wall_front_r`,
    name: 'WallFrontRight',
    shape: 'Block',
    size: [7.5, 8, 1],
    position: [baseX + 5.75, 4.8, baseZ + 7.5],
    rotation: [0, 0, 0],
    color: '#c4281c',
    material: 'Brick',
    transparency: 0,
    reflectance: 0,
    anchored: true,
    canCollide: true,
  });
  parts.push({
    id: `${prefix}_wall_front_top`,
    name: 'DoorwayHeader',
    shape: 'Block',
    size: [5, 2.5, 1],
    position: [baseX, 7.55, baseZ + 7.5],
    rotation: [0, 0, 0],
    color: '#c4281c',
    material: 'Brick',
    transparency: 0,
    reflectance: 0,
    anchored: true,
    canCollide: true,
  });

  // Roof (Steep gable roof)
  parts.push({
    id: `${prefix}_roof_slab`,
    name: 'RoofSlab',
    shape: 'Block',
    size: [22, 1, 18],
    position: [baseX, 9.3, baseZ],
    rotation: [0, 0, 0],
    color: '#424242',
    material: 'Wood',
    transparency: 0,
    reflectance: 0.1,
    anchored: true,
    canCollide: true,
  });

  // Chimney
  parts.push({
    id: `${prefix}_chimney`,
    name: 'Chimney',
    shape: 'Block',
    size: [2.5, 6, 2.5],
    position: [baseX + 6, 12, baseZ - 4],
    rotation: [0, 0, 0],
    color: '#8d6e63',
    material: 'Brick',
    transparency: 0,
    reflectance: 0,
    anchored: true,
    canCollide: true,
  });

  // Interior Sofa (Classic Roblox blue couch)
  parts.push({
    id: `${prefix}_couch_seat`,
    name: 'CouchSeat',
    shape: 'Block',
    size: [6, 1.2, 2.4],
    position: [baseX, 1.4, baseZ - 4],
    rotation: [0, 0, 0],
    color: '#0d69ac',
    material: 'Plastic',
    transparency: 0,
    reflectance: 0.1,
    anchored: true,
    canCollide: true,
  });
  parts.push({
    id: `${prefix}_couch_back`,
    name: 'CouchBack',
    shape: 'Block',
    size: [6, 2.4, 0.8],
    position: [baseX, 2.6, baseZ - 5.2],
    rotation: [0, 0, 0],
    color: '#0d69ac',
    material: 'Plastic',
    transparency: 0,
    reflectance: 0.1,
    anchored: true,
    canCollide: true,
  });

  return parts;
}

/**
 * Builds Classic Red Roblox Racecar
 */
export function buildClassicCarParts(x: number, y: number, z: number, prefix = 'car'): RobloxPart[] {
  const parts: RobloxPart[] = [];

  // Main chassis body
  parts.push({
    id: `${prefix}_chassis`,
    name: 'CarChassis',
    shape: 'Block',
    size: [5, 1.2, 9],
    position: [x, y + 0.6, z],
    rotation: [0, 0, 0],
    color: '#d32f2f', // red
    material: 'SmoothPlastic',
    transparency: 0,
    reflectance: 0.3,
    anchored: true,
    canCollide: true,
  });

  // Hood / Engine
  parts.push({
    id: `${prefix}_hood`,
    name: 'CarHood',
    shape: 'Block',
    size: [4.6, 0.8, 3.5],
    position: [x, y + 1.4, z - 2.5],
    rotation: [0, 0, 0],
    color: '#b71c1c',
    material: 'SmoothPlastic',
    transparency: 0,
    reflectance: 0.4,
    anchored: true,
    canCollide: true,
  });

  // Windshield (Translucent blue/glass)
  parts.push({
    id: `${prefix}_windshield`,
    name: 'Windshield',
    shape: 'Block',
    size: [4.4, 1.4, 0.4],
    position: [x, y + 2.0, z - 0.7],
    rotation: [0.3, 0, 0],
    color: '#81d4fa',
    material: 'Glass',
    transparency: 0.5,
    reflectance: 0.6,
    anchored: true,
    canCollide: true,
  });

  // Rear Spoiler
  parts.push({
    id: `${prefix}_spoiler`,
    name: 'Spoiler',
    shape: 'Block',
    size: [5.2, 0.3, 1.2],
    position: [x, y + 2.4, z + 3.8],
    rotation: [0, 0, 0],
    color: '#212121',
    material: 'Metal',
    transparency: 0,
    reflectance: 0.5,
    anchored: true,
    canCollide: true,
  });

  // 4 Wheels
  const wheelOffsets = [
    [-2.6, y + 0.3, -2.5],
    [2.6, y + 0.3, -2.5],
    [-2.6, y + 0.3, 2.5],
    [2.6, y + 0.3, 2.5],
  ];

  wheelOffsets.forEach(([wx, wy, wz], idx) => {
    parts.push({
      id: `${prefix}_wheel_${idx}`,
      name: `Wheel_${idx + 1}`,
      shape: 'Cylinder',
      size: [1.8, 0.8, 1.8],
      position: [x + wx, wy, z + wz],
      rotation: [0, 0, Math.PI / 2],
      color: '#111111',
      material: 'Plastic',
      transparency: 0,
      reflectance: 0.1,
      anchored: true,
      canCollide: true,
    });
  });

  return parts;
}

/**
 * Builds Sword in Stone monument
 */
export function buildSwordMonumentParts(x: number, z: number, prefix = 'sword_monument'): RobloxPart[] {
  const parts: RobloxPart[] = [];

  // Stone Pedestal
  parts.push({
    id: `${prefix}_stone`,
    name: 'PedestalStone',
    shape: 'Block',
    size: [6, 2.5, 6],
    position: [x, 1.25, z],
    rotation: [0, 0.1, 0],
    color: '#616161',
    material: 'Brick',
    transparency: 0,
    reflectance: 0.05,
    anchored: true,
    canCollide: true,
  });

  // Rune Glow Circle
  parts.push({
    id: `${prefix}_rune`,
    name: 'RuneCircle',
    shape: 'Cylinder',
    size: [5, 0.2, 5],
    position: [x, 2.6, z],
    rotation: [0, 0, 0],
    color: '#00e5ff',
    material: 'Neon',
    transparency: 0.2,
    reflectance: 0.8,
    anchored: true,
    canCollide: true,
  });

  // Sword Blade sticking out of rock
  parts.push({
    id: `${prefix}_blade`,
    name: 'MythicBlade',
    shape: 'Block',
    size: [0.35, 4.5, 0.12],
    position: [x, 4.6, z],
    rotation: [0, 0, 0],
    color: '#e0f7fa',
    material: 'Metal',
    transparency: 0,
    reflectance: 0.95,
    anchored: true,
    canCollide: true,
  });

  // Crossguard
  parts.push({
    id: `${prefix}_guard`,
    name: 'SwordGuard',
    shape: 'Block',
    size: [1.4, 0.25, 0.25],
    position: [x, 6.7, z],
    rotation: [0, 0, 0],
    color: '#ffd700',
    material: 'Metal',
    transparency: 0,
    reflectance: 0.9,
    anchored: true,
    canCollide: true,
  });

  // Sword Grip
  parts.push({
    id: `${prefix}_grip`,
    name: 'SwordGrip',
    shape: 'Cylinder',
    size: [0.18, 1.0, 0.18],
    position: [x, 7.3, z],
    rotation: [0, 0, 0],
    color: '#3e2723',
    material: 'Wood',
    transparency: 0,
    reflectance: 0.1,
    anchored: true,
    canCollide: true,
  });

  return parts;
}

/**
 * Builds blocky procedural Pine Tree
 */
export function buildTreeParts(x: number, z: number, prefix: string): RobloxPart[] {
  return [
    {
      id: `${prefix}_trunk`,
      name: 'TreeTrunk',
      shape: 'Cylinder',
      size: [1.2, 6, 1.2],
      position: [x, 3, z],
      rotation: [0, 0, 0],
      color: '#5d4037',
      material: 'Wood',
      transparency: 0,
      reflectance: 0,
      anchored: true,
      canCollide: true,
    },
    {
      id: `${prefix}_leaves_1`,
      name: 'LeavesBottom',
      shape: 'Block',
      size: [5, 2.2, 5],
      position: [x, 6, z],
      rotation: [0, 0.2, 0],
      color: '#2e7d32',
      material: 'Grass',
      transparency: 0,
      reflectance: 0,
      anchored: true,
      canCollide: true,
    },
    {
      id: `${prefix}_leaves_2`,
      name: 'LeavesTop',
      shape: 'Block',
      size: [3.2, 2.5, 3.2],
      position: [x, 8, z],
      rotation: [0, -0.3, 0],
      color: '#388e3c',
      material: 'Grass',
      transparency: 0,
      reflectance: 0,
      anchored: true,
      canCollide: true,
    },
  ];
}

/**
 * Built-in Preset Models library that users can import into their game with 1 click!
 */
export const PRESET_ROBLOX_MODELS = [
  {
    id: 'preset_happy_home',
    name: 'Classic Happy Home',
    category: 'Buildings',
    description: 'Iconic classic Roblox house with red brick walls, chimney, and blue sofa',
    partsCount: 10,
    generate: (x: number, z: number) => buildClassicHouseParts(x, z, `model_home_${Date.now()}`),
  },
  {
    id: 'preset_racecar',
    name: 'Red Sports Racer',
    category: 'Vehicles',
    description: 'Speedy classic Roblox red racer with wheels, spoiler, and tinted windshield',
    partsCount: 8,
    generate: (x: number, z: number) => buildClassicCarParts(x, 0.8, z, `model_car_${Date.now()}`),
  },
  {
    id: 'preset_sword_monument',
    name: 'Sword in the Stone',
    category: 'Monuments',
    description: 'Ancient mythic blade stuck inside a glowing rune pedestal',
    partsCount: 5,
    generate: (x: number, z: number) => buildSwordMonumentParts(x, z, `model_sword_${Date.now()}`),
  },
  {
    id: 'preset_super_spring',
    name: 'Super Spring Pad',
    category: 'Obby / Gameplay',
    description: 'Neon bounce trampoline that shoots players 45 studs into the air',
    partsCount: 2,
    generate: (x: number, z: number): RobloxPart[] => [
      {
        id: `spring_base_${Date.now()}`,
        name: 'SpringBase',
        shape: 'Cylinder',
        size: [6, 0.4, 6],
        position: [x, 0.2, z],
        rotation: [0, 0, 0],
        color: '#212121',
        material: 'Metal',
        transparency: 0,
        reflectance: 0.2,
        anchored: true,
        canCollide: true,
      },
      {
        id: `spring_pad_${Date.now()}`,
        name: 'SpringPad',
        shape: 'Cylinder',
        size: [5.2, 0.8, 5.2],
        position: [x, 0.8, z],
        rotation: [0, 0, 0],
        color: '#ffd600',
        material: 'Neon',
        transparency: 0,
        reflectance: 0.8,
        anchored: true,
        canCollide: true,
        isBouncePad: true,
        bounceForce: 45,
      },
    ],
  },
  {
    id: 'preset_lava_strip',
    name: 'Lava Hazard Strip',
    category: 'Obby / Gameplay',
    description: 'Glowing red lethal killbrick strip for obstacle courses',
    partsCount: 1,
    generate: (x: number, z: number): RobloxPart[] => [
      {
        id: `lava_strip_${Date.now()}`,
        name: 'LavaHazard',
        shape: 'Block',
        size: [12, 0.8, 4],
        position: [x, 0.4, z],
        rotation: [0, 0, 0],
        color: '#ff1744',
        material: 'Neon',
        transparency: 0,
        reflectance: 0.5,
        anchored: true,
        canCollide: true,
        isKillBrick: true,
      },
    ],
  },
  {
    id: 'preset_pine_grove',
    name: 'Pine Tree Grove',
    category: 'Nature',
    description: 'Trio of blocky pine trees for scenic nature and forests',
    partsCount: 9,
    generate: (x: number, z: number): RobloxPart[] => [
      ...buildTreeParts(x - 4, z - 3, `grove_1_${Date.now()}`),
      ...buildTreeParts(x + 4, z, `grove_2_${Date.now()}`),
      ...buildTreeParts(x, z + 5, `grove_3_${Date.now()}`),
    ],
  },
];
