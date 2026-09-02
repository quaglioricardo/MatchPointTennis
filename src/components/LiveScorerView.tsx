import React, { useState } from 'react';
import { useTennis } from '../context/TennisContext';
import { TournamentMatch, Player, SetScore, MatchScoreDetails } from '../types';
import { 
  Radio, 
  FileEdit, 
  Trophy, 
  Sparkles, 
  CheckCircle2, 
  PlayCircle, 
  Clock, 
  Plus, 
  Minus, 
  Check, 
  ChevronRight, 
  Users, 
  Calendar,
  Swords,
  Activity,
  Flame,
  ShieldAlert
} from 'lucide-react';

interface LiveScorerViewProps {
  onOpenLiveScorer: (match?: TournamentMatch, tournamentId?: string, initialMode?: 'point_by_point' | 'direct_score') => void;
}

export const LiveScorerView: React.FC<LiveScorerViewProps> = ({
  onOpenLiveScorer
}) => {
  const { 
    tournaments, 
    players, 
    currentUser, 
    updateMatchScore, 
    recordDirectMatchResult, 
    triggerCelebration 
  } = useTennis();

  // Quick In-Page Direct Scorer State
  const [isQuickScorerOpen, setIsQuickScorerOpen] = useState<boolean>(false);
  const [quickP1Id, setQuickP1Id] = useState<string>('p1');
  const [quickP2Id, setQuickP2Id] = useState<string>('p2');
  const [quickSets, setQuickSets] = useState<SetScore[]>([
    { player1Games: 6, player2Games: 4 },
    { player1Games: 6, player2Games: 3 }
  ]);
  const [quickWinnerId, setQuickWinnerId] = useState<string>('p1');
  const [quickMatchTitle, setQuickMatchTitle] = useState<string>('Desafio de Barragem');
  const [quickSaved, setQuickSaved] = useState<boolean>(false);

  // Filter for tournament matches
  const [matchStatusFilter, setMatchStatusFilter] = useState<'all' | 'agendado' | 'concluido'>('all');

  const p1 = players.find(p => p.id === quickP1Id) || players[0];
  const p2 = players.find(p => p.id === quickP2Id) || players[1];

  // All matches from all tournaments
  const allMatches = tournaments.flatMap(t => 
    t.matches.map(m => ({
      ...m,
      tournamentTitle: t.title,
      tournamentCategory: t.category,
      tournamentSurface: t.surface
    }))
  );

  const filteredMatches = allMatches.filter(m => {
    if (matchStatusFilter === 'all') return true;
    return m.status === matchStatusFilter;
  });

  const handleQuickUpdateGame = (sIdx: number, pNum: 1 | 2, delta: number) => {
    setQuickSets(prev => {
      const updated = prev.map((s, idx) => {
        if (idx !== sIdx) return s;
        if (pNum === 1) return { ...s, player1Games: Math.max(0, s.player1Games + delta) };
        return { ...s, player2Games: Math.max(0, s.player2Games + delta) };
      });
      // auto calculate winner
      let p1W = 0;
      let p2W = 0;
      updated.forEach(s => {
        if (s.player1Games > s.player2Games) p1W++;
        else if (s.player2Games > s.player1Games) p2W++;
      });
      if (p1W > p2W) setQuickWinnerId(p1.id);
      else if (p2W > p1W) setQuickWinnerId(p2.id);
      return updated;
    });
  };

  const handleSaveQuickDirectResult = () => {
    const scoreData: MatchScoreDetails = {
      sets: quickSets,
      winnerId: quickWinnerId,
      durationMinutes: 70
    };

    recordDirectMatchResult(quickP1Id, quickP2Id, scoreData, quickMatchTitle);
    setQuickSaved(true);
    triggerCelebration();

    setTimeout(() => {
      setQuickSaved(false);
      setIsQuickScorerOpen(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      
      {/* Hero Banner with Clear Actions */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl border border-amber-900/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 animate-pulse text-amber-400" />
              Arbitragem & Mesa de Controle
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            Placar Eletrônico & Registro de Jogos
          </h1>
          <p className="text-sm text-slate-300 max-w-xl">
            Lance diretamente o resultado final de partidas por sets e games ou abra o marcador de quadra ponto a ponto em tempo real.
          </p>
        </div>

        {/* Dual Primary Call-to-Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full md:w-auto">
          <button
            type="button"
            id="btn-open-direct-score-main"
            onClick={() => onOpenLiveScorer(undefined, undefined, 'direct_score')}
            className="px-5 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <FileEdit className="w-4 h-4" />
            📝 Marcar Resultado Direto (Sets & Games)
          </button>

          <button
            type="button"
            id="btn-open-live-scorer-main"
            onClick={() => onOpenLiveScorer(undefined, undefined, 'point_by_point')}
            className="px-5 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Radio className="w-4 h-4 animate-pulse" />
            🔴 Placar Ponto a Ponto Ao Vivo
          </button>
        </div>
      </div>

      {/* QUICK IN-PAGE BARRAGEM / AMISTOSO DIRECT SCORER */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Swords className="w-5 h-5 text-emerald-500" />
              Lançamento Rápido de Resultado (Desafio ou Amistoso)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Acabou de jogar na quadra? Registre os sets e games direto aqui para pontuar no ranking oficial.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsQuickScorerOpen(!isQuickScorerOpen)}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors flex items-center gap-1.5"
          >
            {isQuickScorerOpen ? 'Ocultar Formulário' : '+ Novo Resultado Direto'}
          </button>
        </div>

        {isQuickScorerOpen && (
          <div className="mt-5 p-5 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-5 animate-fadeIn">
            
            {/* Player Selection & Match Type */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">Jogador 1</label>
                <select
                  value={quickP1Id}
                  onChange={(e) => {
                    setQuickP1Id(e.target.value);
                    if (quickWinnerId === quickP1Id) setQuickWinnerId(e.target.value);
                  }}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white font-medium"
                >
                  {players.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.category.split(' ')[0]})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">Jogador 2</label>
                <select
                  value={quickP2Id}
                  onChange={(e) => {
                    setQuickP2Id(e.target.value);
                    if (quickWinnerId === quickP2Id) setQuickWinnerId(e.target.value);
                  }}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white font-medium"
                >
                  {players.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.category.split(' ')[0]})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">Tipo de Partida</label>
                <input
                  type="text"
                  value={quickMatchTitle}
                  onChange={(e) => setQuickMatchTitle(e.target.value)}
                  placeholder="Ex: Barragem 1ª Classe, Amistoso..."
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white font-medium"
                />
              </div>
            </div>

            {/* Sets & Games Inputs */}
            <div className="space-y-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300 pb-2 border-b border-slate-200 dark:border-slate-800">
                <span>Games de Cada Set:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono">
                  {p1.name.split(' ')[0]} vs {p2.name.split(' ')[0]}
                </span>
              </div>

              {quickSets.map((s, idx) => (
                <div key={idx} className="flex items-center justify-between gap-4 p-2 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                  <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300 w-16">
                    {idx === 2 ? '3º Set (STB)' : `${idx + 1}º Set`}
                  </span>

                  <div className="flex items-center gap-3">
                    {/* P1 games */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleQuickUpdateGame(idx, 1, -1)}
                        className="w-6 h-6 rounded bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white flex items-center justify-center text-xs"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
                        {s.player1Games}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleQuickUpdateGame(idx, 1, 1)}
                        className="w-6 h-6 rounded bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white flex items-center justify-center text-xs"
                      >
                        +
                      </button>
                    </div>

                    <span className="text-slate-400 font-bold">x</span>

                    {/* P2 games */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleQuickUpdateGame(idx, 2, -1)}
                        className="w-6 h-6 rounded bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white flex items-center justify-center text-xs"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-mono font-bold text-sm text-blue-600 dark:text-blue-400">
                        {s.player2Games}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleQuickUpdateGame(idx, 2, 1)}
                        className="w-6 h-6 rounded bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white flex items-center justify-center text-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex gap-2 pt-1">
                {quickSets.length < 3 && (
                  <button
                    type="button"
                    onClick={() => setQuickSets([...quickSets, { player1Games: 10, player2Games: 8 }])}
                    className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    + Adicionar 3º Set / Super Tiebreak
                  </button>
                )}
                {quickSets.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setQuickSets(quickSets.slice(0, -1))}
                    className="text-[11px] font-bold text-red-500 hover:underline ml-auto"
                  >
                    - Remover último set
                  </button>
                )}
              </div>
            </div>

            {/* Winner Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Vencedor Confirmado:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setQuickWinnerId(p1.id)}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    quickWinnerId === p1.id
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                      : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  {p1.name} Venceu
                </button>

                <button
                  type="button"
                  onClick={() => setQuickWinnerId(p2.id)}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    quickWinnerId === p2.id
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                      : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  {p2.name} Venceu
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              id="btn-save-quick-result"
              onClick={handleSaveQuickDirectResult}
              disabled={quickSaved}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg transition-all flex items-center justify-center gap-2"
            >
              {quickSaved ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Resultado Gravado com Sucesso!
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Gravar Resultado e Atualizar Ranking Oficial
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* TOURNAMENT MATCHES LIST TO SCORE */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              Partidas dos Torneios Oficiais
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Escolha uma partida abaixo para marcar o resultado direto ou acompanhar ponto a ponto
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => setMatchStatusFilter('all')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                matchStatusFilter === 'all' 
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' 
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              Todas ({allMatches.length})
            </button>
            <button
              type="button"
              onClick={() => setMatchStatusFilter('agendado')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                matchStatusFilter === 'agendado' 
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' 
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              Agendadas
            </button>
            <button
              type="button"
              onClick={() => setMatchStatusFilter('concluido')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                matchStatusFilter === 'concluido' 
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' 
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              Concluídas
            </button>
          </div>
        </div>

        {/* Matches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {filteredMatches.map((m) => {
            const player1 = players.find(p => p.id === m.player1Id);
            const player2 = players.find(p => p.id === m.player2Id);
            const winner = players.find(p => p.id === m.winnerId);

            return (
              <div
                key={m.id}
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:border-emerald-500/50 transition-all flex flex-col justify-between gap-4"
              >
                {/* Match Header info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                      {m.roundName} • Jogo {m.matchNumber}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      {m.tournamentTitle}
                    </span>
                  </div>

                  {m.status === 'concluido' ? (
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      Finalizada
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {m.scheduledTime || 'Agendado'}
                    </span>
                  )}
                </div>

                {/* Matchup Players with Score Display */}
                <div className="space-y-2 py-1">
                  {/* Player 1 */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                    <div className="flex items-center gap-2.5">
                      {player1 ? (
                        <>
                          <img src={player1.avatar} alt={player1.name} className="w-7 h-7 rounded-full object-cover" />
                          <span className={`text-xs font-bold ${m.winnerId === player1.id ? 'text-emerald-600 dark:text-emerald-400 font-black' : 'text-slate-800 dark:text-slate-200'}`}>
                            {player1.name} {m.winnerId === player1.id && '👑'}
                          </span>
                        </>
                      ) : (
                        <span className="text-xs text-slate-400 italic">A definir (Vencedor rodada anterior)</span>
                      )}
                    </div>

                    {/* Sets Score display if completed */}
                    {m.score?.sets && (
                      <div className="flex items-center gap-1.5 font-mono text-xs font-black">
                        {m.score.sets.map((s, idx) => (
                          <span key={idx} className={`px-1.5 py-0.5 rounded ${s.player1Games > s.player2Games ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400'}`}>
                            {s.player1Games}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Player 2 */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                    <div className="flex items-center gap-2.5">
                      {player2 ? (
                        <>
                          <img src={player2.avatar} alt={player2.name} className="w-7 h-7 rounded-full object-cover" />
                          <span className={`text-xs font-bold ${m.winnerId === player2.id ? 'text-emerald-600 dark:text-emerald-400 font-black' : 'text-slate-800 dark:text-slate-200'}`}>
                            {player2.name} {m.winnerId === player2.id && '👑'}
                          </span>
                        </>
                      ) : (
                        <span className="text-xs text-slate-400 italic">A definir (Vencedor rodada anterior)</span>
                      )}
                    </div>

                    {/* Sets Score display if completed */}
                    {m.score?.sets && (
                      <div className="flex items-center gap-1.5 font-mono text-xs font-black">
                        {m.score.sets.map((s, idx) => (
                          <span key={idx} className={`px-1.5 py-0.5 rounded ${s.player2Games > s.player1Games ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400'}`}>
                            {s.player2Games}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Scoring Action Buttons */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => onOpenLiveScorer(m, m.tournamentId, 'direct_score')}
                    className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                  >
                    <FileEdit className="w-3.5 h-3.5" />
                    Marcar Resultado Direto
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenLiveScorer(m, m.tournamentId, 'point_by_point')}
                    className="py-2 px-3 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    title="Abrir Placar Eletrônico Ao Vivo (Ponto a Ponto)"
                  >
                    <Radio className="w-3.5 h-3.5 text-amber-500 hover:text-slate-950" />
                    Ao Vivo
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
