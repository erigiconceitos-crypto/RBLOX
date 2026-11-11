import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types/roblox';
import { Send, Smile } from 'lucide-react';

interface ChatBoxProps {
  isOpen: boolean;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onTriggerEmote: (emote: string) => void;
  onClose: () => void;
}

export const ChatBox: React.FC<ChatBoxProps> = ({
  isOpen,
  messages,
  onSendMessage,
  onTriggerEmote,
}) => {
  const [inputText, setInputText] = useState('');
  const [showEmotes, setShowEmotes] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed) return;

    // Check special commands
    if (trimmed.startsWith('/e ')) {
      const emote = trimmed.replace('/e ', '').toLowerCase();
      onTriggerEmote(emote);
    }

    onSendMessage(trimmed);
    setInputText('');
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-14 left-3 z-20 w-80 sm:w-96 rounded-xl bg-zinc-950/80 backdrop-blur-md border border-zinc-800 shadow-2xl overflow-hidden flex flex-col pointer-events-auto select-none">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-900/90 border-b border-zinc-800 text-xs">
        <span className="font-semibold text-zinc-300 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          Chat do Servidor
        </span>
        <span className="text-[10px] text-zinc-500">Pressione Enter para enviar</span>
      </div>

      {/* Message List */}
      <div
        ref={scrollRef}
        className="h-44 overflow-y-auto p-2.5 space-y-1.5 text-xs text-zinc-200 font-sans"
      >
        {messages.map((msg) => (
          <div key={msg.id} className="leading-snug break-words">
            {msg.isSystem ? (
              <span className="text-amber-400 font-semibold italic">
                [Sistema]: {msg.text}
              </span>
            ) : (
              <>
                <span className="font-bold text-blue-400 mr-1.5">
                  [{msg.sender}]:
                </span>
                <span className="text-zinc-100">{msg.text}</span>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Quick Emote Row */}
      {showEmotes && (
        <div className="flex items-center gap-1 px-2.5 py-1.5 bg-zinc-900/95 border-t border-zinc-800">
          <button
            type="button"
            onClick={() => {
              onTriggerEmote('dance');
              onSendMessage('/e dance');
              setShowEmotes(false);
            }}
            className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-[11px] text-zinc-200 cursor-pointer"
          >
            🕺 Dançar
          </button>
          <button
            type="button"
            onClick={() => {
              onTriggerEmote('wave');
              onSendMessage('/e wave');
              setShowEmotes(false);
            }}
            className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-[11px] text-zinc-200 cursor-pointer"
          >
            👋 Acenar
          </button>
          <button
            type="button"
            onClick={() => {
              onTriggerEmote('cheer');
              onSendMessage('/e cheer');
              setShowEmotes(false);
            }}
            className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-[11px] text-zinc-200 cursor-pointer"
          >
            🎉 Comemorar
          </button>
        </div>
      )}

      {/* Input Field */}
      <form onSubmit={handleSubmit} className="flex items-center p-1.5 bg-zinc-900/70 border-t border-zinc-800 gap-1.5">
        <button
          type="button"
          onClick={() => setShowEmotes(!showEmotes)}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors cursor-pointer"
          title="Emotes (/e dance)"
        >
          <Smile className="w-4 h-4" />
        </button>

        <input
          ref={inputRef}
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Digite /e dance ou converse..."
          className="flex-1 bg-zinc-950/80 border border-zinc-700/80 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
          maxLength={100}
        />

        <button
          type="submit"
          aria-label="Enviar mensagem"
          className="p-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
