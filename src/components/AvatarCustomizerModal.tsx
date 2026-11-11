import React from 'react';
import { PlayerAvatarConfig } from '../types/roblox';
import { ROBLOX_BRICK_COLORS } from '../utils/rblParser';
import { robloxAudio } from '../utils/audio';
import { UserCheck, Sparkles, X, Palette, Crown, Shield } from 'lucide-react';

interface AvatarCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: PlayerAvatarConfig;
  onUpdateConfig: (config: PlayerAvatarConfig) => void;
  onOpenCatalog?: () => void;
}

export const AvatarCustomizerModal: React.FC<AvatarCustomizerModalProps> = ({
  isOpen,
  onClose,
  config,
  onUpdateConfig,
  onOpenCatalog,
}) => {
  if (!isOpen) return null;

  const colorPalette = [
    '#f5cd30', // Bright Yellow
    '#0d69ac', // Bright Blue
    '#4b974b', // Bright Green
    '#c4281c', // Bright Red
    '#f2f3f3', // White
    '#1b2a35', // Black
    '#da8541', // Orange
    '#7c5c40', // Brown
    '#ff66cc', // Pink
    '#9c27b0', // Purple
  ];

  const applyClassicNoob = () => {
    onUpdateConfig({
      ...config,
      headColor: '#f5cd30',
      torsoColor: '#0d69ac',
      leftArmColor: '#f5cd30',
      rightArmColor: '#f5cd30',
      leftLegColor: '#4b974b',
      rightLegColor: '#4b974b',
      face: 'smile',
      hat: 'none',
      backAccessory: 'none',
    });
    robloxAudio.playClick();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm select-none">
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-zinc-950 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white">Editor de Avatar Roblox R6</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Open Full Roblox Catalog by ID */}
          {onOpenCatalog && (
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-gradient-to-r from-purple-900/50 via-zinc-900 to-amber-900/40 border border-purple-500/40 shadow-lg">
              <div>
                <span className="font-bold text-sm text-white flex items-center gap-1.5">
                  <span>🛍️</span> Usar Itens do Catálogo por ID
                </span>
                <span className="text-[11px] text-zinc-300 block mt-0.5">
                  Digite códigos de Valkyrie, Dominus, Illumina, asas ou qualquer Asset ID
                </span>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onOpenCatalog();
                }}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-zinc-950 font-bold text-xs shadow-md transition cursor-pointer active:scale-95"
              >
                Abrir Catálogo
              </button>
            </div>
          )}

          {/* Quick Preset: Classic Noob */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/70 border border-zinc-800">
            <div>
              <span className="font-bold text-amber-400 block">Estilo Clássico: Noob</span>
              <span className="text-[11px] text-zinc-400">Amarelo, Azul e Verde retrô</span>
            </div>
            <button
              onClick={applyClassicNoob}
              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold transition-colors cursor-pointer"
            >
              Aplicar Noob
            </button>
          </div>

          {/* Name */}
          <div>
            <label className="text-zinc-400 block mb-1 font-semibold">Nome de Jogador:</label>
            <input
              type="text"
              value={config.name}
              onChange={(e) => onUpdateConfig({ ...config, name: e.target.value })}
              maxLength={20}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Skin Colors Section */}
          <div>
            <span className="font-bold text-zinc-300 block mb-2 flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-blue-400" />
              Cores do Corpo (Roblox Palette):
            </span>

            <div className="grid grid-cols-2 gap-3">
              {/* Head Color */}
              <div className="p-2.5 rounded-lg bg-zinc-950/80 border border-zinc-800">
                <span className="text-[11px] font-semibold text-zinc-400 block mb-1.5">Cabeça &amp; Braços</span>
                <div className="flex items-center gap-1 flex-wrap">
                  {colorPalette.map((hex) => (
                    <button
                      key={hex}
                      onClick={() =>
                        onUpdateConfig({
                          ...config,
                          headColor: hex,
                          leftArmColor: hex,
                          rightArmColor: hex,
                        })
                      }
                      style={{ backgroundColor: hex }}
                      className={`w-5 h-5 rounded border ${
                        config.headColor === hex ? 'border-white ring-2 ring-blue-500' : 'border-zinc-700'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Torso Color */}
              <div className="p-2.5 rounded-lg bg-zinc-950/80 border border-zinc-800">
                <span className="text-[11px] font-semibold text-zinc-400 block mb-1.5">Torso (Camisa)</span>
                <div className="flex items-center gap-1 flex-wrap">
                  {colorPalette.map((hex) => (
                    <button
                      key={hex}
                      onClick={() => onUpdateConfig({ ...config, torsoColor: hex })}
                      style={{ backgroundColor: hex }}
                      className={`w-5 h-5 rounded border ${
                        config.torsoColor === hex ? 'border-white ring-2 ring-blue-500' : 'border-zinc-700'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Legs Color */}
              <div className="p-2.5 rounded-lg bg-zinc-950/80 border border-zinc-800 col-span-2">
                <span className="text-[11px] font-semibold text-zinc-400 block mb-1.5">Pernas (Calça)</span>
                <div className="flex items-center gap-1 flex-wrap">
                  {colorPalette.map((hex) => (
                    <button
                      key={hex}
                      onClick={() =>
                        onUpdateConfig({
                          ...config,
                          leftLegColor: hex,
                          rightLegColor: hex,
                        })
                      }
                      style={{ backgroundColor: hex }}
                      className={`w-5 h-5 rounded border ${
                        config.leftLegColor === hex ? 'border-white ring-2 ring-blue-500' : 'border-zinc-700'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Hats Selection */}
          <div>
            <span className="font-bold text-zinc-300 block mb-2 flex items-center gap-1.5">
              <Crown className="w-4 h-4 text-amber-400" />
              Chapéus &amp; Acessórios de Cabeça:
            </span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'none', label: 'Nenhum' },
                { id: 'fedora', label: '🎩 Fedora' },
                { id: 'classic_hair', label: '👱 Cabelo' },
                { id: 'valkyrie', label: '⚔️ Valquíria' },
                { id: 'cap', label: '🧢 Boné' },
                { id: 'horns', label: '😈 Chifres' },
              ].map((hat) => (
                <button
                  key={hat.id}
                  onClick={() => onUpdateConfig({ ...config, hat: hat.id as any })}
                  className={`p-2 rounded-lg border text-center font-medium transition-colors cursor-pointer ${
                    config.hat === hat.id
                      ? 'bg-blue-600/80 border-blue-400 text-white'
                      : 'bg-zinc-950/80 border-zinc-800 text-zinc-300 hover:bg-zinc-800'
                  }`}
                >
                  {hat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Faces Selection */}
          <div>
            <span className="font-bold text-zinc-300 block mb-2">Rosto Clássico (Face):</span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'smile', label: 'Default Smile' },
                { id: 'epic', label: 'Epic Sunglasses' },
                { id: 'silly', label: 'Silly Tongue' },
                { id: 'determined', label: 'Determined' },
              ].map((face) => (
                <button
                  key={face.id}
                  onClick={() => onUpdateConfig({ ...config, face: face.id as any })}
                  className={`p-2 rounded-lg border text-center font-medium transition-colors cursor-pointer ${
                    config.face === face.id
                      ? 'bg-blue-600/80 border-blue-400 text-white'
                      : 'bg-zinc-950/80 border-zinc-800 text-zinc-300 hover:bg-zinc-800'
                  }`}
                >
                  {face.label}
                </button>
              ))}
            </div>
          </div>

          {/* Back Accessories */}
          <div>
            <span className="font-bold text-zinc-300 block mb-2 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-400" />
              Acessórios de Costas:
            </span>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'none', label: 'Nenhum' },
                { id: 'sword', label: 'Espada' },
                { id: 'wings', label: 'Asas' },
                { id: 'backpack', label: 'Mochila' },
              ].map((acc) => (
                <button
                  key={acc.id}
                  onClick={() => onUpdateConfig({ ...config, backAccessory: acc.id as any })}
                  className={`p-2 rounded-lg border text-center font-medium transition-colors cursor-pointer ${
                    config.backAccessory === acc.id
                      ? 'bg-blue-600/80 border-blue-400 text-white'
                      : 'bg-zinc-950/80 border-zinc-800 text-zinc-300 hover:bg-zinc-800'
                  }`}
                >
                  {acc.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-zinc-950 border-t border-zinc-800 flex justify-end">
          <button
            onClick={() => {
              onClose();
              robloxAudio.playClick();
            }}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md cursor-pointer"
          >
            Salvar Avatar
          </button>
        </div>
      </div>
    </div>
  );
};
