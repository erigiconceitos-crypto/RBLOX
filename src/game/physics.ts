import { RobloxPart } from '../types/roblox';

export interface BoundingBox3D {
  minX: number;
  minY: number;
  minZ: number;
  maxX: number;
  maxY: number;
  maxZ: number;
}

export interface PlayerPhysicsState {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  isGrounded: boolean;
  health: number;
  maxHealth: number;
  speed: number;
  jumpPower: number;
  checkpoint: [number, number, number];
}

export const GRAVITY = 55; // studs / s^2 (Roblox gravity feel is ~196 studs/s^2, scaled nicely for web loop)
export const DEFAULT_SPEED = 16; // studs / s (classic Roblox 16 studs/s WalkSpeed)
export const SPRINT_SPEED = 28;
export const DEFAULT_JUMP_POWER = 28; // JumpPower 50 in Roblox

export function getPartAABB(part: RobloxPart): BoundingBox3D {
  const [px, py, pz] = part.position;
  const [sx, sy, sz] = part.size;
  return {
    minX: px - sx / 2,
    maxX: px + sx / 2,
    minY: py - sy / 2,
    maxY: py + sy / 2,
    minZ: pz - sz / 2,
    maxZ: pz + sz / 2,
  };
}

export function checkAABBOverlap(a: BoundingBox3D, b: BoundingBox3D): boolean {
  return (
    a.minX < b.maxX &&
    a.maxX > b.minX &&
    a.minY < b.maxY &&
    a.maxY > b.minY &&
    a.minZ < b.maxZ &&
    a.maxZ > b.minZ
  );
}

export interface PhysicsStepResult {
  state: PlayerPhysicsState;
  events: {
    tookDamage: boolean;
    died: boolean;
    bounced: boolean;
    reachedCheckpoint: boolean;
    checkpointId?: number;
  };
}

/**
 * Updates player physics for a fixed or delta time frame
 */
