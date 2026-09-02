import React, { useState } from 'react';
import { useTennis } from '../context/TennisContext';
import { Player, PlayerCategory } from '../types';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Swords, 
  MessageSquare, 
  MapPin, 
  ShieldCheck, 
  Trophy, 
  Award, 
  Flame, 
  Sparkles,
  Phone,
  Mail,
  CheckCircle,
  LayoutGrid,
  List,
  RefreshCw,
  Database
} from 'lucide-react';

interface PlayersDirectoryViewProps {
  onOpenRegisterModal: (playerToEdit?: Player) => void;
}

export const PlayersDirectoryView: React.FC<PlayersDirectoryViewProps> = ({
  onOpenRegisterModal
}) => {
  const { 
    players, 
    currentUser, 
    setCurrentUser, 
    deletePlayer, 
    clearAllPlayersFromDatabase,
    fetchDataFromMySQL,
    challengePlayer, 
    openDirectChatWithPlayer, 
    setSelectedPlayerId,
    setActiveTab,
    isDbConnected
  } = useTennis();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [roleFilter, setRoleFilter] = useState<'all' | 'players' | 'organizers'>('all');
  const [isSyncing, setIsSyncing] = useState(false);

  const categories: { label: string; value: string }[] = [
    { label: 'Todas as Classes', value: 'all' },
    { label: '1ª Classe (Pro)', value: '1ª Classe (Pro/Avançado)' },
    { label: '2ª Classe', value: '2ª Classe (Intermediário Alto)' },
    { label: '3ª Classe', value: '3ª Classe (Intermediário)' },
    { label: '4ª Classe', value: '4ª Classe (Iniciante Avançado)' },
    { label: '5ª Classe', value: '5ª Classe (Principiante)' },
    { label: 'Feminino A', value: 'Feminino A' },
    { label: 'Feminino B', value: 'Feminino B' },
    { label: 'Master +45', value: 'Master +45' },
    { label: 'Duplas Open', value: 'Duplas Open' },
  ];

  const filteredPlayers = players.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.club.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.racket.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchRole = roleFilter === 'all' || (roleFilter === 'organizers' ? p.isOrganizer : !p.isOrganizer);
    return matchSearch && matchCategory && matchRole;
  });

  const handleDelete = (player: Player) => {
    if (confirm(`Tem certeza que deseja remover "${player.name}" da tabela players do banco MySQL rica2888_tenisconde?`)) {
      deletePlayer(player.id);
    }
  };

  const handleClearAll = async () => {
    if (confirm('Atenção: Deseja apagar todos os registros da tabela "players" no banco de dados MySQL rica2888_tenisconde?')) {
      await clearAllPlayersFromDatabase();
      alert('Tabela players limpa com sucesso!');
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    await fetchDataFromMySQL();
    setTimeout(() => setIsSyncing(false), 500);
  };

  const handleMessage = (playerId: string) => {
    openDirectChatWithPlayer(playerId);
    setActiveTab('comunidade');
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 p-6 rounded-3xl text-white shadow-xl border border-emerald-900/50">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Diretório & Gestão de Membros
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Cadastro de Tenistas & Atletas
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl mt-1">
            Gerencie o cadastro de todos os tenistas do clube, cadastre novos participantes para torneios e rankings e edite perfis técnicos.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="px-3.5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs shadow transition-all flex items-center gap-1.5"
            title="Recarregar e sincronizar dados da tabela players do MySQL rica2888_tenisconde"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isSyncing ? 'animate-spin' : ''}`} />
            Sincronizar MySQL
          </button>

          {players.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-3 py-2.5 rounded-2xl bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/50 font-semibold text-xs transition-all flex items-center gap-1.5"
              title="Apagar todos os registros da tabela players do MySQL"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Limpar Tabela
            </button>
          )}

          <button
            id="btn-register-new-player"
            onClick={() => onOpenRegisterModal()}
            className="px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg transition-all flex items-center gap-2 shrink-0 hover:scale-105"
          >
            <UserPlus className="w-4 h-4" />
            Cadastrar Novo Tenista
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Buscar por nome, clube, raquete ou cidade..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 pl-10 pr-4 py-2 text-xs rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Role Filter & View Toggle */}
          <div className="flex items-center gap-2">
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
              <button
                onClick={() => setRoleFilter('all')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  roleFilter === 'all'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Todos ({players.length})
              </button>
              <button
                onClick={() => setRoleFilter('players')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  roleFilter === 'players'
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Atletas ({players.filter(p => !p.isOrganizer).length})
              </button>
              <button
                onClick={() => setRoleFilter('organizers')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  roleFilter === 'organizers'
                    ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Gestores ({players.filter(p => p.isOrganizer).length})
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-xl transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-slate-400 hover:text-slate-700 dark:hover:text-white'
                }`}
                title="Visualização em Grade"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-xl transition-all ${
                  viewMode === 'table'
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-slate-400 hover:text-slate-700 dark:hover:text-white'
                }`}
                title="Visualização em Lista / Tabela"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((c) => (
            <button
              key={c.value}
              onClick={() => setSelectedCategory(c.value)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === c.value
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPlayers.map((player) => {
            const isCurrentUser = player.id === currentUser.id;
            const winRate = player.matchesPlayed > 0 ? Math.round((player.wins / player.matchesPlayed) * 100) : 0;

            return (
              <div
                key={player.id}
                className={`bg-white dark:bg-slate-900 rounded-3xl p-5 border transition-all relative flex flex-col justify-between shadow-sm hover:shadow-md ${
                  isCurrentUser
                    ? 'border-emerald-500/80 ring-1 ring-emerald-500/30'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                {/* Header of Card */}
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img 
                          src={player.avatar} 
                          alt={player.name} 
                          className="w-14 h-14 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700 cursor-pointer hover:scale-105 transition-transform"
                          onClick={() => setSelectedPlayerId(player.id)}
                        />
                        {player.isOrganizer && (
                          <div className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 p-0.5 rounded-full shadow" title="Gestor">
                            <ShieldCheck className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 
                            className="font-extrabold text-sm text-slate-900 dark:text-white hover:text-emerald-500 cursor-pointer transition-colors"
                            onClick={() => setSelectedPlayerId(player.id)}
                          >
                            {player.name}
                          </h3>
                        </div>
                        {isCurrentUser && (
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                            <CheckCircle className="w-3 h-3" /> Logado como Você
                          </span>
                        )}
                        <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 mt-0.5">
                          {player.category}
                        </span>
                      </div>
                    </div>

                    {/* Quick Edit/Delete buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onOpenRegisterModal(player)}
                        className="p-1.5 text-slate-400 hover:text-emerald-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Editar cadastro do tenista"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(player)}
                        className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Remover cadastro"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Club & Location */}
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-3 truncate">
                    <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    {player.club} • {player.location}
                  </p>

                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-1.5 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-2xl text-center text-xs mb-3 border border-slate-100 dark:border-slate-800">
                    <div>
                      <p className="text-[10px] text-slate-400">Pontos</p>
                      <p className="font-extrabold text-emerald-600 dark:text-emerald-400">{player.points}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400">UTR</p>
                      <p className="font-bold text-slate-800 dark:text-slate-200">{player.utrRating}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400">V / D</p>
                      <p className="font-bold text-slate-800 dark:text-slate-200">{player.wins}/{player.losses}</p>
                    </div>
                  </div>

                  {/* Technical Specs */}
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-1 mb-4">
                    <div className="flex justify-between">
                      <span>Estilo:</span>
                      <strong className="text-slate-700 dark:text-slate-300">{player.dominantHand} ({player.backhand})</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Raquete:</span>
                      <strong className="text-slate-700 dark:text-slate-300 truncate max-w-[170px]">{player.racket}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Aproveitamento:</span>
                      <strong className="text-emerald-600 dark:text-emerald-400">{winRate}%</strong>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5">
                  {!isCurrentUser ? (
                    <>
                      <button
                        onClick={() => setCurrentUser(player)}
                        className="flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                        title="Alternar login para atuar como este tenista"
                      >
                        Atuar como
                      </button>
                      <button
                        onClick={() => handleMessage(player.id)}
                        className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                        title="Enviar mensagem direta"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => challengePlayer(player.id)}
                        className="py-1.5 px-3 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1 shadow-sm transition-colors"
                        title="Desafiar tenista"
                      >
                        <Swords className="w-3.5 h-3.5" />
                        Desafiar
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => onOpenRegisterModal(player)}
                      className="w-full py-1.5 rounded-xl text-xs font-bold bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5" /> Editar Meu Cadastro
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Tenista</th>
                  <th className="py-3 px-4">Categoria / Classe</th>
                  <th className="py-3 px-4">Clube & Cidade</th>
                  <th className="py-3 px-4 text-center">Pontos</th>
                  <th className="py-3 px-4 text-center">UTR</th>
                  <th className="py-3 px-4 text-center">V / D</th>
                  <th className="py-3 px-4 text-center">Mão / Golpe</th>
                  <th className="py-3 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredPlayers.map((player) => {
                  const isCurrentUser = player.id === currentUser.id;

                  return (
                    <tr 
                      key={player.id}
                      className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors ${
                        isCurrentUser ? 'bg-emerald-50/60 dark:bg-emerald-950/30 font-semibold' : ''
                      }`}
                    >
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
                            <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                              {player.name}
                              {player.isOrganizer && (
                                <span className="text-[9px] bg-amber-500/20 text-amber-400 font-bold px-1 rounded">GESTOR</span>
                              )}
                              {isCurrentUser && <span className="text-[10px] text-emerald-600 font-bold">(Você)</span>}
                            </p>
                            <p className="text-[11px] text-slate-400">{player.phone}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                        {player.category}
                      </td>

                      <td className="py-3 px-4 text-slate-500 dark:text-slate-400">
                        {player.club} ({player.location})
                      </td>

                      <td className="py-3 px-4 text-center font-bold text-emerald-700 dark:text-emerald-400">
                        {player.points}
                      </td>

                      <td className="py-3 px-4 text-center font-mono font-semibold">
                        {player.utrRating}
                      </td>

                      <td className="py-3 px-4 text-center font-mono">
                        {player.wins}V - {player.losses}D
                      </td>

                      <td className="py-3 px-4 text-center text-slate-500">
                        {player.dominantHand} / {player.backhand}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onOpenRegisterModal(player)}
                            className="p-1.5 text-slate-400 hover:text-emerald-500 rounded-lg"
                            title="Editar cadastro"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          {!isCurrentUser ? (
                            <>
                              <button
                                onClick={() => setCurrentUser(player)}
                                className="px-2 py-1 rounded-lg text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                              >
                                Logar
                              </button>
                              <button
                                onClick={() => challengePlayer(player.id)}
                                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1 shadow-sm"
                              >
                                <Swords className="w-3 h-3" /> Desafiar
                              </button>
                            </>
                          ) : (
                            <span className="text-[11px] text-emerald-500 font-bold px-2">Ativo</span>
                          )}
                          <button
                            onClick={() => handleDelete(player)}
                            className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg"
                            title="Excluir cadastro"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredPlayers.length === 0 && (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4 text-emerald-400">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
            {players.length === 0 ? 'Nenhum jogador cadastrado no banco' : 'Nenhum tenista encontrado com os filtros'}
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 mb-6 leading-relaxed">
            {players.length === 0 
              ? 'A tabela `players` do banco MySQL rica2888_tenisconde está vazia e pronta para receber os novos tenistas e atletas do clube.'
              : 'Nenhum atleta corresponde aos filtros de busca e categoria selecionados.'}
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => onOpenRegisterModal()}
              className="px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg transition-all flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Cadastrar Primeiro Tenista
            </button>
            <button
              onClick={handleSync}
              disabled={isSyncing}
              className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isSyncing ? 'animate-spin' : ''}`} />
              Sincronizar com MySQL
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
