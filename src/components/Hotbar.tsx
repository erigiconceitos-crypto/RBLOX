import React from 'react';
import { ToolItem } from '../types/roblox';
import { Sword, Zap, Hammer, Paintbrush, Box } from 'lucide-react';

interface HotbarProps {
  tools: ToolItem[];
  activeToolId: string | null;
  onSelectTool: (tool: ToolItem | null) => void;
}

export const Hotbar: React.FC<HotbarProps> = ({
  tools,
  activeToolId,
  onSelectTool,
}) => {
  const getToolIcon = (type: string) => {
    switch (type) {
      case 'weapon':
        return <Sword className="w-5 h-5 text-blue-300" />;
      case 'coil':
        return <Zap className="w-5 h-5 text-cyan-300" />;
      case 'builder':
        return <Hammer className="w-5 h-5 text-amber-300" />;
      case 'painter':
        return <Paintbrush className="w-5 h-5 text-rose-300" />;
      case 'spawner':
      default:
        return <Box className="w-5 h-5 text-emerald-300" />;
    }
  };

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 p-1.5 rounded-xl bg-zinc-900/85 backdrop-blur-md border border-zinc-700/80 shadow-2xl pointer-events-auto select-none">
      {tools.map((tool, index) => {
        const isSelected = activeToolId === tool.id;
        const keyNumber = index + 1;

        return (
          <button
            key={tool.id}
            onClick={() => onSelectTool(isSelected ? null : tool)}
            aria-label={`Equipar ${tool.name} (tecla ${keyNumber})`}
            className={`group relative flex flex-col items-center justify-between w-14 h-16 sm:w-16 sm:h-18 p-1.5 rounded-lg border transition-all cursor-pointer ${
              isSelected
                ? 'bg-blue-600/90 border-blue-400 text-white shadow-lg shadow-blue-500/30 -translate-y-1'
                : 'bg-zinc-800/80 hover:bg-zinc-700/90 border-zinc-700 text-zinc-300 hover:text-white'
            }`}
          >
            {/* Slot Number Badge */}
            <span
              className={`absolute top-1 left-1.5 text-[10px] font-mono font-bold leading-none ${
                isSelected ? 'text-blue-100' : 'text-zinc-400 group-hover:text-zinc-200'
              }`}
            >
              {keyNumber}
            </span>

            {/* Tool Icon */}
            <div className="my-auto transform transition-transform group-hover:scale-110">
              {getToolIcon(tool.type)}
            </div>

            {/* Tool Name Label */}
            <span
              className={`text-[9px] font-semibold truncate max-w-full text-center leading-tight ${
                isSelected ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'
              }`}
            >
              {tool.name}
            </span>
          </button>
        );
      })}
    </div>
  );
};
