export type PartShape = 'Block' | 'Ball' | 'Cylinder' | 'Wedge' | 'Mesh';

export type PartMaterial = 
  | 'Plastic'
  | 'SmoothPlastic'
  | 'Neon'
  | 'Wood'
  | 'WoodPlanks'
  | 'Metal'
  | 'CorrodedMetal'
  | 'DiamondPlate'
  | 'Foil'
  | 'Grass'
  | 'Brick'
  | 'Glass'
  | 'Ice';

export interface RobloxScript {
  id: string;
  name: string;
  code: string;
  enabled: boolean;
}

export interface RobloxPart {
  id: string;
  name: string;
  shape: PartShape;
  size: [number, number, number]; // width, height, depth in studs
  position: [number, number, number];
  rotation: [number, number, number]; // degrees or radians
  color: string; // hex color
  material: PartMaterial;
  transparency: number; // 0 to 1
  reflectance: number; // 0 to 1
  anchored: boolean;
  canCollide: boolean;
  isKillBrick?: boolean; // lava / danger part
  isBouncePad?: boolean; // trampoline / spring
  bounceForce?: number;
  isConveyor?: boolean;
  conveyorSpeed?: [number, number, number];
  isCheckpoint?: boolean;
  checkpointId?: number;
  isSpinning?: boolean;
  spinSpeed?: [number, number, number];
  isFadingPlatform?: boolean;
  script?: RobloxScript;
  meshUrl?: string;
  meshData?: string;
}

export interface RobloxModel {
  id: string;
  name: string;
  position: [number, number, number];
  parts: RobloxPart[];
}

export type CatalogItemType =
  | 'Hat'
  | 'Hair'
  | 'Face'
  | 'Back'
  | 'Shoulder'
  | 'Gear'
  | 'Shirt'
  | 'Pants';

export interface CatalogItem {
  id: number;
  name: string;
  creator: string;
  itemType: CatalogItemType;
  priceRobux: number;
  isClassic?: boolean;
  thumbnailUrl: string;
  description: string;
  modelType?: string;
  colorHex?: string;
  secondaryColorHex?: string;
  gearType?: 'weapon' | 'rocket' | 'coil' | 'speed_coil' | 'builder' | 'painter' | 'trowel';
  hasParticles?: boolean;
}

export interface PlayerAvatarConfig {
  name: string;
  displayName: string;
  headColor: string;
  torsoColor: string;
  leftArmColor: string;
  rightArmColor: string;
  leftLegColor: string;
  rightLegColor: string;
  hat: 'none' | 'fedora' | 'classic_hair' | 'valkyrie' | 'cap' | 'horns' | 'dominus';
  face: 'smile' | 'classic' | 'epic' | 'determined' | 'silly';
  backAccessory: 'none' | 'sword' | 'wings' | 'backpack';
  scale: number;
  equippedCatalogItems?: CatalogItem[];
  customFaceUrl?: string;
}

export interface ToolItem {
  id: string;
  name: string;
  icon: string;
  description: string;
  type: 'weapon' | 'rocket' | 'coil' | 'speed_coil' | 'builder' | 'painter' | 'trowel';
  action?: string;
}

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: number;
  isSystem?: boolean;
  channel?: 'all' | 'team';
}

export type GameMode = 'play' | 'studio';

export type StudioTool = 'select' | 'move' | 'scale' | 'rotate' | 'spawn';

export interface RobloxSettings {
  mouseSensitivity: number; // 0.1 to 2.0
  volume: number; // 0 to 100
  isMuted: boolean;
  shiftLockEnabled: boolean;
  graphicsQuality: number; // 1 to 10
  cameraMode: 'classic' | 'follow';
}

export interface PlayerInServer {
  id: string;
  name: string;
  displayName: string;
  avatarFace: string;
  headColor: string;
  ping: number;
  bloxbux: number;
  stage: number;
  isFriend: boolean;
}

export interface EmoteItem {
  id: string;
  name: string;
  command: string;
  icon: string;
}
