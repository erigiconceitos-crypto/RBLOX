import React from 'react';
import { Terminal, Trash2, X } from 'lucide-react';

interface OutputConsoleProps {
  isOpen: boolean;
  onClose: () => void;
  logs: string[];
  onClear: () => void;
}

export const OutputConsole: React.FC<OutputConsoleProps> = ({
  isOpen,
  onClose,
  logs,
  onClear,
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute bottom-0 left-0 right-0 z-30 h-44 bg-zinc-950/95 border-t border-zinc-700/80 shadow-2xl flex flex-col font-mono text-xs select-none pointer-events-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-900 border-b border-zinc-800 text-[11px]">
        <div className="flex items-center gap-2 text-zinc-300 font-bold">
          <Terminal className="w-3.5 h-3.5 text-blue-400" />
          <span>Output (Console de Saída do Roblox Studio)</span>
          <span className="text-zinc-500 font-normal">({logs.length} mensagens)</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onClear}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 cursor-pointer"
            title="Limpar logs"
          >
            <Trash2 className="w-3 h-3" />
            <span>Limpar</span>
          </button>
          <button
            onClick={onClose}
            className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Log lines */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-1 font-mono text-[11px]">
        {logs.length === 0 ? (
          <span className="text-zinc-600 italic">Nenhuma mensagem registrada no output.</span>
        ) : (
          logs.map((log, index) => {
            const isWarn = log.includes('warn') || log.includes('Aviso');
            const isErr = log.includes('error') || log.includes('Erro');
            const isLua = log.includes('[Lua');

            return (
              <div
                key={index}
                className={`leading-tight ${
                  isErr
                    ? 'text-red-400'
                    : isWarn
                    ? 'text-amber-400'
                    : isLua
                    ? 'text-emerald-400'
                    : 'text-zinc-300'
                }`}
              >
                {log}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
