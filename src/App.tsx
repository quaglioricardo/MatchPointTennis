import React, { useState } from 'react';
import { TennisProvider, useTennis } from './context/TennisContext';
import { Navbar } from './components/Navbar';
import { TournamentsView } from './components/TournamentsView';
import { RankingsView } from './components/RankingsView';
import { PlayersDirectoryView } from './components/PlayersDirectoryView';
import { LiveScorerView } from './components/LiveScorerView';
import { ScheduleView } from './components/ScheduleView';
import { ChatView } from './components/ChatView';
import { HeadToHeadView } from './components/HeadToHeadView';
import { CreateTournamentModal } from './components/CreateTournamentModal';
import { RegisterPlayerModal } from './components/RegisterPlayerModal';
import { ScoreMatchModal } from './components/ScoreMatchModal';
import { LiveScorerModal } from './components/LiveScorerModal';
import { BookingModal } from './components/BookingModal';
import { PlayerProfileModal } from './components/PlayerProfileModal';
import { DomainIntegrationModal } from './components/DomainIntegrationModal';
import { TournamentMatch, Player } from './types';
import { Trophy, Award, Calendar, MessageSquare, Radio, Swords, RotateCcw, Users, Globe } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    resetToDefaults, 
    currentUser,
    tournaments
  } = useTennis();

  // Modals state
  const [isCreateTournamentOpen, setIsCreateTournamentOpen] = useState(false);
  const [isRegisterPlayerOpen, setIsRegisterPlayerOpen] = useState(false);
  const [isDomainModalOpen, setIsDomainModalOpen] = useState(false);
  const [playerToEdit, setPlayerToEdit] = useState<Player | null>(null);

  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingCourtId, setBookingCourtId] = useState<string | undefined>(undefined);
  const [bookingTimeSlot, setBookingTimeSlot] = useState<string | undefined>(undefined);

  const [scoreModalMatch, setScoreModalMatch] = useState<TournamentMatch | null>(null);
  const [scoreModalTourId, setScoreModalTourId] = useState<string>('tour1');
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);

  const [liveScorerMatch, setLiveScorerMatch] = useState<TournamentMatch | null>(null);
  const [liveScorerTourId, setLiveScorerTourId] = useState<string | undefined>(undefined);
  const [liveScorerInitialMode, setLiveScorerInitialMode] = useState<'point_by_point' | 'direct_score'>('point_by_point');
  const [isLiveScorerOpen, setIsLiveScorerOpen] = useState(false);

  const handleOpenScoreModal = (match: TournamentMatch, tournamentId: string) => {
    setScoreModalMatch(match);
    setScoreModalTourId(tournamentId);
    setIsScoreModalOpen(true);
  };

  const handleOpenLiveScorer = (
    match?: TournamentMatch, 
    tournamentId?: string, 
    initialMode: 'point_by_point' | 'direct_score' = 'point_by_point'
  ) => {
    setLiveScorerMatch(match || null);
    setLiveScorerTourId(tournamentId);
    setLiveScorerInitialMode(initialMode);
    setIsLiveScorerOpen(true);
  };

  const handleOpenBookingModal = (courtId?: string, timeSlot?: string) => {
    setBookingCourtId(courtId);
    setBookingTimeSlot(timeSlot);
    setIsBookingOpen(true);
  };

  const handleOpenRegisterPlayer = (player?: Player) => {
    setPlayerToEdit(player || null);
    setIsRegisterPlayerOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Top Navigation */}
      <Navbar
        onOpenCreateTournament={() => setIsCreateTournamentOpen(true)}
        onOpenNewBooking={() => handleOpenBookingModal()}
        onOpenRegisterPlayer={() => handleOpenRegisterPlayer()}
        onOpenDomainModal={() => setIsDomainModalOpen(true)}
      />

      {/* Main Container Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'torneios' && (
          <TournamentsView
            onOpenCreateModal={() => setIsCreateTournamentOpen(true)}
            onOpenScoreModal={handleOpenScoreModal}
            onOpenLiveScorer={(m, tid) => handleOpenLiveScorer(m, tid)}
          />
        )}

        {activeTab === 'rankings' && (
          <RankingsView
            onOpenH2H={(p1, p2) => setActiveTab('confrontos')}
            onOpenRegisterModal={() => handleOpenRegisterPlayer()}
          />
        )}

        {activeTab === 'jogadores' && (
          <PlayersDirectoryView
            onOpenRegisterModal={(p) => handleOpenRegisterPlayer(p)}
          />
        )}

        {activeTab === 'quadras' && (
          <ScheduleView
            onOpenBookingModal={handleOpenBookingModal}
          />
        )}

        {activeTab === 'comunidade' && (
          <ChatView
            onOpenBookingModalWithPartner={(pId) => handleOpenBookingModal()}
          />
        )}

        {activeTab === 'confrontos' && (
          <HeadToHeadView />
        )}

        {activeTab === 'placar_ao_vivo' && (
          <LiveScorerView
            onOpenLiveScorer={handleOpenLiveScorer}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 py-6 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-900 dark:text-white">Tennis Condé 2</span>
            <span>• Hub Oficial de Torneios & Rankings (tennisconde2.com)</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDomainModalOpen(true)}
              className="text-emerald-600 dark:text-emerald-400 hover:underline font-bold flex items-center gap-1"
            >
              <Globe className="w-3.5 h-3.5" /> Guia de Integração Web
            </button>
            <button
              onClick={resetToDefaults}
              className="text-slate-400 hover:text-red-500 text-xs flex items-center gap-1 transition-colors"
              title="Restaurar dados iniciais de exemplo"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Restaurar Dados de Exemplo
            </button>
          </div>
        </div>
      </footer>

      {/* Modals Container */}
      <DomainIntegrationModal
        isOpen={isDomainModalOpen}
        onClose={() => setIsDomainModalOpen(false)}
      />

      <CreateTournamentModal
        isOpen={isCreateTournamentOpen}
        onClose={() => setIsCreateTournamentOpen(false)}
      />

      <RegisterPlayerModal
        isOpen={isRegisterPlayerOpen}
        onClose={() => {
          setIsRegisterPlayerOpen(false);
          setPlayerToEdit(null);
        }}
        playerToEdit={playerToEdit}
      />

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialCourtId={bookingCourtId}
        initialTimeSlot={bookingTimeSlot}
      />

      <ScoreMatchModal
        isOpen={isScoreModalOpen}
        onClose={() => setIsScoreModalOpen(false)}
        match={scoreModalMatch}
        tournamentId={scoreModalTourId}
      />

      <LiveScorerModal
        isOpen={isLiveScorerOpen}
        onClose={() => setIsLiveScorerOpen(false)}
        tournamentId={liveScorerTourId}
        match={liveScorerMatch}
        initialMode={liveScorerInitialMode}
      />

      <PlayerProfileModal
        onEditPlayer={(p) => handleOpenRegisterPlayer(p)}
      />

    </div>
  );
};

export default function App() {
  return (
    <TennisProvider>
      <MainAppContent />
    </TennisProvider>
  );
}
