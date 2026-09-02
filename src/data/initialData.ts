import { Player, Tournament, Court, CourtBooking, ChatChannel, ChatMessage, PartnerRequest } from '../types';

// Array de jogadores inicia vazio para que todos os dados venham exclusivamente da tabela `players` do banco MySQL rica2888_tenisconde
export const INITIAL_PLAYERS: Player[] = [];

export const INITIAL_COURTS: Court[] = [
  {
    id: 'c1',
    name: 'Quadra 1 - Central Guga Kuerten',
    surface: 'Saibro (Clay)',
    isCovered: false,
    hasLights: true,
    hourlyRate: 90,
    photo: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'c2',
    name: 'Quadra 2 - Saibro Rápido',
    surface: 'Saibro (Clay)',
    isCovered: false,
    hasLights: true,
    hourlyRate: 80,
    photo: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'c3',
    name: 'Quadra 3 - US Open Rápida (Piso Asfáltico)',
    surface: 'Rápida (Hard)',
    isCovered: false,
    hasLights: true,
    hourlyRate: 85,
    photo: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'c4',
    name: 'Quadra 4 - Coberta Premium (All-Weather)',
    surface: 'Coberta (Indoor)',
    isCovered: true,
    hasLights: true,
    hourlyRate: 110,
    photo: 'https://images.unsplash.com/photo-1627627256672-027a4613d028?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'c5',
    name: 'Quadra 5 - Wimbledon Grass Experience',
    surface: 'Grama (Grass)',
    isCovered: false,
    hasLights: false,
    hourlyRate: 120,
    photo: 'https://images.unsplash.com/photo-1530915534664-4ac6423797c7?w=500&auto=format&fit=crop&q=80',
  }
];

