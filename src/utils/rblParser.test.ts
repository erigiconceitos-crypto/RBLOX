import test from 'node:test';
import assert from 'node:assert/strict';
import { parseRblXml, parseRblJson, parseObjModel, parseRblFile, exportToRblXml, exportToRblJson } from './rblParser';
import { RobloxPart } from '../types/roblox';

test('parseRblJson parses valid JSON parts array', () => {
  const json = JSON.stringify({
    name: 'TestModel',
    parts: [
      {
        name: 'RedBlock',
        shape: 'Block',
        size: [4, 2, 6],
        position: [10, 1, -5],
        color: '#ff0000',
        material: 'Neon',
        anchored: true,
        canCollide: true,
      },
      {
        name: 'BlueSphere',
        shape: 'Ball',
        size: [3, 3, 3],
        position: [0, 3, 0],
        color: '#0000ff',
      }
    ]
  });

  const parts = parseRblJson(json);
  assert.equal(parts.length, 2);
  assert.equal(parts[0].name, 'RedBlock');
  assert.deepEqual(parts[0].size, [4, 2, 6]);
  assert.deepEqual(parts[0].position, [10, 1, -5]);
  assert.equal(parts[0].color, '#ff0000');
  assert.equal(parts[0].material, 'Neon');
  assert.equal(parts[1].shape, 'Ball');
});

test('parseRblXml parses Roblox XML .rbxm/.rbxl format', () => {
  const xml = `
    <roblox version="4">
      <Item class="Part" referent="RBX1">
        <Properties>
          <string name="Name">LavaHazard</string>
          <bool name="Anchored">true</bool>
          <bool name="CanCollide">true</bool>
          <Vector3 name="size"><X>6</X><Y>1</Y><Z>6</Z></Vector3>
          <CoordinateFrame name="CFrame"><X>0</X><Y>0.5</Y><Z>20</Z></CoordinateFrame>
          <Color3 name="Color"><R>0.8</R><G>0.1</G><B>0.1</B></Color3>
        </Properties>
      </Item>
    </roblox>
  `;

  const parts = parseRblXml(xml);
  assert.equal(parts.length, 1);
  assert.equal(parts[0].name, 'LavaHazard');
  assert.deepEqual(parts[0].size, [6, 1, 6]);
  assert.deepEqual(parts[0].position, [0, 0.5, 20]);
  assert.equal(parts[0].isKillBrick, true); // Detected lava/hazard
});

test('parseObjModel computes bounding dimensions from vertices', () => {
  const obj = `
# Sample Cube
v -2.0 -1.0 -2.0
v 2.0 1.0 2.0
f 1 2 1
  `;
  const part = parseObjModel(obj, 'MyCube');
  assert.equal(part.name, 'MyCube');
  assert.equal(part.shape, 'Mesh');
  assert.equal(part.size[0], 4);
  assert.equal(part.size[1], 2);
  assert.equal(part.size[2], 4);
});

test('exportToRblXml and parseRblXml round-trip preserves part attributes', () => {
  const testPart: RobloxPart = {
    id: 'p1',
    name: 'WallSegment',
    shape: 'Block',
    size: [8, 4, 1],
    position: [5, 2, -10],
    rotation: [0, 0, 0],
    color: '#0d69ac',
    material: 'Plastic',
    transparency: 0,
    reflectance: 0,
    anchored: true,
    canCollide: true,
  };

  const xml = exportToRblXml([testPart], 'Wall');
  assert.match(xml, /<roblox/);
  assert.match(xml, /WallSegment/);

  const parsed = parseRblXml(xml);
  assert.equal(parsed.length, 1);
  assert.equal(parsed[0].name, 'WallSegment');
  assert.deepEqual(parsed[0].size, [8, 4, 1]);
  assert.deepEqual(parsed[0].position, [5, 2, -10]);
});

test('parseRblFile auto-detects file type properly', () => {
  const jsonStr = JSON.stringify([{ name: 'TestPart', size: [2, 2, 2], position: [0, 1, 0] }]);
  const res = parseRblFile(jsonStr, 'sample.rbl');
  assert.equal(res.name, 'sample');
  assert.equal(res.parts.length, 1);
});
