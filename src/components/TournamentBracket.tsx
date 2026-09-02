import React from 'react';
import { Tournament, TournamentMatch } from '../types';
import { useTennis } from '../context/TennisContext';
import { Trophy, Clock, MapPin, PlayCircle, CheckCircle2, Award } from 'lucide-react';

interface TournamentBracketProps {
  tournament: Tournament;
  onOpenScoreModal: (match: TournamentMatch) => void;
  onOpenLiveScorer: (match: TournamentMatch) => void;
}

export const TournamentBracket: React.FC<TournamentBracketProps> = ({
  tournament,
  onOpenScoreModal,
  onOpenLiveScorer
}) => {
  const { players, currentUser, setSelectedPlayerId } = useTennis();

  // Group matches by round
  const round1Matches = tournament.matches.filter(m => m.round === 1);
  const round2Matches = tournament.matches.filter(m => m.round === 2);
  const round3Matches = tournament.matches.filter(m => m.round === 3);

  const getPlayer = (id?: string) => players.find(p => p.id === id);

  const renderMatchCard = (match: TournamentMatch) => {
    const p1 = getPlayer(match.player1Id);
    const p2 = getPlayer(match.player2Id);
    const isP1Winner = match.winnerId === match.player1Id;
    const isP2Winner = match.winnerId === match.player2Id;
    const isCurrentUserPlaying = currentUser.id === match.player1Id || currentUser.id === match.player2Id;

    return (
      <div 
        key={match.id} 
        className={`bg-white dark:bg-slate-900 rounded-xl border transition-all duration-200 shadow-sm hover:shadow-md ${
          match.status === 'em_andamento'
            ? 'border-amber-400 dark:border-amber-500/70 ring-2 ring-amber-400/20'
            : match.status === 'concluido'
            ? 'border-slate-200 dark:border-slate-800'
            : 'border-slate-200 dark:border-slate-800'
        } ${isCurrentUserPlaying ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-400' : ''}`}
      >
        {/* Match Header Info */}
        <div className="flex items-center justify-between px-3 py-1.5 bg-slate-50 dark:bg-slate-800/80 rounded-t-xl border-b border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1 font-medium">
            <span>Jogo {match.matchNumber}</span>
            {match.courtName && (
              <span className="hidden sm:inline-block truncate max-w-[120px] text-[10px]">
                • {match.courtName.split(' - ')[0]}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {match.status === 'em_andamento' && (
              <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold animate-pulse text-[10px]">
                <PlayCircle className="w-3 h-3" /> Ao Vivo
              </span>
            )}
            {match.status === 'concluido' && (
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold text-[10px]">
                <CheckCircle2 className="w-3 h-3" /> Finalizado
              </span>
            )}
            {match.status === 'agendado' && (
              <span className="flex items-center gap-1 text-slate-400 text-[10px]">
                <Clock className="w-3 h-3" /> {match.scheduledTime || 'A definir'}
              </span>
            )}
          </div>
        </div>

        {/* Players & Scores */}
        <div className="p-2.5 space-y-2">
          
          {/* Player 1 Row */}
          <div className={`flex items-center justify-between p-1.5 rounded-lg transition-colors ${
            isP1Winner 
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 font-bold' 
              : 'text-slate-700 dark:text-slate-200'
          }`}>
            <div className="flex items-center gap-2 min-w-0">
              {match.player1Seed && (
                <span className="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold px-1 rounded">
                  [{match.player1Seed}]
                </span>
              )}
              {p1 ? (
                <div 
                  className="flex items-center gap-1.5 cursor-pointer hover:underline truncate"
                  onClick={() => setSelectedPlayerId(p1.id)}
                >
                  <img src={p1.avatar} alt={p1.name} className="w-5 h-5 rounded-full object-cover shrink-0" />
                  <span className="text-xs truncate">{p1.name.split(' ').slice(0, 2).join(' ')}</span>
                </div>
              ) : (
                <span className="text-xs text-slate-400 italic">A definir</span>
              )}
            </div>

            {/* Set scores */}
            <div className="flex items-center gap-1 text-xs font-mono shrink-0 ml-2">
              {match.score?.sets.map((set, idx) => (
                <span 
                  key={idx} 
                  className={`w-5 text-center px-0.5 rounded ${
                    set.player1Games > set.player2Games 
                      ? 'font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100/60 dark:bg-emerald-900/30' 
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {set.player1Games}
                </span>
              ))}
            </div>
          </div>

          {/* Player 2 Row */}
          <div className={`flex items-center justify-between p-1.5 rounded-lg transition-colors ${
            isP2Winner 
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 font-bold' 
              : 'text-slate-700 dark:text-slate-200'
          }`}>
            <div className="flex items-center gap-2 min-w-0">
              {match.player2Seed && (
                <span className="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold px-1 rounded">
                  [{match.player2Seed}]
                </span>
              )}
              {p2 ? (
                <div 
                  className="flex items-center gap-1.5 cursor-pointer hover:underline truncate"
                  onClick={() => setSelectedPlayerId(p2.id)}
                >
                  <img src={p2.avatar} alt={p2.name} className="w-5 h-5 rounded-full object-cover shrink-0" />
                  <span className="text-xs truncate">{p2.name.split(' ').slice(0, 2).join(' ')}</span>
                </div>
              ) : (
                <span className="text-xs text-slate-400 italic">A definir</span>
              )}
            </div>

            {/* Set scores */}
            <div className="flex items-center gap-1 text-xs font-mono shrink-0 ml-2">
              {match.score?.sets.map((set, idx) => (
                <span 
                  key={idx} 
                  className={`w-5 text-center px-0.5 rounded ${
                    set.player2Games > set.player1Games 
                      ? 'font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100/60 dark:bg-emerald-900/30' 
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {set.player2Games}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Action footer */}
        <div className="p-2 pt-0 flex items-center justify-end gap-1.5 border-t border-slate-100 dark:border-slate-800/60 mt-1">
          {p1 && p2 && (
            <>
              <button
                id={`btn-livescore-${match.id}`}
                onClick={() => onOpenLiveScorer(match)}
                className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 px-2 py-1 rounded flex items-center gap-1 transition-colors"
                title="Abrir placar ponto a ponto em tempo real"
              >
                <PlayCircle className="w-3 h-3" /> Ao Vivo
              </button>
              <button
                id={`btn-score-${match.id}`}
                onClick={() => onOpenScoreModal(match)}
                className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 px-2 py-1 rounded flex items-center gap-1 transition-colors"
                title="Lançar ou editar placar final da partida"
              >
                {match.status === 'concluido' ? 'Editar Placar' : 'Lançar Placar'}
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  // Champion
  const finalMatch = round3Matches.length > 0 ? round3Matches[0] : (round2Matches.length > 0 ? round2Matches[round2Matches.length - 1] : null);
  const champion = finalMatch?.winnerId ? getPlayer(finalMatch.winnerId) : null;

  return (
    <div className="overflow-x-auto pb-6">
      <div className="min-w-[820px] p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner">
        
        {/* Rounds Header */}
        <div className="grid grid-cols-4 gap-6 mb-4 text-center">
          {round1Matches.length > 0 && (
            <div className="bg-slate-200/70 dark:bg-slate-800 py-1.5 px-3 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              {round1Matches.length === 4 ? 'Quartas de Final' : 'Semifinais'}
            </div>
          )}
          {round2Matches.length > 0 && (
            <div className="bg-slate-200/70 dark:bg-slate-800 py-1.5 px-3 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              {round1Matches.length === 4 ? 'Semifinais' : 'Grande Final'}
            </div>
          )}
          {round3Matches.length > 0 && (
            <div className="bg-slate-200/70 dark:bg-slate-800 py-1.5 px-3 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Grande Final
            </div>
          )}
          <div className="bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/30 py-1.5 px-3 rounded-lg text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider flex items-center justify-center gap-1.5">
            <Trophy className="w-3.5 h-3.5" /> Campeão Oficial
          </div>
        </div>

        {/* Tree Bracket Columns */}
        <div className="grid grid-cols-4 gap-6 items-center">
          
          {/* Column 1: Quartas / Round 1 */}
          <div className="space-y-4">
            {round1Matches.map(match => renderMatchCard(match))}
          </div>

          {/* Column 2: Semifinais / Round 2 */}
          <div className="space-y-12">
            {round2Matches.map(match => renderMatchCard(match))}
          </div>

          {/* Column 3: Final / Round 3 */}
          <div className="space-y-8">
            {round3Matches.length > 0 ? (
              round3Matches.map(match => renderMatchCard(match))
            ) : (
              <div className="text-center text-xs text-slate-400 italic p-6">
                Chaveamento simplificado
              </div>
            )}
          </div>

          {/* Column 4: Champion Trophy Card */}
          <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-b from-amber-50 to-amber-100/60 dark:from-amber-950/40 dark:to-slate-900 border-2 border-amber-300 dark:border-amber-500/40 rounded-2xl shadow-lg text-center">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-slate-950 shadow-md mb-3">
              <Trophy className="w-7 h-7 stroke-[2.5]" />
            </div>

            <p className="text-xs font-extrabold text-amber-800 dark:text-amber-300 uppercase tracking-wider mb-1">
              Campeão do Torneio
            </p>

            {champion ? (
              <div className="space-y-2">
                <img 
                  src={champion.avatar} 
                  alt={champion.name} 
                  className="w-16 h-16 rounded-full mx-auto object-cover border-2 border-amber-400 shadow-md cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => setSelectedPlayerId(champion.id)}
                />
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  {champion.name}
                </h4>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                  +100 pts no Ranking
                </p>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 bg-white/80 dark:bg-slate-800 px-2.5 py-1 rounded-full border border-amber-200 dark:border-slate-700">
                  {tournament.prizeDescription.split('+')[0] || 'Troféu Oficial'}
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-500 dark:text-slate-400 italic py-4">
                Aguardando a conclusão da Grande Final...
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
