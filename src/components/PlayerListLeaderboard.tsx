import React, { useState } from 'react';
import { PlayerInServer } from '../types/roblox';
import { robloxAudio } from '../utils/audio';
import { Users, UserPlus, Shield, Check, Signal, MoreVertical } from 'lucide-react';

interface PlayerListLeaderboardProps {
  isOpen: boolean;
  onToggle: () => void;
  players: PlayerInServer[];
  currentPlayerId: string;
  onAddFriend: (playerId: string) => void;
}

export const PlayerListLeaderboard: React.FC<PlayerListLeaderboardProps> = ({
  isOpen,
  onToggle,
  players,
  currentPlayerId,
  onAddFriend,
}) => {
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <div className="absolute top-14 right-3 z-20 w-72 sm:w-80 rounded-xl bg-zinc-950/85 backdrop-blur-md border border-zinc-800 shadow-2xl overflow-hidden flex flex-col pointer-events-auto select-none font-sans">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-zinc-900 border-b border-zinc-800 text-xs">
        <div className="flex items-center gap-1.5 font-bold text-zinc-300">
          <Users className="w-4 h-4 text-blue-400" />
          <span>Jogadores no Servidor ({players.length})</span>
        </div>
        <span className="text-[10px] text-zinc-500 font-mono">TAB para ocultar</span>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-12 px-3 py-1 bg-zinc-950 text-[10px] font-bold text-zinc-500 uppercase tracking-wider border-b border-zinc-800/80">
        <span className="col-span-6">Jogador</span>
        <span className="col-span-3 text-right">🪙 Moedas</span>
        <span className="col-span-3 text-right">Fase</span>
      </div>

      {/* Player Rows */}
      <div className="max-h-56 overflow-y-auto divide-y divide-zinc-800/60 text-xs">
        {players.map((p) => {
          const isSelf = p.id === currentPlayerId;
          const isSelected = selectedPlayerId === p.id;

          return (
            <div key={p.id} className="relative">
              <div
                onClick={() => {
                  setSelectedPlayerId(isSelected ? null : p.id);
                  robloxAudio.playClick();
                }}
                className={`grid grid-cols-12 items-center px-3 py-2 transition-colors cursor-pointer ${
                  isSelf
                    ? 'bg-blue-950/30 hover:bg-blue-900/40 text-blue-200'
                    : 'hover:bg-zinc-800/60 text-zinc-200'
                }`}
              >
                {/* Avatar icon + name */}
                <div className="col-span-6 flex items-center gap-2 truncate">
                  <div
                    style={{ backgroundColor: p.headColor }}
                    className="w-5 h-5 rounded-md border border-white/20 flex items-center justify-center text-[10px] font-bold text-zinc-900 flex-shrink-0"
                  >
                    R6
                  </div>
                  <div className="truncate">
                    <span className="font-semibold block truncate leading-tight">
                      {p.displayName} {isSelf && <span className="text-[10px] text-blue-400 font-normal">(Você)</span>}
                    </span>
                    <span className="text-[9px] text-zinc-500 block">@{p.name}</span>
                  </div>
                </div>

                {/* Coins */}
                <div className="col-span-3 text-right font-mono font-bold text-amber-400">
                  {p.bloxbux}
                </div>

                {/* Stage */}
                <div className="col-span-3 text-right font-mono text-emerald-400 font-semibold flex items-center justify-end gap-1">
                  <span>{p.stage}</span>
                  <Signal className="w-3 h-3 text-emerald-500" />
                </div>
              </div>

              {/* Action Popup */}
              {isSelected && (
                <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-900 border-y border-zinc-700 text-[11px]">
                  <span className="text-zinc-400">Ações para @{p.name}:</span>
                  <div className="flex items-center gap-1.5">
                    {!isSelf && (
                      <button
                        onClick={() => {
                          onAddFriend(p.id);
                          robloxAudio.playCheckpoint();
                          setSelectedPlayerId(null);
                        }}
                        className="flex items-center gap-1 px-2 py-0.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold cursor-pointer"
                      >
                        {p.isFriend ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>Amigo</span>
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-3 h-3" />
                            <span>Adicionar</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
