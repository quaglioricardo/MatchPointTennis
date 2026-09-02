import React, { useState } from 'react';
import { useTennis } from '../context/TennisContext';
import { ChatChannel, ChatMessage, Player } from '../types';
import { 
  MessageSquare, 
  Send, 
  ShieldCheck, 
  Users, 
  Plus, 
  Search, 
  Smile, 
  Sparkles, 
  Swords, 
  CheckCheck,
  Calendar
} from 'lucide-react';

interface ChatViewProps {
  onOpenBookingModalWithPartner?: (partnerId: string) => void;
}

export const ChatView: React.FC<ChatViewProps> = ({ onOpenBookingModalWithPartner }) => {
  const { 
    currentUser, 
    players, 
    channels, 
    messages, 
    activeChannelId, 
    setActiveChannelId, 
    sendMessage, 
    openDirectChatWithPlayer,
    setSelectedPlayerId
  } = useTennis();

  const [inputMessage, setInputMessage] = useState<string>('');
  const [showNewChatModal, setShowNewChatModal] = useState<boolean>(false);
  const [searchContact, setSearchContact] = useState<string>('');

  const currentChannel = channels.find(c => c.id === activeChannelId) || channels[0];
  const channelMessages = messages.filter(m => m.channelId === currentChannel.id);

  // If DM, find the other player
  const otherPlayerId = currentChannel.participantIds?.find(id => id !== currentUser.id);
  const otherPlayer = otherPlayerId ? players.find(p => p.id === otherPlayerId) : null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    sendMessage(currentChannel.id, inputMessage);
    setInputMessage('');
  };

  const handleSendQuickEmoji = (emoji: string) => {
    setInputMessage(prev => prev + emoji);
  };

  const handleQuickTemplate = (text: string) => {
    sendMessage(currentChannel.id, text);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[620px]">
      
      {/* Left Sidebar: Channels & Conversations (4 cols) */}
      <div className="md:col-span-4 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50/50 dark:bg-slate-900/50">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-600" />
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
              Mensagens & Canais
            </h3>
          </div>

          <button
            onClick={() => setShowNewChatModal(true)}
            className="w-7 h-7 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center transition-colors shadow-sm"
            title="Nova conversa direta"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Channel Categories & List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1 mt-1">
            Canais da Comunidade
          </p>

          {channels.filter(c => c.type !== 'direct').map(c => {
            const isSelected = c.id === currentChannel.id;
            return (
              <div
                key={c.id}
                onClick={() => setActiveChannelId(c.id)}
                className={`p-3 rounded-2xl cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-emerald-100/70 dark:bg-emerald-950/40 border border-emerald-500/40 shadow-sm'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                    {c.name}
                  </h4>
                  <span className="text-[10px] text-slate-400">{c.lastMessageTime || ''}</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {c.lastMessage || c.description}
                </p>
              </div>
            );
          })}

          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1 mt-4">
            Conversas Diretas (1-on-1)
          </p>

          {channels.filter(c => c.type === 'direct').map(c => {
            const isSelected = c.id === currentChannel.id;
            const pId = c.participantIds?.find(id => id !== currentUser.id);
            const p = pId ? players.find(player => player.id === pId) : null;

            return (
              <div
                key={c.id}
                onClick={() => setActiveChannelId(c.id)}
                className={`p-3 rounded-2xl cursor-pointer transition-all flex items-center gap-3 ${
                  isSelected
                    ? 'bg-emerald-100/70 dark:bg-emerald-950/40 border border-emerald-500/40 shadow-sm'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                {p ? (
                  <img src={p.avatar} alt={p.name} className="w-9 h-9 rounded-full object-cover border border-emerald-400" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs">
                    🎾
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                      {p ? p.name : c.name}
                    </h4>
                    <span className="text-[10px] text-slate-400">{c.lastMessageTime || ''}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {c.lastMessage || 'Conversa aberta'}
                  </p>
                </div>
              </div>
            );
          })}

        </div>

      </div>

      {/* Right Column: Chat Content & Input (8 cols) */}
      <div className="md:col-span-8 flex flex-col bg-white dark:bg-slate-900 h-[620px]">
        
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/80">
          <div className="flex items-center gap-3">
            {otherPlayer ? (
              <img 
                src={otherPlayer.avatar} 
                alt={otherPlayer.name} 
                className="w-10 h-10 rounded-full object-cover border-2 border-emerald-400 cursor-pointer"
                onClick={() => setSelectedPlayerId(otherPlayer.id)}
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black text-lg">
                📢
              </div>
            )}

            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                {otherPlayer ? otherPlayer.name : currentChannel.name}
                {otherPlayer?.isOrganizer && (
                  <span className="text-[10px] font-bold text-amber-500 flex items-center gap-0.5">
                    <ShieldCheck className="w-3 h-3" /> Gestor
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {otherPlayer ? `${otherPlayer.category} • ${otherPlayer.club}` : currentChannel.description}
              </p>
            </div>
          </div>

          {/* Quick challenge/book button in direct chat */}
          {otherPlayer && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleQuickTemplate(`🎾 Olá ${otherPlayer.name.split(' ')[0]}! Gostaria de agendar uma partida com você. Qual horário você prefere nesse final de semana?`)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800 transition-colors"
              >
                <Swords className="w-3.5 h-3.5" /> Convidar para Jogo
              </button>
            </div>
          )}
        </div>

        {/* Message Thread List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {channelMessages.map(msg => {
            const isMe = msg.senderId === currentUser.id;

            return (
              <div
                key={msg.id}
                className={`flex items-start gap-2.5 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <img 
                  src={msg.senderAvatar} 
                  alt={msg.senderName} 
                  className="w-8 h-8 rounded-full object-cover shrink-0 cursor-pointer border border-slate-200 dark:border-slate-700" 
                  onClick={() => setSelectedPlayerId(msg.senderId)}
                />

                <div className={`max-w-[75%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                  <div className="flex items-center gap-1.5 mb-1 px-1">
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      {msg.senderName.split(' ')[0]}
                    </span>
                    {msg.isOfficial && (
                      <span className="text-[10px] font-bold text-amber-500 flex items-center gap-0.5">
                        <ShieldCheck className="w-3 h-3" /> Oficial
                      </span>
                    )}
                    <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                  </div>

                  <div
                    className={`p-3 rounded-2xl text-xs leading-relaxed ${
                      isMe
                        ? 'bg-emerald-600 text-white rounded-tr-sm shadow-sm'
                        : msg.isOfficial
                        ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-950 dark:text-amber-200 border border-amber-300 dark:border-amber-700/60 rounded-tl-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-sm'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
            Respostas Rápidas:
          </span>
          <button
            onClick={() => handleQuickTemplate('🎾 Bora jogar amanhã cedo? Tenho bolas novas!')}
            className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-500 whitespace-nowrap"
          >
            🎾 Bora jogar amanhã?
          </button>
          <button
            onClick={() => handleQuickTemplate('✅ Confirmado! Te encontro na quadra no horário.')}
            className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-500 whitespace-nowrap"
          >
            ✅ Horário Confirmado!
          </button>
          <button
            onClick={() => handleQuickTemplate('👏 Parabéns pelo jogaço de hoje! Foi muito disputado.')}
            className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-500 whitespace-nowrap"
          >
            👏 Parabéns pelo jogaço!
          </button>
        </div>

        {/* Message Input Bar */}
        <form onSubmit={handleSend} className="p-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 bg-white dark:bg-slate-900">
          <div className="flex items-center gap-1 text-base">
            {['🎾', '🏆', '🔥', '🤝'].map(em => (
              <button
                key={em}
                type="button"
                onClick={() => handleSendQuickEmoji(em)}
                className="hover:scale-125 transition-transform px-1 text-sm"
              >
                {em}
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder={
              currentChannel.type === 'announcements' && !currentUser.isOrganizer
                ? 'Apenas a diretoria pode postar avisos oficiais neste canal...'
                : `Mensagem em ${currentChannel.name}...`
            }
            disabled={currentChannel.type === 'announcements' && !currentUser.isOrganizer}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white"
          />

          <button
            type="submit"
            disabled={!inputMessage.trim() || (currentChannel.type === 'announcements' && !currentUser.isOrganizer)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-xs rounded-xl flex items-center gap-1 transition-colors shadow"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Enviar</span>
          </button>
        </form>

      </div>

      {/* Modal: Start New Direct Chat */}
      {showNewChatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-base flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-400" />
                Iniciar Nova Conversa
              </h3>
              <button onClick={() => setShowNewChatModal(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <div className="relative mb-3">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar tenista..."
                value={searchContact}
                onChange={(e) => setSearchContact(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white"
              />
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {players
                .filter(p => p.id !== currentUser.id)
                .filter(p => p.name.toLowerCase().includes(searchContact.toLowerCase()))
                .map(p => (
                  <div
                    key={p.id}
                    onClick={() => {
                      openDirectChatWithPlayer(p.id);
                      setShowNewChatModal(false);
                    }}
                    className="p-3 rounded-xl border border-slate-800 bg-slate-800/40 hover:bg-emerald-950/30 hover:border-emerald-500 flex items-center gap-3 cursor-pointer transition-all"
                  >
                    <img src={p.avatar} alt={p.name} className="w-9 h-9 rounded-full object-cover border border-emerald-400" />
                    <div>
                      <h4 className="font-bold text-xs text-white">{p.name}</h4>
                      <p className="text-[10px] text-slate-400">{p.category} • {p.club}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
