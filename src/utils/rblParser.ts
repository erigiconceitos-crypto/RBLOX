import { RobloxPart, PartShape, PartMaterial } from '../types/roblox';

/**
 * Standard Roblox BrickColors map to hex
 */
export const ROBLOX_BRICK_COLORS: Record<number, string> = {
  1: '#f2f3f3', // White
  21: '#c4281c', // Bright red
  23: '#0d69ac', // Bright blue
  24: '#f5cd30', // Bright yellow
  26: '#1b2a35', // Black
  28: '#28272a', // Dark stone grey
  37: '#4b974b', // Bright green
  102: '#6b5a45', // Medium stone grey
  106: '#da8541', // Bright orange
  194: '#a3a2a5', // Medium stone grey
  217: '#7c5c40', // Brown
  330: '#ff66cc', // Carnation pink
  1003: '#111111', // Really black
  1004: '#f8f8f8', // Really blue
};

/**
 * Parse Roblox XML format (.rbxm / .rbxlx / .rbl)
 */
export function parseRblXml(xmlText: string): RobloxPart[] {
  const parts: RobloxPart[] = [];
  
  // Use regex/string scanning to ensure it works in both Node.js (test runner) and Browser
  const itemMatches = xmlText.match(/<Item\s+class="Part"[\s\S]*?<\/Item>/gi) || [];
  
  for (let i = 0; i < itemMatches.length; i++) {
    const itemXml = itemMatches[i];
    
    // Extract Part Name
    const nameMatch = itemXml.match(/<string\s+name="Name">([\s\S]*?)<\/string>/i);
    const name = nameMatch ? nameMatch[1].trim() : `Part_${i + 1}`;
    
    // Extract Size (Vector3)
    let size: [number, number, number] = [4, 1.2, 2];
    const sizeMatch = itemXml.match(/<Vector3\s+name="size">[\s\S]*?<X>([\d.-]+)<\/X>[\s\S]*?<Y>([\d.-]+)<\/Y>[\s\S]*?<Z>([\d.-]+)<\/Z>[\s\S]*?<\/Vector3>/i);
    if (sizeMatch) {
      size = [
        parseFloat(sizeMatch[1]) || 4,
        parseFloat(sizeMatch[2]) || 1.2,
        parseFloat(sizeMatch[3]) || 2,
      ];
    }

    // Extract Position from CFrame CoordinateFrame
    let position: [number, number, number] = [0, size[1] / 2, 0];
    const cframeMatch = itemXml.match(/<CoordinateFrame\s+name="CFrame">[\s\S]*?<X>([\d.-]+)<\/X>[\s\S]*?<Y>([\d.-]+)<\/Y>[\s\S]*?<Z>([\d.-]+)<\/Z>[\s\S]*?<\/CoordinateFrame>/i);
    if (cframeMatch) {
      position = [
        parseFloat(cframeMatch[1]) || 0,
        parseFloat(cframeMatch[2]) || 0,
        parseFloat(cframeMatch[3]) || 0,
      ];
    }

    // Extract Color3 or BrickColor
    let color = '#a3a2a5';
    const color3Match = itemXml.match(/<Color3\s+name="Color">[\s\S]*?<R>([\d.-]+)<\/R>[\s\S]*?<G>([\d.-]+)<\/G>[\s\S]*?<B>([\d.-]+)<\/B>[\s\S]*?<\/Color3>/i);
    if (color3Match) {
      const r = Math.min(255, Math.max(0, Math.round(parseFloat(color3Match[1]) * 255)));
      const g = Math.min(255, Math.max(0, Math.round(parseFloat(color3Match[2]) * 255)));
      const b = Math.min(255, Math.max(0, Math.round(parseFloat(color3Match[3]) * 255)));
      color = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    } else {
      const brickColorMatch = itemXml.match(/<int\s+name="BrickColor">(\d+)<\/int>/i);
      if (brickColorMatch) {
        const id = parseInt(brickColorMatch[1], 10);
        if (ROBLOX_BRICK_COLORS[id]) color = ROBLOX_BRICK_COLORS[id];
      }
    }

    // Shape
    let shape: PartShape = 'Block';
    const shapeMatch = itemXml.match(/<token\s+name="shape">(\d+)<\/token>/i);
    if (shapeMatch) {
      const code = parseInt(shapeMatch[1], 10);
      if (code === 0) shape = 'Ball';
      else if (code === 2) shape = 'Cylinder';
    }

    // Anchored & CanCollide
    const anchoredMatch = itemXml.match(/<bool\s+name="Anchored">(true|false)<\/bool>/i);
    const anchored = anchoredMatch ? anchoredMatch[1].toLowerCase() === 'true' : true;

    const canCollideMatch = itemXml.match(/<bool\s+name="CanCollide">(true|false)<\/bool>/i);
    const canCollide = canCollideMatch ? canCollideMatch[1].toLowerCase() === 'true' : true;

    // Check special gameplay attributes (Lava / KillBrick, BouncePad)
    const isKillBrick = /lava|kill|danger|hazard/i.test(name) || (color.toLowerCase() === '#c4281c' && /neon/i.test(itemXml));
    const isBouncePad = /trampoline|bounce|spring/i.test(name);

    parts.push({
      id: `part_${Date.now()}_${i}_${Math.random().toString(36).substring(2, 6)}`,
      name,
      shape,
      size,
      position,
      rotation: [0, 0, 0],
      color,
      material: isKillBrick ? 'Neon' : 'Plastic',
      transparency: 0,
      reflectance: 0,
      anchored,
      canCollide,
      isKillBrick,
      isBouncePad,
      bounceForce: isBouncePad ? 35 : undefined,
    });
  }

  return parts;
}

