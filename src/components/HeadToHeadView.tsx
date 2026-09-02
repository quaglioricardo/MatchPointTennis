import React, { useState } from 'react';
import { useTennis } from '../context/TennisContext';
import { Player } from '../types';
import { Swords, Trophy, Flame, Shield, Award, Zap, Activity } from 'lucide-react';

export const HeadToHeadView: React.FC = () => {
  const { players, currentUser, challengePlayer, setSelectedPlayerId } = useTennis();

  const [p1Id, setP1Id] = useState<string>(currentUser.id || 'p1');
  const [p2Id, setP2Id] = useState<string>('p2');

  const p1 = players.find(p => p.id === p1Id) || players[0];
  const p2 = players.find(p => p.id === p2Id) || players[1];

  const p1WinRate = p1.matchesPlayed > 0 ? Math.round((p1.wins / p1.matchesPlayed) * 100) : 0;
  const p2WinRate = p2.matchesPlayed > 0 ? Math.round((p2.wins / p2.matchesPlayed) * 100) : 0;

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-slate-900 p-6 rounded-3xl text-white shadow-xl border border-emerald-900/50">
        <div className="flex items-center gap-2 mb-1">
          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            Análise & Estatísticas
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
          <Swords className="w-7 h-7 text-emerald-400" />
          Confronto Direto (Head-to-Head)
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl mt-1">
          Compare as métricas técnicas, ranking UTR, aproveitamento e retrospecto entre quaisquer tenistas do circuito.
        </p>
      </div>

      {/* Selectors Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Tenista 1
          </label>
          <select
            value={p1Id}
            onChange={(e) => setP1Id(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white font-semibold"
          >
            {players.filter(p => !p.isOrganizer).map(p => (
              <option key={p.id} value={p.id}>{p.name} ({p.category.split(' ')[0]})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Tenista 2
          </label>
          <select
            value={p2Id}
            onChange={(e) => setP2Id(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white font-semibold"
          >
            {players.filter(p => !p.isOrganizer).map(p => (
              <option key={p.id} value={p.id}>{p.name} ({p.category.split(' ')[0]})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Visual Faceoff Cards */}
      <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
        
        {/* Player 1 Card (5 cols) */}
        <div className="md:col-span-5 bg-white dark:bg-slate-900 rounded-3xl border-2 border-emerald-500/50 p-6 shadow-md flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute top-3 left-3 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
            #{p1.rank || 1} no Ranking
          </div>

          <img 
            src={p1.avatar} 
            alt={p1.name} 
            className="w-24 h-24 rounded-full object-cover border-4 border-emerald-400 shadow-md mt-2 mb-3 cursor-pointer"
            onClick={() => setSelectedPlayerId(p1.id)}
          />

          <h3 className="font-black text-lg text-slate-900 dark:text-white">
            {p1.name}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-4">{p1.category}</p>

          <div className="w-full grid grid-cols-3 gap-2 py-3 border-t border-b border-slate-100 dark:border-slate-800 text-xs">
            <div>
              <p className="text-[10px] text-slate-400">Pontos</p>
              <p className="font-black text-emerald-600 dark:text-emerald-400 text-sm">{p1.points}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400">UTR</p>
              <p className="font-black text-sm">{p1.utrRating}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400">Aprov.</p>
              <p className="font-black text-sm">{p1WinRate}%</p>
            </div>
          </div>

          <div className="w-full mt-3 space-y-1.5 text-xs text-left text-slate-600 dark:text-slate-400">
            <div className="flex justify-between">
              <span>Mão dominante:</span>
              <strong className="text-slate-800 dark:text-slate-200">{p1.dominantHand}</strong>
            </div>
            <div className="flex justify-between">
              <span>Backhand:</span>
              <strong className="text-slate-800 dark:text-slate-200">{p1.backhand}</strong>
            </div>
            <div className="flex justify-between">
              <span>Raquete:</span>
              <strong className="text-slate-800 dark:text-slate-200">{p1.racket}</strong>
            </div>
            <div className="flex justify-between">
              <span>Sequência atual:</span>
              <strong className="text-orange-500 font-bold">{p1.streak} vitórias seguidas</strong>
            </div>
          </div>
        </div>

        {/* VS Badge (1 col) */}
        <div className="md:col-span-1 flex flex-col items-center justify-center py-4">
          <div className="w-12 h-12 rounded-full bg-slate-900 border-2 border-emerald-500 text-emerald-400 font-black text-base flex items-center justify-center shadow-lg">
            VS
          </div>
        </div>

        {/* Player 2 Card (5 cols) */}
        <div className="md:col-span-5 bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-300 dark:border-slate-700 p-6 shadow-md flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute top-3 left-3 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
            #{p2.rank || 2} no Ranking
          </div>

          <img 
            src={p2.avatar} 
            alt={p2.name} 
            className="w-24 h-24 rounded-full object-cover border-4 border-slate-300 dark:border-slate-600 shadow-md mt-2 mb-3 cursor-pointer"
            onClick={() => setSelectedPlayerId(p2.id)}
          />

          <h3 className="font-black text-lg text-slate-900 dark:text-white">
            {p2.name}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-4">{p2.category}</p>

          <div className="w-full grid grid-cols-3 gap-2 py-3 border-t border-b border-slate-100 dark:border-slate-800 text-xs">
            <div>
              <p className="text-[10px] text-slate-400">Pontos</p>
              <p className="font-black text-emerald-600 dark:text-emerald-400 text-sm">{p2.points}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400">UTR</p>
              <p className="font-black text-sm">{p2.utrRating}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400">Aprov.</p>
              <p className="font-black text-sm">{p2WinRate}%</p>
            </div>
          </div>

          <div className="w-full mt-3 space-y-1.5 text-xs text-left text-slate-600 dark:text-slate-400">
            <div className="flex justify-between">
              <span>Mão dominante:</span>
              <strong className="text-slate-800 dark:text-slate-200">{p2.dominantHand}</strong>
            </div>
            <div className="flex justify-between">
              <span>Backhand:</span>
              <strong className="text-slate-800 dark:text-slate-200">{p2.backhand}</strong>
            </div>
            <div className="flex justify-between">
              <span>Raquete:</span>
              <strong className="text-slate-800 dark:text-slate-200">{p2.racket}</strong>
            </div>
            <div className="flex justify-between">
              <span>Sequência atual:</span>
              <strong className="text-orange-500 font-bold">{p2.streak} vitórias seguidas</strong>
            </div>
          </div>
        </div>

      </div>

      {/* Comparison Metrics Bars */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-600" />
          Comparativo Direto de Desempenho
        </h3>

        {/* Metric: UTR Rating */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-emerald-600">{p1.name.split(' ')[0]}: {p1.utrRating}</span>
            <span className="text-slate-400">UTR Rating Oficial</span>
            <span className="text-blue-600">{p2.name.split(' ')[0]}: {p2.utrRating}</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden flex">
            <div 
              className="bg-emerald-500 h-full" 
              style={{ width: `${(p1.utrRating / (p1.utrRating + p2.utrRating)) * 100}%` }} 
            />
            <div 
              className="bg-blue-500 h-full" 
              style={{ width: `${(p2.utrRating / (p1.utrRating + p2.utrRating)) * 100}%` }} 
            />
          </div>
        </div>

        {/* Metric: Win Rate % */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-emerald-600">{p1.name.split(' ')[0]}: {p1WinRate}%</span>
            <span className="text-slate-400">Aproveitamento de Vitórias (%)</span>
            <span className="text-blue-600">{p2.name.split(' ')[0]}: {p2WinRate}%</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden flex">
            <div 
              className="bg-emerald-500 h-full" 
              style={{ width: `${(p1WinRate / (p1WinRate + p2WinRate || 1)) * 100}%` }} 
            />
            <div 
              className="bg-blue-500 h-full" 
              style={{ width: `${(p2WinRate / (p1WinRate + p2WinRate || 1)) * 100}%` }} 
            />
          </div>
        </div>

        {/* Metric: Ranking Points */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-emerald-600">{p1.name.split(' ')[0]}: {p1.points} pts</span>
            <span className="text-slate-400">Pontuação Geral do Circuito</span>
            <span className="text-blue-600">{p2.name.split(' ')[0]}: {p2.points} pts</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden flex">
            <div 
              className="bg-emerald-500 h-full" 
              style={{ width: `${(p1.points / (p1.points + p2.points || 1)) * 100}%` }} 
            />
            <div 
              className="bg-blue-500 h-full" 
              style={{ width: `${(p2.points / (p1.points + p2.points || 1)) * 100}%` }} 
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 text-center">
          <button
            onClick={() => challengePlayer(p2.id)}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all inline-flex items-center gap-2"
          >
            <Swords className="w-4 h-4" />
            Marcar Duelo entre {p1.name.split(' ')[0]} e {p2.name.split(' ')[0]}
          </button>
        </div>
      </div>

    </div>
  );
};
