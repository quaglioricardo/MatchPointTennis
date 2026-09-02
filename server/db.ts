import mysql from 'mysql2/promise';
import { 
  INITIAL_PLAYERS, 
  INITIAL_TOURNAMENTS, 
  INITIAL_COURTS, 
  INITIAL_BOOKINGS, 
  INITIAL_MESSAGES, 
  INITIAL_PARTNER_REQUESTS
} from '../src/data/initialData.js';

let pool: mysql.Pool | null = null;

export function getDbConfig() {
  return {
    host: process.env.MYSQL_HOST || '216.172.172.195',
    port: Number(process.env.MYSQL_PORT) || 3306,
    user: process.env.MYSQL_USER || 'rica2888_adm',
    password: process.env.MYSQL_PASSWORD || 'admin@tennisConde2',
    database: process.env.MYSQL_DATABASE || 'rica2888_tenisconde',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 8000,
  };
}

export function getDbPool(): mysql.Pool {
  if (!pool) {
    const config = getDbConfig();
    pool = mysql.createPool(config);
  }
  return pool;
}

export async function testConnection(): Promise<{ success: boolean; message: string; details?: any; error?: any }> {
  try {
    const testPool = getDbPool();
    const [rows]: [any, any] = await testPool.query('SELECT VERSION() as version, DATABASE() as db, NOW() as server_time');
    const [tables]: [any, any] = await testPool.query('SHOW TABLES');
    return {
      success: true,
      message: 'Conectado ao MySQL com sucesso!',
      details: {
        serverInfo: rows[0],
        tablesCount: Array.isArray(tables) ? tables.length : 0,
        config: {
          host: getDbConfig().host,
          database: getDbConfig().database,
          user: getDbConfig().user,
        }
      }
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Falha ao conectar no MySQL',
      error: {
        code: error.code,
        errno: error.errno,
        sqlState: error.sqlState,
        host: getDbConfig().host,
        user: getDbConfig().user,
        database: getDbConfig().database
      }
    };
  }
}