/**
 * Parse JSON format (.rbl or custom exported model JSON)
 */
export function parseRblJson(jsonText: string): RobloxPart[] {
  try {
    const data = JSON.parse(jsonText);
    const rawParts: unknown[] = Array.isArray(data) 
      ? data 
      : (Array.isArray(data.parts) ? data.parts : [data]);

    return rawParts.map((p: any, idx: number): RobloxPart => {
      const shape: PartShape = ['Block', 'Ball', 'Cylinder', 'Wedge', 'Mesh'].includes(p.shape) ? p.shape : 'Block';
      const size: [number, number, number] = Array.isArray(p.size) && p.size.length >= 3
        ? [Number(p.size[0]) || 4, Number(p.size[1]) || 1.2, Number(p.size[2]) || 2]
        : [4, 1.2, 2];
      const position: [number, number, number] = Array.isArray(p.position) && p.position.length >= 3
        ? [Number(p.position[0]) || 0, Number(p.position[1]) || size[1] / 2, Number(p.position[2]) || 0]
        : [0, size[1] / 2, 0];
      const rotation: [number, number, number] = Array.isArray(p.rotation) && p.rotation.length >= 3
        ? [Number(p.rotation[0]) || 0, Number(p.rotation[1]) || 0, Number(p.rotation[2]) || 0]
        : [0, 0, 0];

      return {
        id: p.id || `part_${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 6)}`,
        name: p.name || `Part_${idx + 1}`,
        shape,
        size,
        position,
        rotation,
        color: typeof p.color === 'string' ? p.color : '#a3a2a5',
        material: p.material || 'Plastic',
        transparency: typeof p.transparency === 'number' ? p.transparency : 0,
        reflectance: typeof p.reflectance === 'number' ? p.reflectance : 0,
        anchored: p.anchored !== false,
        canCollide: p.canCollide !== false,
        isKillBrick: Boolean(p.isKillBrick),
        isBouncePad: Boolean(p.isBouncePad),
        bounceForce: p.bounceForce,
        isConveyor: Boolean(p.isConveyor),
        conveyorSpeed: p.conveyorSpeed,
        isCheckpoint: Boolean(p.isCheckpoint),
        checkpointId: p.checkpointId,
        meshData: p.meshData,
      };
    });
  } catch (err) {
    console.error('Failed to parse RBL JSON:', err);
    return [];
  }
}

/**
 * Parse OBJ 3D Model into a Roblox Part / MeshPart
 */
