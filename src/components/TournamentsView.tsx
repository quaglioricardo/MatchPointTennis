import React, { useState } from 'react';
import { useTennis } from '../context/TennisContext';
import { Tournament, TournamentMatch, PlayerCategory, TournamentStatus } from '../types';
import { TournamentBracket } from './TournamentBracket';
import { 
  Trophy, 
  Calendar, 
  MapPin, 
  Users, 
  Plus, 
  Layers, 
  DollarSign, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  PlayCircle,
  Filter,
  Search,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

interface TournamentsViewProps {
  onOpenCreateModal: () => void;
  onOpenScoreModal: (match: TournamentMatch, tournamentId: string) => void;
  onOpenLiveScorer: (match: TournamentMatch, tournamentId: string) => void;
}

export const TournamentsView: React.FC<TournamentsViewProps> = ({
  onOpenCreateModal,
  onOpenScoreModal,
  onOpenLiveScorer
}) => {
  const { 
    tournaments, 
    currentUser, 
    players, 
    selectedTournamentId, 
    setSelectedTournamentId,
    registerForTournament,
    unregisterFromTournament,
    generateTournamentBracket,
    setSelectedPlayerId
  } = useTennis();

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSubTab, setActiveSubTab] = useState<'bracket' | 'partidas' | 'inscritos' | 'regras'>('bracket');

  // Filtered tournaments
  const filteredTournaments = tournaments.filter(t => {
    const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.clubName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const currentTournament = tournaments.find(t => t.id === selectedTournamentId) || filteredTournaments[0] || tournaments[0];
  const isRegistered = currentTournament?.registeredPlayerIds.includes(currentUser.id);
  const isFull = (currentTournament?.registeredPlayerIds.length || 0) >= (currentTournament?.maxParticipants || 8);
  const isOrganizer = currentUser.isOrganizer || currentUser.id === currentTournament?.organizerId;

  const getPlayer = (id: string) => players.find(p => p.id === id);

  const getSurfaceBadge = (surface: string) => {
    if (surface.includes('Saibro')) {
      return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-600/10 text-amber-800 dark:text-amber-300 border border-amber-500/20">Saibro (Clay)</span>;
    }
    if (surface.includes('Grama')) {
      return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-600/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20">Grama (Grass)</span>;
    }
    if (surface.includes('Coberta')) {
      return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-600/10 text-purple-800 dark:text-purple-300 border border-purple-500/20">Coberta (Indoor)</span>;
    }
    return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-600/10 text-blue-800 dark:text-blue-300 border border-blue-500/20">Rápida (Hard)</span>;
  };

  const getStatusBadge = (status: TournamentStatus) => {
    switch (status) {
      case 'inscricoes_abertas':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30"><Clock className="w-3 h-3" /> Inscrições Abertas</span>;
      case 'em_andamento':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30 animate-pulse"><PlayCircle className="w-3 h-3" /> Em Andamento</span>;
      case 'concluido':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-500/10 text-slate-700 dark:text-slate-300 border border-slate-500/30"><CheckCircle2 className="w-3 h-3" /> Concluído</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Headline */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-emerald-900 via-slate-900 to-slate-900 p-6 rounded-3xl text-white shadow-xl border border-emerald-900/50">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Gestão de Torneios
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Torneios, Copas & Chaveamentos
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl mt-1">
            Participe de torneios oficiais por classe, acompanhe chaves eliminatórias em tempo real e gerencie competições do seu clube.
          </p>
        </div>

        <button
          id="btn-open-create-tournament"
          onClick={onOpenCreateModal}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm transition-all shadow-lg hover:shadow-emerald-500/25 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Criar Novo Torneio
        </button>
      </div>

      {/* Main Grid: Tournament Selector Sidebar + Selected Tournament Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Tournament List / Selector (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Search and Filters */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Buscar torneio ou clube..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 pl-9 pr-3 py-2 text-xs rounded-xl focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs py-1.5 px-2 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none focus:border-emerald-500"
              >
                <option value="all">Todos os Status</option>
                <option value="inscricoes_abertas">Inscrições Abertas</option>
                <option value="em_andamento">Em Andamento</option>
                <option value="concluido">Concluídos</option>
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs py-1.5 px-2 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none focus:border-emerald-500"
              >
                <option value="all">Todas as Classes</option>
                <option value="1ª Classe (Pro/Avançado)">1ª Classe</option>
                <option value="2ª Classe (Intermediário Alto)">2ª Classe</option>
                <option value="3ª Classe (Intermediário)">3ª Classe</option>
                <option value="Feminino A">Feminino A</option>
                <option value="Master +45">Master +45</option>
              </select>
            </div>
          </div>

          {/* List of Tournament Cards */}
          <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1">
            {filteredTournaments.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 text-center text-slate-400">
                <Trophy className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm font-medium">Nenhum torneio encontrado com os filtros atuais.</p>
              </div>
            ) : (
              filteredTournaments.map(t => {
                const isSelected = t.id === currentTournament?.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTournamentId(t.id)}
                    className={`cursor-pointer p-4 rounded-2xl border transition-all duration-200 relative overflow-hidden ${
                      isSelected
                        ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-500 shadow-md ring-1 ring-emerald-500'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-400 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                          {t.category.split(' ')[0]}
                        </span>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                          {t.title}
                        </h3>
                      </div>
                      {getStatusBadge(t.status)}
                    </div>

                    <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400 mb-3">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{t.clubName}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{t.startDate} até {t.endDate}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
                      <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                        <Users className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{t.registeredPlayerIds.length}/{t.maxParticipants} inscritos</span>
                      </div>
                      <div className="text-emerald-700 dark:text-emerald-400 font-bold">
                        {t.entryFee > 0 ? `R$ ${t.entryFee}` : 'Gratuito'}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>

        {/* Right Column: Active Tournament Details & Visual Bracket (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {currentTournament ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              
              {/* Tournament Banner Header */}
              <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-slate-900">
                <img 
                  src={currentTournament.bannerImage} 
                  alt={currentTournament.title} 
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
                
                {/* Floating details on banner */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {getStatusBadge(currentTournament.status)}
                    {getSurfaceBadge(currentTournament.surface)}
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md text-white border border-white/30">
                      {currentTournament.category}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    {currentTournament.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 flex items-center gap-2 mt-1">
                    <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{currentTournament.clubName} • {currentTournament.address}</span>
                  </p>
                </div>
              </div>

              {/* Tournament Action Bar & Summary Stats */}
              <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-wrap items-center justify-between gap-4">
                
                {/* Key Meta Badges */}
                <div className="flex flex-wrap items-center gap-4 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    <div>
                      <p className="text-[10px] text-slate-400">Datas</p>
                      <p className="font-bold">{currentTournament.startDate} - {currentTournament.endDate}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    <div>
                      <p className="text-[10px] text-slate-400">Inscrição</p>
                      <p className="font-bold">{currentTournament.entryFee > 0 ? `R$ ${currentTournament.entryFee}` : 'Grátis'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    <div>
                      <p className="text-[10px] text-slate-400">Premiação</p>
                      <p className="font-bold truncate max-w-[200px]" title={currentTournament.prizeDescription}>
                        {currentTournament.prizeDescription}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Primary Action Buttons (Register / Generate Bracket) */}
                <div className="flex items-center gap-2">
                  {currentTournament.status === 'inscricoes_abertas' && (
                    <>
                      {isRegistered ? (
                        <button
                          id="btn-unregister-tournament"
                          onClick={() => unregisterFromTournament(currentTournament.id, currentUser.id)}
                          className="px-3.5 py-2 rounded-xl text-xs font-bold text-red-600 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-900/40 border border-red-200 dark:border-red-800 transition-colors"
                        >
                          Cancelar Minha Inscrição
                        </button>
                      ) : (
                        <button
                          id="btn-register-tournament"
                          disabled={isFull}
                          onClick={() => registerForTournament(currentTournament.id, currentUser.id)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md transition-all ${
                            isFull 
                              ? 'bg-slate-400 cursor-not-allowed' 
                              : 'bg-emerald-600 hover:bg-emerald-500 hover:shadow-emerald-600/30'
                          }`}
                        >
                          {isFull ? 'Vagas Esgotadas' : 'Inscrever-se no Torneio'}
                        </button>
                      )}
                    </>
                  )}

                  {/* Organizer Tools: Generate Bracket */}
                  {isOrganizer && currentTournament.matches.length === 0 && (
                    <button
                      id="btn-generate-bracket"
                      onClick={() => generateTournamentBracket(currentTournament.id)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Gerar Chaveamento Automático
                    </button>
                  )}
                </div>

              </div>

              {/* Navigation Sub-Tabs */}
              <div className="px-6 pt-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-6 text-sm font-semibold">
                <button
                  id="tab-bracket"
                  onClick={() => setActiveSubTab('bracket')}
                  className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
                    activeSubTab === 'bracket'
                      ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                      : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  Chave Eliminatória (Bracket)
                </button>

                <button
                  id="tab-partidas"
                  onClick={() => setActiveSubTab('partidas')}
                  className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
                    activeSubTab === 'partidas'
                      ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                      : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  Lista de Partidas ({currentTournament.matches.length})
                </button>

                <button
                  id="tab-inscritos"
                  onClick={() => setActiveSubTab('inscritos')}
                  className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
                    activeSubTab === 'inscritos'
                      ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                      : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Atletas Inscritos ({currentTournament.registeredPlayerIds.length})
                </button>

                <button
                  id="tab-regras"
                  onClick={() => setActiveSubTab('regras')}
                  className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
                    activeSubTab === 'regras'
                      ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                      : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Regulamento
                </button>
              </div>

              {/* Sub Tab Content */}
              <div className="p-6">
                
                {/* SUBTAB 1: Interactive Bracket */}
                {activeSubTab === 'bracket' && (
                  <div>
                    {currentTournament.matches.length > 0 ? (
                      <TournamentBracket
                        tournament={currentTournament}
                        onOpenScoreModal={(match) => onOpenScoreModal(match, currentTournament.id)}
                        onOpenLiveScorer={(match) => onOpenLiveScorer(match, currentTournament.id)}
                      />
                    ) : (
                      <div className="text-center py-12 px-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                        <Sparkles className="w-10 h-10 mx-auto text-amber-500 mb-3" />
                        <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                          Chaveamento ainda não foi gerado
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-4">
                          O torneio está na fase de inscrições. Quando o período encerrar, o organizador poderá gerar a chave eliminatória e os cabeças de chave automaticamente.
                        </p>
                        {isOrganizer && (
                          <button
                            onClick={() => generateTournamentBracket(currentTournament.id)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow"
                          >
                            Gerar Chave Agora
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* SUBTAB 2: Match List */}
                {activeSubTab === 'partidas' && (
                  <div className="space-y-3">
                    {currentTournament.matches.length === 0 ? (
                      <p className="text-center text-xs text-slate-400 py-8">Nenhuma partida agendada ainda.</p>
                    ) : (
                      currentTournament.matches.map(m => {
                        const p1 = getPlayer(m.player1Id);
                        const p2 = getPlayer(m.player2Id);
                        return (
                          <div 
                            key={m.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 gap-3"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                <span className="font-bold text-emerald-600">{m.roundName}</span>
                                <span>• Jogo {m.matchNumber}</span>
                                {m.courtName && <span>• {m.courtName}</span>}
                              </div>

                              <div className="flex items-center gap-4 text-sm font-semibold text-slate-900 dark:text-white">
                                <div className="flex items-center gap-2">
                                  {p1 && <img src={p1.avatar} alt={p1.name} className="w-5 h-5 rounded-full object-cover" />}
                                  <span>{p1 ? p1.name : 'A definir'}</span>
                                </div>
                                <span className="text-xs text-slate-400 font-normal">vs</span>
                                <div className="flex items-center gap-2">
                                  {p2 && <img src={p2.avatar} alt={p2.name} className="w-5 h-5 rounded-full object-cover" />}
                                  <span>{p2 ? p2.name : 'A definir'}</span>
                                </div>
                              </div>

                              {m.score && (
                                <div className="text-xs font-mono text-emerald-700 dark:text-emerald-400 font-bold">
                                  Placar: {m.score.sets.map(s => `${s.player1Games}/${s.player2Games}`).join(' ')}
                                </div>
                              )}
                            </div>

                            {p1 && p2 && (
                              <div className="flex items-center gap-2 shrink-0">
                                <button
                                  onClick={() => onOpenLiveScorer(m, currentTournament.id)}
                                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center gap-1 transition-colors"
                                >
                                  <PlayCircle className="w-3.5 h-3.5" /> Ao Vivo
                                </button>
                                <button
                                  onClick={() => onOpenScoreModal(m, currentTournament.id)}
                                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1 transition-colors"
                                >
                                  Lançar Placar
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                )}

                {/* SUBTAB 3: Registered Athletes */}
                {activeSubTab === 'inscritos' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {currentTournament.registeredPlayerIds.map((pid, idx) => {
                      const player = getPlayer(pid);
                      if (!player) return null;
                      return (
                        <div 
                          key={pid}
                          onClick={() => setSelectedPlayerId(player.id)}
                          className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 cursor-pointer hover:border-emerald-500 transition-colors"
                        >
                          <span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <img src={player.avatar} alt={player.name} className="w-10 h-10 rounded-full object-cover border border-emerald-400" />
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {player.name}
                            </h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                              {player.points} pts • UTR {player.utrRating}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* SUBTAB 4: Rules */}
                {activeSubTab === 'regras' && (
                  <div className="prose dark:prose-invert text-xs space-y-3 text-slate-600 dark:text-slate-300">
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800">
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-2">
                        Regulamento Geral do Torneio
                      </h4>
                      <p className="leading-relaxed mb-3">
                        {currentTournament.rules || 'Partidas disputadas em melhor de 3 sets, com vantagem (Ad). Em caso de empate em 1 set a 1, será disputado um Super Tie-break de 10 pontos decisivo.'}
                      </p>
                      <ul className="list-disc pl-4 space-y-1.5 text-slate-600 dark:text-slate-400">
                        <li>Tolerância de 15 minutos para apresentação na quadra oficial.</li>
                        <li>Aquecimento máximo de 5 minutos antes do início do jogo.</li>
                        <li>Bolas novas disponibilizadas pela organização para cada confronto da chave.</li>
                        <li>O vencedor é responsável por registrar o placar no painel imediatamente após o término.</li>
                      </ul>
                    </div>
                  </div>
                )}

              </div>

            </div>
          ) : (
            <div className="text-center py-20 text-slate-400">
              Selecione um torneio para ver os detalhes
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
