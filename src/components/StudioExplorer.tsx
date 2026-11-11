import React, { useState } from 'react';
import { RobloxPart, PartShape, PartMaterial, StudioTool } from '../types/roblox';
import { ROBLOX_BRICK_COLORS } from '../utils/rblParser';
import { robloxAudio } from '../utils/audio';
import {
  Layers,
  Settings2,
  Trash2,
  Copy,
  Plus,
  Box,
  Eye,
  ChevronRight,
  ChevronDown,
  Minimize2,
  Maximize2
} from 'lucide-react';

interface StudioExplorerProps {
  parts: RobloxPart[];
  selectedPartId: string | null;
  onSelectPart: (id: string | null) => void;
  onUpdatePart: (part: RobloxPart) => void;
  onAddPart: (part: RobloxPart) => void;
  onDeletePart: (id: string) => void;
  onDuplicatePart: (part: RobloxPart) => void;
  activeTool: StudioTool;
  onChangeActiveTool: (tool: StudioTool) => void;
}

export const StudioExplorer: React.FC<StudioExplorerProps> = ({
  parts,
  selectedPartId,
  onSelectPart,
  onUpdatePart,
  onAddPart,
  onDeletePart,
  onDuplicatePart,
  activeTool,
  onChangeActiveTool,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [workspaceOpen, setWorkspaceOpen] = useState(true);

  const selectedPart = parts.find((p) => p.id === selectedPartId);

  const filteredParts = parts.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInsert = (shape: PartShape, special?: 'lava' | 'bounce') => {
    const isKill = special === 'lava';
    const isBounce = special === 'bounce';

    const newPart: RobloxPart = {
      id: `part_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: isKill ? 'LavaBrick' : isBounce ? 'BouncePad' : `${shape}Part`,
      shape,
      size: shape === 'Ball' ? [3, 3, 3] : [4, 1.2, 4],
      position: [0, 2, 0],
      rotation: [0, 0, 0],
      color: isKill ? '#ff1744' : isBounce ? '#ffd600' : '#0d69ac',
      material: isKill || isBounce ? 'Neon' : 'Plastic',
      transparency: 0,
      reflectance: 0.1,
      anchored: true,
      canCollide: true,
      isKillBrick: isKill,
      isBouncePad: isBounce,
      bounceForce: isBounce ? 40 : undefined,
    };

    onAddPart(newPart);
    onSelectPart(newPart.id);
    robloxAudio.playClick();
  };

  const handleDuplicate = () => {
    if (selectedPart) {
      onDuplicatePart(selectedPart);
      robloxAudio.playClick();
    }
  };

  const handleDelete = () => {
    if (selectedPartId) {
      onDeletePart(selectedPartId);
      robloxAudio.playClick();
    }
  };

  return (
    <div className="absolute top-14 right-3 z-20 flex flex-col items-end pointer-events-auto select-none">
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-label={isCollapsed ? 'Expandir Studio' : 'Minimizar Studio'}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-300 text-xs font-semibold shadow-lg mb-2 cursor-pointer"
      >
        {isCollapsed ? (
          <>
            <Maximize2 className="w-3.5 h-3.5 text-blue-400" />
            <span>Painel Studio</span>
          </>
        ) : (
          <>
            <Minimize2 className="w-3.5 h-3.5 text-zinc-400" />
            <span>Ocultar Painel</span>
          </>
        )}
      </button>

      {!isCollapsed && (
        <div className="w-72 sm:w-80 max-h-[82vh] rounded-xl bg-zinc-950/90 backdrop-blur-md border border-zinc-800 shadow-2xl overflow-hidden flex flex-col text-xs">
          {/* Quick Insert Bar */}
          <div className="p-2.5 bg-zinc-900/80 border-b border-zinc-800 flex items-center justify-between gap-1 overflow-x-auto">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mr-1">
              Inserir:
            </span>
            <button
              onClick={() => handleInsert('Block')}
              className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium cursor-pointer"
              title="Inserir Bloco"
            >
              Bloco
            </button>
            <button
              onClick={() => handleInsert('Ball')}
              className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium cursor-pointer"
              title="Inserir Esfera"
            >
              Esfera
            </button>
            <button
              onClick={() => handleInsert('Cylinder')}
              className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium cursor-pointer"
              title="Inserir Cilindro"
            >
              Cilindro
            </button>
            <button
              onClick={() => handleInsert('Wedge')}
              className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium cursor-pointer"
              title="Inserir Rampa Wedge"
            >
              Rampa
            </button>
            <button
              onClick={() => handleInsert('Block', 'bounce')}
              className="px-2 py-1 rounded bg-amber-600/80 hover:bg-amber-500 text-white font-medium cursor-pointer"
              title="Inserir Trampolim"
            >
              Mola
            </button>
            <button
              onClick={() => handleInsert('Block', 'lava')}
              className="px-2 py-1 rounded bg-red-600/80 hover:bg-red-500 text-white font-medium cursor-pointer"
              title="Inserir Lava KillBrick"
            >
              Lava
            </button>
          </div>

          {/* Action Toolbar */}
          <div className="px-2.5 py-1.5 bg-zinc-900/50 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-1">
              {(['select', 'move', 'scale', 'rotate'] as StudioTool[]).map((tool) => (
                <button
                  key={tool}
                  onClick={() => onChangeActiveTool(tool)}
                  className={`px-2 py-0.5 rounded capitalize text-[11px] font-semibold transition-colors cursor-pointer ${
                    activeTool === tool
                      ? 'bg-blue-600 text-white'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {tool === 'select' ? 'Selecionar' : tool === 'move' ? 'Mover' : tool === 'scale' ? 'Escala' : 'Girar'}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleDuplicate}
                disabled={!selectedPart}
                className="p-1 rounded text-zinc-400 hover:text-white disabled:opacity-30 cursor-pointer"
                title="Duplicar Parte (Ctrl+D)"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleDelete}
                disabled={!selectedPart}
                className="p-1 rounded text-zinc-400 hover:text-red-400 disabled:opacity-30 cursor-pointer"
                title="Deletar Parte"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Explorer Tree Section */}
          <div className="h-44 border-b border-zinc-800 flex flex-col">
            <div className="p-1.5 bg-zinc-950/80 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-zinc-300">
                <Layers className="w-3.5 h-3.5 text-blue-400" />
                <span>Explorer (Hierarquia)</span>
              </div>
              <input
                type="text"
                placeholder="Buscar parte..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-28 bg-zinc-900 border border-zinc-700 rounded px-1.5 py-0.5 text-[10px] text-white focus:outline-none"
              />
            </div>

            <div className="flex-1 overflow-y-auto p-1 font-mono text-[11px] space-y-0.5">
              {/* Workspace root node */}
              <div
                onClick={() => setWorkspaceOpen(!workspaceOpen)}
                className="flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-zinc-800 text-zinc-300 cursor-pointer"
              >
                {workspaceOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                <span className="font-semibold text-blue-300">Workspace</span>
                <span className="text-[10px] text-zinc-500">({parts.length})</span>
              </div>

              {workspaceOpen && (
                <div className="pl-4 space-y-0.5">
                  {filteredParts.map((part) => {
                    const isSelected = part.id === selectedPartId;
                    return (
                      <div
                        key={part.id}
                        onClick={() => onSelectPart(part.id)}
                        className={`flex items-center justify-between px-1.5 py-0.5 rounded cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600 text-white font-semibold'
                            : 'text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-200'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          <Box className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{part.name}</span>
                        </div>
                        {part.isKillBrick && (
                          <span className="text-[9px] px-1 rounded bg-red-900/60 text-red-300">
                            Lava
                          </span>
                        )}
                        {part.isBouncePad && (
                          <span className="text-[9px] px-1 rounded bg-amber-900/60 text-amber-300">
                            Mola
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Properties Inspector Section */}
          <div className="flex-1 overflow-y-auto p-3 bg-zinc-950/60">
            <div className="flex items-center gap-1.5 font-bold text-zinc-300 mb-2">
              <Settings2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Propriedades {selectedPart ? `(${selectedPart.name})` : ''}</span>
            </div>

            {selectedPart ? (
              <div className="space-y-2.5 text-[11px]">
                {/* Name */}
                <div>
                  <label className="text-zinc-400 block mb-0.5">Nome:</label>
                  <input
                    type="text"
                    value={selectedPart.name}
                    onChange={(e) => onUpdatePart({ ...selectedPart, name: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-white"
                  />
                </div>

                {/* Color Palette Swatches */}
                <div>
                  <label className="text-zinc-400 block mb-1">BrickColor (Cor):</label>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {Object.values(ROBLOX_BRICK_COLORS).slice(0, 10).map((hex) => (
                      <button
                        key={hex}
                        onClick={() => onUpdatePart({ ...selectedPart, color: hex })}
                        style={{ backgroundColor: hex }}
                        className={`w-5 h-5 rounded border ${
                          selectedPart.color === hex ? 'border-white ring-2 ring-blue-500' : 'border-zinc-700'
                        }`}
                        title={hex}
                      />
                    ))}
                    <input
                      type="color"
                      value={selectedPart.color}
                      onChange={(e) => onUpdatePart({ ...selectedPart, color: e.target.value })}
                      className="w-5 h-5 rounded cursor-pointer bg-transparent border-0"
                    />
                  </div>
                </div>

                {/* Material Dropdown */}
                <div>
                  <label className="text-zinc-400 block mb-0.5">Material:</label>
                  <select
                    value={selectedPart.material}
                    onChange={(e) =>
                      onUpdatePart({ ...selectedPart, material: e.target.value as PartMaterial })
                    }
                    className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-white"
                  >
                    <option value="Plastic">Plastic (Plástico c/ Studs)</option>
                    <option value="SmoothPlastic">SmoothPlastic</option>
                    <option value="Neon">Neon (Brilho Emissivo)</option>
                    <option value="Wood">Wood (Madeira)</option>
                    <option value="WoodPlanks">WoodPlanks (Tábuas)</option>
                    <option value="Metal">Metal</option>
                    <option value="DiamondPlate">DiamondPlate</option>
                    <option value="Brick">Brick (Tijolo)</option>
                    <option value="Glass">Glass (Vidro Translúcido)</option>
                  </select>
                </div>

                {/* Size [X, Y, Z] */}
                <div>
                  <label className="text-zinc-400 block mb-0.5">Tamanho (Size):</label>
                  <div className="grid grid-cols-3 gap-1">
                    {['X', 'Y', 'Z'].map((axis, i) => (
                      <div key={axis} className="flex items-center bg-zinc-900 rounded border border-zinc-700 px-1.5 py-0.5">
                        <span className="text-[10px] text-zinc-500 mr-1">{axis}</span>
                        <input
                          type="number"
                          step="0.5"
                          min="0.2"
                          value={selectedPart.size[i]}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 1;
                            const newSize = [...selectedPart.size] as [number, number, number];
                            newSize[i] = Math.max(0.2, val);
                            onUpdatePart({ ...selectedPart, size: newSize });
                          }}
                          className="w-full bg-transparent text-white focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Position [X, Y, Z] */}
                <div>
                  <label className="text-zinc-400 block mb-0.5">Posição (Position):</label>
                  <div className="grid grid-cols-3 gap-1">
                    {['X', 'Y', 'Z'].map((axis, i) => (
                      <div key={axis} className="flex items-center bg-zinc-900 rounded border border-zinc-700 px-1.5 py-0.5">
                        <span className="text-[10px] text-zinc-500 mr-1">{axis}</span>
                        <input
                          type="number"
                          step="1"
                          value={selectedPart.position[i]}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 0;
                            const newPos = [...selectedPart.position] as [number, number, number];
                            newPos[i] = val;
                            onUpdatePart({ ...selectedPart, position: newPos });
                          }}
                          className="w-full bg-transparent text-white focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Booleans: Anchored, CanCollide, KillBrick */}
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-zinc-800">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedPart.anchored}
                      onChange={(e) => onUpdatePart({ ...selectedPart, anchored: e.target.checked })}
                      className="rounded bg-zinc-900 border-zinc-700 text-blue-600"
                    />
                    <span className="text-zinc-300">Anchored</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedPart.canCollide}
                      onChange={(e) => onUpdatePart({ ...selectedPart, canCollide: e.target.checked })}
                      className="rounded bg-zinc-900 border-zinc-700 text-blue-600"
                    />
                    <span className="text-zinc-300">CanCollide</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(selectedPart.isKillBrick)}
                      onChange={(e) =>
                        onUpdatePart({
                          ...selectedPart,
                          isKillBrick: e.target.checked,
                          material: e.target.checked ? 'Neon' : selectedPart.material,
                          color: e.target.checked ? '#ff1744' : selectedPart.color,
                        })
                      }
                      className="rounded bg-zinc-900 border-zinc-700 text-red-600"
                    />
                    <span className="text-red-400 font-semibold">Lava (Mortal)</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(selectedPart.isBouncePad)}
                      onChange={(e) =>
                        onUpdatePart({
                          ...selectedPart,
                          isBouncePad: e.target.checked,
                          bounceForce: e.target.checked ? 40 : undefined,
                        })
                      }
                      className="rounded bg-zinc-900 border-zinc-700 text-amber-600"
                    />
                    <span className="text-amber-400 font-semibold">Trampolim</span>
                  </label>
                </div>
              </div>
            ) : (
              <p className="text-zinc-500 italic py-4 text-center">
                Selecione uma peça na cena ou na lista do Explorer para editar suas propriedades.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