export function parseObjModel(objText: string, modelName = 'Imported_Mesh'): RobloxPart {
  // Compute basic bounding box from OBJ vertices
  const lines = objText.split('\n');
  let minX = Infinity, minY = Infinity, minZ = Infinity;
  let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
  let vertexCount = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('v ')) {
      const parts = trimmed.split(/\s+/).slice(1).map(Number);
      if (parts.length >= 3 && !isNaN(parts[0])) {
        vertexCount++;
        minX = Math.min(minX, parts[0]);
        minY = Math.min(minY, parts[1]);
        minZ = Math.min(minZ, parts[2]);
        maxX = Math.max(maxX, parts[0]);
        maxY = Math.max(maxY, parts[1]);
        maxZ = Math.max(maxZ, parts[2]);
      }
    }
  }

  const sx = vertexCount > 0 ? Math.max(1, Math.round((maxX - minX) * 10) / 10) : 4;
  const sy = vertexCount > 0 ? Math.max(1, Math.round((maxY - minY) * 10) / 10) : 4;
  const sz = vertexCount > 0 ? Math.max(1, Math.round((maxZ - minZ) * 10) / 10) : 4;

  return {
    id: `meshpart_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    name: modelName,
    shape: 'Mesh',
    size: [sx, sy, sz],
    position: [0, sy / 2, 0],
    rotation: [0, 0, 0],
    color: '#0d69ac',
    material: 'Plastic',
    transparency: 0,
    reflectance: 0.1,
    anchored: true,
    canCollide: true,
    meshData: objText,
  };
}

/**
 * Universal file importer for .rbl, .rbxm, .rbxlx, .json, .obj
 */
export function parseRblFile(content: string, fileName = 'Model.rbl'): { name: string; parts: RobloxPart[] } {
  const cleanName = fileName.replace(/\.[^/.]+$/, '');
  const trimmed = content.trim();

  // Check if OBJ
  if (fileName.toLowerCase().endsWith('.obj') || trimmed.startsWith('# Blender') || (trimmed.includes('v ') && trimmed.includes('f '))) {
    const part = parseObjModel(content, cleanName);
    return { name: cleanName, parts: [part] };
  }

  // Check if Roblox XML (<roblox> ... or <Item class=...)
  if (trimmed.startsWith('<roblox') || trimmed.includes('<Item class="Part"')) {
    const parts = parseRblXml(content);
    return { name: cleanName, parts };
  }

  // Check if JSON
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    const parts = parseRblJson(content);
    return { name: cleanName, parts };
  }

  return { name: cleanName, parts: [] };
}

/**
 * Export parts to classic Roblox XML format (.rbxm / .rbl)
 */
export function exportToRblXml(parts: RobloxPart[], modelName = 'RobloxModel'): string {
  let xml = `<roblox xmlns:xmime="http://www.w3.org/2005/05/xmlmime" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://www.roblox.com/roblox.xsd" version="4">\n`;
  xml += `  <Item class="Model" referent="RBX_ROOT">\n`;
  xml += `    <Properties>\n`;
  xml += `      <string name="Name">${escapeXml(modelName)}</string>\n`;
  xml += `    </Properties>\n`;

  parts.forEach((p, idx) => {
    // Convert hex to rgb 0..1
    let r = 0.6, g = 0.6, b = 0.6;
    if (p.color.startsWith('#')) {
      const hex = p.color.replace('#', '');
      if (hex.length === 6) {
        r = parseInt(hex.substring(0, 2), 16) / 255;
        g = parseInt(hex.substring(2, 4), 16) / 255;
        b = parseInt(hex.substring(4, 6), 16) / 255;
      }
    }

    const shapeCode = p.shape === 'Ball' ? 0 : p.shape === 'Cylinder' ? 2 : 1;

    xml += `    <Item class="Part" referent="RBX_PART_${idx}">\n`;
    xml += `      <Properties>\n`;
    xml += `        <string name="Name">${escapeXml(p.name)}</string>\n`;
    xml += `        <bool name="Anchored">${p.anchored}</bool>\n`;
    xml += `        <bool name="CanCollide">${p.canCollide}</bool>\n`;
    xml += `        <token name="shape">${shapeCode}</token>\n`;
    xml += `        <Color3 name="Color"><R>${r.toFixed(4)}</R><G>${g.toFixed(4)}</G><B>${b.toFixed(4)}</B></Color3>\n`;
    xml += `        <Vector3 name="size"><X>${p.size[0]}</X><Y>${p.size[1]}</Y><Z>${p.size[2]}</Z></Vector3>\n`;
    xml += `        <CoordinateFrame name="CFrame">\n`;
    xml += `          <X>${p.position[0]}</X><Y>${p.position[1]}</Y><Z>${p.position[2]}</Z>\n`;
    xml += `          <R00>1</R00><R01>0</R01><R02>0</R02><R10>0</R10><R11>1</R11><R12>0</R12><R20>0</R20><R21>0</R21><R22>1</R22>\n`;
    xml += `        </CoordinateFrame>\n`;
    xml += `      </Properties>\n`;
    xml += `    </Item>\n`;
  });

  xml += `  </Item>\n`;
  xml += `</roblox>\n`;
  return xml;
}

/**
 * Export parts to lightweight JSON format (.rbl)
 */
export function exportToRblJson(parts: RobloxPart[], modelName = 'RobloxModel'): string {
  return JSON.stringify({
    name: modelName,
    format: 'rbl-v1',
    createdAt: new Date().toISOString(),
    partsCount: parts.length,
    parts,
  }, null, 2);
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}
