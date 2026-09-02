import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { testConnection, initDatabase, getDbPool } from './server/db.js';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Allow embed & CORS for https://tennisconde2.com and subdomains
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    // Allow iframe embedding on tennisconde2.com
    res.setHeader('Content-Security-Policy', "frame-ancestors 'self' https://tennisconde2.com https://*.tennisconde2.com *;");
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // =========================================================================
  // API ROUTES (DATABASE & REST ENDPOINTS)
  // =========================================================================

  // 1. Health check & DB Status
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  app.get('/api/db/status', async (req, res) => {
    const result = await testConnection();
    res.json(result);
  });

  app.post('/api/db/init', async (req, res) => {
    const result = await initDatabase();
    res.json(result);
  });

  // 2. Players API
  app.get('/api/players', async (req, res) => {
    try {
      const db = getDbPool();
      const [rows]: any = await db.query('SELECT * FROM players ORDER BY rank_pos ASC, points DESC');
      const formatted = rows.map((r: any) => ({
        id: r.id,
        name: r.name,
        avatar: r.avatar,
        category: r.category,
        points: r.points,
        rank: r.rank_pos,
        matchesPlayed: r.matches_played,
        wins: r.wins,
        losses: r.losses,
        dominantHand: r.dominant_hand,
        backhand: r.backhand,
        racket: r.racket,
        club: r.club,
        location: r.location,
        phone: r.phone,
        email: r.email,
        utrRating: Number(r.utr_rating),
        streak: r.streak,
        isOrganizer: Boolean(r.is_organizer)
      }));
      res.json({ success: true, data: formatted });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post('/api/players', async (req, res) => {
    try {
      const db = getDbPool();
      const p = req.body;
      await db.query(`
        INSERT INTO players (id, name, avatar, category, points, rank_pos, matches_played, wins, losses, dominant_hand, backhand, racket, club, location, phone, email, utr_rating, streak, is_organizer)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE 
          name=VALUES(name), avatar=VALUES(avatar), category=VALUES(category), points=VALUES(points),
          rank_pos=VALUES(rank_pos), matches_played=VALUES(matches_played), wins=VALUES(wins), losses=VALUES(losses),
          dominant_hand=VALUES(dominant_hand), backhand=VALUES(backhand), racket=VALUES(racket),
          club=VALUES(club), location=VALUES(location), phone=VALUES(phone), email=VALUES(email),
          utr_rating=VALUES(utr_rating), streak=VALUES(streak), is_organizer=VALUES(is_organizer)
      `, [
        p.id, p.name, p.avatar || '', p.category, p.points ?? 1000, p.rank ?? 1, p.matchesPlayed ?? 0, p.wins ?? 0, p.losses ?? 0,
        p.dominantHand || 'Destro', p.backhand || 'Duas Mãos', p.racket || '', p.club || 'Tennis Condé 2', p.location || 'São Paulo, SP', p.phone || '', p.email || '', p.utrRating ?? 6.0, p.streak ?? 0, !!p.isOrganizer
      ]);
      res.json({ success: true, player: p });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.delete('/api/players/:id', async (req, res) => {
    try {
      const db = getDbPool();
      const { id } = req.params;
      await db.query('DELETE FROM players WHERE id = ?', [id]);
      res.json({ success: true, message: `Jogador ${id} removido da tabela players do MySQL rica2888_tenisconde` });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.delete('/api/players', async (req, res) => {
    try {
      const db = getDbPool();
      await db.query('DELETE FROM players');
      res.json({ success: true, message: 'Todos os registros de jogadores foram removidos da tabela players do MySQL rica2888_tenisconde' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post('/api/players/clear-all', async (req, res) => {
    try {
      const db = getDbPool();
      await db.query('DELETE FROM players');
      res.json({ success: true, message: 'Tabela players limpa com sucesso!' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // 3. Tournaments API
  app.get('/api/tournaments', async (req, res) => {
    try {
      const db = getDbPool();
      const [tournaments]: any = await db.query('SELECT * FROM tournaments ORDER BY start_date DESC');
      const [participants]: any = await db.query('SELECT * FROM tournament_participants');
      const [matches]: any = await db.query('SELECT * FROM tournament_matches ORDER BY round_num ASC, match_number ASC');

      const formatted = tournaments.map((t: any) => {
        const tParticipants = participants.filter((p: any) => p.tournament_id === t.id).map((p: any) => p.player_id);
        const tMatches = matches.filter((m: any) => m.tournament_id === t.id).map((m: any) => ({
          id: m.id,
          tournamentId: m.tournament_id,
          round: m.round_num,
          roundName: m.round_name,
          matchNumber: m.match_number,
          player1Id: m.player1_id || undefined,
          player2Id: m.player2_id || undefined,
          player1Seed: m.player1_seed || undefined,
          player2Seed: m.player2_seed || undefined,
          courtId: m.court_id || undefined,
          courtName: m.court_name || undefined,
          scheduledTime: m.scheduled_time || undefined,
          scheduledDate: m.scheduled_date || undefined,
          status: m.status,
          score: m.score_json ? (typeof m.score_json === 'string' ? JSON.parse(m.score_json) : m.score_json) : undefined,
          winnerId: m.winner_id || undefined,
          nextMatchId: m.next_match_id || undefined,
        }));

        return {
          id: t.id,
          title: t.title,
          bannerImage: t.banner_image,
          organizerId: t.organizer_id,
          organizerName: t.organizer_name,
          category: t.category,
          surface: t.surface,
          clubName: t.club_name,
          address: t.address,
          startDate: t.start_date,
          endDate: t.end_date,
          entryFee: Number(t.entry_fee),
          prizeDescription: t.prize_description,
          status: t.status,
          format: t.format,
          maxParticipants: t.max_participants,
          registeredPlayerIds: tParticipants,
          matches: tMatches,
          rules: t.rules
        };
      });

      res.json({ success: true, data: formatted });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post('/api/tournaments', async (req, res) => {
    try {
      const db = getDbPool();
      const t = req.body;
      await db.query(`
        INSERT INTO tournaments (id, title, banner_image, organizer_id, organizer_name, category, surface, club_name, address, start_date, end_date, entry_fee, prize_description, status, format, max_participants, rules)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE 
          title=VALUES(title), banner_image=VALUES(banner_image), category=VALUES(category), surface=VALUES(surface),
          status=VALUES(status), rules=VALUES(rules)
      `, [
        t.id, t.title, t.bannerImage, t.organizerId, t.organizerName, t.category, t.surface,
        t.clubName, t.address, t.startDate, t.endDate, t.entryFee, t.prizeDescription,
        t.status, t.format, t.maxParticipants, t.rules || ''
      ]);

      if (Array.isArray(t.registeredPlayerIds)) {
        for (const pid of t.registeredPlayerIds) {
          await db.query(`INSERT IGNORE INTO tournament_participants (tournament_id, player_id) VALUES (?, ?)`, [t.id, pid]);
        }
      }

      if (Array.isArray(t.matches)) {
        for (const m of t.matches) {
          await db.query(`
            INSERT INTO tournament_matches (id, tournament_id, round_num, round_name, match_number, player1_id, player2_id, player1_seed, player2_seed, court_id, court_name, scheduled_time, scheduled_date, status, winner_id, next_match_id, score_json)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
              player1_id=VALUES(player1_id), player2_id=VALUES(player2_id), status=VALUES(status),
              winner_id=VALUES(winner_id), score_json=VALUES(score_json), scheduled_time=VALUES(scheduled_time)
          `, [
            m.id, m.tournamentId || t.id, m.round, m.roundName, m.matchNumber, m.player1Id || null, m.player2Id || null,
            m.player1Seed || null, m.player2Seed || null, m.courtId || null, m.courtName || null,
            m.scheduledTime || null, m.scheduledDate || null, m.status, m.winnerId || null, m.nextMatchId || null,
            m.score ? JSON.stringify(m.score) : null
          ]);
        }
      }

      res.json({ success: true, tournament: t });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Update match score in MySQL
  app.put('/api/matches/:matchId/score', async (req, res) => {
    try {
      const db = getDbPool();
      const { matchId } = req.params;
      const { score, winnerId, status } = req.body;

      await db.query(`
        UPDATE tournament_matches 
        SET score_json = ?, winner_id = ?, status = ?
        WHERE id = ?
      `, [JSON.stringify(score), winnerId || null, status || 'concluido', matchId]);

      res.json({ success: true, matchId, winnerId });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // 4. Bookings API
  app.get('/api/bookings', async (req, res) => {
    try {
      const db = getDbPool();
      const [rows]: any = await db.query('SELECT * FROM court_bookings ORDER BY booking_date DESC');
      const formatted = rows.map((r: any) => ({
        id: r.id,
        courtId: r.court_id,
        courtName: r.court_name,
        date: r.booking_date,
        timeSlot: r.time_slot,
        player1Id: r.player1_id,
        player2Id: r.player2_id || undefined,
        bookingType: r.booking_type,
        status: r.status,
        notes: r.notes || undefined
      }));
      res.json({ success: true, data: formatted });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post('/api/bookings', async (req, res) => {
    try {
      const db = getDbPool();
      const b = req.body;
      await db.query(`
        INSERT INTO court_bookings (id, court_id, court_name, booking_date, time_slot, player1_id, player2_id, booking_type, status, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE status=VALUES(status), player2_id=VALUES(player2_id), notes=VALUES(notes)
      `, [b.id, b.courtId, b.courtName, b.date, b.timeSlot, b.player1Id, b.player2Id || null, b.bookingType, b.status, b.notes || null]);
      res.json({ success: true, booking: b });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // 5. Chat Messages API
  app.get('/api/messages', async (req, res) => {
    try {
      const db = getDbPool();
      const [rows]: any = await db.query('SELECT * FROM chat_messages ORDER BY created_at ASC');
      const formatted = rows.map((r: any) => ({
        id: r.id,
        senderId: r.sender_id,
        senderName: r.sender_name,
        senderAvatar: r.sender_avatar,
        timestamp: r.timestamp,
        content: r.content,
        channelId: r.channel_id,
        isOfficial: Boolean(r.is_official)
      }));
      res.json({ success: true, data: formatted });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post('/api/messages', async (req, res) => {
    try {
      const db = getDbPool();
      const m = req.body;
      await db.query(`
        INSERT INTO chat_messages (id, sender_id, sender_name, sender_avatar, timestamp, content, channel_id, is_official)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [m.id, m.senderId, m.senderName, m.senderAvatar, m.timestamp, m.content, m.channelId, !!m.isOfficial]);
      res.json({ success: true, message: m });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // =========================================================================
  // VITE MIDDLEWARE SETUP
  // =========================================================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🎾 Tennis Condé 2 Server rodando em http://localhost:${PORT}`);
  });
}

startServer();
