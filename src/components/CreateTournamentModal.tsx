import React, { useState } from 'react';
import { useTennis } from '../context/TennisContext';
import { PlayerCategory, CourtSurface } from '../types';
import { Trophy, X, Calendar, MapPin, DollarSign, Users, Layers, ShieldCheck } from 'lucide-react';

interface CreateTournamentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateTournamentModal: React.FC<CreateTournamentModalProps> = ({ isOpen, onClose }) => {
  const { createTournament, triggerCelebration } = useTennis();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<PlayerCategory>('1ª Classe (Pro/Avançado)');
  const [surface, setSurface] = useState<CourtSurface>('Saibro (Clay)');
  const [clubName, setClubName] = useState('MatchPoint Tennis Club - São Paulo');
  const [address, setAddress] = useState('Av. das Nações Unidas, 14261 - Morumbi, SP');
  const [startDate, setStartDate] = useState('2026-09-12');
  const [endDate, setEndDate] = useState('2026-09-14');
  const [entryFee, setEntryFee] = useState<number>(120);
  const [prizeDescription, setPrizeDescription] = useState('Troféu Oficial + R$ 2.500 em premiação e Raqueteira');
  const [maxParticipants, setMaxParticipants] = useState<number>(8);
  const [format, setFormat] = useState<'eliminatoria_simples' | 'grupos_eliminatoria'>('eliminatoria_simples');
  const [rules, setRules] = useState('Melhor de 3 sets com Super Tie-break no 3º set (10 pontos). Bola oficial: Wilson Roland Garros.');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    createTournament({
      title: title.trim(),
      category,
      surface,
      clubName,
      address,
      startDate,
      endDate,
      entryFee: Number(entryFee) || 0,
      prizeDescription,
      maxParticipants: Number(maxParticipants) || 8,
      rules,
      format
    });

    triggerCelebration();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-xl rounded-3xl p-6 shadow-2xl text-white my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-lime-500 flex items-center justify-center text-slate-950 font-black shadow-md">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">
                Criar Novo Torneio de Tênis
              </h3>
              <p className="text-xs text-slate-400">
                Configure regulamento, categorias e chaves eliminatórias
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center hover:bg-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-bold mb-1">Título do Torneio *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: 1º Aberto de Primavera de Saibro 2026"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Classe / Categoria *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as PlayerCategory)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="1ª Classe (Pro/Avançado)">1ª Classe (Pro/Avançado)</option>
                <option value="2ª Classe (Intermediário Alto)">2ª Classe (Intermediário Alto)</option>
                <option value="3ª Classe (Intermediário)">3ª Classe (Intermediário)</option>
                <option value="4ª Classe (Iniciante Avançado)">4ª Classe (Iniciante Avançado)</option>
                <option value="5ª Classe (Principiante)">5ª Classe (Principiante)</option>
                <option value="Feminino A">Feminino A</option>
                <option value="Feminino B">Feminino B</option>
                <option value="Master +45">Master +45</option>
                <option value="Duplas Open">Duplas Open</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Piso / Superfície *</label>
              <select
                value={surface}
                onChange={(e) => setSurface(e.target.value as CourtSurface)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Saibro (Clay)">Saibro (Clay)</option>
                <option value="Rápida (Hard)">Rápida (Hard)</option>
                <option value="Coberta (Indoor)">Coberta (Indoor)</option>
                <option value="Grama (Grass)">Grama (Grass)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Data de Início *</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Data de Término *</label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Taxa de Inscrição (R$)</label>
              <input
                type="number"
                value={entryFee}
                onChange={(e) => setEntryFee(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Vagas (Atletas)</label>
              <select
                value={maxParticipants}
                onChange={(e) => setMaxParticipants(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value={4}>4 Tenistas (Semifinais)</option>
                <option value={8}>8 Tenistas (Quartas)</option>
                <option value={16}>16 Tenistas (Oitavas)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Formato</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as any)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="eliminatoria_simples">Eliminatória Simples</option>
                <option value="grupos_eliminatoria">Fase de Grupos + Finais</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Premiação Oficial</label>
            <input
              type="text"
              value={prizeDescription}
              onChange={(e) => setPrizeDescription(e.target.value)}
              placeholder="Ex: Troféus + R$ 2.000 + Brindes de Patrocinadores"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Regulamento e Observações</label>
            <textarea
              rows={2}
              value={rules}
              onChange={(e) => setRules(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white resize-none focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="pt-2">
            <button
              id="btn-submit-tournament"
              type="submit"
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-sm transition-all shadow-lg hover:shadow-emerald-500/30"
            >
              Publicar Torneio e Abrir Inscrições
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
