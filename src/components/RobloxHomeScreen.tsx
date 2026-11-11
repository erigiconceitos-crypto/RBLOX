import React, { useState } from 'react';
import { PlayerAvatarConfig } from '../types/roblox';
import { robloxAudio } from '../utils/audio';
import {
  Search,
  Bell,
  Settings,
  Home,
  PlayCircle,
  User,
  MessageSquare,
  MoreHorizontal,
  Users,
  Play,
  ThumbsUp,
  X,
  Plus,
  Compass,
  ShoppingBag,
} from 'lucide-react';

export interface RobloxGameItem {
  id: string;
  title: string;
  subtitle?: string;
  stats: string; // e.g. "4 Friends" or "👍 83%  👥 8.5K"
  badgeText?: string;
  thumbnailBg: string;
  thumbnailStyle?: string;
  customArt: 'mm2' | 'avatar_creator' | 'evade' | 'spray_paint' | 'doors' | 'skibidi' | 'catalog' | 'brookhaven' | 'rec_it' | 'homework' | 'sus_hangout' | 'adopt_me' | 'bloxburg' | 'make_art' | 'action_sword' | 'gods_will' | 'generic';
}

export interface RobloxFriendItem {
  id: string;
  name: string;
  activity: string;
  avatarBg: string;
  avatarFace: string;
  isOnline: boolean;
}

// Exact friends matching the user reference screenshot
export const EXACT_FRIENDS_LIST: RobloxFriendItem[] = [
  { id: 'f1', name: 'neko678', activity: 'Радужные...', avatarBg: '#ffe0b2', avatarFace: '👩', isOnline: true },
  { id: 'f2', name: 'gjo681', activity: 'Tiny Bunny /...', avatarBg: '#fff9c4', avatarFace: '🧒', isOnline: true },
  { id: 'f3', name: 'IPOT4937', activity: 'Игровая штука...', avatarBg: '#e0f2f1', avatarFace: '🤠', isOnline: true },
  { id: 'f4', name: 'itx_ga588', activity: 'Глупый Саймон...', avatarBg: '#d7ccc8', avatarFace: '👧', isOnline: true },
  { id: 'f5', name: 'Karina', activity: 'Не нажимайте...', avatarBg: '#f8bbd0', avatarFace: '💃', isOnline: true },
  { id: 'f6', name: 'Patviam', activity: 'Car Crash Test', avatarBg: '#bbdefb', avatarFace: '🏎️', isOnline: true },
  { id: 'f7', name: 'yurai_01', activity: 'Симулятор...', avatarBg: '#ffe082', avatarFace: '🧑', isOnline: true },
  { id: 'f8', name: 'Harun_adrovic', activity: '[ ] Защита от...', avatarBg: '#cfd8dc', avatarFace: '🖥️', isOnline: true },
  { id: 'f9', name: 'kate7045r5', activity: 'Online', avatarBg: '#ffccbc', avatarFace: '👱‍♀️', isOnline: true },
  { id: 'f10', name: 'kenneth', activity: 'Online', avatarBg: '#ede7f6', avatarFace: '🤖', isOnline: true },
  { id: 'f11', name: 'Tanya36123', activity: 'Online', avatarBg: '#fce4ec', avatarFace: '🧢', isOnline: true },
];

// Exact Continue games from the user reference screenshot
export const EXACT_CONTINUE_GAMES: RobloxGameItem[] = [
  {
    id: 'g_mm2',
    title: 'Загадочное убийство 2',
    stats: '4 Friends',
    thumbnailBg: '#0f172a',
    customArt: 'mm2',
  },
  {
    id: 'g_avatar_creator',
    title: 'Каталог Аватар Создатель',
    stats: '5 Friends',
    thumbnailBg: '#1e293b',
    customArt: 'avatar_creator',
  },
  {
    id: 'g_evade',
    title: 'Убежать',
    stats: '3 Friends',
    thumbnailBg: '#09090b',
    customArt: 'evade',
  },
  {
    id: 'g_spray_paint',
    title: 'Spray Paint!',
    stats: '👍 83%  👥 8.5K',
    thumbnailBg: '#27272a',
    customArt: 'spray_paint',
  },
  {
    id: 'g_doors',
    title: 'DOORS 👁 [🚪]',
    stats: '6 Friends',
    thumbnailBg: '#18120c',
    customArt: 'doors',
  },
  {
    id: 'g_skibidi',
    title: '[ 🚽 ] Защиta от осады туалета...',
    stats: '👥 Friends',
    thumbnailBg: '#020617',
    customArt: 'skibidi',
  },
  {
    id: 'g_catalog',
    title: 'Каталог аватармейкера',
    stats: '👍 74%  👥 4.6K',
    thumbnailBg: '#450a0a',
    customArt: 'catalog',
  },
  {
    id: 'g_brookhaven',
    title: 'Брукхейвен 🏡RP',
    stats: '7 Friends',
    thumbnailBg: '#064e3b',
    customArt: 'brookhaven',
  },
];

