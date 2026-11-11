import React, { useState, useMemo } from 'react';
import {
  Search,
  X,
  Sparkles,
  Check,
  Tag,
  Copy,
  Layers,
  Shield,
  Zap,
  Sword,
  Smile,
  Crown,
  Trash2,
} from 'lucide-react';
import { CatalogItem, CatalogItemType, PlayerAvatarConfig, ToolItem } from '../types/roblox';
import {
  OFFICIAL_ROBLOX_CATALOG,
  extractCatalogAssetId,
  resolveCatalogItem,
  equipCatalogItem,
  unequipCatalogItem,
} from '../utils/robloxCatalog';
import { robloxAudio } from '../utils/audio';

interface RobloxCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: PlayerAvatarConfig;
  onUpdateConfig: (newConfig: PlayerAvatarConfig) => void;
  onEquipNewTool?: (tool: ToolItem) => void;
  robuxBalance: number;
}

export function RobloxCatalogModal({
  isOpen,
  onClose,
  config,
  onUpdateConfig,
  onEquipNewTool,
  robuxBalance,
}: RobloxCatalogModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [codeInput, setCodeInput] = useState('');
  const [statusFeedback, setStatusFeedback] = useState<{ message: string; isError?: boolean } | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const equippedItems = useMemo(() => config.equippedCatalogItems || [], [config.equippedCatalogItems]);

  const categories: { id: string; label: string; icon: React.ReactNode }[] = [
    { id: 'All', label: 'Todos', icon: <Layers className="w-4 h-4" /> },
    { id: 'Hat', label: 'Chapéus & Cabelos', icon: <Crown className="w-4 h-4" /> },
    { id: 'Face', label: 'Rostos', icon: <Smile className="w-4 h-4" /> },
    { id: 'Back', label: 'Costas & Asas', icon: <Shield className="w-4 h-4" /> },
    { id: 'Gear', label: 'Gears & Armas', icon: <Sword className="w-4 h-4" /> },
    { id: 'Equipped', label: `Equipados (${equippedItems.length})`, icon: <Check className="w-4 h-4" /> },
  ];

  // Quick preset codes for user convenience
  const popularPresets = [
    { id: 1365551, name: 'Valkyrie Helm' },
    { id: 21070012, name: 'Dominus Empyreus' },
    { id: 11884330, name: 'Illumina' },
    { id: 124115669, name: 'Darkheart' },
    { id: 49429119, name: 'Super Super Happy Face' },
    { id: 140305753, name: 'Wings of Archangel' },
    { id: 100929604, name: 'Sparkle Time Fedora' },
    { id: 1285307, name: 'Subspace Tripmine' },
  ];

  const filteredItems = useMemo(() => {
    let items = OFFICIAL_ROBLOX_CATALOG;

    if (selectedCategory === 'Equipped') {
      return equippedItems;
    }

    if (selectedCategory !== 'All') {
      if (selectedCategory === 'Hat') {
        items = items.filter((it) => it.itemType === 'Hat' || it.itemType === 'Hair');
      } else {
        items = items.filter((it) => it.itemType === selectedCategory);
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      items = items.filter(
        (it) =>
          it.name.toLowerCase().includes(q) ||
          it.id.toString().includes(q) ||
          it.creator.toLowerCase().includes(q)
      );
    }

    return items;
  }, [selectedCategory, searchQuery, equippedItems]);

  // Handle direct code loading & equip
  const handleLoadByCode = (customId?: number) => {
    const assetId = customId !== undefined ? customId : extractCatalogAssetId(codeInput);

    if (!assetId) {
      setStatusFeedback({
        message: 'Por favor, insira um ID de item numérico válido ou link do catálogo (ex: 1365551).',
        isError: true,
      });
      robloxAudio.playOof();
      return;
    }

    const resolved = resolveCatalogItem(assetId);
    handleEquip(resolved);
    setCodeInput('');
    setStatusFeedback({
      message: `Item #${resolved.id} (${resolved.name}) carregado e equipado com sucesso!`,
    });
    setTimeout(() => setStatusFeedback(null), 4000);
  };

  const handleEquip = (item: CatalogItem) => {
    const { newConfig, newTool } = equipCatalogItem(config, item);
    onUpdateConfig(newConfig);

    if (newTool && onEquipNewTool) {
      onEquipNewTool(newTool);
    }

    robloxAudio.playClick();
  };

  const handleUnequip = (itemId: number) => {
    const updated = unequipCatalogItem(config, itemId);
    onUpdateConfig(updated);
    robloxAudio.playClick();
  };

  const handleClearAll = () => {
    onUpdateConfig({
      ...config,
      hat: 'none',
      face: 'smile',
      backAccessory: 'none',
      equippedCatalogItems: [],
    });
    robloxAudio.playClick();
  };

  const handleCopyId = (id: number) => {
    navigator.clipboard?.writeText(id.toString());
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fadeIn">
      <div className="flex flex-col w-full max-w-5xl h-[88vh] bg-[#191b1d] border border-white/10 rounded-2xl shadow-2xl overflow-hidden text-white">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#232527]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-black font-black text-xl shadow-lg">
              🛍️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight text-white">Catálogo do Roblox (Avatar Shop)</h2>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Item ID Engine v3.0
                </span>
              </div>
              <p className="text-xs text-white/50">
                Insira qualquer ID de item do catálogo oficial para equipar chapéus, rostos, asas e armas reais!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Robux Balance */}
            <div className="flex items-center gap-2 bg-black/40 px-3.5 py-1.5 rounded-full border border-amber-500/30">
              <div className="w-5 h-5 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-amber-400">
                  <path
                    d="M12 2L20.5 7V17L12 22L3.5 17V7L12 2Z"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    fill="currentColor"
                    fillOpacity="0.2"
                  />
                  <circle cx="12" cy="12" r="3" fill="currentColor" />
                </svg>
              </div>
              <span className="text-sm font-bold text-amber-300">{robuxBalance.toLocaleString()}</span>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition"
              aria-label="Fechar catálogo"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PROMINENT ASSET ID INPUT BAR (Direct User Requirement) */}
        <div className="px-6 py-3.5 bg-gradient-to-r from-[#2a1b3d] via-[#1f2329] to-[#1a2332] border-b border-purple-500/20">
          <div className="flex flex-col md:flex-row gap-2.5 items-stretch md:items-center">
            <div className="relative flex-1">
              <Zap className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
              <input
                type="text"
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLoadByCode()}
                placeholder="Cole o link ou digite o código ID do item (ex: 1365551, 21070012, 11884330)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/60 border border-purple-500/40 text-sm text-white placeholder-white/40 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
              />
            </div>

            <button
              onClick={() => handleLoadByCode()}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white shadow-lg shadow-emerald-950/40 cursor-pointer active:scale-95 transition"
            >
              <Sparkles className="w-4 h-4" />
              Carregar & Equipar pelo Código
            </button>
          </div>

          {/* Quick preset chips */}
          <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto pb-1 text-xs text-white/70">
            <span className="font-semibold text-white/40 flex-shrink-0">Exemplos populares:</span>
            {popularPresets.map((p) => (
              <button
                key={p.id}
                onClick={() => handleLoadByCode(p.id)}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 border border-white/5 hover:border-amber-400/40 text-white/80 hover:text-amber-300 transition flex-shrink-0 cursor-pointer text-[11px]"
              >
                {p.name} <span className="text-white/40 font-mono">({p.id})</span>
              </button>
            ))}
          </div>

          {/* Status Feedback Toast */}
          {statusFeedback && (
            <div
              className={`mt-2 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 ${
                statusFeedback.isError
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}
            >
              {statusFeedback.isError ? '⚠️' : '✓'} {statusFeedback.message}
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Main Items Catalog */}
          <div className="flex-1 flex flex-col p-6 overflow-hidden">
            {/* Filter Tabs & Search */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {categories.map((cat) => {
                  const isActive = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex-shrink-0 ${
                        isActive
                          ? 'bg-white text-black shadow-md'
                          : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {cat.icon}
                      {cat.label}
                    </button>
                  );
                })}
              </div>

              {/* Search Box */}
              <div className="relative min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Pesquisar por nome ou ID..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white/30"
                />
              </div>
            </div>

            {/* Items Grid */}
            <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 content-start">
              {filteredItems.map((item) => {
                const isEquipped = equippedItems.some((eq) => eq.id === item.id);
                return (
                  <div
                    key={item.id}
                    className={`group relative flex flex-col bg-[#232527] border rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl ${
                      isEquipped ? 'border-emerald-500 shadow-emerald-950/30' : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    {/* Item Image with Fallback */}
                    <div className="relative w-full aspect-square bg-[#191b1d] p-3 flex items-center justify-center overflow-hidden">
                      <img
                        src={item.thumbnailUrl}
                        alt={item.name}
                        className="w-full h-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-200"
                        onError={(e) => {
                          // Fallback icon visual if CDN has CORS
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      {/* Badge if Classic */}
                      {item.isClassic && (
                        <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          CLASSIC
                        </span>
                      )}

                      {/* Equipped Check Badge */}
                      {isEquipped && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-black font-bold shadow-md">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </div>

                    {/* Card Info */}
                    <div className="flex flex-col p-3 flex-1 justify-between bg-[#232527]">
                      <div>
                        {/* Title */}
                        <h4 className="font-bold text-xs text-white truncate group-hover:text-amber-400 transition" title={item.name}>
                          {item.name}
                        </h4>
                        <div className="text-[10px] text-white/50 truncate mb-1">
                          Por {item.creator}
                        </div>

                        {/* ID Tag with Copy */}
                        <div className="flex items-center justify-between text-[11px] mb-2">
                          <button
                            onClick={() => handleCopyId(item.id)}
                            className="flex items-center gap-1 font-mono text-[10px] text-white/40 hover:text-white transition cursor-pointer"
                            title="Clique para copiar o ID"
                          >
                            <Tag className="w-3 h-3 text-white/30" />
                            ID: {item.id}
                            {copiedId === item.id ? (
                              <Check className="w-2.5 h-2.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-2.5 h-2.5" />
                            )}
                          </button>

                          {/* Price Tag */}
                          <div className="flex items-center gap-1 font-bold text-amber-400 text-xs">
                            <span className="text-[10px]">R$</span>
                            {item.priceRobux > 0 ? item.priceRobux.toLocaleString() : 'Grátis'}
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      {isEquipped ? (
                        <button
                          onClick={() => handleUnequip(item.id)}
                          className="w-full py-1.5 rounded-lg text-xs font-semibold bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 transition cursor-pointer active:scale-95 flex items-center justify-center gap-1.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Remover
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEquip(item)}
                          className={`w-full py-1.5 rounded-lg text-xs font-bold transition cursor-pointer active:scale-95 flex items-center justify-center gap-1.5 ${
                            item.itemType === 'Gear'
                              ? 'bg-purple-600 hover:bg-purple-500 text-white'
                              : 'bg-white hover:bg-white/90 text-black'
                          }`}
                        >
                          {item.itemType === 'Gear' ? (
                            <>
                              <Sword className="w-3.5 h-3.5" />
                              Equipar Ferramenta
                            </>
                          ) : (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              Equipar no Avatar
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

              {filteredItems.length === 0 && (
                <div className="col-span-full py-16 flex flex-col items-center justify-center text-white/40">
                  <div className="text-4xl mb-3">🔍</div>
                  <p className="text-sm font-semibold">Nenhum item encontrado nesta categoria.</p>
                  <p className="text-xs mt-1">Experimente digitar o ID do item na barra acima para carregá-lo instantaneamente!</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar: Avatar Summary & Equipped Drawer */}
          <div className="w-80 border-l border-white/10 bg-[#1e2022] p-5 flex flex-col justify-between hidden lg:flex">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                <h3 className="font-bold text-sm text-white">Avatar Atual</h3>
                {equippedItems.length > 0 && (
                  <button
                    onClick={handleClearAll}
                    className="text-xs text-rose-400 hover:text-rose-300 transition cursor-pointer"
                  >
                    Desequipar Tudo
                  </button>
                )}
              </div>

              {/* Player Summary Card */}
              <div className="p-4 rounded-xl bg-black/40 border border-white/10 mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-md border border-white/20"
                    style={{ backgroundColor: config.torsoColor }}
                  >
                    🤠
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white">{config.displayName}</div>
                    <div className="text-xs text-white/50">@{config.name}</div>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-400">
                      R6 Classic Mesh
                    </span>
                  </div>
                </div>

                {/* Base Attributes */}
                <div className="text-xs text-white/60 space-y-1.5 pt-2 border-t border-white/10">
                  <div className="flex justify-between">
                    <span>Chapéu ativo:</span>
                    <span className="font-medium text-white capitalize">{config.hat}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rosto:</span>
                    <span className="font-medium text-white capitalize">{config.face}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Acessório Costas:</span>
                    <span className="font-medium text-white capitalize">{config.backAccessory}</span>
                  </div>
                </div>
              </div>

              {/* Currently Equipped Items List */}
              <h4 className="text-xs font-bold text-white/70 uppercase tracking-wider mb-2">
                Itens de Catálogo Equipados ({equippedItems.length})
              </h4>
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {equippedItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/10 text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded bg-black/40 p-0.5 flex-shrink-0">
                        <img src={item.thumbnailUrl} alt={item.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="truncate">
                        <div className="font-semibold text-white truncate">{item.name}</div>
                        <div className="text-[10px] text-white/40 font-mono">ID: {item.id}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleUnequip(item.id)}
                      className="p-1 rounded hover:bg-rose-500/20 text-white/40 hover:text-rose-400 transition cursor-pointer"
                      title="Desequipar item"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                {equippedItems.length === 0 && (
                  <div className="py-6 text-center text-xs text-white/30 border border-dashed border-white/10 rounded-xl">
                    Nenhum item de catálogo equipado.
                    <br />
                    Selecione um item ou digite um ID!
                  </div>
                )}
              </div>
            </div>

            {/* Ready to Play Button */}
            <div className="pt-4 border-t border-white/10">
              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-950/40 transition cursor-pointer active:scale-95 flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                Concluir & Voltar ao Jogo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
