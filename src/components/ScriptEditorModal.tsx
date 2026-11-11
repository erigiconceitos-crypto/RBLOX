import React, { useState } from 'react';
import { RobloxPart, RobloxScript } from '../types/roblox';
import { robloxAudio } from '../utils/audio';
import { Code, Play, X, Save, CheckCircle2, RotateCcw } from 'lucide-react';

interface ScriptEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  part: RobloxPart | null;
  onSaveScript: (partId: string, script: RobloxScript) => void;
  onLogOutput: (msg: string) => void;
}

export const ScriptEditorModal: React.FC<ScriptEditorModalProps> = ({
  isOpen,
  onClose,
  part,
  onSaveScript,
  onLogOutput,
}) => {
  const defaultCode = part?.script?.code || `-- Script attached to ${part?.name || 'Part'}
local part = script.Parent

-- Example 1: Make part spin smoothly
-- part.Spinning = true

-- Example 2: Event when player touches this part
part.Touched:Connect(function(hit)
    print("Touched by: " .. hit.Name)
    -- hit.Parent.Humanoid.Health = 0 -- Kill player
end)

print("${part?.name || 'Part'} script loaded successfully!")
`;

  const [code, setCode] = useState(defaultCode);
  const [scriptName, setScriptName] = useState(part?.script?.name || 'Script');
  const [savedStatus, setSavedStatus] = useState(false);

  if (!isOpen || !part) return null;

  const handleSaveAndRun = () => {
    const updatedScript: RobloxScript = {
      id: part.script?.id || `script_${Date.now()}`,
      name: scriptName,
      code,
      enabled: true,
    };

    onSaveScript(part.id, updatedScript);
    robloxAudio.playClick();
    onLogOutput(`[Lua Output]: Executing ${scriptName} on "${part.name}"...`);

    // Parse simple script keywords for runtime behavior
    if (code.includes('Spinning = true') || code.includes('spin')) {
      onLogOutput(`[Lua Output]: Part "${part.name}" is now spinning!`);
    }
    if (code.includes('Health = 0') || code.includes('Lava')) {
      onLogOutput(`[Lua Output]: Part "${part.name}" configured as lethal killbrick.`);
    }

    setSavedStatus(true);
    setTimeout(() => {
      setSavedStatus(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm select-none font-sans">
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-zinc-900 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white tracking-wide">
                  Roblox Script Editor (Lua)
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-blue-400 font-mono">
                  {part.name}.{scriptName}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Edite o código de comportamento anexado a esta peça
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Script Name bar */}
        <div className="px-5 py-2 bg-zinc-900/60 border-b border-zinc-800 flex items-center gap-3 text-xs">
          <span className="text-zinc-400 font-medium">Nome do Script:</span>
          <input
            type="text"
            value={scriptName}
            onChange={(e) => setScriptName(e.target.value)}
            className="bg-zinc-950 border border-zinc-700 rounded px-2.5 py-1 text-white text-xs font-mono focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Code Editor Body */}
        <div className="relative p-4 flex-1 overflow-hidden bg-zinc-950 font-mono text-xs">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={14}
            className="w-full h-full bg-transparent text-emerald-400 font-mono text-xs leading-relaxed resize-none focus:outline-none"
            spellCheck={false}
          />
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-zinc-900 border-t border-zinc-800 flex items-center justify-between">
          <div className="text-[11px] text-zinc-400">
            {savedStatus ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Script salvo e compilado!
              </span>
            ) : (
              <span>Pressione Salvar &amp; Executar para rodar o script no Workspace</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCode(defaultCode)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restaurar Padrão</span>
            </button>
            <button
              onClick={handleSaveAndRun}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Salvar &amp; Executar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
