import React from 'react';
import { robloxAudio } from '../utils/audio';
import { Play, Flame, Trophy, Compass, Star, Users, X } from 'lucide-react';

export interface RobloxExperience {
  id: string;
  title: string;
  developer: string;
  rating: string;
  activePlayers: string;
  thumbnailColor: string;
  description: string;
  category: string;
}

export const EXPERIENCES_CATALOG: RobloxExperience[] = [
  {
    id: 'exp_obby',
    title: 'Tower of Obby Classic',
    developer: 'BloxCraft Studios',
    rating: '94%',
    activePlayers: '14.2K',
    thumbnailColor: '#0d69ac',
    description: 'Pistas verticais de parkour clássico com blocos de lava neon, trampolins de super impulso e ilha da vitória!',
    category: 'Aventura / Parkour',
  },
  {
    id: 'exp_sandbox',
    title: 'Classic Baseplate Sandbox',
    developer: 'Roblox Devs',
    rating: '91%',
    activePlayers: '8.7K',
    thumbnailColor: '#3a8e3a',
    description: 'O mapa clássico de baseplate de 240 studs com ferramentas de construção, pintura e importação de modelos.',
    category: 'Construção Livre',
  },
  {
    id: 'exp_speedway',
    title: 'Red Racer Speedway Arena',
    developer: 'TurboBlox',
    rating: '89%',
    activePlayers: '5.1K',
    thumbnailColor: '#c4281c',
    description: 'Pista de velocidade com carros clássicos Roblox vermelhos, rampas aerodinâmicas e obstáculos.',
    category: 'Corrida',
  },
  {
    id: 'exp_swordfight',
    title: 'Sword Fight on the Heights',
    developer: 'Shedletsky Classic',
    rating: '96%',
    activePlayers: '22.8K',
    thumbnailColor: '#7b1fa2',
    description: 'Combates lendários de espada clássica em plataformas flutuantes sobre o abismo!',
    category: 'Combate PVP',
  },
];

interface ExperienceHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectExperience: (exp: RobloxExperience) => void;
}

export const ExperienceHubModal: React.FC<ExperienceHubModalProps> = ({
  isOpen,
  onClose,
  onSelectExperience,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none font-sans">
      <div className="relative w-full max-w-3xl bg-zinc-950 border border-zinc-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-zinc-900 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <Compass className="w-6 h-6 text-blue-400" />
            <div>
              <h2 className="text-base font-extrabold text-white tracking-wide">
                Roblox Descobrir (Experiences Hub)
              </h2>
              <p className="text-xs text-zinc-400">
                Explore e jogue diferentes modos e mapas criados pela comunidade
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Catalog Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
          {EXPERIENCES_CATALOG.map((exp) => (
            <div
              key={exp.id}
              className="group flex flex-col justify-between p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-blue-500/80 transition-all shadow-md"
            >
              <div>
                {/* Banner Thumbnail */}
                <div
                  style={{ backgroundColor: exp.thumbnailColor }}
                  className="w-full h-28 rounded-lg mb-3 flex items-center justify-center text-white font-extrabold text-lg shadow-inner relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="relative z-10 px-3 text-center">{exp.title}</span>
                  <div className="absolute top-2 right-2 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 text-[10px] text-amber-300 font-bold">
                    <Star className="w-3 h-3 fill-current" />
                    <span>{exp.rating}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-1 text-xs">
                  <span className="text-zinc-400 font-medium">{exp.developer}</span>
                  <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold">
                    <Users className="w-3 h-3" />
                    <span>{exp.activePlayers}</span>
                  </span>
                </div>

                <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed mb-4">
                  {exp.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-zinc-800/80">
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-400 font-semibold">
                  {exp.category}
                </span>
                <button
                  onClick={() => {
                    onSelectExperience(exp);
                    robloxAudio.playCheckpoint();
                    onClose();
                  }}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Jogar Agora</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
