import React, { useState, useRef } from 'react';
import { RobloxPart } from '../types/roblox';
import { parseRblFile, exportToRblXml, exportToRblJson } from '../utils/rblParser';
import { PRESET_ROBLOX_MODELS } from '../game/presets';
import { robloxAudio } from '../utils/audio';
import {
  UploadCloud,
  FileCode,
  FolderOpen,
  Download,
  Package,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  Plus
} from 'lucide-react';

interface ModelImporterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportParts: (parts: RobloxPart[], modelName: string) => void;
  currentWorldParts: RobloxPart[];
}

export const ModelImporterModal: React.FC<ModelImporterModalProps> = ({
  isOpen,
  onClose,
  onImportParts,
  currentWorldParts,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste' | 'presets' | 'export'>('upload');
  const [pasteContent, setPasteContent] = useState('');
  const [modelNameInput, setModelNameInput] = useState('MeuModelo');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileProcess = async (file: File) => {
    try {
      const text = await file.text();
      const parsed = parseRblFile(text, file.name);

      if (parsed.parts.length === 0) {
        setStatusMessage({
          type: 'error',
          text: `Nenhuma parte válida encontrada no arquivo "${file.name}". Verifique o formato RBL, XML ou OBJ.`,
        });
        return;
      }

      onImportParts(parsed.parts, parsed.name);
      robloxAudio.playCheckpoint();
      setStatusMessage({
        type: 'success',
        text: `Sucesso! Importadas ${parsed.parts.length} partes do modelo "${parsed.name}".`,
      });

      setTimeout(() => {
        onClose();
        setStatusMessage(null);
      }, 1200);
    } catch (err) {
      console.error(err);
      setStatusMessage({
        type: 'error',
        text: 'Erro ao ler arquivo. Certifique-se de que é um arquivo de texto válido (.rbl, .rbxm, .obj, .json).',
      });
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const handlePasteImport = () => {
    const trimmed = pasteContent.trim();
    if (!trimmed) {
      setStatusMessage({ type: 'error', text: 'Por favor, cole o código RBL (XML ou JSON) primeiro.' });
      return;
    }

    const parsed = parseRblFile(trimmed, `${modelNameInput}.rbl`);
    if (parsed.parts.length === 0) {
      setStatusMessage({
        type: 'error',
        text: 'Não foi possível interpretar o código colado. Verifique se possui tags <roblox> ou formato JSON com lista de partes.',
      });
      return;
    }

    onImportParts(parsed.parts, modelNameInput);
    robloxAudio.playCheckpoint();
    setStatusMessage({
      type: 'success',
      text: `Sucesso! Importadas ${parsed.parts.length} partes com sucesso.`,
    });

    setTimeout(() => {
      onClose();
      setStatusMessage(null);
    }, 1200);
  };

  const handleSpawnPreset = (preset: typeof PRESET_ROBLOX_MODELS[0]) => {
    // Generate preset at ground location in front of player
    const parts = preset.generate(0, 10);
    onImportParts(parts, preset.name);
    robloxAudio.playCheckpoint();
    setStatusMessage({
      type: 'success',
      text: `Modelo "${preset.name}" (${parts.length} partes) adicionado ao mundo!`,
    });

    setTimeout(() => {
      onClose();
      setStatusMessage(null);
    }, 1000);
  };

  const handleExport = (format: 'xml' | 'json') => {
    const content =
      format === 'xml'
        ? exportToRblXml(currentWorldParts, modelNameInput || 'RobloxPlace')
        : exportToRblJson(currentWorldParts, modelNameInput || 'RobloxPlace');

    const extension = format === 'xml' ? 'rbl' : 'json';
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${modelNameInput || 'RobloxWorld'}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    robloxAudio.playClick();
    setStatusMessage({
      type: 'success',
      text: `Arquivo .${extension} exportado com sucesso!`,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm select-none">
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-zinc-950 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">
                Importador de Modelos &amp; Arquivos RBL
              </h2>
              <p className="text-xs text-zinc-400">
                Importe arquivos .rbl, .rbxm, .obj ou modelos 3D para o seu jogo
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar janela"
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center px-5 pt-3 gap-2 bg-zinc-950/60 border-b border-zinc-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-1.5 px-3 py-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'upload'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>Arrastar &amp; Soltar</span>
          </button>
          <button
            onClick={() => setActiveTab('presets')}
            className={`flex items-center gap-1.5 px-3 py-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'presets'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Modelos Prontos</span>
          </button>
          <button
            onClick={() => setActiveTab('paste')}
            className={`flex items-center gap-1.5 px-3 py-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'paste'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>Colar RBL / XML</span>
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`flex items-center gap-1.5 px-3 py-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'export'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Exportar</span>
          </button>
        </div>

        {/* Status notification */}
        {statusMessage && (
          <div
            className={`mx-5 mt-3 p-3 rounded-lg flex items-center gap-2 text-xs font-medium ${
              statusMessage.type === 'success'
                ? 'bg-emerald-950/80 border border-emerald-700 text-emerald-200'
                : 'bg-rose-950/80 border border-rose-700 text-rose-200'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Tab Content */}
        <div className="p-5 overflow-y-auto flex-1">
          {activeTab === 'upload' && (
            <div className="space-y-4">
              {/* Drag and Drop Box */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleFileDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`flex flex-col items-center justify-center p-8 rounded-xl border-2 border-dashed transition-all cursor-pointer ${
                  isDragging
                    ? 'border-blue-400 bg-blue-950/40 text-blue-300'
                    : 'border-zinc-700 hover:border-zinc-500 bg-zinc-950/50 text-zinc-400'
                }`}
              >
                <div className="p-4 rounded-full bg-zinc-800 text-blue-400 mb-3">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <p className="text-sm font-semibold text-white mb-1">
                  Arraste e solte o arquivo aqui, ou clique para procurar
                </p>
                <p className="text-xs text-zinc-400 text-center max-w-md">
                  Suporta arquivos Roblox <strong className="text-blue-400">.RBL</strong>,{' '}
                  <strong className="text-blue-400">.RBXM</strong>,{' '}
                  <strong className="text-blue-400">.RBXLX</strong>,{' '}
                  <strong className="text-blue-400">.OBJ</strong> e{' '}
                  <strong className="text-blue-400">.JSON</strong>
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".rbl,.rbxm,.rbxl,.rbxlx,.obj,.json,.txt"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {/* Supported formats explanation */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-800">
                  <span className="font-semibold text-blue-400">Arquivos Roblox (.rbl, .rbxm)</span>
                  <p className="text-zinc-400 mt-1 leading-relaxed">
                    Carrega automaticamente peças, cores de tijolo (BrickColor), tamanhos e posições.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-800">
                  <span className="font-semibold text-amber-400">Modelos 3D (.obj, .gltf)</span>
                  <p className="text-zinc-400 mt-1 leading-relaxed">
                    Importa geometrias 3D convertendo vértices e polígonos em MeshParts utilizáveis.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'presets' && (
            <div className="space-y-3">
              <p className="text-xs text-zinc-400">
                Escolha um dos modelos icônicos abaixo para inserir instantaneamente no seu mundo:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PRESET_ROBLOX_MODELS.map((preset) => (
                  <div
                    key={preset.id}
                    className="flex flex-col justify-between p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-800 hover:border-zinc-600 transition-colors"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-white">{preset.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
                          {preset.category}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed mb-3">
                        {preset.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80">
                      <span className="text-[11px] text-zinc-500 font-mono">
                        {preset.partsCount} partes
                      </span>
                      <button
                        onClick={() => handleSpawnPreset(preset)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Adicionar</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'paste' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Nome do Modelo:
                </label>
                <input
                  type="text"
                  value={modelNameInput}
                  onChange={(e) => setModelNameInput(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Código RBL / XML ou JSON:
                </label>
                <textarea
                  value={pasteContent}
                  onChange={(e) => setPasteContent(e.target.value)}
                  placeholder={`<roblox version="4">\n  <Item class="Part">\n    <Properties>\n      <string name="Name">MyPart</string>\n      <Vector3 name="size"><X>4</X><Y>2</Y><Z>4</Z></Vector3>\n    </Properties>\n  </Item>\n</roblox>`}
                  rows={8}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-xs font-mono text-zinc-200 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <button
                onClick={handlePasteImport}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Interpretar e Carregar Modelo</span>
              </button>
            </div>
          )}

          {activeTab === 'export' && (
            <div className="space-y-4">
              <p className="text-xs text-zinc-400 leading-relaxed">
                Exporte todo o seu mapa e criações para um arquivo <strong className="text-white">.RBL</strong> compatível ou em formato <strong className="text-white">JSON</strong>:
              </p>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Nome do Arquivo Exportado:
                </label>
                <input
                  type="text"
                  value={modelNameInput}
                  onChange={(e) => setModelNameInput(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="p-3.5 rounded-lg bg-zinc-950/80 border border-zinc-800 text-xs">
                <span className="text-zinc-400">Total de partes no mundo atual:</span>
                <span className="ml-2 font-bold text-white">{currentWorldParts.length}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleExport('xml')}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4 text-blue-400" />
                  <span>Baixar .RBL (XML)</span>
                </button>
                <button
                  onClick={() => handleExport('json')}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>Baixar .JSON</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
