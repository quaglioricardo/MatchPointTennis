import React, { useState } from 'react';
import { useTennis } from '../context/TennisContext';
import { Court, CourtBooking } from '../types';
import { Calendar, Clock, X, MapPin, Users, CheckCircle, ShieldCheck } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCourtId?: string;
  initialTimeSlot?: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  initialCourtId,
  initialTimeSlot
}) => {
  const { courts, players, currentUser, createBooking } = useTennis();

  const [courtId, setCourtId] = useState<string>(initialCourtId || courts[0]?.id || 'c1');
  const [date, setDate] = useState<string>('2026-08-22');
  const [timeSlot, setTimeSlot] = useState<string>(initialTimeSlot || '08:30 - 10:00');
  const [player2Id, setPlayer2Id] = useState<string>('p2');
  const [bookingType, setBookingType] = useState<'partida_amistosa' | 'barragem_desafio' | 'torneio' | 'treino_aula'>('partida_amistosa');
  const [notes, setNotes] = useState<string>('');

  if (!isOpen) return null;

  const selectedCourt = courts.find(c => c.id === courtId) || courts[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createBooking({
      courtId: selectedCourt.id,
      courtName: selectedCourt.name,
      date,
      timeSlot,
      player1Id: currentUser.id,
      player2Id: player2Id || undefined,
      bookingType,
      status: 'confirmado',
      notes: notes.trim() || undefined
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-3xl p-6 shadow-2xl text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-extrabold text-base text-white">
                Reservar Horário de Quadra
              </h3>
              <p className="text-xs text-slate-400">
                MatchPoint Tennis Club
              </p>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-bold mb-1">Selecionar Quadra *</label>
            <select
              value={courtId}
              onChange={(e) => setCourtId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
            >
              {courts.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.surface}) - R$ {c.hourlyRate}/h
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Data *</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Horário *</label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="07:00 - 08:30">07:00 - 08:30</option>
                <option value="08:30 - 10:00">08:30 - 10:00</option>
                <option value="10:00 - 11:30">10:00 - 11:30</option>
                <option value="11:30 - 13:00">11:30 - 13:00</option>
                <option value="14:00 - 15:30">14:00 - 15:30</option>
                <option value="15:30 - 17:00">15:30 - 17:00</option>
                <option value="17:00 - 18:30">17:00 - 18:30</option>
                <option value="18:30 - 20:00">18:30 - 20:00</option>
                <option value="20:00 - 21:30">20:00 - 21:30</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Tipo de Partida</label>
              <select
                value={bookingType}
                onChange={(e) => setBookingType(e.target.value as any)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="partida_amistosa">Jogo Amistoso</option>
                <option value="barragem_desafio">Desafio de Barragem</option>
                <option value="torneio">Torneio Oficial</option>
                <option value="treino_aula">Treino / Aula</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Adversário / Parceiro</label>
              <select
                value={player2Id}
                onChange={(e) => setPlayer2Id(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="">A definir / Procurando</option>
                {players.filter(p => p.id !== currentUser.id).map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.category.split(' ')[0]})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Observações adicionais</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Levarei tubo de bolas lacrado..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-sm transition-all shadow-lg mt-2"
          >
            Confirmar Reserva na Quadra
          </button>
        </form>

      </div>
    </div>
  );
};
