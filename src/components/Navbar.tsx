import React from 'react';
import { 
  Trophy, 
  Award, 
  Calendar, 
  MessageSquare, 
  Radio, 
  Users, 
  PlusCircle, 
  UserPlus,
  ShieldCheck, 
  UserCircle2,
  Swords,
  Globe,
  Database
} from 'lucide-react';
import { useTennis } from '../context/TennisContext';

interface NavbarProps {
  onOpenCreateTournament: () => void;
  onOpenNewBooking: () => void;
  onOpenRegisterPlayer: () => void;
  onOpenDomainModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onOpenCreateTournament, 
  onOpenNewBooking,
  onOpenRegisterPlayer,
  onOpenDomainModal
}) => {
  const { 
    currentUser, 
    setCurrentUser, 
    players, 
    activeTab, 
    setActiveTab, 
    setSelectedPlayerId,
    messages,
    isDbConnected
  } = useTennis();

  // Count unread or announcements
  const officialMessagesCount = messages.filter(m => m.channelId === 'avisos-torneios').length;

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('torneios')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-lime-500 flex items-center justify-center shadow-md shadow-emerald-900/40 text-slate-950 font-black text-xl">
              🎾
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-400 bg-clip-text text-transparent">
                  Tennis Condé 2
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  tennisconde2.com
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Torneios • Rankings • Agendamento • Placar Eletrônico
              </p>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
            <button
              id="nav-tournaments"
              onClick={() => setActiveTab('torneios')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'torneios'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              Torneios
            </button>

            <button
              id="nav-rankings"
              onClick={() => setActiveTab('rankings')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'rankings'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              Rankings
            </button>

            <button
              id="nav-players"
              onClick={() => setActiveTab('jogadores')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'jogadores'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              Jogadores
            </button>

            <button
              id="nav-scheduler"
              onClick={() => setActiveTab('quadras')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'quadras'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              Quadras
            </button>

            <button
              id="nav-live-score"
              onClick={() => setActiveTab('placar_ao_vivo')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'placar_ao_vivo'
                  ? 'bg-amber-600 text-white shadow-sm animate-pulse'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Radio className="w-3.5 h-3.5 text-amber-300" />
              Placar
            </button>

            <button
              id="nav-community"
              onClick={() => setActiveTab('comunidade')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all relative ${
                activeTab === 'comunidade'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Chat
              {officialMessagesCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 absolute top-1.5 right-1.5 animate-ping"></span>
              )}
            </button>

            <button
              id="nav-confrontos"
              onClick={() => setActiveTab('confrontos')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'confrontos'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Swords className="w-3.5 h-3.5" />
              H2H
            </button>
          </nav>

          {/* Right Action & User Profile Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Domain & MySQL Integration Guide Button */}
            {onOpenDomainModal && (
              <button
                id="btn-nav-domain-guide"
                onClick={onOpenDomainModal}
                className="hidden md:flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-emerald-500/50 font-bold px-2.5 py-1.5 rounded-lg text-xs transition-colors"
                title="Configurações do Banco MySQL e domínio tennisconde2.com"
              >
                <Database className={`w-3.5 h-3.5 ${isDbConnected ? 'text-emerald-400' : 'text-amber-400'}`} />
                <span className="hidden xl:inline">MySQL</span>
                <span className={`w-2 h-2 rounded-full ${isDbConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              </button>
            )}

            {/* Quick Register Player Button */}
            <button
              id="btn-nav-register-player"
              onClick={onOpenRegisterPlayer}
              className="hidden lg:flex items-center gap-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-bold px-2.5 py-1.5 rounded-lg text-xs transition-colors"
              title="Cadastrar novo tenista no sistema"
            >
              <UserPlus className="w-3.5 h-3.5" />
              + Jogador
            </button>

            {/* Quick Action Button */}
            {currentUser.isOrganizer ? (
              <button
                id="btn-quick-create-tournament"
                onClick={onOpenCreateTournament}
                className="hidden sm:flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs transition-colors shadow"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Novo Torneio
              </button>
            ) : (
              <button
                id="btn-quick-book-court"
                onClick={onOpenNewBooking}
                className="hidden sm:flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs transition-colors shadow"
              >
                <Calendar className="w-3.5 h-3.5" />
                Reservar Quadra
              </button>
            )}

            {/* Profile & User Role Switcher Dropdown */}
            <div className="flex items-center gap-2 bg-slate-800/90 py-1 px-2.5 rounded-xl border border-slate-700">
              <div 
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setSelectedPlayerId(currentUser.id)}
                title="Ver perfil completo"
              >
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name} 
                  className="w-7 h-7 rounded-full object-cover border border-emerald-400/60" 
                />
                <div className="text-left hidden xl:block">
                  <p className="text-xs font-semibold text-white leading-tight max-w-[120px] truncate">
                    {currentUser.name}
                  </p>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400">
                    {currentUser.isOrganizer ? (
                      <span className="text-amber-400 font-bold flex items-center gap-0.5">
                        <ShieldCheck className="w-3 h-3" /> Gestor
                      </span>
                    ) : (
                      <span>{currentUser.category.split(' ')[0]}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Selector to switch logged in user */}
              <div className="border-l border-slate-700 pl-2">
                <select
                  id="select-active-user"
                  value={currentUser.id}
                  onChange={(e) => {
                    const found = players.find(p => p.id === e.target.value);
                    if (found) setCurrentUser(found);
                  }}
                  className="bg-slate-900 text-slate-200 text-xs py-1 px-2 rounded-lg border border-slate-700 focus:outline-none focus:border-emerald-500 cursor-pointer max-w-[130px] sm:max-w-none"
                  title="Alternar usuário para testar como jogador ou organizador"
                >
                  <optgroup label="Organizadores / Gestores">
                    {players.filter(p => p.isOrganizer).map(p => (
                      <option key={p.id} value={p.id}>👑 {p.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Tenistas / Atletas">
                    {players.filter(p => !p.isOrganizer).map(p => (
                      <option key={p.id} value={p.id}>🎾 {p.name} ({p.category.split(' ')[0]})</option>
                    ))}
                  </optgroup>
                </select>
              </div>
            </div>

          </div>

        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-800 text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('torneios')}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded whitespace-nowrap ${
              activeTab === 'torneios' ? 'text-emerald-400 font-bold' : 'text-slate-400'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Torneios</span>
          </button>
          <button
            onClick={() => setActiveTab('rankings')}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded whitespace-nowrap ${
              activeTab === 'rankings' ? 'text-emerald-400 font-bold' : 'text-slate-400'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Rankings</span>
          </button>
          <button
            onClick={() => setActiveTab('jogadores')}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded whitespace-nowrap ${
              activeTab === 'jogadores' ? 'text-emerald-400 font-bold' : 'text-slate-400'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Jogadores</span>
          </button>
          <button
            onClick={() => setActiveTab('quadras')}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded whitespace-nowrap ${
              activeTab === 'quadras' ? 'text-emerald-400 font-bold' : 'text-slate-400'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Quadras</span>
          </button>
          <button
            onClick={() => setActiveTab('placar_ao_vivo')}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded whitespace-nowrap ${
              activeTab === 'placar_ao_vivo' ? 'text-amber-400 font-bold' : 'text-slate-400'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>Placar</span>
          </button>
          <button
            onClick={() => setActiveTab('comunidade')}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded whitespace-nowrap ${
              activeTab === 'comunidade' ? 'text-emerald-400 font-bold' : 'text-slate-400'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat</span>
          </button>
        </div>

      </div>
    </header>
  );
};
