import React, { useState } from 'react';
import { PlayerInServer, RobloxSettings } from '../types/roblox';
import { robloxAudio } from '../utils/audio';
import {
  Play,
  RotateCcw,
  LogOut,
  Users,
  Settings,
  HelpCircle,
  X,
  Volume2,
  VolumeX,
  ShieldAlert,
  UserPlus,
  Check,
  Crosshair
} from 'lucide-react';

interface EscMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetCharacter: () => void;
  onLeaveGame: () => void;
  playerName: string;
  players: PlayerInServer[];
  settings: RobloxSettings;
  onUpdateSettings: (settings: RobloxSettings) => void;
  onAddFriend: (playerId: string) => void;
}

export const EscMenuModal: React.FC<EscMenuModalProps> = ({
  isOpen,
  onClose,
  onResetCharacter,
  onLeaveGame,
  playerName,
  players,
  settings,
  onUpdateSettings,
  onAddFriend,
}) => {
  const [activeTab, setActiveTab] = useState<'players' | 'settings' | 'help'>('settings');
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  if (!isOpen) return null;

  const handleReset = () => {
    onResetCharacter();
    robloxAudio.playOof();
    setShowConfirmReset(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none font-sans">
      <div className="relative w-full max-w-2xl bg-zinc-950/95 border border-zinc-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        {/* Top Experience Banner */}
        <div className="px-6 py-4 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-zinc-200 to-zinc-400 rotate-12 rounded-sm border border-zinc-500 flex items-center justify-center shadow-md">
              <div className="w-2 h-2 bg-zinc-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-white tracking-wide">
                  BloxCraft 3D
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 font-bold border border-zinc-700">
                  Livre (Todas as Idades)
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Experiência criada pela Comunidade • Servidor Ativo
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar Menu"
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center px-6 gap-3 bg-zinc-900/60 border-b border-zinc-800 text-xs font-bold">
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 py-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'settings'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Configurações</span>
          </button>
          <button
            onClick={() => setActiveTab('players')}
            className={`flex items-center gap-2 py-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'players'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Pessoas ({players.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('help')}
            className={`flex items-center gap-2 py-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'help'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Ajuda</span>
          </button>
        </div>

        {/* Main Tab Content */}
        <div className="p-6 overflow-y-auto flex-1 text-xs">
          {showConfirmReset ? (
            <div className="p-6 rounded-2xl bg-red-950/80 border border-red-700 text-center space-y-4">
              <ShieldAlert className="w-10 h-10 text-red-400 mx-auto animate-bounce" />
              <h3 className="text-base font-bold text-white">
                Deseja realmente resetar o personagem?
              </h3>
              <p className="text-zinc-300 text-xs max-w-md mx-auto">
                Seu avatar sofrerá dano letal, reproduzirá o clássico som de &quot;OOF&quot; e reaparecerá no último ponto de Spawn/Checkpoint.
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setShowConfirmReset(false)}
                  className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleReset}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold shadow-lg shadow-red-900/50 transition-colors cursor-pointer"
                >
                  Resetar (Oof!)
                </button>
              </div>
            </div>
          ) : activeTab === 'settings' ? (
            <div className="space-y-4 max-w-lg mx-auto">
              {/* Shift Lock Switch */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <Crosshair className="w-4 h-4 text-blue-400" />
                  <div>
                    <span className="font-bold text-white block">Interruptor de Shift Lock</span>
                    <span className="text-[11px] text-zinc-400">
                      Pressione Shift para travar a mira e orientar o avatar com a câmera
                    </span>
                  </div>
                </div>
                <button
                  onClick={() =>
                    onUpdateSettings({
                      ...settings,
                      shiftLockEnabled: !settings.shiftLockEnabled,
                    })
                  }
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                    settings.shiftLockEnabled
                      ? 'bg-blue-600 text-white'
                      : 'bg-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  {settings.shiftLockEnabled ? 'LIGADO' : 'DESLIGADO'}
                </button>
              </div>

              {/* Volume Slider */}
              <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {settings.isMuted ? (
                      <VolumeX className="w-4 h-4 text-zinc-500" />
                    ) : (
                      <Volume2 className="w-4 h-4 text-emerald-400" />
                    )}
                    <span className="font-bold text-white">Volume dos Sons</span>
                  </div>
                  <span className="font-mono text-zinc-300">{settings.volume}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.volume}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    onUpdateSettings({
                      ...settings,
                      volume: val,
                      isMuted: val === 0,
                    });
                    robloxAudio.setVolume(val / 100);
                  }}
                  className="w-full accent-blue-500 cursor-pointer"
                />
              </div>

              {/* Mouse Sensitivity */}
              <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Sensibilidade da Câmera</span>
                  <span className="font-mono text-zinc-300">
                    {settings.mouseSensitivity.toFixed(1)}x
                  </span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="2.5"
                  step="0.1"
                  value={settings.mouseSensitivity}
                  onChange={(e) =>
                    onUpdateSettings({
                      ...settings,
                      mouseSensitivity: parseFloat(e.target.value),
                    })
                  }
                  className="w-full accent-blue-500 cursor-pointer"
                />
              </div>

              {/* Graphics Quality */}
              <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Qualidade dos Gráficos</span>
                  <span className="font-mono text-zinc-300">{settings.graphicsQuality} / 10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={settings.graphicsQuality}
                  onChange={(e) =>
                    onUpdateSettings({
                      ...settings,
                      graphicsQuality: parseInt(e.target.value, 10),
                    })
                  }
                  className="w-full accent-blue-500 cursor-pointer"
                />
              </div>
            </div>
          ) : activeTab === 'players' ? (
            <div className="space-y-2 max-w-lg mx-auto">
              <span className="text-zinc-400 block mb-2 font-semibold">
                Jogadores conectados nesta sessão:
              </span>
              <div className="divide-y divide-zinc-800 bg-zinc-900/80 rounded-xl border border-zinc-800 overflow-hidden">
                {players.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-3 hover:bg-zinc-800/50"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        style={{ backgroundColor: p.headColor }}
                        className="w-7 h-7 rounded-md border border-white/20 flex items-center justify-center font-bold text-zinc-950 text-xs"
                      >
                        R6
                      </div>
                      <div>
                        <span className="font-bold text-white block">{p.displayName}</span>
                        <span className="text-[10px] text-zinc-500">@{p.name} • {p.ping}ms</span>
                      </div>
                    </div>
                    {p.name !== playerName && (
                      <button
                        onClick={() => onAddFriend(p.id)}
                        className="flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold cursor-pointer"
                      >
                        {p.isFriend ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Amigo</span>
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-3.5 h-3.5" />
                            <span>Adicionar</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-3 max-w-lg mx-auto">
              <h3 className="font-bold text-white text-sm mb-1">Mapeamento de Teclas do Roblox</h3>
              <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-zinc-800 text-zinc-300">
                  <span className="font-semibold">Mover Avatar:</span>
                  <span className="font-mono text-blue-400 font-bold">W, A, S, D ou Teclas de Seta</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-800 text-zinc-300">
                  <span className="font-semibold">Pular:</span>
                  <span className="font-mono text-blue-400 font-bold">Barra de Espaço</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-800 text-zinc-300">
                  <span className="font-semibold">Correr (Sprint) / Shift Lock:</span>
                  <span className="font-mono text-blue-400 font-bold">Shift</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-800 text-zinc-300">
                  <span className="font-semibold">Girar Câmera:</span>
                  <span className="font-mono text-blue-400 font-bold">Botão Direito do Mouse</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-800 text-zinc-300">
                  <span className="font-semibold">Roda de Emotes:</span>
                  <span className="font-mono text-blue-400 font-bold">Tecla . (Ponto)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-800 text-zinc-300">
                  <span className="font-semibold">Inventário / Mochila:</span>
                  <span className="font-mono text-blue-400 font-bold">Tecla ~ (Til)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-800 text-zinc-300">
                  <span className="font-semibold">Tabela de Jogadores:</span>
                  <span className="font-mono text-blue-400 font-bold">Tecla Tab</span>
                </div>
                <div className="flex justify-between py-1 text-zinc-300">
                  <span className="font-semibold">Abrir Chat:</span>
                  <span className="font-mono text-blue-400 font-bold">Tecla / (Barra)</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Roblox Actions Bar */}
        <div className="p-4 bg-zinc-900 border-t border-zinc-800 flex items-center justify-between">
          <button
            onClick={() => setShowConfirmReset(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-red-950/40 border border-zinc-700 hover:border-red-600 text-zinc-300 hover:text-red-300 font-bold transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-red-400" />
            <span>Resetar Personagem</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Retomar Jogo (ESC)</span>
            </button>
            <button
              onClick={onLeaveGame}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 font-bold transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair do Jogo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