// Exact Recommended games from the user reference screenshot
export const EXACT_RECOMMENDED_GAMES: RobloxGameItem[] = [
  {
    id: 'r_rec_it',
    title: 'Rec It',
    stats: '1 Friend',
    thumbnailBg: '#09090b',
    customArt: 'rec_it',
  },
  {
    id: 'r_homework',
    title: '[HOMEWORK] The Presentation...',
    stats: '👍 93%  👥 2K',
    thumbnailBg: '#78350f',
    customArt: 'homework',
  },
  {
    id: 'r_sus_hangout',
    title: '(SUS) Hangout c девушкой neko',
    stats: '👍 63%  👥 855',
    thumbnailBg: '#4a044e',
    customArt: 'sus_hangout',
  },
  {
    id: 'r_adopt_me',
    title: 'Adopt Me!',
    stats: '4 Friends',
    thumbnailBg: '#0284c7',
    customArt: 'adopt_me',
  },
  {
    id: 'r_bloxburg',
    title: 'Добро пожаловать в Блоксбург',
    stats: '👍 88%  👥 35.6K',
    thumbnailBg: '#047857',
    customArt: 'bloxburg',
  },
  {
    id: 'r_make_art',
    title: 'Голодающие художники (ИГРА MAKE ART!)',
    stats: '👍 90%  👥 3K',
    thumbnailBg: '#15803d',
    customArt: 'make_art',
  },
  {
    id: 'r_action_sword',
    title: '[ 🗡️ АКЦИЯ!] Таинственные...',
    stats: '👍 88%  👥 4.8K',
    thumbnailBg: '#0369a1',
    customArt: 'action_sword',
  },
  {
    id: 'r_gods_will',
    title: 'ВОЛЯ БОГОВ',
    stats: '👍 76%  👥 24.8K',
    thumbnailBg: '#451a03',
    customArt: 'gods_will',
  },
];

interface RobloxHomeScreenProps {
  avatarConfig: PlayerAvatarConfig;
  robuxBalance: number;
  onLaunchGame: (gameId?: string) => void;
  onOpenStudio: () => void;
  onOpenAvatarCustomizer: () => void;
  onOpenCatalog: () => void;
  onOpenImporter: () => void;
}

