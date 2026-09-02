import React, { useState } from 'react';
import { useTennis } from '../context/TennisContext';
import { Court, CourtBooking, CourtSurface } from '../types';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Plus, 
  Users, 
  CheckCircle2, 
  Sun, 
  Moon, 
  Flame, 
  Filter, 
  Sparkles, 
  AlertCircle,
  X,
  MessageSquare
} from 'lucide-react';

interface ScheduleViewProps {
  onOpenBookingModal: (preselectedCourtId?: string, preselectedTime?: string) => void;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({ onOpenBookingModal }) => {
  const { 
    courts, 
    bookings, 
    currentUser, 
    players, 
    cancelBooking, 
    partnerRequests, 
    acceptPartnerRequest, 
    createPartnerRequest,
    setSelectedPlayerId
  } = useTennis();

  // Selected date (defaults to tomorrow 2026-08-22 or today)
  const [selectedDate, setSelectedDate] = useState<string>('2026-08-22');
  const [surfaceFilter, setSurfaceFilter] = useState<string>('all');
  const [showPartnerModal, setShowPartnerModal] = useState<boolean>(false);

  // New partner request form state
  const [partnerDate, setPartnerDate] = useState<string>('Sábado (Amanhã)');
  const [partnerTime, setPartnerTime] = useState<string>('09:00');
  const [partnerSurface, setPartnerSurface] = useState<CourtSurface>('Saibro (Clay)');
  const [partnerDescription, setPartnerDescription] = useState<string>('');

  const timeSlots = [
    '07:00 - 08:30',
    '08:30 - 10:00',
    '10:00 - 11:30',
    '11:30 - 13:00',
    '14:00 - 15:30',
    '15:30 - 17:00',
    '17:00 - 18:30',
    '18:30 - 20:00',
    '20:00 - 21:30'
  ];

  const filteredCourts = courts.filter(c => {
    if (surfaceFilter === 'all') return true;
    return c.surface.includes(surfaceFilter);
  });

  const getPlayer = (id?: string) => players.find(p => p.id === id);

  const handleCreatePartnerRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerDescription.trim()) return;

    createPartnerRequest({
      preferredDate: partnerDate,
      preferredTime: partnerTime,
      courtSurface: partnerSurface,
      clubLocation: 'MatchPoint Tennis Club - São Paulo',
      description: partnerDescription
    });