export function updatePlayerPhysics(
  state: PlayerPhysicsState,
  input: { forward: number; strafe: number; jump: boolean; sprint?: boolean; cameraYaw: number },
  parts: RobloxPart[],
  dt: number
): PhysicsStepResult {
  const events = {
    tookDamage: false,
    died: false,
    bounced: false,
    reachedCheckpoint: false,
    checkpointId: undefined as number | undefined,
  };

  // Clone state
  const next: PlayerPhysicsState = { ...state };
  const currentSpeed = input.sprint ? SPRINT_SPEED : next.speed;

  // Calculate movement direction relative to camera angle
  let moveX = 0;
  let moveZ = 0;
  if (input.forward !== 0 || input.strafe !== 0) {
    const angle = input.cameraYaw;
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);

    // Forward is along -cos, -sin
    const forwardX = -sin * input.forward;
    const forwardZ = -cos * input.forward;

    // Strafe is perpendicular (right is cos, -sin)
    const strafeX = cos * input.strafe;
    const strafeZ = -sin * input.strafe;

    const rawX = forwardX + strafeX;
    const rawZ = forwardZ + strafeZ;
    const len = Math.hypot(rawX, rawZ);
    if (len > 0.001) {
      moveX = (rawX / len) * currentSpeed;
      moveZ = (rawZ / len) * currentSpeed;
    }
  }

  // Smooth horizontal velocity
  next.vx = moveX;
  next.vz = moveZ;

  // Vertical physics (gravity and jump)
  if (input.jump && next.isGrounded) {
    next.vy = next.jumpPower;
    next.isGrounded = false;
  } else if (!next.isGrounded) {
    next.vy -= GRAVITY * dt;
  }

  // Proposed new position
  const targetX = next.x + next.vx * dt;
  const targetY = next.y + next.vy * dt;
  const targetZ = next.z + next.vz * dt;

  // Character bounding box dimensions (2 wide, 5 tall, 1 deep)
  const charHalfW = 0.9;
  const charHalfD = 0.9;
  const charH = 5.0;

  // 1. Check vertical movement & ground landing
  let groundY = -999;
  let standingOnPart: RobloxPart | null = null;
  let hitCeiling = false;

  for (const part of parts) {
    if (!part.canCollide && !part.isKillBrick && !part.isCheckpoint) continue;
    const aabb = getPartAABB(part);

    // Horizontal overlap check with player column
    const horizOverlap =
      next.x + charHalfW > aabb.minX &&
      next.x - charHalfW < aabb.maxX &&
      next.z + charHalfD > aabb.minZ &&
      next.z - charHalfD < aabb.maxZ;

    if (horizOverlap) {
      // Check if landing on top of part
      const feetY = next.y;
      const prevFeetY = state.y;
      const landingTolerance = Math.max(0.4, Math.abs(next.vy * dt) + 0.1);

      if (
        (targetY <= aabb.maxY + landingTolerance && prevFeetY >= aabb.maxY - 0.2 && next.vy <= 0) ||
        (targetY <= aabb.maxY && prevFeetY >= aabb.maxY)
      ) {
        if (aabb.maxY > groundY) {
          groundY = aabb.maxY;
          standingOnPart = part;
        }
      }

      // Check ceiling collision
      if (next.vy > 0 && next.y + charH >= aabb.minY && state.y + charH <= aabb.minY + 0.5) {
        hitCeiling = true;
        next.y = aabb.minY - charH;
        next.vy = 0;
      }

      // Check if touching killbrick or checkpoint (with slight epsilon padding)
      const playerBox: BoundingBox3D = {
        minX: targetX - charHalfW,
        maxX: targetX + charHalfW,
        minY: targetY - 0.1, // Include contact with surface beneath feet
        maxY: targetY + charH,
        minZ: targetZ - charHalfD,
        maxZ: targetZ + charHalfD,
      };

      if (checkAABBOverlap(playerBox, aabb)) {
        if (part.isKillBrick) {
          events.tookDamage = true;
          events.died = true;
          next.health = 0;
        } else if (part.isCheckpoint && part.checkpointId !== undefined) {
          if (next.checkpoint[0] !== part.position[0] || next.checkpoint[2] !== part.position[2]) {
            next.checkpoint = [part.position[0], part.position[1] + part.size[1] / 2 + 0.5, part.position[2]];
            events.reachedCheckpoint = true;
            events.checkpointId = part.checkpointId;
          }
        }
      }
    }
  }

  // Update Y position
  if (standingOnPart && groundY > -900 && targetY <= groundY) {
    next.y = groundY;
    next.vy = 0;
    next.isGrounded = true;

    // Check bounce pad
    if (standingOnPart.isBouncePad) {
      next.vy = standingOnPart.bounceForce || 40;
      next.isGrounded = false;
      events.bounced = true;
    }

    // Check conveyor belt
    if (standingOnPart.isConveyor && standingOnPart.conveyorSpeed) {
      next.x += standingOnPart.conveyorSpeed[0] * dt;
      next.z += standingOnPart.conveyorSpeed[2] * dt;
    }
  } else if (!hitCeiling) {
    next.y = targetY;
    next.isGrounded = false;
  }

  // 2. Horizontal movement & wall sliding
  // Test X
  let canMoveX = true;
  const testBoxX: BoundingBox3D = {
    minX: targetX - charHalfW,
    maxX: targetX + charHalfW,
    minY: next.y + 0.2, // slightly above feet so step-ups don't catch small seams
    maxY: next.y + charH - 0.2,
    minZ: next.z - charHalfD,
    maxZ: next.z + charHalfD,
  };

  for (const part of parts) {
    if (!part.canCollide) continue;
    const aabb = getPartAABB(part);
    if (checkAABBOverlap(testBoxX, aabb)) {
      canMoveX = false;
      break;
    }
  }
  if (canMoveX) {
    next.x = targetX;
  }

  // Test Z
  let canMoveZ = true;
  const testBoxZ: BoundingBox3D = {
    minX: next.x - charHalfW,
    maxX: next.x + charHalfW,
    minY: next.y + 0.2,
    maxY: next.y + charH - 0.2,
    minZ: targetZ - charHalfD,
    maxZ: targetZ + charHalfD,
  };

  for (const part of parts) {
    if (!part.canCollide) continue;
    const aabb = getPartAABB(part);
    if (checkAABBOverlap(testBoxZ, aabb)) {
      canMoveZ = false;
      break;
    }
  }
  if (canMoveZ) {
    next.z = targetZ;
  }

  // Check void death (falling off world)
  if (next.y < -35) {
    events.died = true;
    events.tookDamage = true;
    next.health = 0;
  }

  // Respawn if dead
  if (next.health <= 0) {
    next.health = next.maxHealth;
    next.x = next.checkpoint[0];
    next.y = next.checkpoint[1];
    next.z = next.checkpoint[2];
    next.vx = 0;
    next.vy = 0;
    next.vz = 0;
    next.isGrounded = true;
  }

  return { state: next, events };
}