export const RobloxHomeScreen: React.FC<RobloxHomeScreenProps> = ({
  avatarConfig,
  robuxBalance,
  onLaunchGame,
  onOpenStudio,
  onOpenAvatarCustomizer,
  onOpenCatalog,
  onOpenImporter,
}) => {
  const [selectedGame, setSelectedGame] = useState<RobloxGameItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNav, setActiveNav] = useState<'home' | 'discover' | 'avatar' | 'chat'>('home');

  const username = avatarConfig.displayName || avatarConfig.name || 'MediaLazurKotRUS';

  const handleCardClick = (game: RobloxGameItem) => {
    robloxAudio.playClick();
    setSelectedGame(game);
  };

  const handleStartPlay = (game: RobloxGameItem) => {
    robloxAudio.playCheckpoint();
    onLaunchGame(game.id);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#232527] text-white flex select-none font-sans">
      {/* 1. LEFT NARROW ICON RAIL (MATCHING SCREENSHOT) */}
      <aside className="w-12 sm:w-14 bg-[#191b1d] border-r border-[#2a2c30] flex flex-col items-center justify-between py-3 flex-shrink-0 z-30">
        <div className="flex flex-col items-center gap-5 w-full">
          {/* Home Icon (White/Active) */}
          <button
            onClick={() => setActiveNav('home')}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              activeNav === 'home' ? 'text-white bg-[#2b2d31]' : 'text-zinc-400 hover:text-white'
            }`}
            title="Home"
          >
            <Home className="w-5 h-5 fill-current" />
          </button>

          {/* Discover Icon (Play circle) */}
          <button
            onClick={() => {
              setActiveNav('discover');
              robloxAudio.playClick();
            }}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              activeNav === 'discover' ? 'text-white bg-[#2b2d31]' : 'text-zinc-400 hover:text-white'
            }`}
            title="Discover"
          >
            <PlayCircle className="w-5 h-5" />
          </button>

          {/* Avatar Icon */}
          <button
            onClick={onOpenAvatarCustomizer}
            className="p-2 rounded-xl text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="Avatar Customizer"
          >
            <User className="w-5 h-5" />
          </button>

          {/* Catalog / Avatar Shop Icon */}
          <button
            onClick={onOpenCatalog}
            className="p-2 rounded-xl text-amber-400 hover:text-amber-300 hover:bg-[#2b2d31] transition-colors cursor-pointer"
            title="Catálogo do Roblox (Itens por Código e Loja)"
          >
            <ShoppingBag className="w-5 h-5" />
          </button>

          {/* Chat Icon */}
          <button
            onClick={() => {
              setActiveNav('chat');
              robloxAudio.playClick();
            }}
            className="p-2 rounded-xl text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="Chat & Connect"
          >
            <MessageSquare className="w-5 h-5" />
          </button>

          {/* More (...) */}
          <button
            onClick={onOpenImporter}
            className="p-2 rounded-xl text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="More / Import RBL"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* Bottom Blue Roblox Tilted Square Logo (Studio / Create) */}
        <button
          onClick={onOpenStudio}
          className="group relative flex items-center justify-center w-8 h-8 rounded-lg bg-[#00a2ff]/15 hover:bg-[#00a2ff]/30 transition-transform active:scale-95 cursor-pointer"
          title="Roblox Studio (Create)"
        >
          {/* Blue Roblox tilted icon */}
          <div className="w-5 h-5 bg-[#00a2ff] rotate-15 rounded-xs flex items-center justify-center shadow group-hover:rotate-0 transition-transform">
            <div className="w-1.5 h-1.5 bg-[#191b1d] rounded-2xs" />
          </div>
        </button>
      </aside>

      {/* 2. MAIN APP CONTENT CONTAINER */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* TOP BAR (MATCHING REFERENCE EXACTLY) */}
        <header className="h-14 bg-[#191b1d] border-b border-[#2a2c30] flex items-center justify-between px-6 flex-shrink-0 z-20">
          {/* Left: Home Title */}
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Home
          </h1>

          {/* Center: Search input pill */}
          <div className="flex-1 max-w-md mx-6">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#2a2d32] hover:bg-[#32363c] border-0 rounded-full pl-9 pr-4 py-1.5 text-xs text-white placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-white/40 transition-colors"
              />
            </div>
          </div>

          {/* Right: User Avatar + Name + Robux Hexagon + Bell + Settings */}
          <div className="flex items-center gap-4 text-xs font-semibold">
            {/* User Avatar with Green Online indicator */}
            <div
              onClick={onOpenAvatarCustomizer}
              className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity"
            >
              <div
                style={{ backgroundColor: avatarConfig.headColor || '#f5cd30' }}
                className="w-6 h-6 rounded-full border border-white/30 flex items-center justify-center text-[10px] font-extrabold text-zinc-950 shadow-sm relative"
              >
                R6
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-[#191b1d]" />
              </div>
              <span className="text-zinc-200 hover:text-white font-medium text-xs hidden sm:inline">
                {username}
              </span>
            </div>

            {/* Golden Robux Hexagon Icon */}
            <div
              className="flex items-center gap-1.5 cursor-pointer text-zinc-300 hover:text-white transition-colors"
              title="Robux Balance"
            >
              <div className="w-4 h-4 bg-gradient-to-br from-amber-300 to-amber-500 rotate-45 rounded-2xs flex items-center justify-center shadow-inner">
                <div className="w-1.5 h-1.5 bg-[#191b1d] -rotate-45" />
              </div>
              <span className="font-bold text-xs">{robuxBalance.toLocaleString()}</span>
            </div>

            {/* Notification Bell */}
            <button
              className="relative text-zinc-300 hover:text-white transition-colors cursor-pointer p-1"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-red-500" />
            </button>

            {/* Settings Cog */}
            <button
              onClick={onOpenStudio}
              className="text-zinc-300 hover:text-white transition-colors cursor-pointer p-1"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* 3. SCROLLABLE FEED (FRIENDS + CONTINUE + RECOMMENDED) */}
        <main className="flex-1 overflow-y-auto px-6 py-4 space-y-6 bg-[#232527] scrollbar-thin">
          {/* SECTION A: FRIENDS CAROUSEL (EXACTLY LIKE IMAGE) */}
          <section className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm sm:text-base font-extrabold text-white">
                Friends
              </h2>
              <button
                onClick={() => {
                  robloxAudio.playClick();
                }}
                className="px-3 py-1 rounded-full border border-zinc-700 hover:border-zinc-500 bg-[#2b2d31] hover:bg-[#34373d] text-xs font-semibold text-zinc-300 transition-colors cursor-pointer"
              >
                See All
              </button>
            </div>

            {/* Horizontal Carousel of Friend Avatars */}
            <div className="flex items-start gap-4 overflow-x-auto pb-2 scrollbar-none">
              {/* 1st Item: Add Friends Circle */}
              <div
                onClick={() => {
                  robloxAudio.playClick();
                  onOpenImporter();
                }}
                className="flex flex-col items-center min-w-[70px] cursor-pointer group"
              >
                <div className="w-16 h-16 rounded-full bg-[#34373c] border border-zinc-700/80 group-hover:border-zinc-500 flex items-center justify-center text-zinc-300 transition-transform group-hover:scale-105 shadow-md">
                  <Users className="w-6 h-6 text-zinc-400 group-hover:text-white" />
                </div>
                <span className="text-[11px] font-bold text-zinc-300 mt-1.5 text-center leading-tight">
                  Add Friends
                </span>
              </div>

              {/* Real Friends Avatars with exact Russian/Global labels from screenshot */}
              {EXACT_FRIENDS_LIST.map((friend) => (
                <div
                  key={friend.id}
                  onClick={() => {
                    robloxAudio.playClick();
                    onLaunchGame(friend.activity);
                  }}
                  className="flex flex-col items-center min-w-[70px] cursor-pointer group text-center"
                >
                  {/* Friend circular portrait */}
                  <div className="relative mb-1">
                    <div
                      style={{ backgroundColor: friend.avatarBg }}
                      className="w-16 h-16 rounded-full border-2 border-zinc-700/80 group-hover:border-white/60 flex items-center justify-center text-2xl shadow-md transition-transform group-hover:scale-105"
                    >
                      {friend.avatarFace}
                    </div>
                    {/* Status green dot */}
                    <span className="absolute bottom-0 right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#232527]" />
                  </div>

                  {/* Friend Username */}
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                    <span className="text-[11px] font-bold text-zinc-200 truncate max-w-[68px] leading-tight group-hover:text-white">
                      {friend.name}
                    </span>
                  </div>

                  {/* Activity text beneath */}
                  <span className="text-[10px] text-zinc-400 truncate max-w-[72px] leading-tight mt-0.5">
                    {friend.activity}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION B: CONTINUE (MATCHING REFERENCE IMAGE) */}
          <section className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm sm:text-base font-extrabold text-white">
                Continue
              </h2>
              <button
                onClick={() => {
                  robloxAudio.playClick();
                }}
                className="px-3 py-1 rounded-full border border-zinc-700 hover:border-zinc-500 bg-[#2b2d31] hover:bg-[#34373d] text-xs font-semibold text-zinc-300 transition-colors cursor-pointer"
              >
                See All
              </button>
            </div>

            {/* Grid / Horizontal Row of Continue Games */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {EXACT_CONTINUE_GAMES.map((game) => (
                <div
                  key={game.id}
                  onClick={() => handleCardClick(game)}
                  className="group flex flex-col justify-between cursor-pointer"
                >
                  {/* Game Thumbnail Card */}
                  <div
                    style={{ backgroundColor: game.thumbnailBg }}
                    className="w-full aspect-square rounded-2xl border border-zinc-700/60 group-hover:border-zinc-400 relative overflow-hidden transition-all group-hover:scale-102 shadow-md flex items-center justify-center p-2 text-center"
                  >
                    <RenderCustomGameArt art={game.customArt} title={game.title} />

                    {/* Hover Play Button */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-xl transform scale-90 group-hover:scale-100 transition-transform">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>
                  </div>

                  {/* Game Title */}
                  <h3 className="text-xs font-bold text-zinc-200 group-hover:text-white truncate mt-1.5 leading-snug">
                    {game.title}
                  </h3>

                  {/* Stats (e.g. "4 Friends" or "👍 83% 👥 8.5K") */}
                  <span className="text-[10px] text-zinc-400 font-medium block truncate mt-0.5">
                    {game.stats}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION C: RECOMMENDED FOR YOU (MATCHING REFERENCE IMAGE) */}
          <section className="space-y-2.5 pb-8">
            <div className="flex items-center justify-between">
              <h2 className="text-sm sm:text-base font-extrabold text-white">
                Recommended For You
              </h2>
            </div>

            {/* Grid of Recommended Games */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {EXACT_RECOMMENDED_GAMES.map((game) => (
                <div
                  key={game.id}
                  onClick={() => handleCardClick(game)}
                  className="group flex flex-col justify-between cursor-pointer"
                >
                  <div
                    style={{ backgroundColor: game.thumbnailBg }}
                    className="w-full aspect-square rounded-2xl border border-zinc-700/60 group-hover:border-zinc-400 relative overflow-hidden transition-all group-hover:scale-102 shadow-md flex items-center justify-center p-2 text-center"
                  >
                    <RenderCustomGameArt art={game.customArt} title={game.title} />

                    {/* Hover Play Button */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-xl transform scale-90 group-hover:scale-100 transition-transform">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xs font-bold text-zinc-200 group-hover:text-white truncate mt-1.5 leading-snug">
                    {game.title}
                  </h3>

                  <span className="text-[10px] text-zinc-400 font-medium block truncate mt-0.5">
                    {game.stats}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>

      {/* 4. GAME DETAILS & LAUNCH MODAL */}
      {selectedGame && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none font-sans">
          <div className="relative w-full max-w-xl bg-[#191b1d] border border-zinc-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            {/* Banner */}
            <div
              style={{ backgroundColor: selectedGame.thumbnailBg }}
              className="w-full h-44 relative flex items-center justify-center p-4 shadow-inner overflow-hidden"
            >
              <RenderCustomGameArt art={selectedGame.customArt} title={selectedGame.title} isLarge />
              <button
                onClick={() => setSelectedGame(null)}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4 overflow-y-auto">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-black text-white leading-tight">
                    {selectedGame.title}
                  </h2>
                  <span className="text-xs text-zinc-400 block mt-1">
                    Stats: <strong className="text-emerald-400">{selectedGame.stats}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {(selectedGame.id === 'g_avatar_creator' || selectedGame.id === 'g_catalog') && (
                    <button
                      onClick={() => {
                        setSelectedGame(null);
                        onOpenCatalog();
                      }}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg transition active:scale-95 cursor-pointer"
                    >
                      <span>🛍️</span>
                      <span>ABRIR CATÁLOGO</span>
                    </button>
                  )}

                  {/* Big Green Play Button */}
                  <button
                    onClick={() => {
                      handleStartPlay(selectedGame);
                      setSelectedGame(null);
                    }}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-900/40 transition-all hover:scale-105 active:scale-95 cursor-pointer flex-shrink-0"
                  >
                    <Play className="w-5 h-5 fill-current" />
                    <span>JOGAR</span>
                  </button>
                </div>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed">
                Entre agora neste clássico do Roblox! Desenvolvido com física realista de blocos,
                avatares R6 personalizáveis, suporte completo a arquivos .RBL e ferramentas autênticas.
              </p>

              <div className="p-3.5 rounded-xl bg-[#232527] border border-zinc-700 text-xs space-y-1.5 text-zinc-400">
                <div className="flex justify-between">
                  <span>Desenvolvedor:</span>
                  <span className="text-blue-400 font-semibold">Roblox Community Studio</span>
                </div>
                <div className="flex justify-between">
                  <span>Compatibilidade:</span>
                  <span className="text-emerald-400 font-semibold">Motor 3D WebGL / R6 Engine</span>
                </div>
                <div className="flex justify-between">
                  <span>Suporte a Arquivos:</span>
                  <span className="text-white font-mono font-semibold">.RBL, .RBXM, .OBJ, .GLTF</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Procedural Art Renderer for the exact Roblox game covers in the screenshot
 */
function RenderCustomGameArt({
  art,
  title,
  isLarge,
}: {
  art: RobloxGameItem['customArt'];
  title: string;
  isLarge?: boolean;
}) {
  switch (art) {
    case 'mm2':
      return (
        <div className="w-full h-full flex flex-col items-center justify-center relative bg-gradient-to-b from-cyan-900/80 to-blue-950">
          <div className="text-3xl filter drop-shadow-[0_0_12px_#00e5ff]">🗡️</div>
          <span className="text-[10px] font-black text-cyan-300 tracking-wider mt-1 drop-shadow">
            MM2
          </span>
        </div>
      );
    case 'avatar_creator':
      return (
        <div className="w-full h-full grid grid-cols-2 gap-1 p-1 bg-gradient-to-br from-pink-900 to-indigo-950">
          <div className="bg-cyan-500/30 rounded flex items-center justify-center text-xs">👕</div>
          <div className="bg-pink-500/30 rounded flex items-center justify-center text-xs">🧢</div>
          <div className="bg-amber-500/30 rounded flex items-center justify-center text-xs">👖</div>
          <div className="bg-emerald-500/30 rounded flex items-center justify-center text-xs">✨</div>
        </div>
      );
    case 'evade':
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-black relative">
          <div className="text-3xl mb-1 filter drop-shadow-[0_0_8px_#ffd600]">🙂</div>
          <span className="text-xs font-black text-amber-400 tracking-widest uppercase">
            EVADE
          </span>
        </div>
      );
    case 'spray_paint':
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-zinc-800 to-zinc-900">
          <div className="text-3xl">🎨</div>
          <span className="text-[9px] font-bold text-zinc-300">Spray Paint</span>
        </div>
      );
    case 'doors':
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-[#24170d] border border-amber-900/60">
          <span className="text-[9px] font-mono text-amber-500/80 border border-amber-800 px-1 rounded mb-1">
            0013
          </span>
          <span className="text-xs font-black text-amber-200 tracking-wider">DOORS 👁</span>
        </div>
      );
    case 'skibidi':
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-indigo-950 to-black">
          <div className="text-2xl mb-1">🚽⚡</div>
          <span className="text-[9px] font-black text-blue-300 text-center leading-none">
            DEFENSE
          </span>
        </div>
      );
    case 'catalog':
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-red-900 to-amber-950">
          <div className="text-2xl">👑🦖</div>
          <span className="text-[9px] font-black text-amber-300">Avatar Maker</span>
        </div>
      );
    case 'brookhaven':
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-emerald-900 to-teal-950">
          <div className="text-2xl mb-1">🏡🌳</div>
          <span className="text-[10px] font-black text-emerald-200 tracking-wider">
            BROOKHAVEN
          </span>
        </div>
      );
    case 'rec_it':
      return (
        <div className="w-full h-full flex items-center justify-center bg-black">
          <span className="text-4xl font-black text-red-500 font-mono">R</span>
        </div>
      );
    case 'homework':
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-[#451a03]">
          <span className="text-[9px] text-amber-200 font-bold">pls no me!</span>
          <div className="text-2xl my-0.5">🐧</div>
          <span className="text-[8px] bg-red-600 text-white font-extrabold px-1 rounded">
            UPDATE
          </span>
        </div>
      );
    case 'sus_hangout':
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-purple-950 to-pink-950">
          <div className="text-2xl">🐱🛋️</div>
          <span className="text-[9px] font-bold text-pink-300">Neko Hangout</span>
        </div>
      );
    case 'adopt_me':
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-sky-600 to-sky-900">
          <div className="text-2xl mb-0.5">🐶🐱</div>
          <span className="text-[10px] font-black text-amber-300 drop-shadow">ADOPT ME!</span>
        </div>
      );
    case 'bloxburg':
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-emerald-700 to-emerald-950">
          <div className="text-2xl mb-0.5">👷‍♂️🏡</div>
          <span className="text-[9px] font-black text-white text-center leading-none">
            BLOXBURG
          </span>
        </div>
      );
    case 'make_art':
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-green-800 to-amber-900">
          <span className="text-[9px] font-black text-amber-300 text-center leading-none">
            MAKE ART!
          </span>
          <span className="text-[10px] font-black text-white">EARN $$</span>
        </div>
      );
    case 'action_sword':
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-sky-800 to-blue-950">
          <div className="text-3xl filter drop-shadow">🗡️🌊</div>
        </div>
      );
    case 'gods_will':
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-stone-900 to-amber-950">
          <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">
            GODS WILL
          </span>
        </div>
      );
    default:
      return (
        <span className="text-xs font-extrabold text-white px-2 text-center drop-shadow">
          {title}
        </span>
      );
  }
}