    setShowPartnerModal(false);
    setPartnerDescription('');
  };

  const getBookingTypeBadge = (type: string) => {
    switch (type) {
      case 'torneio':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">Torneio</span>;
      case 'barragem_desafio':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">Barragem</span>;
      case 'treino_aula':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30">Aula</span>;
      default:
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/30">Amistoso</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-emerald-900 via-slate-900 to-slate-900 p-6 rounded-3xl text-white shadow-xl border border-emerald-900/50">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Quadras & Agendamento
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Grade de Horários & Locação de Quadras
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl mt-1">
            Reserve horários nas quadras de Saibro, Rápida e Cobertas, marque desafios e encontre parceiros de jogo.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-open-partner-modal"
            onClick={() => setShowPartnerModal(true)}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold px-3.5 py-2.5 rounded-xl text-xs transition-colors border border-slate-700"
          >
            <Users className="w-4 h-4 text-emerald-400" />
            Buscar Parceiro(a)
          </button>
          <button
            id="btn-open-booking-direct"
            onClick={() => onOpenBookingModal()}
            className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs transition-all shadow-lg hover:shadow-emerald-500/25 shrink-0"
          >
            <Plus className="w-4 h-4" />
            Nova Reserva
          </button>
        </div>
      </div>

      {/* Date Switcher & Surface Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        
        {/* Date pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {[
            { label: 'Hoje', val: '2026-08-21' },
            { label: 'Amanhã (Sábado)', val: '2026-08-22' },
            { label: 'Domingo', val: '2026-08-23' },
            { label: 'Segunda', val: '2026-08-24' },
            { label: 'Terça', val: '2026-08-25' },
          ].map(d => (
            <button
              key={d.val}
              onClick={() => setSelectedDate(d.val)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedDate === d.val
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        {/* Surface Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={surfaceFilter}
            onChange={(e) => setSurfaceFilter(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs py-1.5 px-3 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">Todas as Quadras</option>
            <option value="Saibro">Saibro (Clay)</option>
            <option value="Rápida">Rápida (Hard)</option>
            <option value="Coberta">Coberta (Indoor)</option>
            <option value="Grama">Grama (Grass)</option>
          </select>
        </div>

      </div>

      {/* Courts & Time Slots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourts.map(court => {
          // Find bookings for this court and date
          const courtBookings = bookings.filter(b => b.courtId === court.id && b.date === selectedDate);

          return (
            <div 
              key={court.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col"
            >
              {/* Court Header Card */}
              <div className="relative h-32 w-full overflow-hidden bg-slate-900">
                <img 
                  src={court.photo} 
                  alt={court.name} 
                  className="w-full h-full object-cover opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-500/40">
                      {court.surface}
                    </span>
                    <span className="text-xs font-black text-amber-300">
                      R$ {court.hourlyRate}/h
                    </span>
                  </div>
                  <h3 className="font-extrabold text-sm text-white truncate mt-1">
                    {court.name}
                  </h3>
                </div>
              </div>

              {/* Court Features */}
              <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>{court.isCovered ? '🛡️ Coberta' : '☀️ Aberta'}</span>
                <span>{court.hasLights ? '💡 Iluminação Noturna' : 'Sem luz'}</span>
              </div>

              {/* Time Slots for the day */}
              <div className="p-4 space-y-2 flex-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Horários em {selectedDate}
                </p>

                <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                  {timeSlots.map(slot => {
                    const booking = courtBookings.find(b => b.timeSlot.startsWith(slot.split(' - ')[0]));
                    const p1 = booking ? getPlayer(booking.player1Id) : null;
                    const p2 = booking?.player2Id ? getPlayer(booking.player2Id) : null;
                    const isMyBooking = booking?.player1Id === currentUser.id || booking?.player2Id === currentUser.id;

                    if (booking) {
                      return (
                        <div 
                          key={slot}
                          className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                            isMyBooking 
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 text-emerald-950 dark:text-emerald-200 font-medium' 
                              : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <span className="font-mono font-bold text-[11px]">{slot}</span>
                              {getBookingTypeBadge(booking.bookingType)}
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[170px]">
                              {p1 ? p1.name.split(' ')[0] : 'Tenista'} {p2 ? `vs ${p2.name.split(' ')[0]}` : ''}
                            </p>
                          </div>

                          {isMyBooking && (
                            <button
                              onClick={() => cancelBooking(booking.id)}
                              className="text-[10px] text-red-600 hover:text-red-700 dark:text-red-400 font-bold px-1.5 py-0.5 rounded bg-red-100/60 dark:bg-red-950/50"
                              title="Cancelar Reserva"
                            >
                              Cancelar
                            </button>
                          )}
                        </div>
                      );
                    }

                    // Available Slot
                    return (
                      <div 
                        key={slot}
                        className="p-2 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 flex items-center justify-between text-xs transition-colors bg-white dark:bg-slate-900 group"
                      >
                        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                          <Clock className="w-3 h-3 text-emerald-500" />
                          <span className="font-mono">{slot}</span>
                        </div>
                        <button
                          onClick={() => onOpenBookingModal(court.id, slot)}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 dark:bg-slate-800 group-hover:bg-emerald-600 group-hover:text-white text-slate-700 dark:text-slate-300 transition-colors"
                        >
                          Reservar
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Partner Bulletin Board (Mural de Parceiros) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Mural de Parceiros (Buscando Adversário)
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tenistas procurando alguém no mesmo nível para bater bola ou jogar partida amistosa
            </p>
          </div>

          <button
            onClick={() => setShowPartnerModal(true)}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
          >
            + Publicar Pedido
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {partnerRequests.map(req => {
            const isMe = req.playerId === currentUser.id;
            return (
              <div 
                key={req.id}
                className={`p-4 rounded-2xl border transition-all ${
                  req.status === 'combinado'
                    ? 'bg-slate-50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 opacity-60'
                    : 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60 shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div 
                    className="flex items-center gap-2.5 cursor-pointer"
                    onClick={() => setSelectedPlayerId(req.playerId)}
                  >
                    <img src={req.playerAvatar} alt={req.playerName} className="w-9 h-9 rounded-full object-cover border border-emerald-400" />
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                        {req.playerName}
                      </h4>
                      <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">
                        {req.category}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] text-slate-400">
                    {req.createdAt}
                  </span>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 mb-3 bg-white/80 dark:bg-slate-900/80 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 leading-relaxed">
                  "{req.description}"
                </p>

                <div className="flex items-center justify-between text-xs pt-1">
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <span>📅 {req.preferredDate}</span>
                    <span>⏰ {req.preferredTime}</span>
                    <span>🎾 {req.courtSurface.split(' ')[0]}</span>
                  </div>

                  {!isMe && req.status === 'aberto' && (
                    <button
                      onClick={() => acceptPartnerRequest(req.id)}
                      className="px-3 py-1 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1 shadow transition-colors"
                    >
                      <MessageSquare className="w-3 h-3" /> Combinar Jogo
                    </button>
                  )}
                  {req.status === 'combinado' && (
                    <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Jogo Combinado!
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal: Create Partner Request */}
      {showPartnerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-base flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" />
                Buscar Parceiro de Tênis
              </h3>
              <button onClick={() => setShowPartnerModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePartnerRequest} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Dia de preferência</label>
                <input
                  type="text"
                  value={partnerDate}
                  onChange={(e) => setPartnerDate(e.target.value)}
                  placeholder="Ex: Sábado de manhã, Domingo às 16h..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Horário desejado</label>
                  <input
                    type="text"
                    value={partnerTime}
                    onChange={(e) => setPartnerTime(e.target.value)}
                    placeholder="Ex: 08:30 ou 18:00"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Superfície</label>
                  <select
                    value={partnerSurface}
                    onChange={(e) => setPartnerSurface(e.target.value as CourtSurface)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  >
                    <option value="Saibro (Clay)">Saibro (Clay)</option>
                    <option value="Rápida (Hard)">Rápida (Hard)</option>
                    <option value="Coberta (Indoor)">Coberta (Indoor)</option>
                    <option value="Grama (Grass)">Grama (Grass)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Descrição / Tipo de Jogo</label>
                <textarea
                  rows={3}
                  value={partnerDescription}
                  onChange={(e) => setPartnerDescription(e.target.value)}
                  placeholder="Ex: Procuro adversário para jogo de 2 sets normais + super tie-break. Nível intermediário/avançado. Dividimos o valor da quadra."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-sm transition-colors shadow-lg"
              >
                Publicar no Mural e Notificar Tenistas
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
