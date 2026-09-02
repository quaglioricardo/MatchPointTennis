import React from 'react';
import { useTennis } from '../context/TennisContext';
import { Player } from '../types';
import { 
  X, 
  Trophy, 
  Award, 
  Flame, 
  Swords, 
  MessageSquare, 
  Mail, 
  Phone, 
  MapPin, 
  Activity,
  ShieldCheck,
  CheckCircle2,
  Edit
} from 'lucide-react';

interface PlayerProfileModalProps {
  onEditPlayer?: (player: Player) => void;
}

export const PlayerProfileModal: React.FC<PlayerProfileModalProps> = ({ onEditPlayer }) => {
  const { 
    selectedPlayerId, 
    setSelectedPlayerId, 
    players, 
    currentUser, 
    challengePlayer, 
    openDirectChatWithPlayer,
    setActiveTab
  } = useTennis();

  if (!selectedPlayerId) return null;

  const player = players.find(p => p.id === selectedPlayerId);
  if (!player) return null;

  const isCurrentUser = player.id === currentUser.id;
  const winRate = player.matchesPlayed > 0 ? Math.round((player.wins / player.matchesPlayed) * 100) : 0;

  const handleMessage = () => {
    openDirectChatWithPlayer(player.id);
    setSelectedPlayerId(null);
    setActiveTab('comunidade');
  };

  const handleChallenge = () => {
    challengePlayer(player.id);
    setSelectedPlayerId(null);
  };

  const handleEdit = () => {
    setSelectedPlayerId(null);
    if (onEditPlayer) {
      onEditPlayer(player);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl text-white my-6">
        
        {/* Banner Header */}
        <div className="relative h-28 bg-gradient-to-r from-emerald-800 via-slate-900 to-slate-950 p-4">
          <button
            onClick={() => setSelectedPlayerId(null)}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-900/80 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Details */}
        <div className="px-6 pb-6 pt-0 relative">
          
          {/* Avatar floating */}
          <div className="-mt-14 mb-3 flex items-end justify-between">
            <div className="relative">
              <img 
                src={player.avatar} 
                alt={player.name} 
                className="w-24 h-24 rounded-full object-cover border-4 border-slate-900 shadow-xl"
              />
              {player.isOrganizer && (
                <div className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 p-1 rounded-full shadow" title="Diretor Técnico">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {onEditPlayer && (
                <button
                  onClick={handleEdit}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1 border border-slate-700 transition-colors"
                  title="Editar cadastro do jogador"
                >
                  <Edit className="w-3.5 h-3.5 text-emerald-400" />
                  Editar
                </button>
              )}

              {!isCurrentUser ? (
                <>
                  <button
                    onClick={handleMessage}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                    Mensagem
                  </button>
                  <button
                    onClick={handleChallenge}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors"
                  >
                    <Swords className="w-3.5 h-3.5" />
                    Desafiar
                  </button>
                </>
              ) : null}
            </div>
          </div>

          {/* Name & Bio */}
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-black text-white">{player.name}</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {player.category}
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-500" />
              {player.club} • {player.location}
            </p>
          </div>

          {/* Key Stat Cards */}
          <div className="grid grid-cols-4 gap-2 my-4 text-center">
            <div className="bg-slate-800/80 p-2.5 rounded-2xl border border-slate-700">
              <p className="text-[10px] text-slate-400">Ranking</p>
              <p className="font-black text-amber-400 text-sm">#{player.rank || 1}</p>
            </div>
            <div className="bg-slate-800/80 p-2.5 rounded-2xl border border-slate-700">
              <p className="text-[10px] text-slate-400">Pontos</p>
              <p className="font-black text-emerald-400 text-sm">{player.points}</p>
            </div>
            <div className="bg-slate-800/80 p-2.5 rounded-2xl border border-slate-700">
              <p className="text-[10px] text-slate-400">UTR</p>
              <p className="font-black text-sm">{player.utrRating}</p>
            </div>
            <div className="bg-slate-800/80 p-2.5 rounded-2xl border border-slate-700">
              <p className="text-[10px] text-slate-400">Vitórias</p>
              <p className="font-black text-lime-400 text-sm">{player.wins}V - {player.losses}D</p>
            </div>
          </div>

          {/* Technical Specs */}
          <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800 text-xs">
            <h4 className="font-bold text-slate-300 flex items-center gap-1.5 text-xs mb-2">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              Características Técnicas
            </h4>
            <div className="grid grid-cols-2 gap-2 text-slate-300">
              <div>
                <span className="text-slate-500">Mão Dominante:</span>{' '}
                <strong className="text-white">{player.dominantHand}</strong>
              </div>
              <div>
                <span className="text-slate-500">Backhand:</span>{' '}
                <strong className="text-white">{player.backhand}</strong>
              </div>
              <div className="col-span-2">
                <span className="text-slate-500">Raquete de Escolha:</span>{' '}
                <strong className="text-white">{player.racket}</strong>
              </div>
              <div>
                <span className="text-slate-500">Aproveitamento:</span>{' '}
                <strong className="text-emerald-400">{winRate}%</strong>
              </div>
              <div>
                <span className="text-slate-500">Sequência:</span>{' '}
                <strong className="text-orange-400 font-bold">{player.streak}V</strong>
              </div>
            </div>
          </div>

          {/* Contact details */}
          <div className="mt-3 pt-3 border-t border-slate-800 text-xs text-slate-400 space-y-1">
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-slate-500" />
              <span>{player.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-slate-500" />
              <span>{player.email}</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
