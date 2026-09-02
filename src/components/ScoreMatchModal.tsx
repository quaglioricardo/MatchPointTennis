import React, { useState } from 'react';
import { useTennis } from '../context/TennisContext';
import { TournamentMatch, MatchScoreDetails } from '../types';
import { Trophy, X, Check, Award } from 'lucide-react';

interface ScoreMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  match: TournamentMatch | null;
  tournamentId: string;
}

export const ScoreMatchModal: React.FC<ScoreMatchModalProps> = ({
  isOpen,
  onClose,
  match,
  tournamentId
}) => {
  const { players, updateMatchScore, triggerCelebration } = useTennis();

  // Sets state
  const [s1P1, setS1P1] = useState<number>(6);
  const [s1P2, setS1P2] = useState<number>(4);

  const [s2P1, setS2P1] = useState<number>(6);
  const [s2P2, setS2P2] = useState<number>(3);

  const [hasThirdSet, setHasThirdSet] = useState<boolean>(false);
  const [s3P1, setS3P1] = useState<number>(10);
  const [s3P2, setS3P2] = useState<number>(8);

  const [winnerId, setWinnerId] = useState<string>(match?.player1Id || 'p1');

  if (!isOpen || !match) return null;

  const p1 = players.find(p => p.id === match.player1Id);
  const p2 = players.find(p => p.id === match.player2Id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const sets = [
      { player1Games: Number(s1P1), player2Games: Number(s1P2) },
      { player1Games: Number(s2P1), player2Games: Number(s2P2) },
    ];

    if (hasThirdSet) {
      sets.push({ player1Games: Number(s3P1), player2Games: Number(s3P2) });
    }

    const scoreData: MatchScoreDetails = {
      sets,
      winnerId,
      durationMinutes: 80
    };

    updateMatchScore(tournamentId, match.id, scoreData);
    triggerCelebration();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-3xl p-6 shadow-2xl text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-extrabold text-base text-white">
                Registrar Placar Oficial
              </h3>
              <p className="text-xs text-slate-400">
                {match.roundName} • Jogo {match.matchNumber}
              </p>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          
          {/* Players matchup banner */}
          <div className="p-3 bg-slate-800/60 rounded-2xl border border-slate-700 flex items-center justify-around text-xs">
            <div className="flex items-center gap-2">
              {p1 && <img src={p1.avatar} alt={p1.name} className="w-7 h-7 rounded-full object-cover border border-emerald-400" />}
              <span className="font-bold">{p1?.name}</span>
            </div>
            <span className="text-slate-400 font-bold">vs</span>
            <div className="flex items-center gap-2">
              {p2 && <img src={p2.avatar} alt={p2.name} className="w-7 h-7 rounded-full object-cover border border-emerald-400" />}
              <span className="font-bold">{p2?.name}</span>
            </div>
          </div>

          {/* Winner Selection */}
          <div>
            <label className="block text-slate-300 font-bold mb-1.5">Vencedor do Confronto *</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setWinnerId(match.player1Id || 'p1')}
                className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  winnerId === match.player1Id
                    ? 'bg-emerald-600 border-emerald-400 text-white shadow-md'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                {p1?.name.split(' ')[0]} Venceu
              </button>

              <button
                type="button"
                onClick={() => setWinnerId(match.player2Id || 'p2')}
                className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  winnerId === match.player2Id
                    ? 'bg-emerald-600 border-emerald-400 text-white shadow-md'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                {p2?.name.split(' ')[0]} Venceu
              </button>
            </div>
          </div>

          {/* Sets Score inputs */}
          <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
            <p className="font-bold text-slate-300">Games por Set:</p>
            
            {/* Set 1 */}
            <div className="flex items-center justify-between gap-3">
              <span className="font-bold text-slate-400 w-12">1º Set:</span>
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="number"
                  min={0}
                  max={7}
                  value={s1P1}
                  onChange={(e) => setS1P1(Number(e.target.value))}
                  className="w-16 bg-slate-800 border border-slate-700 rounded-lg p-2 text-center text-white font-bold"
                />
                <span className="text-slate-500">/</span>
                <input
                  type="number"
                  min={0}
                  max={7}
                  value={s1P2}
                  onChange={(e) => setS1P2(Number(e.target.value))}
                  className="w-16 bg-slate-800 border border-slate-700 rounded-lg p-2 text-center text-white font-bold"
                />
              </div>
            </div>

            {/* Set 2 */}
            <div className="flex items-center justify-between gap-3">
              <span className="font-bold text-slate-400 w-12">2º Set:</span>
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="number"
                  min={0}
                  max={7}
                  value={s2P1}
                  onChange={(e) => setS2P1(Number(e.target.value))}
                  className="w-16 bg-slate-800 border border-slate-700 rounded-lg p-2 text-center text-white font-bold"
                />
                <span className="text-slate-500">/</span>
                <input
                  type="number"
                  min={0}
                  max={7}
                  value={s2P2}
                  onChange={(e) => setS2P2(Number(e.target.value))}
                  className="w-16 bg-slate-800 border border-slate-700 rounded-lg p-2 text-center text-white font-bold"
                />
              </div>
            </div>

            {/* Toggle 3rd set */}
            <div className="pt-2">
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasThirdSet}
                  onChange={(e) => setHasThirdSet(e.target.checked)}
                  className="rounded border-slate-700 text-emerald-500 focus:ring-0"
                />
                <span>Houve 3º Set / Super Tie-Break?</span>
              </label>

              {hasThirdSet && (
                <div className="flex items-center justify-between gap-3 mt-2">
                  <span className="font-bold text-slate-400 w-12">3º Set:</span>
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="number"
                      min={0}
                      max={20}
                      value={s3P1}
                      onChange={(e) => setS3P1(Number(e.target.value))}
                      className="w-16 bg-slate-800 border border-slate-700 rounded-lg p-2 text-center text-white font-bold"
                    />
                    <span className="text-slate-500">/</span>
                    <input
                      type="number"
                      min={0}
                      max={20}
                      value={s3P2}
                      onChange={(e) => setS3P2(Number(e.target.value))}
                      className="w-16 bg-slate-800 border border-slate-700 rounded-lg p-2 text-center text-white font-bold"
                    />
                  </div>
                </div>
              )}
            </div>

          </div>

          <button
            type="submit"
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-sm transition-all shadow-lg"
          >
            Confirmar Placar e Avançar Chave
          </button>
        </form>

      </div>
    </div>
  );
};
