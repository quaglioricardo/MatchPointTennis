import React, { useState } from 'react';
import { useTennis } from '../context/TennisContext';
import { Player, PlayerCategory } from '../types';
import { 
  Award, 
  Trophy, 
  Flame, 
  Swords, 
  User, 
  Search, 
  TrendingUp, 
  Zap, 
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  UserPlus
} from 'lucide-react';

interface RankingsViewProps {
  onOpenH2H: (player1Id: string, player2Id: string) => void;
  onOpenRegisterModal?: () => void;
}

export const RankingsView: React.FC<RankingsViewProps> = ({ 
  onOpenH2H,
  onOpenRegisterModal 
}) => {
  const { 
    players, 
    currentUser, 
    challengePlayer, 
    setSelectedPlayerId 
  } = useTennis();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showLadderRules, setShowLadderRules] = useState<boolean>(false);

  // Filter and sort players by points desc
  const filteredPlayers = players
    .filter(p => !p.isOrganizer)
    .filter(p => {
      const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.club.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    })
    .sort((a, b) => b.points - a.points);

  const categories: { label: string; value: string }[] = [
    { label: 'Geral (Todos)', value: 'all' },
    { label: '1ª Classe (Pro)', value: '1ª Classe (Pro/Avançado)' },
    { label: '2ª Classe', value: '2ª Classe (Intermediário Alto)' },
    { label: '3ª Classe', value: '3ª Classe (Intermediário)' },
    { label: 'Feminino A', value: 'Feminino A' },
    { label: 'Master +45', value: 'Master +45' },
  ];

  // Top 3 Podium
  const top1 = filteredPlayers[0];
  const top2 = filteredPlayers[1];
  const top3 = filteredPlayers[2];

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-emerald-900 via-slate-900 to-slate-900 p-6 rounded-3xl text-white shadow-xl border border-emerald-900/50">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Circuito & Barragem
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Rankings Oficiais & Barragem
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl mt-1">
            Acompanhe a pontuação atualizada, aproveitamento e desafie jogadores para partidas de barragem para subir de posição.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onOpenRegisterModal && (
            <button
              onClick={onOpenRegisterModal}
              className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-md"
            >
              <UserPlus className="w-4 h-4" />
              + Cadastrar Tenista
            </button>
          )}

          <button
            onClick={() => setShowLadderRules(!showLadderRules)}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-emerald-400" />
            Como funciona a Barragem?
          </button>
        </div>
      </div>

      {/* Ladder Rules Explanation Banner (collapsible) */}
      {showLadderRules && (
        <div className="p-5 bg-gradient-to-r from-emerald-950/50 to-slate-900 rounded-2xl border border-emerald-500/30 text-xs text-slate-300 space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm text-emerald-300">
            <Zap className="w-4 h-4 text-amber-400" />
            Regulamento do Sistema de Barragem (Ladder):
          </div>
          <p className="leading-relaxed">
            • <strong>Desafio:</strong> Qualquer tenista pode desafiar atletas que estejam até <strong>3 posições acima</strong> no ranking da mesma categoria.
          </p>
          <p className="leading-relaxed">
            • <strong>Vitória do Desafiante:</strong> O desafiante assume a posição do defensor no ranking, e todos os jogadores entre eles descem 1 posição!
          </p>
          <p className="leading-relaxed">
            • <strong>Pontuação:</strong> Vitórias em barragem concedem +100 pontos no ranking geral e atualizam seu UTR.
          </p>
        </div>
      )}

      {/* Category Pills & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        
        {/* Category selector pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.value
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search player input */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por nome ou clube..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 pl-9 pr-3 py-1.5 text-xs rounded-xl focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white"
          />
        </div>

      </div>

      {/* Top 3 Podium Showcase (if at least 2 players exist) */}
      {filteredPlayers.length >= 2 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          
          {/* #2 Silver */}
          {top2 && (
            <div className="order-2 md:order-1 bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
              <div className="absolute top-3 left-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-black px-2.5 py-1 rounded-full flex items-center gap-1">
                🥈 2º Lugar
              </div>

              <img 
                src={top2.avatar} 
                alt={top2.name} 
                className="w-20 h-20 rounded-full object-cover border-4 border-slate-300 dark:border-slate-600 shadow mt-4 mb-2 cursor-pointer hover:scale-105 transition-transform"
                onClick={() => setSelectedPlayerId(top2.id)}
              />
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                {top2.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{top2.category}</p>

              <div className="mt-3 py-2 px-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-800 w-full flex items-center justify-around text-xs">
                <div>
                  <p className="text-[10px] text-slate-400">Pontos</p>
                  <p className="font-bold text-emerald-600 dark:text-emerald-400">{top2.points}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400">UTR</p>
                  <p className="font-bold">{top2.utrRating}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400">V/D</p>
                  <p className="font-bold">{top2.wins}/{top2.losses}</p>
                </div>
              </div>

              {currentUser.id !== top2.id && (
                <button
                  onClick={() => challengePlayer(top2.id)}
                  className="mt-3 w-full py-1.5 rounded-xl text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center gap-1 transition-colors"
                >
                  <Swords className="w-3.5 h-3.5" /> Desafiar Barragem
                </button>
              )}
            </div>
          )}

          {/* #1 Gold - Champion in Center */}
          {top1 && (
            <div className="order-1 md:order-2 bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-white dark:to-slate-900 rounded-3xl p-6 border-2 border-amber-400 dark:border-amber-500/60 shadow-md flex flex-col items-center text-center relative overflow-hidden md:-mt-2">
              <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 text-xs font-black px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                👑 1º Lugar • Líder Geral
              </div>

              <div className="relative mt-4 mb-2">
                <img 
                  src={top1.avatar} 
                  alt={top1.name} 
                  className="w-24 h-24 rounded-full object-cover border-4 border-amber-400 shadow-lg cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => setSelectedPlayerId(top1.id)}
                />
                <div className="w-7 h-7 bg-amber-400 text-slate-950 rounded-full flex items-center justify-center absolute -bottom-1 -right-1 font-black text-sm shadow">
                  <Trophy className="w-4 h-4" />
                </div>
              </div>

              <h3 className="font-black text-lg text-slate-900 dark:text-white">
                {top1.name}
              </h3>
              <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">{top1.category}</p>

              <div className="mt-3 py-2 px-4 rounded-xl bg-white dark:bg-slate-800 border border-amber-200 dark:border-slate-700 w-full flex items-center justify-around text-xs shadow-sm">
                <div>
                  <p className="text-[10px] text-slate-400">Pontos</p>
                  <p className="font-extrabold text-amber-600 dark:text-amber-400 text-sm">{top1.points}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400">UTR</p>
                  <p className="font-bold">{top1.utrRating}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400">V/D</p>
                  <p className="font-bold">{top1.wins}/{top1.losses}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400">Sequência</p>
                  <p className="font-bold text-orange-500 flex items-center gap-0.5">
                    <Flame className="w-3.5 h-3.5" /> {top1.streak}V
                  </p>
                </div>
              </div>

              {currentUser.id !== top1.id && (
                <button
                  onClick={() => challengePlayer(top1.id)}
                  className="mt-3 w-full py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md flex items-center justify-center gap-1.5 transition-all"
                >
                  <Swords className="w-3.5 h-3.5" /> Desafiar Líder da Tabela
                </button>
              )}
            </div>
          )}

          {/* #3 Bronze */}
          {top3 && (
            <div className="order-3 bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
              <div className="absolute top-3 left-3 bg-amber-700/20 text-amber-800 dark:text-amber-400 text-xs font-black px-2.5 py-1 rounded-full flex items-center gap-1">
                🥉 3º Lugar
              </div>

              <img 
                src={top3.avatar} 
                alt={top3.name} 
                className="w-20 h-20 rounded-full object-cover border-4 border-amber-700/40 shadow mt-4 mb-2 cursor-pointer hover:scale-105 transition-transform"
                onClick={() => setSelectedPlayerId(top3.id)}
              />
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                {top3.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{top3.category}</p>

              <div className="mt-3 py-2 px-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-800 w-full flex items-center justify-around text-xs">
                <div>
                  <p className="text-[10px] text-slate-400">Pontos</p>
                  <p className="font-bold text-emerald-600 dark:text-emerald-400">{top3.points}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400">UTR</p>
                  <p className="font-bold">{top3.utrRating}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400">V/D</p>
                  <p className="font-bold">{top3.wins}/{top3.losses}</p>
                </div>
              </div>

              {currentUser.id !== top3.id && (
                <button
                  onClick={() => challengePlayer(top3.id)}
                  className="mt-3 w-full py-1.5 rounded-xl text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center gap-1 transition-colors"
                >
                  <Swords className="w-3.5 h-3.5" /> Desafiar Barragem
                </button>
              )}
            </div>
          )}

        </div>
      )}

      {/* Complete Leaderboard Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Tabela de Classificação Geral
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            {filteredPlayers.length} atletas listados
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4 w-12 text-center">Pos.</th>
                <th className="py-3 px-4">Tenista</th>
                <th className="py-3 px-4 hidden sm:table-cell">Categoria</th>
                <th className="py-3 px-4 text-center">Pontos</th>
                <th className="py-3 px-4 text-center">UTR</th>
                <th className="py-3 px-4 text-center hidden md:table-cell">V / D</th>
                <th className="py-3 px-4 text-center hidden lg:table-cell">Aprov. (%)</th>
                <th className="py-3 px-4 text-center">Sequência</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredPlayers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <Trophy className="w-10 h-10 mx-auto mb-2 text-slate-300 dark:text-slate-600 opacity-60" />
                    <p className="font-bold text-sm text-slate-700 dark:text-slate-300">Nenhum atleta registrado nesta categoria</p>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                      Os atletas cadastrados no banco MySQL rica2888_tenisconde aparecerão aqui automaticamente organizados pelo ranking.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredPlayers.map((player, index) => {
                const isCurrentUser = player.id === currentUser.id;
                const winRate = player.matchesPlayed > 0 ? Math.round((player.wins / player.matchesPlayed) * 100) : 0;
                const canChallenge = !isCurrentUser && Math.abs(index + 1 - (currentUser.rank || 5)) <= 3;

                return (
                  <tr 
                    key={player.id}
                    className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors ${
                      isCurrentUser ? 'bg-emerald-50/60 dark:bg-emerald-950/30 font-semibold' : ''
                    }`}
                  >
                    <td className="py-3 px-4 text-center font-bold">
                      {index === 0 ? '🥇 1' : index === 1 ? '🥈 2' : index === 2 ? '🥉 3' : `#${index + 1}`}
                    </td>

                    <td className="py-3 px-4">
                      <div 
                        className="flex items-center gap-3 cursor-pointer"
                        onClick={() => setSelectedPlayerId(player.id)}
                      >
                        <img 
                          src={player.avatar} 
                          alt={player.name} 
                          className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700" 
                        />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white hover:text-emerald-600 transition-colors">
                            {player.name} {isCurrentUser && <span className="text-[10px] text-emerald-600 font-bold">(Você)</span>}
                          </p>
                          <p className="text-[11px] text-slate-400 hidden sm:block">
                            {player.club} • {player.racket}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 hidden sm:table-cell text-slate-600 dark:text-slate-300">
                      {player.category.split(' ')[0]}
                    </td>

                    <td className="py-3 px-4 text-center font-bold text-emerald-700 dark:text-emerald-400">
                      {player.points}
                    </td>

                    <td className="py-3 px-4 text-center font-mono font-semibold">
                      {player.utrRating}
                    </td>

                    <td className="py-3 px-4 text-center hidden md:table-cell text-slate-600 dark:text-slate-300 font-mono">
                      {player.wins}V - {player.losses}D
                    </td>

                    <td className="py-3 px-4 text-center hidden lg:table-cell font-semibold">
                      <span className={`px-2 py-0.5 rounded-full ${
                        winRate >= 70 ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}>
                        {winRate}%
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      {player.streak > 0 ? (
                        <span className="text-orange-500 font-bold flex items-center justify-center gap-0.5">
                          <Flame className="w-3.5 h-3.5" /> {player.streak}V
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">
                          {Math.abs(player.streak)}D
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {!isCurrentUser && (
                          <>
                            <button
                              id={`btn-challenge-${player.id}`}
                              onClick={() => challengePlayer(player.id)}
                              className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center gap-1 shadow-sm"
                              title="Desafiar tenista para partida de barragem"
                            >
                              <Swords className="w-3 h-3" /> Desafiar
                            </button>
                            <button
                              onClick={() => onOpenH2H(currentUser.id, player.id)}
                              className="px-2 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                              title="Comparar histórico de confrontos (H2H)"
                            >
                              H2H
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => setSelectedPlayerId(player.id)}
                          className="px-2 py-1 rounded-lg text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white"
                          title="Ver perfil completo"
                        >
                          Perfil
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              }))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
