import React from 'react';
import { GameMode } from '../types/roblox';
import {
  MessageSquare,
  Hammer,
  Gamepad2,
  PackagePlus,
  UserCheck,
  Smile,
  Backpack,
  Users
} from 'lucide-react';

interface TopBarProps {
  mode: GameMode;
  onToggleMode: () => void;
  isChatOpen: boolean;
  onToggleChat: () => void;
  onOpenEmotes: () => void;
  onOpenBackpack: () => void;
  onToggleLeaderboard: () => void;
  isLeaderboardOpen: boolean;
  onOpenImporter: () => void;
  onOpenAvatar: () => void;
  onOpenCatalog?: () => void;
  onOpenEscMenu: () => void;
  health: number;
  maxHealth: number;
  coins: number;
  stage: number;
  playerName: string;
  playersCount: number;
}

export const TopBar: React.FC<TopBarProps> = ({
  mode,
  onToggleMode,
  isChatOpen,
  onToggleChat,
  onOpenEmotes,
  onOpenBackpack,
  onToggleLeaderboard,
  isLeaderboardOpen,
  onOpenImporter,
  onOpenAvatar,
  onOpenCatalog,
  onOpenEscMenu,
  health,
  maxHealth,
  coins,
  stage,
  playerName,
  playersCount,
}) => {
  const hpPercent = Math.max(0, Math.min(100, (health / maxHealth) * 100));

  return (
    <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-3 py-2 bg-gradient-to-b from-black/85 via-black/50 to-transparent pointer-events-none select-none font-sans">
      {/* Left Action Buttons */}
      <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
        {/* Official Roblox Logo Button (ESC Menu) */}
        <button
          onClick={onOpenEscMenu}
          aria-label="Menu Principal do Roblox"
          className="group relative flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 transition-transform active:scale-95 shadow-lg cursor-pointer"
          title="Menu Principal (Esc)"
        >
          <div className="w-5 h-5 bg-gradient-to-br from-zinc-200 to-zinc-400 rotate-12 rounded-sm border border-zinc-500 flex items-center justify-center shadow-inner group-hover:rotate-0 transition-transform">
            <div className="w-1.5 h-1.5 bg-zinc-950 rounded-2xs" />
          </div>
        </button>

        {/* Chat Toggle Button */}
        <button
          onClick={onToggleChat}
          aria-label="Abrir ou fechar Chat"
          className={`flex items-center justify-center w-10 h-10 rounded-xl border transition-colors cursor-pointer ${
            isChatOpen
              ? 'bg-blue-600 border-blue-400 text-white shadow-lg'
              : 'bg-zinc-900/90 hover:bg-zinc-800 border-zinc-700/80 text-zinc-300'
          }`}
          title="Chat (/)"
        >
          <MessageSquare className="w-4 h-4" />
        </button>

        {/* Emotes Wheel Button */}
        <button
          onClick={onOpenEmotes}
          aria-label="Roda de Emotes do Roblox"
          className="flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-300 hover:text-white transition-colors cursor-pointer shadow-md"
          title="Roda de Emotes (.)"
        >
          <Smile className="w-4 h-4 text-amber-400" />
        </button>

        {/* Backpack Inventory Button */}
        <button
          onClick={onOpenBackpack}
          aria-label="Mochila / Inventário de Ferramentas"
          className="flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-300 hover:text-white transition-colors cursor-pointer shadow-md"
          title="Mochila (~)"
        >
          <Backpack className="w-4 h-4 text-emerald-400" />
        </button>

        {/* Studio / Play Toggle */}
        <button
          onClick={onToggleMode}
          aria-label={`Alternar para ${mode === 'play' ? 'Modo Studio' : 'Modo Jogo'}`}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer ${
            mode === 'studio'
              ? 'bg-amber-600 hover:bg-amber-500 border-amber-400 text-white shadow-amber-900/40'
              : 'bg-blue-600 hover:bg-blue-500 border-blue-400 text-white shadow-blue-900/40'
          }`}
        >
          {mode === 'play' ? (
            <>
              <Hammer className="w-3.5 h-3.5" />
              <span>Studio</span>
            </>
          ) : (
            <>
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>Jogar</span>
            </>
          )}
        </button>

        {/* Model Importer Button */}
        <button
          onClick={onOpenImporter}
          aria-label="Importar Modelos RBL e 3D"
          className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-200 text-xs font-semibold shadow-md transition-colors cursor-pointer"
        >
          <PackagePlus className="w-4 h-4 text-blue-400" />
          <span>Importar RBL</span>
        </button>
      </div>

      {/* Right Stats & Health Bar */}
      <div className="flex items-center gap-2.5 pointer-events-auto">
        {/* Roblox Catalog Button */}
        {onOpenCatalog && (
          <button
            onClick={onOpenCatalog}
            aria-label="Abrir Catálogo de Itens do Roblox"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 border border-amber-400 text-white text-xs font-bold shadow-lg shadow-amber-950/40 transition cursor-pointer active:scale-95"
            title="Catálogo do Roblox (Itens e Códigos ID)"
          >
            <span className="text-sm">🛍️</span>
            <span className="hidden sm:inline">Catálogo</span>
          </button>
        )}

        {/* Avatar Customizer */}
        <button
          onClick={onOpenAvatar}
          aria-label="Personalizar Avatar"
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-200 text-xs font-semibold transition-colors cursor-pointer shadow-md"
        >
          <UserCheck className="w-4 h-4 text-emerald-400" />
          <span className="hidden sm:inline">Avatar</span>
        </button>

        {/* Leaderboard Toggle Button */}
        <button
          onClick={onToggleLeaderboard}
          aria-label="Tabela de Jogadores"
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer shadow-md ${
            isLeaderboardOpen
              ? 'bg-blue-600 border-blue-400 text-white'
              : 'bg-zinc-900/90 hover:bg-zinc-800 border-zinc-700/80 text-zinc-300'
          }`}
          title="Tabela de Jogadores (Tab)"
        >
          <Users className="w-4 h-4 text-blue-300" />
          <span>{playersCount}</span>
        </button>

        {/* Health Gauge */}
        <div className="flex flex-col items-end gap-0.5">
          <div className="flex items-center gap-1 text-[11px] font-bold text-zinc-300">
            <span>HP</span>
            <span className={health < 30 ? 'text-red-400' : 'text-emerald-400'}>
              {Math.round(health)}
            </span>
          </div>
          <div className="w-24 sm:w-32 h-2.5 rounded-full bg-zinc-800/90 border border-zinc-700 overflow-hidden shadow-inner p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-200 ${
                hpPercent > 50
                  ? 'bg-gradient-to-r from-emerald-500 to-green-400'
                  : hpPercent > 25
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                  : 'bg-gradient-to-r from-red-600 to-rose-400'
              }`}
              style={{ width: `${hpPercent}%` }}
            />
          </div>
        </div>

        {/* Profile Card */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900/90 border border-zinc-700/80 shadow-md text-xs">
          <div className="w-6 h-6 rounded-md bg-yellow-400 border border-yellow-200 flex items-center justify-center text-zinc-950 font-extrabold text-[11px]">
            R6
          </div>
          <div className="flex flex-col text-left">
            <span className="font-semibold text-white leading-tight">{playerName}</span>
            <span className="text-[10px] text-amber-400 font-bold">🪙 {coins}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
