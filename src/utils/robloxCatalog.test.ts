import test from 'node:test';
import assert from 'node:assert/strict';
import {
  extractCatalogAssetId,
  resolveCatalogItem,
  equipCatalogItem,
  unequipCatalogItem,
  OFFICIAL_ROBLOX_CATALOG,
} from './robloxCatalog';
import { PlayerAvatarConfig } from '../types/roblox';

test('extractCatalogAssetId correctly parses raw numeric IDs and # prefixed IDs', () => {
  assert.equal(extractCatalogAssetId('1365551'), 1365551);
  assert.equal(extractCatalogAssetId('#21070012'), 21070012);
  assert.equal(extractCatalogAssetId('  1029025  '), 1029025);
});

test('extractCatalogAssetId parses full roblox.com catalog and library URLs', () => {
  assert.equal(
    extractCatalogAssetId('https://www.roblox.com/catalog/1365551/Valkyrie-Helm'),
    1365551
  );
  assert.equal(
    extractCatalogAssetId('https://web.roblox.com/catalog/21070012/Dominus-Empyreus'),
    21070012
  );
  assert.equal(
    extractCatalogAssetId('roblox.com/library/1073659/TopHat'),
    1073659
  );
});

test('extractCatalogAssetId parses chat command prefix :item or /item', () => {
  assert.equal(extractCatalogAssetId(':item 1365551'), 1365551);
  assert.equal(extractCatalogAssetId('/item 11884330'), 11884330);
});

test('extractCatalogAssetId returns null for invalid inputs', () => {
  assert.equal(extractCatalogAssetId(''), null);
  assert.equal(extractCatalogAssetId('abc'), null);
  assert.equal(extractCatalogAssetId('https://google.com'), null);
});

test('resolveCatalogItem returns curated item for famous IDs and fallback for custom IDs', () => {
  const valkyrie = resolveCatalogItem(1365551);
  assert.equal(valkyrie.name, 'Valkyrie Helm');
  assert.equal(valkyrie.itemType, 'Hat');

  const custom = resolveCatalogItem(999999999);
  assert.equal(custom.id, 999999999);
  assert.ok(custom.thumbnailUrl.includes('999999999'));
});

test('equipCatalogItem equips hats and creates gear tools for Hotbar', () => {
  const baseConfig: PlayerAvatarConfig = {
    name: 'Player',
    displayName: 'Player',
    headColor: '#f5cd30',
    torsoColor: '#0d69ac',
    leftArmColor: '#f5cd30',
    rightArmColor: '#f5cd30',
    leftLegColor: '#4b974b',
    rightLegColor: '#4b974b',
    hat: 'none',
    face: 'smile',
    backAccessory: 'none',
    scale: 1,
  };

  const valkyrie = resolveCatalogItem(1365551);
  const { newConfig: equippedHatConfig, newTool: hatTool } = equipCatalogItem(baseConfig, valkyrie);
  assert.equal(equippedHatConfig.hat, 'valkyrie');
  assert.equal(hatTool, undefined);
  assert.equal(equippedHatConfig.equippedCatalogItems?.length, 1);

  // Equip Gear (Illumina Sword)
  const illumina = resolveCatalogItem(11884330);
  const { newConfig: equippedGearConfig, newTool: gearTool } = equipCatalogItem(equippedHatConfig, illumina);
  assert.ok(gearTool);
  assert.equal(gearTool?.name, 'Illumina');
  assert.equal(gearTool?.type, 'weapon');
  assert.equal(equippedGearConfig.equippedCatalogItems?.length, 2);

  // Unequip item
  const unequippedConfig = unequipCatalogItem(equippedGearConfig, 1365551);
  assert.equal(unequippedConfig.equippedCatalogItems?.length, 1);
  assert.equal(unequippedConfig.equippedCatalogItems?.[0].id, 11884330);
});
