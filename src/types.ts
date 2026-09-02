export type PlayerCategory = 
  | '1ª Classe (Pro/Avançado)' 
  | '2ª Classe (Intermediário Alto)' 
  | '3ª Classe (Intermediário)' 
  | '4ª Classe (Iniciante Avançado)' 
  | '5ª Classe (Principiante)' 
  | 'Feminino A' 
  | 'Feminino B' 
  | 'Master +45' 
  | 'Duplas Open';

export type CourtSurface = 'Saibro (Clay)' | 'Rápida (Hard)' | 'Grama (Grass)' | 'Coberta (Indoor)';

export interface Player {
  id: string;
  name: string;
  avatar: string;
  category: PlayerCategory;
  points: number;
  rank: number;
  matchesPlayed: number;
  wins: number;
  losses: number;
  dominantHand: 'Destro' | 'Canhoto';
  backhand: 'Uma Mão' | 'Duas Mãos';
  racket: string;
  club: string;
  location: string;
  phone: string;
  email: string;
  utrRating: number;
  streak: number; // positive for wins, negative for losses
  isOrganizer?: boolean;
}

export interface SetScore {
  player1Games: number;
  player2Games: number;
  tiebreakPlayer1?: number;
  tiebreakPlayer2?: number;
}

export interface MatchScoreDetails {
  sets: SetScore[];
  winnerId: string;
  durationMinutes?: number;
  acesP1?: number;
  acesP2?: number;
  doubleFaultsP1?: number;
  doubleFaultsP2?: number;
  unforcedErrorsP1?: number;
  unforcedErrorsP2?: number;
  breakPointsWonP1?: number;
  breakPointsWonP2?: number;
}

export type MatchStatus = 'agendado' | 'em_andamento' | 'concluido' | 'cancelado';

export interface TournamentMatch {
  id: string;
  tournamentId: string;
  round: number; // 1 = 1st round, 2 = QF, 3 = SF, 4 = Final
  roundName: string;
  matchNumber: number;
  player1Id?: string;
  player2Id?: string;
  player1Seed?: number;
  player2Seed?: number;
  courtId?: string;
  courtName?: string;
  scheduledTime?: string;
  scheduledDate?: string;
  status: MatchStatus;
  score?: MatchScoreDetails;
  winnerId?: string;
  nextMatchId?: string;
}

export type TournamentFormat = 'eliminatoria_simples' | 'grupos_eliminatoria' | 'todos_contra_todos';

export type TournamentStatus = 'inscricoes_abertas' | 'em_andamento' | 'concluido';

export interface Tournament {
  id: string;
  title: string;
  bannerImage: string;
  organizerId: string;
  organizerName: string;
  category: PlayerCategory;
  surface: CourtSurface;
  clubName: string;
  address: string;
  startDate: string;
  endDate: string;
  entryFee: number;
  prizeDescription: string;
  status: TournamentStatus;
  format: TournamentFormat;
  maxParticipants: number;
  registeredPlayerIds: string[];
  matches: TournamentMatch[];
  rules?: string;
}

export interface Court {
  id: string;
  name: string;
  surface: CourtSurface;
  isCovered: boolean;
  hasLights: boolean;
  hourlyRate: number;
  photo: string;
}

export interface CourtBooking {
  id: string;
  courtId: string;
  courtName: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "18:00 - 19:30"
  player1Id: string;
  player2Id?: string;
  bookingType: 'partida_amistosa' | 'torneio' | 'barragem_desafio' | 'treino_aula';
  status: 'confirmado' | 'pendente_parceiro' | 'cancelado';
  notes?: string;
}

export interface LadderChallenge {
  id: string;
  challengerId: string;
  defenderId: string;
  challengeDate: string;
  status: 'pendente' | 'aceito' | 'recusado' | 'concluido';
  matchDate?: string;
  courtId?: string;
  winnerId?: string;
  score?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  timestamp: string;
  content: string;
  channelId: string; // e.g., "geral", "avisos-torneios", or a direct chat id like "dm_p1_p2"
  isOfficial?: boolean;
}

export interface ChatChannel {
  id: string;
  name: string;
  description: string;
  type: 'public_group' | 'announcements' | 'direct';
  participantIds?: string[];
  unreadCount?: number;
  lastMessage?: string;
  lastMessageTime?: string;
}

export interface PartnerRequest {
  id: string;
  playerId: string;
  playerName: string;
  playerAvatar: string;
  category: PlayerCategory;
  preferredDate: string;
  preferredTime: string;
  courtSurface: CourtSurface;
  clubLocation: string;
  description: string;
  createdAt: string;
  status: 'aberto' | 'combinado';
}