export const INITIAL_TOURNAMENTS: Tournament[] = [
  {
    id: 'tour1',
    title: 'Torneio Aberto Tennis Condé 2 (2026)',
    bannerImage: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800&auto=format&fit=crop&q=80',
    organizerId: 'org1',
    organizerName: 'Prof. Roberto Camargo',
    category: '1ª Classe (Pro/Avançado)',
    surface: 'Saibro (Clay)',
    clubName: 'Tennis Condé 2 - Residencial Condé II',
    address: 'Alameda dos Ipês, Quadras de Tênis - Condé 2',
    startDate: '2026-09-05',
    endDate: '2026-09-07',
    entryFee: 120,
    prizeDescription: 'Troféu Oficial + R$ 3.500 em premiações e Raqueteira Babolat',
    status: 'em_andamento',
    format: 'eliminatoria_simples',
    maxParticipants: 8,
    registeredPlayerIds: ['p1', 'p2', 'p4', 'p5', 'p7', 'p8'],
    rules: 'Melhor de 3 sets com Super Tie-break no 3º set (10 pontos). Bola oficial: Wilson Roland Garros.',
    matches: [
      // Round 1 (Quartas de Final - 4 matches)
      {
        id: 'm1',
        tournamentId: 'tour1',
        round: 1,
        roundName: 'Quartas de Final',
        matchNumber: 1,
        player1Id: 'p1',
        player2Id: 'p7',
        player1Seed: 1,
        courtId: 'c1',
        courtName: 'Quadra 1 - Central Guga Kuerten',
        scheduledDate: '2026-09-05',
        scheduledTime: '09:00',
        status: 'concluido',
        winnerId: 'p1',
        score: {
          sets: [{ player1Games: 6, player2Games: 2 }, { player1Games: 6, player2Games: 3 }],
          winnerId: 'p1',
          durationMinutes: 75,
          acesP1: 7,
          acesP2: 2,
          doubleFaultsP1: 1,
          doubleFaultsP2: 4,
          unforcedErrorsP1: 12,
          unforcedErrorsP2: 24,
          breakPointsWonP1: 4,
          breakPointsWonP2: 1
        },
        nextMatchId: 'm5'
      },
      {
        id: 'm2',
        tournamentId: 'tour1',
        round: 1,
        roundName: 'Quartas de Final',
        matchNumber: 2,
        player1Id: 'p4',
        player2Id: 'p5',
        courtId: 'c2',
        courtName: 'Quadra 2 - Saibro Rápido',
        scheduledDate: '2026-09-05',
        scheduledTime: '10:30',
        status: 'concluido',
        winnerId: 'p4',
        score: {
          sets: [{ player1Games: 7, player2Games: 5 }, { player1Games: 3, player2Games: 6 }, { player1Games: 10, player2Games: 8 }],
          winnerId: 'p4',
          durationMinutes: 110,
          acesP1: 4,
          acesP2: 5,
          doubleFaultsP1: 3,
          doubleFaultsP2: 2,
          unforcedErrorsP1: 22,
          unforcedErrorsP2: 26,
          breakPointsWonP1: 3,
          breakPointsWonP2: 3
        },
        nextMatchId: 'm5'
      },
      {
        id: 'm3',
        tournamentId: 'tour1',
        round: 1,
        roundName: 'Quartas de Final',
        matchNumber: 3,
        player1Id: 'p8',
        player2Id: 'p2',
        player2Seed: 2,
        courtId: 'c1',
        courtName: 'Quadra 1 - Central Guga Kuerten',
        scheduledDate: '2026-09-05',
        scheduledTime: '14:00',
        status: 'concluido',
        winnerId: 'p2',
        score: {
          sets: [{ player1Games: 4, player2Games: 6 }, { player1Games: 2, player2Games: 6 }],
          winnerId: 'p2',
          durationMinutes: 80,
          acesP1: 3,
          acesP2: 9,
          doubleFaultsP1: 2,
          doubleFaultsP2: 1,
          unforcedErrorsP1: 19,
          unforcedErrorsP2: 14,
          breakPointsWonP1: 1,
          breakPointsWonP2: 4
        },
        nextMatchId: 'm6'
      },
      {
        id: 'm4',
        tournamentId: 'tour1',
        round: 1,
        roundName: 'Quartas de Final',
        matchNumber: 4,
        player1Id: 'p5', // Bye/Qualifier slot
        player2Id: 'p1', // slot
        courtId: 'c2',
        courtName: 'Quadra 2 - Saibro Rápido',
        scheduledDate: '2026-09-05',
        scheduledTime: '15:30',
        status: 'concluido',
        winnerId: 'p5',
        score: {
          sets: [{ player1Games: 6, player2Games: 4 }, { player1Games: 6, player2Games: 4 }],
          winnerId: 'p5',
          durationMinutes: 70
        },
        nextMatchId: 'm6'
      },
      // Round 2 (Semifinais)
      {
        id: 'm5',
        tournamentId: 'tour1',
        round: 2,
        roundName: 'Semifinal 1',
        matchNumber: 5,
        player1Id: 'p1',
        player2Id: 'p4',
        player1Seed: 1,
        courtId: 'c1',
        courtName: 'Quadra 1 - Central Guga Kuerten',
        scheduledDate: '2026-09-06',
        scheduledTime: '10:00',
        status: 'concluido',
        winnerId: 'p1',
        score: {
          sets: [{ player1Games: 6, player2Games: 3 }, { player1Games: 6, player2Games: 4 }],
          winnerId: 'p1',
          durationMinutes: 85,
          acesP1: 8,
          acesP2: 3,
          doubleFaultsP1: 0,
          doubleFaultsP2: 3
        },
        nextMatchId: 'm7'
      },
      {
        id: 'm6',
        tournamentId: 'tour1',
        round: 2,
        roundName: 'Semifinal 2',
        matchNumber: 6,
        player1Id: 'p2',
        player2Id: 'p5',
        player1Seed: 2,
        courtId: 'c1',
        courtName: 'Quadra 1 - Central Guga Kuerten',
        scheduledDate: '2026-09-06',
        scheduledTime: '11:30',
        status: 'concluido',
        winnerId: 'p2',
        score: {
          sets: [{ player1Games: 6, player2Games: 2 }, { player1Games: 6, player2Games: 3 }],
          winnerId: 'p2',
          durationMinutes: 65,
          acesP1: 10,
          acesP2: 2
        },
        nextMatchId: 'm7'
      },
      // Round 3 (Grande Final)
      {
        id: 'm7',
        tournamentId: 'tour1',
        round: 3,
        roundName: 'Grande Final',
        matchNumber: 7,
        player1Id: 'p1',
        player2Id: 'p2',
        player1Seed: 1,
        player2Seed: 2,
        courtId: 'c1',
        courtName: 'Quadra 1 - Central Guga Kuerten',
        scheduledDate: '2026-09-07',
        scheduledTime: '16:00',
        status: 'em_andamento',
        score: {
          sets: [{ player1Games: 6, player2Games: 4 }, { player1Games: 4, player2Games: 6 }],
          winnerId: ''
        }
      }
    ]
  },
  {
    id: 'tour2',
    title: 'Circuito Feminino de Primavera',
    bannerImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=80',
    organizerId: 'org1',
    organizerName: 'Prof. Roberto Camargo',
    category: 'Feminino A',
    surface: 'Rápida (Hard)',
    clubName: 'Academia Winner Tennis',
    address: 'Rua dos Esportistas, 500 - Campinas, SP',
    startDate: '2026-09-18',
    endDate: '2026-09-20',
    entryFee: 100,
    prizeDescription: 'Troféus, Kit Head exclusivo e R$ 2.000 em vouchers esportivos',
    status: 'inscricoes_abertas',
    format: 'eliminatoria_simples',
    maxParticipants: 16,
    registeredPlayerIds: ['p3', 'p6'],
    rules: 'Sets normais de 6 games com tie-break tradicional a 7 pontos no 3º set.',
    matches: []
  },
  {
    id: 'tour3',
    title: 'Torneio Noturno de Duplas Master +45',
    bannerImage: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&auto=format&fit=crop&q=80',
    organizerId: 'org1',
    organizerName: 'Prof. Roberto Camargo',
    category: 'Master +45',
    surface: 'Coberta (Indoor)',
    clubName: 'MatchPoint Tennis Club - São Paulo',
    address: 'Av. das Nações Unidas, 14261 - Morumbi, SP',
    startDate: '2026-09-25',
    endDate: '2026-09-27',
    entryFee: 150,
    prizeDescription: 'Churrasco de premiação + Troféus e Vinhos Especiais para campeões e vices',
    status: 'inscricoes_abertas',
    format: 'grupos_eliminatoria',
    maxParticipants: 12,
    registeredPlayerIds: ['p8', 'p7', 'p5'],
    rules: 'Fase de grupos com 3 duplas por chave, avançando os 2 melhores de cada grupo.',
    matches: []
  }
];