export async function initDatabase(): Promise<{ success: boolean; message: string; tablesCreated?: string[] }> {
  try {
    const db = getDbPool();

    // 1. Players table
    await db.query(`
      CREATE TABLE IF NOT EXISTS players (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        avatar TEXT,
        category VARCHAR(100) NOT NULL DEFAULT '3ª Classe (Intermediário)',
        points INT NOT NULL DEFAULT 1000,
        rank_pos INT NOT NULL DEFAULT 1,
        matches_played INT NOT NULL DEFAULT 0,
        wins INT NOT NULL DEFAULT 0,
        losses INT NOT NULL DEFAULT 0,
        dominant_hand VARCHAR(50) DEFAULT 'Destro',
        backhand VARCHAR(50) DEFAULT 'Duas Mãos',
        racket VARCHAR(150),
        club VARCHAR(255) DEFAULT 'Tennis Condé 2',
        location VARCHAR(255) DEFAULT 'São Paulo, SP',
        phone VARCHAR(50),
        email VARCHAR(150),
        utr_rating DECIMAL(4,2) DEFAULT 5.50,
        streak INT DEFAULT 0,
        is_organizer BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 2. Tournaments table
    await db.query(`
      CREATE TABLE IF NOT EXISTS tournaments (
        id VARCHAR(64) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        banner_image TEXT,
        organizer_id VARCHAR(64),
        organizer_name VARCHAR(255),
        category VARCHAR(100) NOT NULL,
        surface VARCHAR(100) NOT NULL,
        club_name VARCHAR(255) DEFAULT 'Tennis Condé 2',
        address VARCHAR(255),
        start_date VARCHAR(50) NOT NULL,
        end_date VARCHAR(50) NOT NULL,
        entry_fee DECIMAL(10,2) DEFAULT 0.00,
        prize_description TEXT,
        status VARCHAR(50) DEFAULT 'inscricoes_abertas',
        format VARCHAR(50) DEFAULT 'eliminatoria_simples',
        max_participants INT DEFAULT 16,
        rules TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 3. Tournament participants
    await db.query(`
      CREATE TABLE IF NOT EXISTS tournament_participants (
        id INT AUTO_INCREMENT PRIMARY KEY,
        tournament_id VARCHAR(64) NOT NULL,
        player_id VARCHAR(64) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_tour_player (tournament_id, player_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 4. Tournament matches
    await db.query(`
      CREATE TABLE IF NOT EXISTS tournament_matches (
        id VARCHAR(64) PRIMARY KEY,
        tournament_id VARCHAR(64) NOT NULL,
        round_num INT NOT NULL DEFAULT 1,
        round_name VARCHAR(100) NOT NULL,
        match_number INT NOT NULL DEFAULT 1,
        player1_id VARCHAR(64),
        player2_id VARCHAR(64),
        player1_seed INT,
        player2_seed INT,
        court_id VARCHAR(64),
        court_name VARCHAR(100),
        scheduled_time VARCHAR(20),
        scheduled_date VARCHAR(50),
        status VARCHAR(50) DEFAULT 'agendado',
        winner_id VARCHAR(64),
        next_match_id VARCHAR(64),
        score_json JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 5. Courts
    await db.query(`
      CREATE TABLE IF NOT EXISTS courts (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        surface VARCHAR(100) NOT NULL DEFAULT 'Saibro (Clay)',
        is_covered BOOLEAN DEFAULT FALSE,
        has_lights BOOLEAN DEFAULT TRUE,
        hourly_rate DECIMAL(10,2) DEFAULT 0.00,
        photo TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 6. Bookings
    await db.query(`
      CREATE TABLE IF NOT EXISTS court_bookings (
        id VARCHAR(64) PRIMARY KEY,
        court_id VARCHAR(64) NOT NULL,
        court_name VARCHAR(100) NOT NULL,
        booking_date VARCHAR(50) NOT NULL,
        time_slot VARCHAR(50) NOT NULL,
        player1_id VARCHAR(64) NOT NULL,
        player2_id VARCHAR(64),
        booking_type VARCHAR(50) DEFAULT 'partida_amistosa',
        status VARCHAR(50) DEFAULT 'confirmado',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 7. Ladder challenges
    await db.query(`
      CREATE TABLE IF NOT EXISTS ladder_challenges (
        id VARCHAR(64) PRIMARY KEY,
        challenger_id VARCHAR(64) NOT NULL,
        defender_id VARCHAR(64) NOT NULL,
        challenge_date VARCHAR(50) NOT NULL,
        status VARCHAR(50) DEFAULT 'pendente',
        match_date VARCHAR(50),
        court_id VARCHAR(64),
        winner_id VARCHAR(64),
        score VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 8. Chat messages
    await db.query(`
      CREATE TABLE IF NOT EXISTS chat_messages (
        id VARCHAR(64) PRIMARY KEY,
        sender_id VARCHAR(64) NOT NULL,
        sender_name VARCHAR(255) NOT NULL,
        sender_avatar TEXT,
        timestamp VARCHAR(50) NOT NULL,
        content TEXT NOT NULL,
        channel_id VARCHAR(100) NOT NULL DEFAULT 'geral',
        is_official BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 9. Partner requests
    await db.query(`
      CREATE TABLE IF NOT EXISTS partner_requests (
        id VARCHAR(64) PRIMARY KEY,
        player_id VARCHAR(64) NOT NULL,
        player_name VARCHAR(255) NOT NULL,
        player_avatar TEXT,
        category VARCHAR(100) NOT NULL,
        preferred_date VARCHAR(50),
        preferred_time VARCHAR(50),
        court_surface VARCHAR(100),
        club_location VARCHAR(255),
        description TEXT,
        status VARCHAR(50) DEFAULT 'aberto',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Ensure mock players are not auto-seeded; players table is reserved strictly for real athletes
    // Seed courts if empty
    const [courtCount]: any = await db.query('SELECT COUNT(*) as count FROM courts');
    if (courtCount[0]?.count === 0) {
      for (const c of INITIAL_COURTS) {
        await db.query(`
          INSERT INTO courts (id, name, surface, is_covered, has_lights, hourly_rate, photo)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [c.id, c.name, c.surface, c.isCovered, c.hasLights, c.hourlyRate, c.photo]);
      }
    }

    return {
      success: true,
      message: 'Tabelas do banco MySQL rica2888_tenisconde verificadas e prontas!',
      tablesCreated: [
        'players', 'tournaments', 'tournament_participants', 'tournament_matches',
        'courts', 'court_bookings', 'ladder_challenges', 'chat_messages', 'partner_requests'
      ]
    };
  } catch (error: any) {
    console.error('Erro na inicialização do schema MySQL:', error);
    return {
      success: false,
      message: error.message || 'Erro ao inicializar tabelas MySQL'
    };
  }
}

export async function clearAllPlayers(): Promise<{ success: boolean; message: string }> {
  try {
    const db = getDbPool();
    await db.query('DELETE FROM players');
    return { success: true, message: 'Todos os registros de jogadores foram removidos da tabela players do banco rica2888_tenisconde.' };
  } catch (error: any) {
    return { success: false, message: error.message || 'Erro ao remover jogadores do banco' };
  }
}

export async function deletePlayerById(id: string): Promise<{ success: boolean; message: string }> {
  try {
    const db = getDbPool();
    await db.query('DELETE FROM players WHERE id = ?', [id]);
    return { success: true, message: `Jogador ${id} removido com sucesso do MySQL rica2888_tenisconde.` };
  } catch (error: any) {
    return { success: false, message: error.message || 'Erro ao deletar jogador' };
  }
}
