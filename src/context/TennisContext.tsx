import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { apiFetch } from '../lib/api';
import { 
  Player, 
  Tournament, 
  Court, 
  CourtBooking, 
  ChatChannel, 
  ChatMessage, 
  PartnerRequest, 
  MatchScoreDetails, 
  TournamentMatch,
  PlayerCategory,
  CourtSurface
} from '../types';
import { 
  INITIAL_PLAYERS, 
  INITIAL_COURTS, 
  INITIAL_TOURNAMENTS, 
  INITIAL_BOOKINGS, 
  INITIAL_CHANNELS, 
  INITIAL_MESSAGES, 
  INITIAL_PARTNER_REQUESTS 
} from '../data/initialData';

interface TennisContextType {
  currentUser: Player;
  setCurrentUser: (player: Player) => void;
  players: Player[];
  createPlayer: (data: {
    name: string;
    avatar?: string;
    category: PlayerCategory;
    dominantHand: 'Destro' | 'Canhoto';
    backhand: 'Uma Mão' | 'Duas Mãos';
    racket: string;
    club: string;
    location: string;
    phone: string;
    email: string;
    utrRating?: number;
    points?: number;
    isOrganizer?: boolean;
  }) => Player;
  deletePlayer: (playerId: string) => Promise<void>;
  clearAllPlayersFromDatabase: () => Promise<void>;
  fetchDataFromMySQL: () => Promise<void>;
  updatePlayer: (player: Player) => void;
  tournaments: Tournament[];
  createTournament: (data: {
    title: string;
    category: PlayerCategory;
    surface: CourtSurface;
    clubName: string;
    address: string;
    startDate: string;
    endDate: string;
    entryFee: number;
    prizeDescription: string;
    maxParticipants: number;
    rules: string;
    format: 'eliminatoria_simples' | 'grupos_eliminatoria';
    bannerImage?: string;
  }) => string;
  registerForTournament: (tournamentId: string, playerId: string) => void;
  unregisterFromTournament: (tournamentId: string, playerId: string) => void;
  generateTournamentBracket: (tournamentId: string) => void;
  updateMatchScore: (tournamentId: string, matchId: string, score: MatchScoreDetails) => void;
  recordDirectMatchResult: (player1Id: string, player2Id: string, score: MatchScoreDetails, matchTypeTitle?: string) => void;
  courts: Court[];
  bookings: CourtBooking[];
  createBooking: (booking: Omit<CourtBooking, 'id'>) => void;
  cancelBooking: (bookingId: string) => void;
  partnerRequests: PartnerRequest[];
  createPartnerRequest: (req: {
    preferredDate: string;
    preferredTime: string;
    courtSurface: CourtSurface;
    clubLocation: string;
    description: string;
  }) => void;
  acceptPartnerRequest: (requestId: string) => void;
  channels: ChatChannel[];
  messages: ChatMessage[];
  activeChannelId: string;
  setActiveChannelId: (channelId: string) => void;
  sendMessage: (channelId: string, content: string) => void;
  openDirectChatWithPlayer: (partnerId: string) => string;
  activeTab: 'torneios' | 'rankings' | 'jogadores' | 'quadras' | 'comunidade' | 'placar_ao_vivo' | 'confrontos';
  setActiveTab: (tab: 'torneios' | 'rankings' | 'jogadores' | 'quadras' | 'comunidade' | 'placar_ao_vivo' | 'confrontos') => void;
  selectedTournamentId: string | null;
  setSelectedTournamentId: (id: string | null) => void;
  selectedPlayerId: string | null;
  setSelectedPlayerId: (id: string | null) => void;
  challengePlayer: (challengedId: string) => void;
  triggerCelebration: () => void;
  resetToDefaults: () => void;
  dbStatus: {
    tested: boolean;
    success: boolean;
    message: string;
    details?: any;
    error?: any;
  };
  isDbConnected: boolean;
  isDbLoading: boolean;
  checkDbStatus: () => Promise<void>;
  initDbSchema: () => Promise<{ success: boolean; message: string }>;
}

const TennisContext = createContext<TennisContextType | undefined>(undefined);