export const INITIAL_BOOKINGS: CourtBooking[] = [
  {
    id: 'b1',
    courtId: 'c1',
    courtName: 'Quadra 1 - Central Guga Kuerten',
    date: '2026-08-22',
    timeSlot: '08:00 - 09:30',
    player1Id: 'p1',
    player2Id: 'p2',
    bookingType: 'barragem_desafio',
    status: 'confirmado',
    notes: 'Desafio válido pelo Ranking da 1ª Classe'
  },
  {
    id: 'b2',
    courtId: 'c2',
    courtName: 'Quadra 2 - Saibro Rápido',
    date: '2026-08-22',
    timeSlot: '10:00 - 11:30',
    player1Id: 'p3',
    player2Id: 'p6',
    bookingType: 'partida_amistosa',
    status: 'confirmado',
    notes: 'Treino preparatório para torneio feminino'
  },
  {
    id: 'b3',
    courtId: 'c4',
    courtName: 'Quadra 4 - Coberta Premium (All-Weather)',
    date: '2026-08-22',
    timeSlot: '18:00 - 19:30',
    player1Id: 'p4',
    bookingType: 'partida_amistosa',
    status: 'pendente_parceiro',
    notes: 'Buscando adversário de 2ª ou 3ª classe'
  },
  {
    id: 'b4',
    courtId: 'c3',
    courtName: 'Quadra 3 - US Open Rápida (Piso Asfáltico)',
    date: '2026-08-23',
    timeSlot: '09:00 - 10:30',
    player1Id: 'p8',
    player2Id: 'p7',
    bookingType: 'treino_aula',
    status: 'confirmado',
    notes: 'Aula com Prof. Roberto'
  }
];

