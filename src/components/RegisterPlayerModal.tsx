import React, { useState, useEffect } from 'react';
import { useTennis } from '../context/TennisContext';
import { Player, PlayerCategory } from '../types';
import { 
  X, 
  UserPlus, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  ShieldCheck, 
  Award, 
  Activity, 
  Check, 
  Sparkles,
  Zap,
  Image as ImageIcon
} from 'lucide-react';

interface RegisterPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerToEdit?: Player | null;
}

const PRESET_AVATARS = [
  { id: '1', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', label: 'Masculino 1' },
  { id: '2', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', label: 'Masculino 2' },
  { id: '3', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', label: 'Feminino 1' },
  { id: '4', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', label: 'Feminino 2' },
  { id: '5', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', label: 'Masculino 3' },
  { id: '6', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', label: 'Feminino 3' },
  { id: '7', url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80', label: 'Masculino 4' },
  { id: '8', url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80', label: 'Master / Sênior' },
];

const CATEGORY_DEFAULT_POINTS: Record<PlayerCategory, number> = {
  '1ª Classe (Pro/Avançado)': 2000,
  '2ª Classe (Intermediário Alto)': 1600,
  '3ª Classe (Intermediário)': 1300,
  '4ª Classe (Iniciante Avançado)': 1000,
  '5ª Classe (Principiante)': 700,
  'Feminino A': 1800,
  'Feminino B': 1200,
  'Master +45': 1500,
  'Duplas Open': 1400
};

const CATEGORY_DEFAULT_UTR: Record<PlayerCategory, number> = {
  '1ª Classe (Pro/Avançado)': 10.5,
  '2ª Classe (Intermediário Alto)': 8.5,
  '3ª Classe (Intermediário)': 6.8,
  '4ª Classe (Iniciante Avançado)': 5.2,
  '5ª Classe (Principiante)': 3.5,
  'Feminino A': 9.2,
  'Feminino B': 6.0,
  'Master +45': 7.5,
  'Duplas Open': 7.0
};

export const RegisterPlayerModal: React.FC<RegisterPlayerModalProps> = ({
  isOpen,
  onClose,
  playerToEdit
}) => {
  const { createPlayer, updatePlayer, setCurrentUser } = useTennis();

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [club, setClub] = useState('MatchPoint Tennis Club - São Paulo');
  const [location, setLocation] = useState('São Paulo, SP');
  const [isOrganizer, setIsOrganizer] = useState(false);

  // Technical State
  const [category, setCategory] = useState<PlayerCategory>('3ª Classe (Intermediário)');
  const [dominantHand, setDominantHand] = useState<'Destro' | 'Canhoto'>('Destro');
  const [backhand, setBackhand] = useState<'Uma Mão' | 'Duas Mãos'>('Duas Mãos');
  const [racket, setRacket] = useState('Wilson Blade 98 v8');
  const [utrRating, setUtrRating] = useState<number>(6.8);
  const [points, setPoints] = useState<number>(1300);

  // Avatar State
  const [avatar, setAvatar] = useState(PRESET_AVATARS[0].url);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [isCustomAvatar, setIsCustomAvatar] = useState(false);

  // Options
  const [switchUserAfterSave, setSwitchUserAfterSave] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeFormTab, setActiveFormTab] = useState<'pessoal' | 'tecnico' | 'avatar'>('pessoal');

  // Load editing player or reset
  useEffect(() => {
    if (playerToEdit) {
      setName(playerToEdit.name);
      setEmail(playerToEdit.email);
      setPhone(playerToEdit.phone);
      setClub(playerToEdit.club);
      setLocation(playerToEdit.location);
      setIsOrganizer(!!playerToEdit.isOrganizer);
      setCategory(playerToEdit.category);
      setDominantHand(playerToEdit.dominantHand);
      setBackhand(playerToEdit.backhand);
      setRacket(playerToEdit.racket);
      setUtrRating(playerToEdit.utrRating);
      setPoints(playerToEdit.points);
      setAvatar(playerToEdit.avatar);
      setSwitchUserAfterSave(false);
    } else {
      setName('');
      setEmail('');
      setPhone('(11) 9');
      setClub('MatchPoint Tennis Club - São Paulo');
      setLocation('São Paulo, SP');
      setIsOrganizer(false);
      setCategory('3ª Classe (Intermediário)');
      setDominantHand('Destro');
      setBackhand('Duas Mãos');
      setRacket('Wilson Blade 98');
      setUtrRating(6.8);
      setPoints(1300);
      setAvatar(PRESET_AVATARS[0].url);
      setCustomAvatarUrl('');
      setIsCustomAvatar(false);
      setSwitchUserAfterSave(true);
      setErrorMsg('');
    }
  }, [playerToEdit, isOpen]);

  // Update defaults when category changes if creating new
  const handleCategoryChange = (newCat: PlayerCategory) => {
    setCategory(newCat);
    if (!playerToEdit) {
      setPoints(CATEGORY_DEFAULT_POINTS[newCat] || 1000);
      setUtrRating(CATEGORY_DEFAULT_UTR[newCat] || 6.0);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setErrorMsg('Por favor, informe o nome completo do tenista.');
      setActiveFormTab('pessoal');
      return;
    }

    const selectedAvatar = isCustomAvatar && customAvatarUrl.trim() ? customAvatarUrl.trim() : avatar;

    if (playerToEdit) {
      const updated: Player = {
        ...playerToEdit,
        name: name.trim(),
        email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '.')}@email.com`,
        phone: phone.trim() || '(11) 99999-0000',
        club: club.trim() || 'MatchPoint Tennis Club',
        location: location.trim() || 'São Paulo, SP',
        category,
        dominantHand,
        backhand,
        racket: racket.trim() || 'Wilson Pro Staff',
        utrRating: Number(utrRating) || 6.0,
        points: Number(points) || 1000,
        avatar: selectedAvatar,
        isOrganizer
      };
      updatePlayer(updated);
      onClose();
    } else {
      const newPlayer = createPlayer({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        club: club.trim(),
        location: location.trim(),
        category,
        dominantHand,
        backhand,
        racket: racket.trim(),
        utrRating: Number(utrRating) || 6.0,
        points: Number(points) || 1000,
        avatar: selectedAvatar,
        isOrganizer
      });

      if (switchUserAfterSave) {
        setCurrentUser(newPlayer);
      }

      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl text-white my-6 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-emerald-900 via-slate-800 to-slate-900 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white">
                  {playerToEdit ? 'Editar Cadastro de Tenista' : 'Cadastro de Novo Jogador'}
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                  Circuito Oficial
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Cadastre o atleta no ranking, barragem e lista de participantes
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-800 px-6 bg-slate-900/60 text-xs">
          <button
            type="button"
            onClick={() => setActiveFormTab('pessoal')}
            className={`py-3 px-4 font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeFormTab === 'pessoal'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            1. Dados Pessoais & Clube
          </button>

          <button
            type="button"
            onClick={() => setActiveFormTab('tecnico')}
            className={`py-3 px-4 font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeFormTab === 'tecnico'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            2. Categoria & Estilo de Jogo
          </button>

          <button
            type="button"
            onClick={() => setActiveFormTab('avatar')}
            className={`py-3 px-4 font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeFormTab === 'avatar'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            3. Foto & Prévia do Card
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          
          {errorMsg && (
            <div className="p-3 bg-red-500/10 border border-red-500/40 rounded-xl text-red-300 text-xs font-semibold flex items-center gap-2">
              <Zap className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* TAB 1: Dados Pessoais */}
          {activeFormTab === 'pessoal' && (
            <div className="space-y-4">
              
              {/* Nome */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Nome Completo do Tenista <span className="text-emerald-400">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Ex: Carlos Eduardo Silveira"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setErrorMsg('');
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Email & Telefone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    E-mail
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="email"
                      placeholder="exemplo@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    WhatsApp / Telefone para Contato
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="(11) 98765-4321"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Clube & Localização */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Clube / Academia de Origem
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Ex: MatchPoint Tennis Club"
                      value={club}
                      onChange={(e) => setClub(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Cidade / UF
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="São Paulo, SP"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Tipo de Perfil: Atleta vs Gestor */}
              <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700">
                <label className="block text-xs font-bold text-slate-200 mb-2">
                  Função no Clube / Sistema:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setIsOrganizer(false)}
                    className={`p-3 rounded-xl border text-left text-xs transition-all flex items-start gap-2.5 ${
                      !isOrganizer
                        ? 'bg-emerald-950/40 border-emerald-500 text-white'
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-xl">🎾</span>
                    <div>
                      <p className="font-bold text-white">Tenista / Atleta</p>
                      <p className="text-[10px] text-slate-400">Joga torneios, barragem e reserva quadras</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsOrganizer(true)}
                    className={`p-3 rounded-xl border text-left text-xs transition-all flex items-start gap-2.5 ${
                      isOrganizer
                        ? 'bg-amber-950/40 border-amber-500 text-white'
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-xl">👑</span>
                    <div>
                      <p className="font-bold text-white">Gestor / Organizador</p>
                      <p className="text-[10px] text-slate-400">Cria torneios, gerencia quadras e comunicados</p>
                    </div>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: Dados Técnicos */}
          {activeFormTab === 'tecnico' && (
            <div className="space-y-4">
              
              {/* Categoria / Classe */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Categoria / Classe do Ranking Oficial
                </label>
                <select
                  value={category}
                  onChange={(e) => handleCategoryChange(e.target.value as PlayerCategory)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="1ª Classe (Pro/Avançado)">1ª Classe (Pro / Avançado - UTR 10+)</option>
                  <option value="2ª Classe (Intermediário Alto)">2ª Classe (Intermediário Alto - UTR 8 a 10)</option>
                  <option value="3ª Classe (Intermediário)">3ª Classe (Intermediário - UTR 6 a 8)</option>
                  <option value="4ª Classe (Iniciante Avançado)">4ª Classe (Iniciante Avançado - UTR 4 a 6)</option>
                  <option value="5ª Classe (Principiante)">5ª Classe (Principiante - UTR 2 a 4)</option>
                  <option value="Feminino A">Feminino A (Avançado / Intermediário Alto)</option>
                  <option value="Feminino B">Feminino B (Intermediário / Iniciante)</option>
                  <option value="Master +45">Master +45 (Veteranos)</option>
                  <option value="Duplas Open">Duplas Open</option>
                </select>
              </div>

              {/* Mão Dominante & Backhand */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Braço Dominante
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setDominantHand('Destro')}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                        dominantHand === 'Destro'
                          ? 'bg-emerald-600 border-emerald-500 text-white'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      Destro
                    </button>
                    <button
                      type="button"
                      onClick={() => setDominantHand('Canhoto')}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                        dominantHand === 'Canhoto'
                          ? 'bg-emerald-600 border-emerald-500 text-white'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      Canhoto
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Golpe de Backhand
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setBackhand('Duas Mãos')}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                        backhand === 'Duas Mãos'
                          ? 'bg-emerald-600 border-emerald-500 text-white'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      Duas Mãos (2H)
                    </button>
                    <button
                      type="button"
                      onClick={() => setBackhand('Uma Mão')}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                        backhand === 'Uma Mão'
                          ? 'bg-emerald-600 border-emerald-500 text-white'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      Uma Mão (1H)
                    </button>
                  </div>
                </div>
              </div>

              {/* Raquete */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Raquete de Escolha
                </label>
                <input
                  type="text"
                  placeholder="Ex: Babolat Pure Aero 98, Wilson Blade 98, Head Speed Pro..."
                  value={racket}
                  onChange={(e) => setRacket(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* UTR Rating & Pontos Iniciais */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-800/60 rounded-2xl border border-slate-700">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-300">
                      Nível UTR Estimado (1.0 - 16.5)
                    </label>
                    <span className="font-mono font-bold text-emerald-400 text-xs">
                      {utrRating} UTR
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="14.0"
                    step="0.1"
                    value={utrRating}
                    onChange={(e) => setUtrRating(parseFloat(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Ajuste fino de acordo com o nível técnico real do atleta.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Pontos Iniciais no Ranking
                  </label>
                  <input
                    type="number"
                    value={points}
                    onChange={(e) => setPoints(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-emerald-400 font-bold focus:outline-none focus:border-emerald-500"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Base sugerida para a {category.split(' ')[0]}.
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: Avatar & Prévia */}
          {activeFormTab === 'avatar' && (
            <div className="space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  Escolha um Avatar Pré-definido:
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {PRESET_AVATARS.map((p) => {
                    const isSelected = !isCustomAvatar && avatar === p.url;
                    return (
                      <div
                        key={p.id}
                        onClick={() => {
                          setAvatar(p.url);
                          setIsCustomAvatar(false);
                        }}
                        className={`cursor-pointer rounded-2xl p-1.5 border transition-all flex flex-col items-center gap-1 ${
                          isSelected
                            ? 'bg-emerald-950/60 border-emerald-500 ring-2 ring-emerald-500/50 scale-105'
                            : 'bg-slate-800 border-slate-700 hover:border-slate-500'
                        }`}
                      >
                        <img 
                          src={p.url} 
                          alt={p.label} 
                          className="w-14 h-14 rounded-full object-cover" 
                        />
                        <span className="text-[10px] text-slate-300 font-medium">{p.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* URL Customizada */}
              <div className="p-3 bg-slate-800/60 rounded-2xl border border-slate-700">
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Ou insira a URL da Foto de Perfil (Opcional):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    placeholder="https://exemplo.com/minha-foto.jpg"
                    value={customAvatarUrl}
                    onChange={(e) => {
                      setCustomAvatarUrl(e.target.value);
                      if (e.target.value.trim()) setIsCustomAvatar(true);
                    }}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                  {customAvatarUrl && (
                    <button
                      type="button"
                      onClick={() => setIsCustomAvatar(true)}
                      className="px-3 py-2 rounded-xl bg-emerald-600 text-xs font-bold text-white hover:bg-emerald-500"
                    >
                      Usar URL
                    </button>
                  )}
                </div>
              </div>

              {/* Live Preview Card */}
              <div className="p-4 bg-gradient-to-r from-slate-950 to-slate-900 rounded-2xl border border-emerald-500/40">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 mb-3">
                  <Sparkles className="w-3.5 h-3.5" /> Prévia da Carteirinha do Atleta:
                </div>
                
                <div className="flex items-center gap-4">
                  <img 
                    src={isCustomAvatar && customAvatarUrl ? customAvatarUrl : avatar} 
                    alt="Preview" 
                    className="w-16 h-16 rounded-full object-cover border-2 border-emerald-400 shadow-md shrink-0" 
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-sm text-white truncate">
                        {name || 'Nome do Jogador'}
                      </h4>
                      {isOrganizer && (
                        <span className="text-[9px] bg-amber-500 text-slate-950 font-bold px-1.5 py-0.2 rounded">
                          GESTOR
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-emerald-400 font-semibold">{category}</p>
                    <p className="text-[11px] text-slate-400 truncate">
                      {club || 'MatchPoint Tennis Club'} • {location || 'São Paulo, SP'}
                    </p>
                    <div className="flex items-center gap-3 text-[10px] text-slate-300 mt-1 font-mono">
                      <span>UTR: <strong>{utrRating}</strong></span>
                      <span>Pontos: <strong className="text-emerald-400">{points} pts</strong></span>
                      <span>{dominantHand} / {backhand}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* Opção de login imediato */}
          {!playerToEdit && (
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 select-none">
                <input
                  type="checkbox"
                  checked={switchUserAfterSave}
                  onChange={(e) => setSwitchUserAfterSave(e.target.checked)}
                  className="rounded border-slate-700 text-emerald-600 focus:ring-emerald-500 w-4 h-4 bg-slate-800"
                />
                <span>Definir como usuário ativo após salvar o cadastro</span>
              </label>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              Cancelar
            </button>

            <div className="flex items-center gap-2">
              {activeFormTab !== 'pessoal' && (
                <button
                  type="button"
                  onClick={() => setActiveFormTab(activeFormTab === 'avatar' ? 'tecnico' : 'pessoal')}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
                >
                  Voltar
                </button>
              )}

              {activeFormTab !== 'avatar' ? (
                <button
                  type="button"
                  onClick={() => {
                    if (activeFormTab === 'pessoal' && !name.trim()) {
                      setErrorMsg('Informe o nome do tenista para continuar.');
                      return;
                    }
                    setActiveFormTab(activeFormTab === 'pessoal' ? 'tecnico' : 'avatar');
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-colors flex items-center gap-1.5"
                >
                  Próximo Passo →
                </button>
              ) : (
                <button
                  id="btn-confirm-register-player"
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black shadow-lg transition-all flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  {playerToEdit ? 'Salvar Alterações' : 'Concluir Cadastro'}
                </button>
              )}
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
