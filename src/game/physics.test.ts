import test from 'node:test';
import assert from 'node:assert/strict';
import { updatePlayerPhysics, PlayerPhysicsState, getPartAABB, checkAABBOverlap } from './physics';
import { RobloxPart } from '../types/roblox';

const mockBaseplate: RobloxPart = {
  id: 'baseplate',
  name: 'Baseplate',
  shape: 'Block',
  size: [100, 2, 100],
  position: [0, -1, 0], // Top is at y = 0
  rotation: [0, 0, 0],
  color: '#3a8e3a',
  material: 'Plastic',
  transparency: 0,
  reflectance: 0,
  anchored: true,
  canCollide: true,
};

const mockKillBrick: RobloxPart = {
  id: 'lava',
  name: 'LavaPart',
  shape: 'Block',
  size: [8, 1, 8],
  position: [20, 0.5, 0],
  rotation: [0, 0, 0],
  color: '#ff0000',
  material: 'Neon',
  transparency: 0,
  reflectance: 0,
  anchored: true,
  canCollide: true,
  isKillBrick: true,
};

const mockBouncePad: RobloxPart = {
  id: 'trampoline',
  name: 'SuperSpring',
  shape: 'Block',
  size: [6, 1, 6],
  position: [0, 0.5, 30],
  rotation: [0, 0, 0],
  color: '#ffd700',
  material: 'Neon',
  transparency: 0,
  reflectance: 0,
  anchored: true,
  canCollide: true,
  isBouncePad: true,
  bounceForce: 45,
};

function createInitialState(): PlayerPhysicsState {
  return {
    x: 0,
    y: 0,
    z: 0,
    vx: 0,
    vy: 0,
    vz: 0,
    isGrounded: true,
    health: 100,
    maxHealth: 100,
    speed: 16,
    jumpPower: 28,
    checkpoint: [0, 0, 0],
  };
}

test('Player stands grounded on Baseplate', () => {
  const state = createInitialState();
  const input = { forward: 0, strafe: 0, jump: false, cameraYaw: 0 };
  const res = updatePlayerPhysics(state, input, [mockBaseplate], 0.016);

  assert.equal(res.state.isGrounded, true);
  assert.equal(res.state.y, 0); // resting on top of baseplate
  assert.equal(res.state.vy, 0);
});

test('Player jumps when grounded and applying jump key', () => {
  const state = createInitialState();
  const input = { forward: 0, strafe: 0, jump: true, cameraYaw: 0 };
  const res = updatePlayerPhysics(state, input, [mockBaseplate], 0.016);

  assert.equal(res.state.isGrounded, false);
  assert.equal(res.state.vy, 28);
  assert.ok(res.state.y > 0);
});

test('Touching KillBrick resets player and fires death event', () => {
  const state = createInitialState();
  state.x = 20; // exactly on the lava part
  state.y = 1;
  const input = { forward: 0, strafe: 0, jump: false, cameraYaw: 0 };
  const res = updatePlayerPhysics(state, input, [mockBaseplate, mockKillBrick], 0.016);

  assert.equal(res.events.died, true);
  assert.equal(res.events.tookDamage, true);
  // Respawned to checkpoint
  assert.equal(res.state.x, 0);
  assert.equal(res.state.y, 0);
  assert.equal(res.state.health, 100);
});

test('Landing on BouncePad launches player upward', () => {
  const state = createInitialState();
  state.x = 0;
  state.z = 30;
  state.y = 1.2; // falling down onto bounce pad (top is 1.0)
  state.vy = -10;
  state.isGrounded = false;

  const input = { forward: 0, strafe: 0, jump: false, cameraYaw: 0 };
  const res = updatePlayerPhysics(state, input, [mockBaseplate, mockBouncePad], 0.05);

  assert.equal(res.events.bounced, true);
  assert.equal(res.state.vy, 45); // bounceForce applied
});

test('Falling into void (y < -35) triggers respawn', () => {
  const state = createInitialState();
  state.y = -36;
  const input = { forward: 0, strafe: 0, jump: false, cameraYaw: 0 };
  const res = updatePlayerPhysics(state, input, [], 0.016);

  assert.equal(res.events.died, true);
  assert.equal(res.state.y, 0);
});
