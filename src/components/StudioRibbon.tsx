import React, { useState } from 'react';
import { StudioTool, PartShape, PartMaterial } from '../types/roblox';
import { robloxAudio } from '../utils/audio';
import {
  MousePointer,
  Move,
  Maximize2,
  RotateCw,
  Box,
  Palette,
  Play,
  Terminal,
  Package,
  Layers,
  Settings,
  Code
} from 'lucide-react';

interface StudioRibbonProps {
  activeTool: StudioTool;
  onChangeTool: (tool: StudioTool) => void;
  onInsertPart: (shape: PartShape, special?: 'lava' | 'bounce') => void;
  onTogglePlay: () => void;
  isOutputOpen: boolean;
  onToggleOutput: () => void;
  onOpenImporter: () => void;
  onOpenScriptEditor?: () => void;
  hasSelectedPart: boolean;
}

export const StudioRibbon: React.FC<StudioRibbonProps> = ({
  activeTool,
  onChangeTool,
  onInsertPart,
  onTogglePlay,
  isOutputOpen,
  onToggleOutput,
  onOpenImporter,
  onOpenScriptEditor,
  hasSelectedPart,
}) => {
  const [activeTab, setActiveTab] = useState<'home' | 'model' | 'view'>('home');

  return (
    <header className="absolute top-0 left-0 right-0 z-30 bg-zinc-900 border-b border-zinc-700/80 shadow-xl select-none font-sans pointer-events-auto">
      {/* Top Studio Bar: Tabs & Play button */}
      <div className="flex items-center justify-between px-3 py-1 bg-zinc-950 border-b border-zinc-800 text-xs">
        <div className="flex items-center gap-1">
          {/* Studio Brand Icon */}
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-600/20 border border-blue-500/40 text-blue-400 font-bold mr-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span>Roblox Studio</span>
          </div>

          {/* Ribbon Tabs */}
          {(['home', 'model', 'view'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded-t-md font-semibold capitalize transition-colors cursor-pointer ${
                activeTab === tab
                  ? 'bg-zinc-900 text-white border-t-2 border-blue-500'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
              }`}
            >
              {tab === 'home' ? 'Início (Home)' : tab === 'model' ? 'Modelo (Model)' : 'Exibir (View)'}
            </button>
          ))}
        </div>

        {/* Big Blue Play / Test Button */}
        <button
          onClick={onTogglePlay}
          className="flex items-center gap-1.5 px-4 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md transition-all active:scale-95 cursor-pointer"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Testar Jogo (F5)</span>
        </button>
      </div>

      {/* Ribbon Toolbar Content based on tab */}
      <div className="flex items-center gap-2 px-3 py-2 bg-zinc-900 overflow-x-auto text-xs">
        {activeTab === 'home' && (
          <>
            {/* Transform Tools Group */}
            <div className="flex items-center gap-1 pr-3 border-r border-zinc-700/80">
              <span className="text-[10px] font-bold text-zinc-500 uppercase mr-1">Ferramentas:</span>
              <button
                onClick={() => onChangeTool('select')}
                className={`flex flex-col items-center justify-center p-1.5 min-w-12 rounded-lg border transition-colors cursor-pointer ${
                  activeTool === 'select'
                    ? 'bg-blue-600 border-blue-400 text-white'
                    : 'bg-zinc-800/80 hover:bg-zinc-700 border-zinc-700 text-zinc-300'
                }`}
                title="Selecionar Peça"
              >
                <MousePointer className="w-4 h-4 mb-0.5" />
                <span className="text-[9px] font-semibold">Select</span>
              </button>
              <button
                onClick={() => onChangeTool('move')}
                className={`flex flex-col items-center justify-center p-1.5 min-w-12 rounded-lg border transition-colors cursor-pointer ${
                  activeTool === 'move'
                    ? 'bg-blue-600 border-blue-400 text-white'
                    : 'bg-zinc-800/80 hover:bg-zinc-700 border-zinc-700 text-zinc-300'
                }`}
                title="Mover Peça (Eixos X, Y, Z)"
              >
                <Move className="w-4 h-4 mb-0.5" />
                <span className="text-[9px] font-semibold">Move</span>
              </button>
              <button
                onClick={() => onChangeTool('scale')}
                className={`flex flex-col items-center justify-center p-1.5 min-w-12 rounded-lg border transition-colors cursor-pointer ${
                  activeTool === 'scale'
                    ? 'bg-blue-600 border-blue-400 text-white'
                    : 'bg-zinc-800/80 hover:bg-zinc-700 border-zinc-700 text-zinc-300'
                }`}
                title="Escala e Dimensionamento"
              >
                <Maximize2 className="w-4 h-4 mb-0.5" />
                <span className="text-[9px] font-semibold">Scale</span>
              </button>
              <button
                onClick={() => onChangeTool('rotate')}
                className={`flex flex-col items-center justify-center p-1.5 min-w-12 rounded-lg border transition-colors cursor-pointer ${
                  activeTool === 'rotate'
                    ? 'bg-blue-600 border-blue-400 text-white'
                    : 'bg-zinc-800/80 hover:bg-zinc-700 border-zinc-700 text-zinc-300'
                }`}
                title="Girar Peça"
              >
                <RotateCw className="w-4 h-4 mb-0.5" />
                <span className="text-[9px] font-semibold">Rotate</span>
              </button>
            </div>

            {/* Quick Insert Parts Group */}
            <div className="flex items-center gap-1.5 pr-3 border-r border-zinc-700/80">
              <span className="text-[10px] font-bold text-zinc-500 uppercase mr-1">Partes:</span>
              <button
                onClick={() => onInsertPart('Block')}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 font-semibold cursor-pointer"
              >
                <Box className="w-3.5 h-3.5 text-blue-400" />
                <span>Bloco</span>
              </button>
              <button
                onClick={() => onInsertPart('Ball')}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 font-semibold cursor-pointer"
              >
                <span>Esfera</span>
              </button>
              <button
                onClick={() => onInsertPart('Cylinder')}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 font-semibold cursor-pointer"
              >
                <span>Cilindro</span>
              </button>
              <button
                onClick={() => onInsertPart('Wedge')}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 font-semibold cursor-pointer"
              >
                <span>Rampa</span>
              </button>
              <button
                onClick={() => onInsertPart('Block', 'bounce')}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-600/90 hover:bg-amber-500 text-white font-semibold cursor-pointer"
              >
                <span>Mola</span>
              </button>
              <button
                onClick={() => onInsertPart('Block', 'lava')}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-600/90 hover:bg-red-500 text-white font-semibold cursor-pointer"
              >
                <span>Lava</span>
              </button>
            </div>

            {/* Toolbox & Importer */}
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenImporter}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow cursor-pointer"
              >
                <Package className="w-4 h-4" />
                <span>Toolbox / Importar RBL</span>
              </button>

              {hasSelectedPart && onOpenScriptEditor && (
                <button
                  onClick={onOpenScriptEditor}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow cursor-pointer"
                >
                  <Code className="w-4 h-4" />
                  <span>Editar Script (Lua)</span>
                </button>
              )}
            </div>
          </>
        )}

        {activeTab === 'model' && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onInsertPart('Block')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 font-semibold cursor-pointer"
            >
              <Box className="w-4 h-4 text-blue-400" />
              <span>Inserir Objeto 3D</span>
            </button>
            <button
              onClick={onOpenImporter}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold cursor-pointer"
            >
              <Package className="w-4 h-4" />
              <span>Importar Modelo .RBL / .OBJ</span>
            </button>
          </div>
        )}

        {activeTab === 'view' && (
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleOutput}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-semibold cursor-pointer ${
                isOutputOpen
                  ? 'bg-blue-600 border-blue-400 text-white'
                  : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300'
              }`}
            >
              <Terminal className="w-4 h-4" />
              <span>Output Console (Saída)</span>
            </button>
            <button
              onClick={onOpenImporter}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 font-semibold cursor-pointer"
            >
              <Package className="w-4 h-4 text-amber-400" />
              <span>Toolbox / Biblioteca de Assets</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