export const TennisProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // MySQL Database Connection Status
  const [dbStatus, setDbStatus] = useState<{
    tested: boolean;
    success: boolean;
    message: string;
    details?: any;
    error?: any;
  }>({
    tested: false,
    success: false,
    message: 'Verificando conexão com MySQL HostGator...',
  });
  const [isDbLoading, setIsDbLoading] = useState<boolean>(false);

  // Load from local storage or initial (wiping legacy mock records)
  const [players, setPlayers] = useState<Player[]>(() => {
    const saved = localStorage.getItem('matchpoint_players');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // If stored players contain legacy mock IDs, clear to ensure 100% database accuracy
          const hasLegacyMock = parsed.some(p => ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'org1'].includes(p.id) && (p.name.includes('Carlos Alcaraz') || p.name.includes('Roberto Camargo')));
          if (hasLegacyMock) {
            localStorage.removeItem('matchpoint_players');
            return [];
          }
          return parsed;
        }
      } catch {
        return [];
      }
    }
    return INITIAL_PLAYERS;
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    return localStorage.getItem('matchpoint_current_user_id') || 'admin_conde';
  });

  const [tournaments, setTournaments] = useState<Tournament[]>(() => {
    const saved = localStorage.getItem('matchpoint_tournaments');
    return saved ? JSON.parse(saved) : INITIAL_TOURNAMENTS;
  });

  const [courts] = useState<Court[]>(INITIAL_COURTS);

  const [bookings, setBookings] = useState<CourtBooking[]>(() => {
    const saved = localStorage.getItem('matchpoint_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [partnerRequests, setPartnerRequests] = useState<PartnerRequest[]>(() => {
    const saved = localStorage.getItem('matchpoint_partner_requests');
    return saved ? JSON.parse(saved) : INITIAL_PARTNER_REQUESTS;
  });

  const [channels, setChannels] = useState<ChatChannel[]>(() => {
    const saved = localStorage.getItem('matchpoint_channels');
    return saved ? JSON.parse(saved) : INITIAL_CHANNELS;
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('matchpoint_messages');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [activeChannelId, setActiveChannelId] = useState<string>('avisos-torneios');
  const [activeTab, setActiveTab] = useState<'torneios' | 'rankings' | 'quadras' | 'comunidade' | 'placar_ao_vivo' | 'confrontos'>('torneios');
  const [selectedTournamentId, setSelectedTournamentId] = useState<string | null>('tour1');
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('matchpoint_players', JSON.stringify(players));
  }, [players]);

  useEffect(() => {
    localStorage.setItem('matchpoint_current_user_id', currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    localStorage.setItem('matchpoint_tournaments', JSON.stringify(tournaments));
  }, [tournaments]);

  useEffect(() => {
    localStorage.setItem('matchpoint_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('matchpoint_partner_requests', JSON.stringify(partnerRequests));
  }, [partnerRequests]);

  useEffect(() => {
    localStorage.setItem('matchpoint_channels', JSON.stringify(channels));
  }, [channels]);

  useEffect(() => {
    localStorage.setItem('matchpoint_messages', JSON.stringify(messages));
  }, [messages]);

  // MySQL Connection & Sync Logic
  const checkDbStatus = async () => {
    setIsDbLoading(true);
    try {
      const res = await apiFetch('/api/db/status');
      const data = await res.json();
      setDbStatus({
        tested: true,
        success: !!data.success,
        message: data.message || (data.success ? 'Conectado ao MySQL HostGator!' : 'Falha na conexão'),
        details: data.details,
        error: data.error
      });

      // If connected, fetch live data
      if (data.success) {
        fetchDataFromMySQL();
      }
    } catch (err: any) {
      setDbStatus({
        tested: true,
        success: false,
        message: 'Servidor local não respondeu ao teste de banco de dados',
        error: { message: err.message }
      });
    } finally {
      setIsDbLoading(false);
    }
  };

  const initDbSchema = async () => {
    setIsDbLoading(true);
    try {
      const res = await apiFetch('/api/db/init', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        await checkDbStatus();
      }
      return data;
    } catch (err: any) {
      return { success: false, message: err.message };
    } finally {
      setIsDbLoading(false);
    }
  };

  const fetchDataFromMySQL = async () => {
    try {
      // Fetch players directly from table `players` of MySQL `rica2888_tenisconde`
      const pRes = await apiFetch('/api/players');
      const pData = await pRes.json();
      if (pData.success && Array.isArray(pData.data)) {
        setPlayers(pData.data);
      }

      // Fetch tournaments
      const tRes = await apiFetch('/api/tournaments');
      const tData = await tRes.json();
      if (tData.success && Array.isArray(tData.data) && tData.data.length > 0) {
        setTournaments(tData.data);
      }

      // Fetch bookings
      const bRes = await apiFetch('/api/bookings');
      const bData = await bRes.json();
      if (bData.success && Array.isArray(bData.data) && bData.data.length > 0) {
        setBookings(bData.data);
      }

      // Fetch messages
      const mRes = await apiFetch('/api/messages');
      const mData = await mRes.json();
      if (mData.success && Array.isArray(mData.data) && mData.data.length > 0) {
        setMessages(mData.data);
      }
    } catch (e) {
      console.warn('Erro ao carregar dados do MySQL, utilizando dados locais:', e);
    }
  };

  // Test DB connection on mount
  useEffect(() => {
    checkDbStatus();
  }, []);

  // Safe default admin profile if no players exist yet in database
  const DEFAULT_ADMIN: Player = {
    id: 'admin_conde',
    name: 'Gestor Tennis Condé 2',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    category: '1ª Classe (Pro/Avançado)',
    points: 2000,
    rank: 1,
    matchesPlayed: 0,
    wins: 0,
    losses: 0,
    dominantHand: 'Destro',
    backhand: 'Duas Mãos',
    racket: 'Wilson Blade 98',
    club: 'Tennis Condé 2 - Residencial Condé II',
    location: 'São Paulo, SP',
    phone: '(11) 99999-0000',
    email: 'ricardo.quaglio@gmail.com',
    utrRating: 8.0,
    streak: 0,
    isOrganizer: true
  };

  const currentUser: Player = players.find(p => p.id === currentUserId) || players[0] || DEFAULT_ADMIN;

  const setCurrentUser = (player: Player) => {
    setCurrentUserId(player.id);
  };

  const updatePlayer = (updated: Player) => {
    setPlayers(prev => prev.map(p => p.id === updated.id ? updated : p));
    // Persist to MySQL database table `players`
    apiFetch('/api/players', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    }).catch(err => console.error('Erro ao sincronizar jogador no MySQL:', err));
  };

  const createPlayer = (data: {
    name: string;
    avatar?: string;
    category: PlayerCategory;
    dominantHand: 'Destro' | 'Canhoto';
    backhand: 'Uma Mão' | 'Duas Mãos';
    racket: string;
    club: string;
    location: string;
    phone: string;
    email: string;
    utrRating?: number;
    points?: number;
    isOrganizer?: boolean;
  }): Player => {
    const id = `p_${Date.now()}`;
    
    // Default avatar if none provided
    const defaultAvatars = [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80'
    ];
    const avatar = data.avatar?.trim() || defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)];

    // Estimate initial points based on category if not provided
    const defaultPoints: Record<PlayerCategory, number> = {
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

    const points = data.points !== undefined ? data.points : (defaultPoints[data.category] || 1000);
    const utrRating = data.utrRating !== undefined ? data.utrRating : 6.0;

    const newPlayer: Player = {
      id,
      name: data.name.trim(),
      avatar,
      category: data.category,
      points,
      rank: players.filter(p => !p.isOrganizer && p.category === data.category).length + 1,
      matchesPlayed: 0,
      wins: 0,
      losses: 0,
      dominantHand: data.dominantHand || 'Destro',
      backhand: data.backhand || 'Duas Mãos',
      racket: data.racket?.trim() || 'Wilson Blade 98',
      club: data.club?.trim() || 'Tennis Condé 2',
      location: data.location?.trim() || 'São Paulo, SP',
      phone: data.phone?.trim() || '(11) 99999-0000',
      email: data.email?.trim() || `${data.name.toLowerCase().replace(/\s+/g, '.')}@email.com`,
      utrRating,
      streak: 0,
      isOrganizer: !!data.isOrganizer
    };

    setPlayers(prev => [newPlayer, ...prev]);
    setCurrentUserId(newPlayer.id);
    triggerCelebration();

    // Persist new player directly to MySQL database table `players` of `rica2888_tenisconde`
    apiFetch('/api/players', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPlayer)
    }).catch(err => console.error('Erro ao persistir novo jogador no MySQL:', err));

    // Send welcome greeting in chat
    const welcomeMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: 'admin_conde',
      senderName: 'Gestão Tennis Condé 2',
      senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      timestamp: 'Agora',
      content: `🎾 Damos as boas-vindas ao novo tenista cadastrado: ${newPlayer.name} (${newPlayer.category} • Clube: ${newPlayer.club})! Desejamos excelentes partidas! 👏`,
      channelId: 'geral',
      isOfficial: true
    };
    setMessages(prev => [...prev, welcomeMsg]);

    return newPlayer;
  };

  const deletePlayer = async (playerId: string) => {
    setPlayers(prev => prev.filter(p => p.id !== playerId));
    if (currentUserId === playerId) {
      const remaining = players.filter(p => p.id !== playerId);
      if (remaining.length > 0) {
        setCurrentUserId(remaining[0].id);
      } else {
        setCurrentUserId('admin_conde');
      }
    }

    try {
      await apiFetch(`/api/players/${playerId}`, { method: 'DELETE' });
    } catch (e) {
      console.error('Erro ao excluir jogador no MySQL:', e);
    }
  };

  const clearAllPlayersFromDatabase = async () => {
    setPlayers([]);
    setCurrentUserId('admin_conde');
    localStorage.removeItem('matchpoint_players');
    try {
      await apiFetch('/api/players/clear-all', { method: 'POST' });
    } catch (e) {
      console.error('Erro ao limpar jogadores no MySQL:', e);
    }
  };

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#22c55e', '#eab308', '#3b82f6', '#ef4444', '#a855f7']
      });
    } catch {
      // ignore
    }
  };

  const createTournament = (data: {
    title: string;
    category: PlayerCategory;
    surface: CourtSurface;
    clubName: string;
    address: string;
    startDate: string;
    endDate: string;
    entryFee: number;
    prizeDescription: string;
    maxParticipants: number;
    rules: string;
    format: 'eliminatoria_simples' | 'grupos_eliminatoria';
    bannerImage?: string;
  }): string => {
    const id = `tour_${Date.now()}`;
    const defaultBanner = data.surface === 'Saibro (Clay)' 
      ? 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800&auto=format&fit=crop&q=80'
      : data.surface === 'Grama (Grass)'
      ? 'https://images.unsplash.com/photo-1530915534664-4ac6423797c7?w=800&auto=format&fit=crop&q=80'
      : 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&auto=format&fit=crop&q=80';

    const newTournament: Tournament = {
      id,
      title: data.title,
      bannerImage: data.bannerImage || defaultBanner,
      organizerId: currentUser.id,
      organizerName: currentUser.name,
      category: data.category,
      surface: data.surface,
      clubName: data.clubName || 'MatchPoint Tennis Club',
      address: data.address || 'Av. das Nações Unidas, 14261 - Morumbi, SP',
      startDate: data.startDate,
      endDate: data.endDate,
      entryFee: Number(data.entryFee) || 0,
      prizeDescription: data.prizeDescription || 'Troféus e brindes',
      status: 'inscricoes_abertas',
      format: data.format,
      maxParticipants: Number(data.maxParticipants) || 8,
      registeredPlayerIds: [currentUser.id],
      rules: data.rules,
      matches: []
    };

    setTournaments(prev => [newTournament, ...prev]);

    // Send announcement
    const announcementMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      timestamp: 'Agora',
      content: `🏆 Novo Torneio Criado: "${data.title}" (${data.category} - Piso: ${data.surface})! Inscrições abertas no valor de R$ ${data.entryFee}.`,
      channelId: 'avisos-torneios',
      isOfficial: true
    };
    setMessages(prev => [...prev, announcementMsg]);

    return id;
  };

  const registerForTournament = (tournamentId: string, playerId: string) => {
    setTournaments(prev => prev.map(t => {
      if (t.id !== tournamentId) return t;
      if (t.registeredPlayerIds.includes(playerId)) return t;
      if (t.registeredPlayerIds.length >= t.maxParticipants) return t;
      return {
        ...t,
        registeredPlayerIds: [...t.registeredPlayerIds, playerId]
      };
    }));
  };

  const unregisterFromTournament = (tournamentId: string, playerId: string) => {
    setTournaments(prev => prev.map(t => {
      if (t.id !== tournamentId) return t;
      return {
        ...t,
        registeredPlayerIds: t.registeredPlayerIds.filter(id => id !== playerId)
      };
    }));
  };

  const generateTournamentBracket = (tournamentId: string) => {
    setTournaments(prev => prev.map(t => {
      if (t.id !== tournamentId) return t;
      const registered = [...t.registeredPlayerIds];
      
      // Auto-fill slots if needed with dummy or fill with registered
      const size = t.maxParticipants <= 4 ? 4 : 8;
      const matches: TournamentMatch[] = [];

      if (size === 4) {
        // 2 Semifinals + 1 Final
        matches.push({
          id: `${tournamentId}_m1`,
          tournamentId,
          round: 1,
          roundName: 'Semifinal 1',
          matchNumber: 1,
          player1Id: registered[0] || undefined,
          player2Id: registered[3] || registered[1] || undefined,
          player1Seed: 1,
          courtId: 'c1',
          courtName: 'Quadra 1 - Central Guga Kuerten',
          scheduledDate: t.startDate,
          scheduledTime: '09:00',
          status: 'agendado',
          nextMatchId: `${tournamentId}_m3`
        });
        matches.push({
          id: `${tournamentId}_m2`,
          tournamentId,
          round: 1,
          roundName: 'Semifinal 2',
          matchNumber: 2,
          player1Id: registered[1] || registered[2] || undefined,
          player2Id: registered[2] || registered[3] || undefined,
          player1Seed: 2,
          courtId: 'c2',
          courtName: 'Quadra 2 - Saibro Rápido',
          scheduledDate: t.startDate,
          scheduledTime: '10:30',
          status: 'agendado',
          nextMatchId: `${tournamentId}_m3`
        });
        matches.push({
          id: `${tournamentId}_m3`,
          tournamentId,
          round: 2,
          roundName: 'Grande Final',
          matchNumber: 3,
          courtId: 'c1',
          courtName: 'Quadra 1 - Central Guga Kuerten',
          scheduledDate: t.endDate,
          scheduledTime: '16:00',
          status: 'agendado'
        });
      } else {
        // 8 Players: 4 Quartas + 2 Semis + 1 Final
        matches.push(
          {
            id: `${tournamentId}_m1`,
            tournamentId,
            round: 1,
            roundName: 'Quartas de Final 1',
            matchNumber: 1,
            player1Id: registered[0] || 'p1',
            player2Id: registered[7] || 'p7',
            player1Seed: 1,
            courtId: 'c1',
            courtName: 'Quadra 1 - Central Guga Kuerten',
            scheduledDate: t.startDate,
            scheduledTime: '09:00',
            status: 'agendado',
            nextMatchId: `${tournamentId}_m5`
          },
          {
            id: `${tournamentId}_m2`,
            tournamentId,
            round: 1,
            roundName: 'Quartas de Final 2',
            matchNumber: 2,
            player1Id: registered[3] || 'p4',
            player2Id: registered[4] || 'p5',
            courtId: 'c2',
            courtName: 'Quadra 2 - Saibro Rápido',
            scheduledDate: t.startDate,
            scheduledTime: '10:30',
            status: 'agendado',
            nextMatchId: `${tournamentId}_m5`
          },
          {
            id: `${tournamentId}_m3`,
            tournamentId,
            round: 1,
            roundName: 'Quartas de Final 3',
            matchNumber: 3,
            player1Id: registered[2] || 'p8',
            player2Id: registered[5] || 'p3',
            courtId: 'c3',
            courtName: 'Quadra 3 - US Open Rápida',
            scheduledDate: t.startDate,
            scheduledTime: '14:00',
            status: 'agendado',
            nextMatchId: `${tournamentId}_m6`
          },
          {
            id: `${tournamentId}_m4`,
            tournamentId,
            round: 1,
            roundName: 'Quartas de Final 4',
            matchNumber: 4,
            player1Id: registered[6] || 'p6',
            player2Id: registered[1] || 'p2',
            player2Seed: 2,
            courtId: 'c1',
            courtName: 'Quadra 1 - Central Guga Kuerten',
            scheduledDate: t.startDate,
            scheduledTime: '15:30',
            status: 'agendado',
            nextMatchId: `${tournamentId}_m6`
          },
          // Semis
          {
            id: `${tournamentId}_m5`,
            tournamentId,
            round: 2,
            roundName: 'Semifinal 1',
            matchNumber: 5,
            courtId: 'c1',
            courtName: 'Quadra 1 - Central Guga Kuerten',
            scheduledDate: t.endDate,
            scheduledTime: '10:00',
            status: 'agendado',
            nextMatchId: `${tournamentId}_m7`
          },
          {
            id: `${tournamentId}_m6`,
            tournamentId,
            round: 2,
            roundName: 'Semifinal 2',
            matchNumber: 6,
            courtId: 'c1',
            courtName: 'Quadra 1 - Central Guga Kuerten',
            scheduledDate: t.endDate,
            scheduledTime: '11:30',
            status: 'agendado',
            nextMatchId: `${tournamentId}_m7`
          },
          // Final
          {
            id: `${tournamentId}_m7`,
            tournamentId,
            round: 3,
            roundName: 'Grande Final',
            matchNumber: 7,
            courtId: 'c1',
            courtName: 'Quadra 1 - Central Guga Kuerten',
            scheduledDate: t.endDate,
            scheduledTime: '16:00',
            status: 'agendado'
          }
        );
      }

      return {
        ...t,
        status: 'em_andamento',
        matches
      };
    }));
  };

  const updateMatchScore = (tournamentId: string, matchId: string, score: MatchScoreDetails) => {
    let updatedTournamentWinner: string | null = null;

    setTournaments(prev => prev.map(t => {
      if (t.id !== tournamentId) return t;

      const currentMatch = t.matches.find(m => m.id === matchId);
      if (!currentMatch) return t;

      const winnerId = score.winnerId;
      const nextMatchId = currentMatch.nextMatchId;

      const updatedMatches = t.matches.map(m => {
        if (m.id === matchId) {
          return {
            ...m,
            status: 'concluido' as const,
            winnerId,
            score
          };
        }

        // Advance winner to the next bracket round
        if (nextMatchId && m.id === nextMatchId) {
          if (!m.player1Id) {
            return { ...m, player1Id: winnerId };
          } else if (!m.player2Id && m.player1Id !== winnerId) {
            return { ...m, player2Id: winnerId };
          } else if (m.player1Id === winnerId || m.player2Id === winnerId) {
            return m;
          }
        }

        return m;
      });

      // Check if this was the Final
      const isFinal = !currentMatch.nextMatchId;
      let newStatus = t.status;
      if (isFinal && winnerId) {
        newStatus = 'concluido';
        updatedTournamentWinner = winnerId;
      }

      return {
        ...t,
        status: newStatus,
        matches: updatedMatches
      };
    }));

    // Update player ranking stats
    if (score.winnerId) {
      const winner = players.find(p => p.id === score.winnerId);
      const targetMatch = tournaments.find(t => t.id === tournamentId)?.matches.find(m => m.id === matchId);
      const loserId = targetMatch?.player1Id === score.winnerId ? targetMatch?.player2Id : targetMatch?.player1Id;

      setPlayers(prev => prev.map(p => {
        if (p.id === score.winnerId) {
          return {
            ...p,
            points: p.points + 100,
            matchesPlayed: p.matchesPlayed + 1,
            wins: p.wins + 1,
            streak: p.streak >= 0 ? p.streak + 1 : 1,
            utrRating: Number((p.utrRating + 0.1).toFixed(2))
          };
        }
        if (loserId && p.id === loserId) {
          return {
            ...p,
            points: Math.max(0, p.points + 25),
            matchesPlayed: p.matchesPlayed + 1,
            losses: p.losses + 1,
            streak: p.streak <= 0 ? p.streak - 1 : -1
          };
        }
        return p;
      }));

      triggerCelebration();

      // Post broadcast in chat
      if (winner) {
        const scoreStr = score.sets.map(s => `${s.player1Games}/${s.player2Games}`).join(' ');
        const resultMsg: ChatMessage = {
          id: `msg_${Date.now()}`,
          senderId: 'org1',
          senderName: 'Prof. Roberto Camargo (Diretor Técnico)',
          senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
          timestamp: 'Agora',
          content: `🎾 Placar registrado: ${winner.name} venceu a partida por ${scoreStr}! 👏`,
          channelId: 'avisos-torneios',
          isOfficial: true
        };
        setMessages(prev => [...prev, resultMsg]);
      }
    }
  };

  const recordDirectMatchResult = (
    player1Id: string, 
    player2Id: string, 
    score: MatchScoreDetails, 
    matchTypeTitle: string = 'Desafio de Barragem / Amistoso'
  ) => {
    if (!score.winnerId) return;

    const winner = players.find(p => p.id === score.winnerId);
    const loserId = player1Id === score.winnerId ? player2Id : player1Id;
    const loser = players.find(p => p.id === loserId);

    setPlayers(prev => prev.map(p => {
      if (p.id === score.winnerId) {
        return {
          ...p,
          points: p.points + 80,
          matchesPlayed: p.matchesPlayed + 1,
          wins: p.wins + 1,
          streak: p.streak >= 0 ? p.streak + 1 : 1,
          utrRating: Number((p.utrRating + 0.1).toFixed(2))
        };
      }
      if (p.id === loserId) {
        return {
          ...p,
          points: Math.max(0, p.points + 20),
          matchesPlayed: p.matchesPlayed + 1,
          losses: p.losses + 1,
          streak: p.streak <= 0 ? p.streak - 1 : -1
        };
      }
      return p;
    }));

    triggerCelebration();

    if (winner && loser) {
      const scoreStr = score.sets.map(s => {
        if (s.tiebreakPlayer1 !== undefined && s.tiebreakPlayer2 !== undefined) {
          return `${s.player1Games}/${s.player2Games}(${Math.min(s.tiebreakPlayer1, s.tiebreakPlayer2)})`;
        }
        return `${s.player1Games}/${s.player2Games}`;
      }).join(' ');

      const resultMsg: ChatMessage = {
        id: `msg_${Date.now()}`,
        senderId: 'org1',
        senderName: 'MatchPoint Arbitragem',
        senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
        timestamp: 'Agora',
        content: `🎾 Placar Final Registrado [${matchTypeTitle}]: ${winner.name} venceu ${loser.name} por ${scoreStr}! Ambos pontuaram no Ranking do Clube. 🏆`,
        channelId: 'geral-clube',
        isOfficial: true
      };
      setMessages(prev => [...prev, resultMsg]);
    }
  };

  const createBooking = (bookingData: Omit<CourtBooking, 'id'>) => {
    const newBooking: CourtBooking = {
      id: `b_${Date.now()}`,
      ...bookingData
    };
    setBookings(prev => [newBooking, ...prev]);
    triggerCelebration();
  };

  const cancelBooking = (bookingId: string) => {
    setBookings(prev => prev.filter(b => b.id !== bookingId));
  };

  const createPartnerRequest = (req: {
    preferredDate: string;
    preferredTime: string;
    courtSurface: CourtSurface;
    clubLocation: string;
    description: string;
  }) => {
    const newReq: PartnerRequest = {
      id: `pr_${Date.now()}`,
      playerId: currentUser.id,
      playerName: currentUser.name,
      playerAvatar: currentUser.avatar,
      category: currentUser.category,
      preferredDate: req.preferredDate,
      preferredTime: req.preferredTime,
      courtSurface: req.courtSurface,
      clubLocation: req.clubLocation,
      description: req.description,
      createdAt: 'Agora mesmo',
      status: 'aberto'
    };
    setPartnerRequests(prev => [newReq, ...prev]);

    // Send message to public group
    const chatMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      timestamp: 'Agora',
      content: `🎾 Procuro parceiro(a) para jogar em ${req.preferredDate} (${req.preferredTime}) na quadra de ${req.courtSurface}. Quem puder, me envie uma mensagem!`,
      channelId: 'geral'
    };
    setMessages(prev => [...prev, chatMsg]);
  };

  const acceptPartnerRequest = (requestId: string) => {
    setPartnerRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'combinado' as const } : r));
    const target = partnerRequests.find(r => r.id === requestId);
    if (target) {
      openDirectChatWithPlayer(target.playerId);
      setActiveTab('comunidade');
    }
  };

  const sendMessage = (channelId: string, content: string) => {
    if (!content.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      timestamp: 'Agora',
      content: content.trim(),
      channelId,
      isOfficial: currentUser.isOrganizer && channelId === 'avisos-torneios'
    };

    setMessages(prev => [...prev, newMsg]);

    // Update channel snippet
    setChannels(prev => prev.map(c => {
      if (c.id === channelId) {
        return {
          ...c,
          lastMessage: content.slice(0, 45) + (content.length > 45 ? '...' : ''),
          lastMessageTime: 'Agora'
        };
      }
      return c;
    }));
  };

  const openDirectChatWithPlayer = (partnerId: string): string => {
    const partner = players.find(p => p.id === partnerId);
    if (!partner) return 'geral';

    const directId = [currentUser.id, partnerId].sort().join('_');
    const channelId = `dm_${directId}`;

    const existing = channels.find(c => c.id === channelId);
    if (!existing) {
      const newChannel: ChatChannel = {
        id: channelId,
        name: partner.name,
        description: `Chat direto com ${partner.name} (${partner.category})`,
        type: 'direct',
        participantIds: [currentUser.id, partnerId],
        unreadCount: 0,
        lastMessage: 'Conversa iniciada',
        lastMessageTime: 'Agora'
      };
      setChannels(prev => [...prev, newChannel]);
    }

    setActiveChannelId(channelId);
    return channelId;
  };

  const challengePlayer = (challengedId: string) => {
    const challenged = players.find(p => p.id === challengedId);
    if (!challenged) return;

    const directChannelId = openDirectChatWithPlayer(challengedId);
    setActiveChannelId(directChannelId);
    setActiveTab('comunidade');

    // Auto-send a challenge invitation message
    sendMessage(
      directChannelId,
      `🎾 Olá ${challenged.name}! Gostaria de desafiar você para uma partida de Barragem pelo Ranking ${currentUser.category}. Vamos agendar uma data?`
    );
  };

  const resetToDefaults = () => {
    setPlayers(INITIAL_PLAYERS);
    setTournaments(INITIAL_TOURNAMENTS);
    setBookings(INITIAL_BOOKINGS);
    setPartnerRequests(INITIAL_PARTNER_REQUESTS);
    setChannels(INITIAL_CHANNELS);
    setMessages(INITIAL_MESSAGES);
    setCurrentUserId('p1');
    localStorage.clear();
  };

  return (
    <TennisContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        players,
        createPlayer,
        deletePlayer,
        updatePlayer,
        tournaments,
        createTournament,
        registerForTournament,
        unregisterFromTournament,
        generateTournamentBracket,
        updateMatchScore,
        recordDirectMatchResult,
        courts,
        bookings,
        createBooking,
        cancelBooking,
        partnerRequests,
        createPartnerRequest,
        acceptPartnerRequest,
        channels,
        messages,
        activeChannelId,
        setActiveChannelId,
        sendMessage,
        openDirectChatWithPlayer,
        activeTab,
        setActiveTab,
        selectedTournamentId,
        setSelectedTournamentId,
        selectedPlayerId,
        setSelectedPlayerId,
        challengePlayer,
        triggerCelebration,
        resetToDefaults,
        dbStatus,
        isDbConnected: dbStatus.success,
        isDbLoading,
        checkDbStatus,
        initDbSchema,
        fetchDataFromMySQL,
        clearAllPlayersFromDatabase
      }}
    >
      {children}
    </TennisContext.Provider>
  );
};

export const useTennis = () => {
  const context = useContext(TennisContext);
  if (!context) {
    throw new Error('useTennis must be used within a TennisProvider');
  }
  return context;
};
