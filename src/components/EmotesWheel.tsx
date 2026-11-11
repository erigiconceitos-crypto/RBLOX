import React from 'react';
import { EmoteItem } from '../types/roblox';
import { robloxAudio } from '../utils/audio';
import { X } from 'lucide-react';

export const ROBLOX_EMOTES: EmoteItem[] = [
  { id: 'dance', name: 'Dance 1', command: '/e dance', icon: '🕺' },
  { id: 'dance2', name: 'Dance 2', command: '/e dance2', icon: '💃' },
  { id: 'wave', name: 'Wave', command: '/e wave', icon: '👋' },
  { id: 'cheer', name: 'Cheer', command: '/e cheer', icon: '🎉' },
  { id: 'point', name: 'Point', command: '/e point', icon: '👉' },
  { id: 'laugh', name: 'Laugh', command: '/e laugh', icon: '😂' },
  { id: 'salute', name: 'Salute', command: '/e salute', icon: '🫡' },
  { id: 'tilt', name: 'Side Tilt', command: '/e tilt', icon: '🤸' },
];

interface EmotesWheelProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEmote: (emote: EmoteItem) => void;
}

export const EmotesWheel: React.FC<EmotesWheelProps> = ({
  isOpen,
  onClose,
  onSelectEmote,
}) => {
  if (!isOpen) return null;

  const count = ROBLOX_EMOTES.length;
  const radius = 110; // px distance from center

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-xs select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-80 h-80 flex items-center justify-center"
      >
        {/* Outer Circular Ring */}
        <div className="absolute inset-0 rounded-full border-2 border-zinc-700/80 bg-zinc-950/70 shadow-2xl pointer-events-none" />

        {/* Center Close / Brand Button */}
        <button
          onClick={onClose}
          className="z-10 flex flex-col items-center justify-center w-20 h-20 rounded-full bg-zinc-900 border-2 border-zinc-600 hover:border-zinc-400 text-white shadow-xl transition-transform active:scale-95 cursor-pointer"
        >
          <X className="w-5 h-5 text-zinc-400 mb-0.5" />
          <span className="text-[10px] font-bold text-zinc-300 uppercase">Fechar</span>
        </button>

        {/* 8 Emote Radial Slots */}
        {ROBLOX_EMOTES.map((emote, index) => {
          const angle = (index * (360 / count) - 90) * (Math.PI / 180);
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          return (
            <button
              key={emote.id}
              onClick={() => {
                onSelectEmote(emote);
                robloxAudio.playClick();
                onClose();
              }}
              style={{
                transform: `translate(${x}px, ${y}px)`,
              }}
              className="group absolute flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-zinc-900/90 hover:bg-blue-600 border border-zinc-700 hover:border-blue-400 text-white shadow-xl transition-all hover:scale-110 active:scale-95 cursor-pointer"
              title={`${emote.name} (${emote.command})`}
            >
              <span className="text-xl mb-0.5 transform transition-transform group-hover:scale-115">
                {emote.icon}
              </span>
              <span className="text-[9px] font-bold truncate max-w-[56px] text-zinc-300 group-hover:text-white leading-none">
                {emote.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
