import React, { useState, useEffect } from 'react';
import { useTennis } from '../context/TennisContext';
import { TournamentMatch, Player, SetScore, MatchScoreDetails } from '../types';
import { 
  X, 
  RotateCcw, 
  CheckCircle, 
  Trophy, 
  Radio, 
  Zap, 
  Flame, 
  Play, 
  Award,
  ChevronRight,
  Shield,
  FileEdit,
  Plus,
  Minus,
  Check,
  Sparkles,
  Clock,
  Activity
} from 'lucide-react';

interface LiveScorerModalProps {
  isOpen: boolean;
  onClose: () => void;
  tournamentId?: string;
  match?: TournamentMatch | null;
  initialMode?: 'point_by_point' | 'direct_score';
}

export const LiveScorerModal: React.FC<LiveScorerModalProps> = ({
  isOpen,
  onClose,
  tournamentId,
  match,
  initialMode = 'point_by_point'
}) => {
  const { 
    players, 
    tournaments, 
    updateMatchScore, 
    recordDirectMatchResult,
    triggerCelebration 
  } = useTennis();

  // Mode switcher: 'point_by_point' (Ao Vivo) or 'direct_score' (Resultado Direto - Games e Sets)
  const [scorerMode, setScorerMode] = useState<'point_by_point' | 'direct_score'>(initialMode);

  // Match participants
  const [player1Id, setPlayer1Id] = useState<string>('p1');
  const [player2Id, setPlayer2Id] = useState<string>('p2');

  // Match format options
  const [matchFormat, setMatchFormat] = useState<'melhor_de_3_com_super_tiebreak' | 'melhor_de_3_tradicional' | 'pro_set_8'>('melhor_de_3_com_super_tiebreak');

  // --- LIVE SCORER STATE ---
  const [p1Points, setP1Points] = useState<number>(0); // 0=0, 1=15, 2=30, 3=40, 4=AD
  const [p2Points, setP2Points] = useState<number>(0);
  const [sets, setSets] = useState<SetScore[]>([
    { player1Games: 0, player2Games: 0 }
  ]);
  const [currentSetIndex, setCurrentSetIndex] = useState<number>(0);

  // Tiebreak states for live scorer
  const [isTiebreak, setIsTiebreak] = useState<boolean>(false);
  const [isSuperTiebreak, setIsSuperTiebreak] = useState<boolean>(false);
  const [tiebreakP1, setTiebreakP1] = useState<number>(0);
  const [tiebreakP2, setTiebreakP2] = useState<number>(0);

  // Server indicator (1 = P1, 2 = P2)
  const [server, setServer] = useState<1 | 2>(1);

  // Match statistics tracker
  const [acesP1, setAcesP1] = useState<number>(0);
  const [acesP2, setAcesP2] = useState<number>(0);
  const [dfP1, setDfP1] = useState<number>(0);
  const [dfP2, setDfP2] = useState<number>(0);
  const [winnersP1, setWinnersP1] = useState<number>(0);
  const [winnersP2, setWinnersP2] = useState<number>(0);

  const [matchFinished, setMatchFinished] = useState<boolean>(false);
  const [winnerId, setWinnerId] = useState<string | null>(null);

  // --- DIRECT SCORE STATE (Games & Sets) ---
  const [directSets, setDirectSets] = useState<SetScore[]>([
    { player1Games: 6, player2Games: 4 },
    { player1Games: 6, player2Games: 3 }
  ]);
  const [directWinnerId, setDirectWinnerId] = useState<string>('p1');
  const [matchDuration, setMatchDuration] = useState<number>(75);
  const [directAcesP1, setDirectAcesP1] = useState<number>(3);
  const [directAcesP2, setDirectAcesP2] = useState<number>(2);
  const [directDfP1, setDirectDfP1] = useState<number>(1);
  const [directDfP2, setDirectDfP2] = useState<number>(2);
  const [isDirectSaved, setIsDirectSaved] = useState<boolean>(false);

  // Synchronize on modal open or match change
  useEffect(() => {
    if (isOpen) {
      setScorerMode(initialMode);
      setIsDirectSaved(false);
    }
  }, [isOpen, initialMode]);

  useEffect(() => {
    if (match) {
      if (match.player1Id) {
        setPlayer1Id(match.player1Id);
        setDirectWinnerId(match.player1Id);
      }
      if (match.player2Id) setPlayer2Id(match.player2Id);
      
      if (match.score?.sets && match.score.sets.length > 0) {
        setSets(match.score.sets);
        setDirectSets(match.score.sets);
        setCurrentSetIndex(Math.max(0, match.score.sets.length - 1));
        if (match.score.winnerId) {
          setWinnerId(match.score.winnerId);
          setDirectWinnerId(match.score.winnerId);
          setMatchFinished(true);
        }
      }
    } else {
      setPlayer1Id('p1');
      setPlayer2Id('p2');
      setDirectWinnerId('p1');
    }
  }, [match, isOpen]);

  const p1 = players.find(p => p.id === player1Id) || players[0];
  const p2 = players.find(p => p.id === player2Id) || players[1];

  // Auto-calculate winner for direct score
  const updateDirectWinnerCalculation = (currentSets: SetScore[]) => {
    let p1Sets = 0;
    let p2Sets = 0;
    currentSets.forEach(s => {
      if (s.player1Games > s.player2Games) p1Sets++;
      else if (s.player2Games > s.player1Games) p2Sets++;
    });

    if (p1Sets > p2Sets) {
      setDirectWinnerId(p1.id);
    } else if (p2Sets > p1Sets) {
      setDirectWinnerId(p2.id);
    }
  };

  // Direct Sets Handlers
  const handleUpdateDirectGame = (setIndex: number, player: 1 | 2, delta: number) => {
    setDirectSets(prev => {
      const updated = prev.map((s, idx) => {
        if (idx !== setIndex) return s;
        if (player === 1) {
          return { ...s, player1Games: Math.max(0, s.player1Games + delta) };
        } else {
          return { ...s, player2Games: Math.max(0, s.player2Games + delta) };
        }
      });
      updateDirectWinnerCalculation(updated);
      return updated;
    });
  };

  const handleSetDirectGameDirectly = (setIndex: number, player: 1 | 2, val: number) => {
    setDirectSets(prev => {
      const updated = prev.map((s, idx) => {
        if (idx !== setIndex) return s;
        if (player === 1) {
          return { ...s, player1Games: Math.max(0, val) };
        } else {
          return { ...s, player2Games: Math.max(0, val) };
        }
      });
      updateDirectWinnerCalculation(updated);
      return updated;
    });
  };

  const handleAddDirectSet = () => {
    if (directSets.length < 5) {
      const newSets = [...directSets, { player1Games: 0, player2Games: 0 }];
      setDirectSets(newSets);
    }
  };

  const handleRemoveDirectSet = (index: number) => {
    if (directSets.length > 1) {
      const newSets = directSets.filter((_, idx) => idx !== index);
      setDirectSets(newSets);
      updateDirectWinnerCalculation(newSets);
    }
  };

  // Quick Preset Scores
  const applyPresetScore = (presetSets: SetScore[]) => {
    setDirectSets(presetSets);
    updateDirectWinnerCalculation(presetSets);
  };

  // Submit Direct Score
  const handleSaveDirectScore = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!directWinnerId) {
      alert('Por favor selecione o vencedor da partida.');
      return;
    }

    const scoreData: MatchScoreDetails = {
      sets: directSets,
      winnerId: directWinnerId,
      acesP1: directAcesP1,
      acesP2: directAcesP2,
      doubleFaultsP1: directDfP1,
      doubleFaultsP2: directDfP2,
      durationMinutes: matchDuration
    };

    if (tournamentId && match) {
      updateMatchScore(tournamentId, match.id, scoreData);
    } else {
      recordDirectMatchResult(player1Id, player2Id, scoreData, 'Placar Eletrônico Direto');
    }

    setIsDirectSaved(true);
    triggerCelebration();

    setTimeout(() => {
      onClose();
    }, 1200);
  };

  // Helper to format points for Live Scorer
  const formatTennisPoints = (pts1: number, pts2: number): { p1Display: string; p2Display: string; status: string } => {
    if (isTiebreak || isSuperTiebreak) {
      return {
        p1Display: String(tiebreakP1),
        p2Display: String(tiebreakP2),
        status: isSuperTiebreak ? 'Super Tie-Break (10 pts)' : 'Tie-Break (7 pts)'
      };
    }

    if (pts1 >= 3 && pts2 >= 3) {
      if (pts1 === pts2) return { p1Display: '40', p2Display: '40', status: 'Deuce / Igualdade' };
      if (pts1 === 4) return { p1Display: 'AD', p2Display: '40', status: `Vantagem ${p1.name.split(' ')[0]}` };
      if (pts2 === 4) return { p1Display: '40', p2Display: 'AD', status: `Vantagem ${p2.name.split(' ')[0]}` };
    }

    const pointLabels = ['0', '15', '30', '40'];
    const p1Display = pointLabels[pts1] || '40';
    const p2Display = pointLabels[pts2] || '40';

    let status = 'Em disputa';
    if (pts1 === 3 && pts2 < 3) status = `Game Point (${p1.name.split(' ')[0]})`;
    if (pts2 === 3 && pts1 < 3) status = `Game Point (${p2.name.split(' ')[0]})`;

    return { p1Display, p2Display, status };
  };

  const pointInfo = formatTennisPoints(p1Points, p2Points);

  // Check if a set was won in Live Mode
  const checkSetWin = (newSets: SetScore[], setIdx: number) => {
    const currentSet = newSets[setIdx];
    const g1 = currentSet.player1Games;
    const g2 = currentSet.player2Games;

    let setWinner: 1 | 2 | null = null;
    if (g1 >= 6 && g1 - g2 >= 2) setWinner = 1;
    else if (g2 >= 6 && g2 - g1 >= 2) setWinner = 2;
    else if (g1 === 7 && g2 === 6) setWinner = 1;
    else if (g2 === 7 && g1 === 6) setWinner = 2;

    if (setWinner) {
      let p1SetsWon = 0;
      let p2SetsWon = 0;
      newSets.forEach((s) => {
        if (s.player1Games > s.player2Games) p1SetsWon++;
        else if (s.player2Games > s.player1Games) p2SetsWon++;
      });

      if (p1SetsWon === 2) {
        setMatchFinished(true);
        setWinnerId(p1.id);
        triggerCelebration();
        return;
      }
      if (p2SetsWon === 2) {
        setMatchFinished(true);
        setWinnerId(p2.id);
        triggerCelebration();
        return;
      }

      if (p1SetsWon === 1 && p2SetsWon === 1 && matchFormat === 'melhor_de_3_com_super_tiebreak') {
        setIsSuperTiebreak(true);
        setCurrentSetIndex(2);
        setSets(prev => [...prev, { player1Games: 0, player2Games: 0 }]);
        return;
      }

      if (setIdx < 2) {
        setCurrentSetIndex(setIdx + 1);
        setSets(prev => [...prev, { player1Games: 0, player2Games: 0 }]);
      }
    }
  };

  // Point scoring for Live Mode
  const addPointP1 = (type: 'point' | 'ace' | 'winner' = 'point') => {
    if (matchFinished) return;

    if (type === 'ace') setAcesP1(prev => prev + 1);
    if (type === 'winner') setWinnersP1(prev => prev + 1);

    if (isSuperTiebreak) {
      const nextP1 = tiebreakP1 + 1;
      setTiebreakP1(nextP1);
      if (nextP1 >= 10 && nextP1 - tiebreakP2 >= 2) {
        setSets(prev => {
          const copy = [...prev];
          copy[currentSetIndex] = { player1Games: nextP1, player2Games: tiebreakP2 };
          return copy;
        });
        setMatchFinished(true);
        setWinnerId(p1.id);
        triggerCelebration();
      }
      return;
    }

    if (isTiebreak) {
      const nextP1 = tiebreakP1 + 1;
      setTiebreakP1(nextP1);
      if (nextP1 >= 7 && nextP1 - tiebreakP2 >= 2) {
        const newSets = [...sets];
        newSets[currentSetIndex] = {
          player1Games: 7,
          player2Games: 6,
          tiebreakPlayer1: nextP1,
          tiebreakPlayer2: tiebreakP2
        };
        setSets(newSets);
        setIsTiebreak(false);
        setTiebreakP1(0);
        setTiebreakP2(0);
        setP1Points(0);
        setP2Points(0);
        checkSetWin(newSets, currentSetIndex);
      }
      return;
    }

    if (p1Points === 0) setP1Points(1);
    else if (p1Points === 1) setP1Points(2);
    else if (p1Points === 2) setP1Points(3);
    else if (p1Points === 3) {
      if (p2Points < 3) {
        winGame(1);
      } else if (p2Points === 3) {
        setP1Points(4);
      } else if (p2Points === 4) {
        setP2Points(3);
      }
    } else if (p1Points === 4) {
      winGame(1);
    }
  };

  const addPointP2 = (type: 'point' | 'ace' | 'winner' = 'point') => {
    if (matchFinished) return;

    if (type === 'ace') setAcesP2(prev => prev + 1);
    if (type === 'winner') setWinnersP2(prev => prev + 1);

    if (isSuperTiebreak) {
      const nextP2 = tiebreakP2 + 1;
      setTiebreakP2(nextP2);
      if (nextP2 >= 10 && nextP2 - tiebreakP1 >= 2) {
        setSets(prev => {
          const copy = [...prev];
          copy[currentSetIndex] = { player1Games: tiebreakP1, player2Games: nextP2 };
          return copy;
        });
        setMatchFinished(true);
        setWinnerId(p2.id);
        triggerCelebration();
      }
      return;
    }

    if (isTiebreak) {
      const nextP2 = tiebreakP2 + 1;
      setTiebreakP2(nextP2);
      if (nextP2 >= 7 && nextP2 - tiebreakP1 >= 2) {
        const newSets = [...sets];
        newSets[currentSetIndex] = {
          player1Games: 6,
          player2Games: 7,
          tiebreakPlayer1: tiebreakP1,
          tiebreakPlayer2: nextP2
        };
        setSets(newSets);
        setIsTiebreak(false);
        setTiebreakP1(0);
        setTiebreakP2(0);
        setP1Points(0);
        setP2Points(0);
        checkSetWin(newSets, currentSetIndex);
      }
      return;
    }

    if (p2Points === 0) setP2Points(1);
    else if (p2Points === 1) setP2Points(2);
    else if (p2Points === 2) setP2Points(3);
    else if (p2Points === 3) {
      if (p1Points < 3) {
        winGame(2);
      } else if (p1Points === 3) {
        setP2Points(4);
      } else if (p1Points === 4) {
        setP1Points(3);
      }
    } else if (p2Points === 4) {
      winGame(2);
    }
  };

  const winGame = (winner: 1 | 2) => {
    setP1Points(0);
    setP2Points(0);
    setServer(prev => (prev === 1 ? 2 : 1));

    const newSets = [...sets];
    const cur = newSets[currentSetIndex];
    if (winner === 1) cur.player1Games += 1;
    else cur.player2Games += 1;

    if (cur.player1Games === 6 && cur.player2Games === 6) {
      setIsTiebreak(true);
      setTiebreakP1(0);
      setTiebreakP2(0);
      return;
    }

    setSets(newSets);
    checkSetWin(newSets, currentSetIndex);
  };

  const handleResetLiveMatch = () => {
    setSets([{ player1Games: 0, player2Games: 0 }]);
    setCurrentSetIndex(0);
    setP1Points(0);
    setP2Points(0);
    setIsTiebreak(false);
    setIsSuperTiebreak(false);
    setTiebreakP1(0);
    setTiebreakP2(0);
    setAcesP1(0);
    setAcesP2(0);
    setDfP1(0);
    setDfP2(0);
    setWinnersP1(0);
    setWinnersP2(0);
    setMatchFinished(false);
    setWinnerId(null);
  };

  const handleSaveAndFinishLive = () => {
    if (!winnerId) {
      alert('Selecione ou aguarde a finalização da partida.');
      return;
    }

    const scoreData: MatchScoreDetails = {
      sets,
      winnerId,
      acesP1,
      acesP2,
      doubleFaultsP1: dfP1,
      doubleFaultsP2: dfP2,
      durationMinutes: 90
    };

    if (tournamentId && match) {
      updateMatchScore(tournamentId, match.id, scoreData);
    } else {
      recordDirectMatchResult(player1Id, player2Id, scoreData, 'Placar Ao Vivo de Quadra');
    }

    triggerCelebration();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-3xl shadow-2xl text-white overflow-hidden my-6">
        
        {/* Top Header with Mode Selector */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border transition-colors ${
                scorerMode === 'direct_score'
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
              }`}>
                {scorerMode === 'direct_score' ? (
                  <FileEdit className="w-5 h-5" />
                ) : (
                  <Radio className="w-5 h-5 animate-pulse" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-lg text-white">
                    {scorerMode === 'direct_score' ? 'Marcar Resultado Direto' : 'Placar Eletrônico Ao Vivo'}
                  </h3>
                  <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
                    {match ? `${match.roundName} • Jogo ${match.matchNumber}` : 'Jogo Avulso / Barragem'}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {scorerMode === 'direct_score' 
                    ? 'Informe os games e sets concluídos para salvar o placar final instantaneamente' 
                    : 'Marcador oficial ponto a ponto em tempo real para controle da quadra'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center hover:bg-slate-700 transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="mt-4 grid grid-cols-2 gap-2 p-1 bg-slate-900/90 rounded-2xl border border-slate-800">
            <button
              type="button"
              id="tab-direct-score"
              onClick={() => setScorerMode('direct_score')}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                scorerMode === 'direct_score'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <FileEdit className="w-4 h-4" />
              📝 Marcar Resultado Direto (Games & Sets)
            </button>

            <button
              type="button"
              id="tab-point-by-point"
              onClick={() => setScorerMode('point_by_point')}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                scorerMode === 'point_by_point'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Radio className="w-4 h-4" />
              ⚡ Ponto a Ponto (Ao Vivo)
            </button>
          </div>
        </div>

        {/* Player Selection if not an automated tournament match */}
        {!match && (
          <div className="p-4 bg-slate-800/40 border-b border-slate-800 grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Jogador 1</label>
              <select
                value={player1Id}
                onChange={(e) => {
                  setPlayer1Id(e.target.value);
                  if (directWinnerId === player1Id) setDirectWinnerId(e.target.value);
                }}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white font-medium focus:ring-1 focus:ring-emerald-500 outline-none"
              >
                {players.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.category.split(' ')[0]})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Jogador 2</label>
              <select
                value={player2Id}
                onChange={(e) => {
                  setPlayer2Id(e.target.value);
                  if (directWinnerId === player2Id) setDirectWinnerId(e.target.value);
                }}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white font-medium focus:ring-1 focus:ring-emerald-500 outline-none"
              >
                {players.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.category.split(' ')[0]})</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* MATCHUP CARD DISPLAY */}
        <div className="px-6 pt-5">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src={p1.avatar} 
                alt={p1.name} 
                className="w-11 h-11 rounded-2xl object-cover border-2 border-emerald-500" 
              />
              <div>
                <h4 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                  {p1.name}
                  {directWinnerId === p1.id && scorerMode === 'direct_score' && (
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.2 rounded font-bold">Vencedor</span>
                  )}
                </h4>
                <p className="text-[11px] text-slate-400">{p1.club || 'MatchPoint Tennis Club'} • {p1.category.split(' ')[0]}</p>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-black text-amber-400">
              VS
            </span>

            <div className="flex items-center gap-3 text-right flex-row-reverse">
              <img 
                src={p2.avatar} 
                alt={p2.name} 
                className="w-11 h-11 rounded-2xl object-cover border-2 border-blue-500" 
              />
              <div>
                <h4 className="font-extrabold text-sm text-white flex items-center justify-end gap-1.5">
                  {directWinnerId === p2.id && scorerMode === 'direct_score' && (
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.2 rounded font-bold">Vencedor</span>
                  )}
                  {p2.name}
                </h4>
                <p className="text-[11px] text-slate-400">{p2.club || 'MatchPoint Tennis Club'} • {p2.category.split(' ')[0]}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* MODE 1: DIRECT SCORE (MARCAR RESULTADO DIRETO COM GAMES E SETS) */}
        {/* ------------------------------------------------------------- */}
        {scorerMode === 'direct_score' && (
          <div className="p-6 space-y-6">
            
            {/* Quick Score Presets */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Placares Mais Comuns (Clique para aplicar):
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => applyPresetScore([
                    { player1Games: 6, player2Games: 4 },
                    { player1Games: 6, player2Games: 3 }
                  ])}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-mono font-bold text-slate-200 border border-slate-700"
                >
                  6/4 6/3
                </button>
                <button
                  type="button"
                  onClick={() => applyPresetScore([
                    { player1Games: 6, player2Games: 2 },
                    { player1Games: 6, player2Games: 4 }
                  ])}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-mono font-bold text-slate-200 border border-slate-700"
                >
                  6/2 6/4
                </button>
                <button
                  type="button"
                  onClick={() => applyPresetScore([
                    { player1Games: 7, player2Games: 6, tiebreakPlayer1: 7, tiebreakPlayer2: 4 },
                    { player1Games: 6, player2Games: 4 }
                  ])}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-mono font-bold text-slate-200 border border-slate-700"
                >
                  7/6(4) 6/4
                </button>
                <button
                  type="button"
                  onClick={() => applyPresetScore([
                    { player1Games: 6, player2Games: 3 },
                    { player1Games: 4, player2Games: 6 },
                    { player1Games: 10, player2Games: 7 }
                  ])}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-mono font-bold text-slate-200 border border-slate-700"
                >
                  6/3 4/6 10/7 (STB)
                </button>
                <button
                  type="button"
                  onClick={() => applyPresetScore([
                    { player1Games: 4, player2Games: 6 },
                    { player1Games: 6, player2Games: 2 },
                    { player1Games: 10, player2Games: 8 }
                  ])}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-mono font-bold text-slate-200 border border-slate-700"
                >
                  4/6 6/2 10/8 (STB)
                </button>
                <button
                  type="button"
                  onClick={() => applyPresetScore([
                    { player1Games: 8, player2Games: 5 }
                  ])}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-mono font-bold text-slate-200 border border-slate-700"
                >
                  8/5 (Pro-Set)
                </button>
              </div>
            </div>

            {/* Set & Games Inputs */}
            <div className="space-y-3 bg-slate-950/70 p-5 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                <span className="text-xs font-extrabold uppercase text-slate-300 tracking-wider">
                  Contagem de Games por Set
                </span>
                <span className="text-[11px] text-emerald-400 font-bold">
                  {p1.name.split(' ')[0]} vs {p2.name.split(' ')[0]}
                </span>
              </div>

              {directSets.map((setObj, sIdx) => (
                <div 
                  key={sIdx}
                  className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-slate-800 text-slate-200 flex items-center justify-center font-bold text-xs">
                      {sIdx + 1}º
                    </span>
                    <div>
                      <span className="text-xs font-bold text-white">
                        {sIdx === 2 ? '3º Set / Super Tie-Break' : `Set ${sIdx + 1}`}
                      </span>
                      <p className="text-[10px] text-slate-400">Games ganhos</p>
                    </div>
                  </div>

                  {/* Player 1 Games Controls */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                      <span className="text-[11px] font-bold text-emerald-400 w-16 truncate">
                        {p1.name.split(' ')[0]}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleUpdateDirectGame(sIdx, 1, -1)}
                        className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <input
                        type="number"
                        min={0}
                        max={30}
                        value={setObj.player1Games}
                        onChange={(e) => handleSetDirectGameDirectly(sIdx, 1, parseInt(e.target.value) || 0)}
                        className="w-12 h-7 bg-slate-900 border border-slate-700 rounded-lg text-center font-mono font-black text-sm text-white focus:border-emerald-500 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleUpdateDirectGame(sIdx, 1, 1)}
                        className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="font-bold text-slate-500">x</span>

                    {/* Player 2 Games Controls */}
                    <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                      <input
                        type="number"
                        min={0}
                        max={30}
                        value={setObj.player2Games}
                        onChange={(e) => handleSetDirectGameDirectly(sIdx, 2, parseInt(e.target.value) || 0)}
                        className="w-12 h-7 bg-slate-900 border border-slate-700 rounded-lg text-center font-mono font-black text-sm text-white focus:border-emerald-500 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleUpdateDirectGame(sIdx, 2, -1)}
                        className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpdateDirectGame(sIdx, 2, 1)}
                        className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-[11px] font-bold text-blue-400 w-16 text-right truncate">
                        {p2.name.split(' ')[0]}
                      </span>
                    </div>

                    {directSets.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveDirectSet(sIdx)}
                        className="w-7 h-7 rounded-lg bg-red-950/40 text-red-400 hover:bg-red-900/60 flex items-center justify-center text-xs ml-1"
                        title="Remover este set"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {/* Add Set Button */}
              {directSets.length < 5 && (
                <button
                  type="button"
                  onClick={handleAddDirectSet}
                  className="w-full py-2 border border-dashed border-slate-700 hover:border-slate-500 rounded-xl text-xs font-bold text-slate-400 hover:text-white flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Adicionar Outro Set / Desempate
                </button>
              )}
            </div>

            {/* Winner Confirmation Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">
                Vencedor Oficial da Partida:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  id="btn-winner-p1"
                  onClick={() => setDirectWinnerId(p1.id)}
                  className={`p-3.5 rounded-2xl border text-xs font-bold transition-all flex items-center justify-between ${
                    directWinnerId === p1.id
                      ? 'bg-emerald-600/90 border-emerald-400 text-white shadow-lg ring-2 ring-emerald-400/40'
                      : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <img src={p1.avatar} alt={p1.name} className="w-7 h-7 rounded-full object-cover" />
                    <span className="font-extrabold">{p1.name}</span>
                  </div>
                  {directWinnerId === p1.id && <Check className="w-4 h-4 text-emerald-200" />}
                </button>

                <button
                  type="button"
                  id="btn-winner-p2"
                  onClick={() => setDirectWinnerId(p2.id)}
                  className={`p-3.5 rounded-2xl border text-xs font-bold transition-all flex items-center justify-between ${
                    directWinnerId === p2.id
                      ? 'bg-emerald-600/90 border-emerald-400 text-white shadow-lg ring-2 ring-emerald-400/40'
                      : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <img src={p2.avatar} alt={p2.name} className="w-7 h-7 rounded-full object-cover" />
                    <span className="font-extrabold">{p2.name}</span>
                  </div>
                  {directWinnerId === p2.id && <Check className="w-4 h-4 text-emerald-200" />}
                </button>
              </div>
            </div>

            {/* Optional Stats (Aces, Duration) */}
            <div className="bg-slate-950/40 p-4 rounded-2xl border border-slate-800/80 grid grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 text-[11px] mb-1 font-medium">Duração (minutos)</label>
                <div className="flex items-center gap-1 bg-slate-900 border border-slate-700 rounded-xl px-2 py-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="number"
                    value={matchDuration}
                    onChange={(e) => setMatchDuration(Number(e.target.value))}
                    className="w-full bg-transparent text-white font-bold outline-none text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 text-[11px] mb-1 font-medium">Aces ({p1.name.split(' ')[0]} / {p2.name.split(' ')[0]})</label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={directAcesP1}
                    onChange={(e) => setDirectAcesP1(Number(e.target.value))}
                    className="w-1/2 bg-slate-900 border border-slate-700 rounded-xl p-1.5 text-center text-white font-bold outline-none text-xs"
                    title={`Aces de ${p1.name}`}
                  />
                  <span className="text-slate-500">/</span>
                  <input
                    type="number"
                    value={directAcesP2}
                    onChange={(e) => setDirectAcesP2(Number(e.target.value))}
                    className="w-1/2 bg-slate-900 border border-slate-700 rounded-xl p-1.5 text-center text-white font-bold outline-none text-xs"
                    title={`Aces de ${p2.name}`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 text-[11px] mb-1 font-medium">Duplas Faltas</label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={directDfP1}
                    onChange={(e) => setDirectDfP1(Number(e.target.value))}
                    className="w-1/2 bg-slate-900 border border-slate-700 rounded-xl p-1.5 text-center text-white font-bold outline-none text-xs"
                  />
                  <span className="text-slate-500">/</span>
                  <input
                    type="number"
                    value={directDfP2}
                    onChange={(e) => setDirectDfP2(Number(e.target.value))}
                    className="w-1/2 bg-slate-900 border border-slate-700 rounded-xl p-1.5 text-center text-white font-bold outline-none text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Score Summary Badge */}
            <div className="p-3.5 bg-emerald-950/30 border border-emerald-500/30 rounded-2xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-emerald-300">
                <Trophy className="w-4 h-4 text-emerald-400" />
                <span className="font-bold">
                  Resumo do Placar: {directSets.map(s => `${s.player1Games}/${s.player2Games}`).join(' ')}
                </span>
              </div>
              <span className="font-black text-white bg-emerald-600 px-2 py-0.5 rounded-lg text-[11px]">
                {directWinnerId === p1.id ? p1.name.split(' ')[0] : p2.name.split(' ')[0]} Vence
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors"
              >
                Cancelar
              </button>

              <button
                type="button"
                id="btn-confirm-direct-score"
                onClick={() => handleSaveDirectScore()}
                disabled={isDirectSaved}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-lime-500 hover:from-emerald-400 hover:to-lime-400 text-slate-950 font-black text-xs shadow-lg transition-all flex items-center gap-2"
              >
                {isDirectSaved ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Placar Salvo com Sucesso!
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Gravar Placar Oficial e Atualizar Ranking
                  </>
                )}
              </button>
            </div>

          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* MODE 2: LIVE POINT-BY-POINT SCORER (PLACAR ELETRÔNICO AO VIVO) */}
        {/* ------------------------------------------------------------- */}
        {scorerMode === 'point_by_point' && (
          <div className="p-6 space-y-6">
            
            {/* Digital Scoreboard Display */}
            <div className="bg-slate-950 rounded-2xl border-2 border-emerald-500/40 p-4 shadow-xl overflow-hidden">
              
              {/* Status ticker */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs">
                <span className="text-amber-400 font-bold flex items-center gap-1.5 animate-pulse">
                  <Zap className="w-3.5 h-3.5" />
                  {pointInfo.status}
                </span>
                <span className="text-slate-400 font-mono text-[11px]">
                  Set {currentSetIndex + 1} em andamento
                </span>
              </div>

              {/* Player 1 Row */}
              <div className="flex items-center justify-between py-2 border-b border-slate-800/80">
                <div className="flex items-center gap-3">
                  {server === 1 && (
                    <span className="text-lime-400 font-bold text-sm animate-bounce" title="No saque">🎾</span>
                  )}
                  <img src={p1.avatar} alt={p1.name} className="w-9 h-9 rounded-full object-cover border border-emerald-400" />
                  <div>
                    <h4 className="font-extrabold text-sm text-white">
                      {p1.name}
                    </h4>
                    <p className="text-[10px] text-slate-400">{p1.category.split(' ')[0]}</p>
                  </div>
                </div>

                {/* Set Games & Current Point */}
                <div className="flex items-center gap-2 font-mono">
                  {sets.map((s, idx) => (
                    <span 
                      key={idx} 
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm ${
                        idx === currentSetIndex 
                          ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-500/50' 
                          : 'bg-slate-900 text-slate-300'
                      }`}
                    >
                      {s.player1Games}
                    </span>
                  ))}
                  <span className="w-12 h-9 rounded-xl bg-amber-500 text-slate-950 font-black text-base flex items-center justify-center shadow-md">
                    {pointInfo.p1Display}
                  </span>
                </div>
              </div>

              {/* Player 2 Row */}
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  {server === 2 && (
                    <span className="text-lime-400 font-bold text-sm animate-bounce" title="No saque">🎾</span>
                  )}
                  <img src={p2.avatar} alt={p2.name} className="w-9 h-9 rounded-full object-cover border border-emerald-400" />
                  <div>
                    <h4 className="font-extrabold text-sm text-white">
                      {p2.name}
                    </h4>
                    <p className="text-[10px] text-slate-400">{p2.category.split(' ')[0]}</p>
                  </div>
                </div>

                {/* Set Games & Current Point */}
                <div className="flex items-center gap-2 font-mono">
                  {sets.map((s, idx) => (
                    <span 
                      key={idx} 
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm ${
                        idx === currentSetIndex 
                          ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-500/50' 
                          : 'bg-slate-900 text-slate-300'
                      }`}
                    >
                      {s.player2Games}
                    </span>
                  ))}
                  <span className="w-12 h-9 rounded-xl bg-amber-500 text-slate-950 font-black text-base flex items-center justify-center shadow-md">
                    {pointInfo.p2Display}
                  </span>
                </div>
              </div>

            </div>

            {/* Point Action Buttons */}
            {!matchFinished ? (
              <div className="grid grid-cols-2 gap-4">
                
                {/* Player 1 Point Controls */}
                <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                  <p className="text-xs font-bold text-emerald-400 truncate mb-1">
                    Ponto para {p1.name.split(' ')[0]}
                  </p>
                  <button
                    id="btn-p1-point"
                    onClick={() => addPointP1('point')}
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-black text-sm rounded-xl shadow-lg transition-all"
                  >
                    + PONTO ({p1.name.split(' ')[0]})
                  </button>

                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => addPointP1('ace')}
                      className="py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold rounded-lg transition-colors"
                    >
                      ⚡ Ace ({acesP1})
                    </button>
                    <button
                      onClick={() => addPointP1('winner')}
                      className="py-1.5 bg-slate-800 hover:bg-slate-700 text-lime-300 text-xs font-bold rounded-lg transition-colors"
                    >
                      🎯 Winner ({winnersP1})
                    </button>
                  </div>
                </div>

                {/* Player 2 Point Controls */}
                <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                  <p className="text-xs font-bold text-emerald-400 truncate mb-1">
                    Ponto para {p2.name.split(' ')[0]}
                  </p>
                  <button
                    id="btn-p2-point"
                    onClick={() => addPointP2('point')}
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-black text-sm rounded-xl shadow-lg transition-all"
                  >
                    + PONTO ({p2.name.split(' ')[0]})
                  </button>

                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => addPointP2('ace')}
                      className="py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold rounded-lg transition-colors"
                    >
                      ⚡ Ace ({acesP2})
                    </button>
                    <button
                      onClick={() => addPointP2('winner')}
                      className="py-1.5 bg-slate-800 hover:bg-slate-700 text-lime-300 text-xs font-bold rounded-lg transition-colors"
                    >
                      🎯 Winner ({winnersP2})
                    </button>
                  </div>
                </div>

              </div>
            ) : (
              <div className="p-6 bg-gradient-to-r from-amber-500/20 via-emerald-500/20 to-slate-950 rounded-2xl border border-amber-400/50 text-center space-y-3">
                <Trophy className="w-12 h-12 text-amber-400 mx-auto animate-bounce" />
                <h3 className="text-xl font-black text-white">
                  Partida Finalizada!
                </h3>
                <p className="text-sm font-semibold text-emerald-300">
                  Vencedor: {winnerId === p1.id ? p1.name : p2.name} 🏆
                </p>
                <div className="text-xs font-mono text-slate-300">
                  Placar Final: {sets.map(s => `${s.player1Games}/${s.player2Games}`).join(' ')}
                </div>

                <button
                  id="btn-save-live-score"
                  onClick={handleSaveAndFinishLive}
                  className="mt-4 px-6 py-2.5 rounded-xl font-black text-xs bg-gradient-to-r from-emerald-500 to-lime-500 hover:from-emerald-400 hover:to-lime-400 text-slate-950 shadow-lg"
                >
                  Salvar Placar Oficial e Atualizar Ranking
                </button>
              </div>
            )}

            {/* Quick Utility Tools (Switch server, Reset, Switch to Direct Mode) */}
            <div className="flex flex-wrap items-center justify-between text-xs pt-2 border-t border-slate-800 text-slate-400 gap-2">
              <button
                type="button"
                onClick={() => setServer(prev => (prev === 1 ? 2 : 1))}
                className="hover:text-white flex items-center gap-1"
              >
                🔄 Trocar Sacador Manualmente
              </button>

              <button
                type="button"
                onClick={() => setScorerMode('direct_score')}
                className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
              >
                <FileEdit className="w-3.5 h-3.5" />
                Lançar Resultado Direto em Games
              </button>

              <button
                type="button"
                onClick={handleResetLiveMatch}
                className="hover:text-red-400 flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Zerar Placar
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