export const INITIAL_CHANNELS: ChatChannel[] = [
  {
    id: 'avisos-torneios',
    name: '📢 Comunicados da Diretoria',
    description: 'Avisos oficiais, chaveamentos, regras e status de chuva das quadras',
    type: 'announcements',
    unreadCount: 1,
    lastMessage: 'Atenção tenistas: As quadras de saibro estão 100% liberadas para o final de semana!',
    lastMessageTime: '11:45'
  },
  {
    id: 'geral',
    name: '🎾 Resenha dos Tenistas (Geral)',
    description: 'Bate-papo comunitário, combinação de jogos e dicas de equipamentos',
    type: 'public_group',
    unreadCount: 0,
    lastMessage: 'Alguém disponível para bater bola amanhã cedo na quadra de saibro?',
    lastMessageTime: '12:15'
  },
  {
    id: 'dm_p1_p2',
    name: 'Gabriel Medina',
    description: 'Chat direto',
    type: 'direct',
    participantIds: ['p1', 'p2'],
    unreadCount: 0,
    lastMessage: 'Combinado! Sexta às 18h na Quadra Central. Levo as bolas novas.',
    lastMessageTime: 'Ontem'
  },
  {
    id: 'dm_p1_p3',
    name: 'Marina Fontes Costa',
    description: 'Chat direto',
    type: 'direct',
    participantIds: ['p1', 'p3'],
    unreadCount: 0,
    lastMessage: 'Parabéns pela vitória no último jogo! Jogou muito.',
    lastMessageTime: 'Há 2 dias'
  }
];

export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'm1',
    senderId: 'org1',
    senderName: 'Prof. Roberto Camargo (Diretor Técnico)',
    senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    timestamp: 'Hoje, 09:30',
    content: '🏆 Inscrições abertas para o Torneio Noturno de Duplas Master +45! Vagas limitadas a 12 duplas.',
    channelId: 'avisos-torneios',
    isOfficial: true
  },
  {
    id: 'm2',
    senderId: 'org1',
    senderName: 'Prof. Roberto Camargo (Diretor Técnico)',
    senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    timestamp: 'Hoje, 11:45',
    content: 'Atenção tenistas: As quadras de saibro estão 100% liberadas para o final de semana!',
    channelId: 'avisos-torneios',
    isOfficial: true
  },
  {
    id: 'm3',
    senderId: 'p4',
    senderName: 'Lucas Zanetti Oliveira',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    timestamp: 'Hoje, 10:15',
    content: 'Pessoal, acabei de encordoar minha raquete com Luxilon Alu Power a 52 lbs. Ficou sensacional o controle!',
    channelId: 'geral'
  },
  {
    id: 'm4',
    senderId: 'p7',
    senderName: 'Bruno Pires Carvalho',
    senderAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    timestamp: 'Hoje, 12:15',
    content: 'Alguém disponível para bater bola amanhã cedo na quadra de saibro?',
    channelId: 'geral'
  },
  {
    id: 'm5',
    senderId: 'p2',
    senderName: 'Gabriel Medina Ramos',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    timestamp: 'Ontem, 17:40',
    content: 'E aí Carlos, vamos jogar nosso confronto da barragem nessa sexta?',
    channelId: 'dm_p1_p2'
  },
  {
    id: 'm6',
    senderId: 'p1',
    senderName: 'Carlos Alcaraz Silva',
    senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    timestamp: 'Ontem, 17:45',
    content: 'Combinado! Sexta às 18h na Quadra Central. Levo as bolas novas.',
    channelId: 'dm_p1_p2'
  }
];

export const INITIAL_PARTNER_REQUESTS: PartnerRequest[] = [
  {
    id: 'pr1',
    playerId: 'p4',
    playerName: 'Lucas Zanetti Oliveira',
    playerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    category: '2ª Classe (Intermediário Alto)',
    preferredDate: 'Amanhã (Sábado)',
    preferredTime: '08:30 ou 09:00',
    courtSurface: 'Saibro (Clay)',
    clubLocation: 'MatchPoint Tennis Club',
    description: 'Procuro parceiro de 2ª ou 3ª classe para jogo em melhor de 3 sets com Super Tie-break. Bolas novas por minha conta.',
    createdAt: 'Hoje às 10:00',
    status: 'aberto'
  },
  {
    id: 'pr2',
    playerId: 'p6',
    playerName: 'Juliana Paes Barreto',
    playerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    category: 'Feminino A',
    preferredDate: 'Domingo',
    preferredTime: '17:00',
    courtSurface: 'Rápida (Hard)',
    clubLocation: 'MatchPoint Tennis Club',
    description: 'Treino de drills e troca de bolas de fundo + tie-breaks de treino feminino.',
    createdAt: 'Hoje às 11:30',
    status: 'aberto'
  }
];
