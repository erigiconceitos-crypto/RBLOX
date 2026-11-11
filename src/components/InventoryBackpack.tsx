import React from 'react';
import { ToolItem } from '../types/roblox';
import { robloxAudio } from '../utils/audio';
import { Backpack, X, Sword, Rocket, Zap, Hammer, Paintbrush, ShieldCheck } from 'lucide-react';

interface InventoryBackpackProps {
  isOpen: boolean;
  onClose: () => void;
  availableTools: ToolItem[];
  equippedTool: ToolItem | null;
  onEquipTool: (tool: ToolItem | null) => void;
}

export const InventoryBackpack: React.FC<InventoryBackpackProps> = ({
  isOpen,
  onClose,
  availableTools,
  equippedTool,
  onEquipTool,
}) => {
  if (!isOpen) return null;

  const getToolIcon = (type: string) => {
    switch (type) {
      case 'weapon':
        return <Sword className="w-5 h-5 text-blue-400" />;
      case 'rocket':
        return <Rocket className="w-5 h-5 text-red-400" />;
      case 'coil':
        return <Zap className="w-5 h-5 text-cyan-400" />;
      case 'speed_coil':
        return <Zap className="w-5 h-5 text-amber-400" />;
      case 'builder':
        return <Hammer className="w-5 h-5 text-emerald-400" />;
      case 'painter':
        return <Paintbrush className="w-5 h-5 text-rose-400" />;
      case 'trowel':
      default:
        return <ShieldCheck className="w-5 h-5 text-purple-400" />;
    }
  };

  return (
    <div className="absolute top-14 left-1/2 -translate-x-1/2 z-30 w-full max-w-xl px-4 pointer-events-auto select-none">
      <div className="bg-zinc-950/90 backdrop-blur-md border border-zinc-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Backpack className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-white tracking-wide uppercase">
              Mochila / Inventário de Ferramentas (Backpack)
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tools Grid */}
        <div className="p-3 grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-60 overflow-y-auto">
          {availableTools.map((tool) => {
            const isEquipped = equippedTool?.id === tool.id;

            return (
              <button
                key={tool.id}
                onClick={() => {
                  onEquipTool(isEquipped ? null : tool);
                  robloxAudio.playClick();
                }}
                className={`flex flex-col items-center justify-between p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  isEquipped
                    ? 'bg-blue-600/90 border-blue-400 text-white shadow-lg'
                    : 'bg-zinc-900/80 hover:bg-zinc-800 border-zinc-800 text-zinc-300'
                }`}
              >
                <div className="my-1.5 p-2 rounded-lg bg-zinc-950/60">
                  {getToolIcon(tool.type)}
                </div>
                <span className="text-xs font-bold truncate max-w-full leading-tight">
                  {tool.name}
                </span>
                <span className="text-[10px] text-zinc-400 line-clamp-1 mt-0.5">
                  {tool.description}
                </span>
                <span
                  className={`mt-2 text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    isEquipped ? 'bg-white text-blue-900' : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {isEquipped ? 'EQUIPADO' : 'EQUIPAR'}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
