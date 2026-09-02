-- ==========================================================
-- TENNIS CONDÉ 2 - DATABASE SCHEMA (MySQL / MariaDB)
-- HostGator Database: rica2888_tenisconde
-- ==========================================================

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
  dominant_hand ENUM('Destro', 'Canhoto') DEFAULT 'Destro',
  backhand ENUM('Uma Mão', 'Duas Mãos') DEFAULT 'Duas Mãos',
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
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  entry_fee DECIMAL(10,2) DEFAULT 0.00,
  prize_description TEXT,
  status ENUM('inscricoes_abertas', 'em_andamento', 'concluido') DEFAULT 'inscricoes_abertas',
  format ENUM('eliminatoria_simples', 'grupos_eliminatoria', 'todos_contra_todos') DEFAULT 'eliminatoria_simples',
  max_participants INT DEFAULT 16,
  rules TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS tournament_participants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tournament_id VARCHAR(64) NOT NULL,
  player_id VARCHAR(64) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_tour_player (tournament_id, player_id),
  INDEX idx_tour (tournament_id),
  INDEX idx_player (player_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
  scheduled_date DATE,
  status ENUM('agendado', 'em_andamento', 'concluido', 'cancelado') DEFAULT 'agendado',
  winner_id VARCHAR(64),
  next_match_id VARCHAR(64),
  score_json JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_match_tour (tournament_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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

CREATE TABLE IF NOT EXISTS court_bookings (
  id VARCHAR(64) PRIMARY KEY,
  court_id VARCHAR(64) NOT NULL,
  court_name VARCHAR(100) NOT NULL,
  booking_date DATE NOT NULL,
  time_slot VARCHAR(50) NOT NULL,
  player1_id VARCHAR(64) NOT NULL,
  player2_id VARCHAR(64),
  booking_type ENUM('partida_amistosa', 'torneio', 'barragem_desafio', 'treino_aula') DEFAULT 'partida_amistosa',
  status ENUM('confirmado', 'pendente_parceiro', 'cancelado') DEFAULT 'confirmado',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_booking_date (booking_date),
  INDEX idx_booking_court (court_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS ladder_challenges (
  id VARCHAR(64) PRIMARY KEY,
  challenger_id VARCHAR(64) NOT NULL,
  defender_id VARCHAR(64) NOT NULL,
  challenge_date DATETIME NOT NULL,
  status ENUM('pendente', 'aceito', 'recusado', 'concluido') DEFAULT 'pendente',
  match_date DATE,
  court_id VARCHAR(64),
  winner_id VARCHAR(64),
  score VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS chat_messages (
  id VARCHAR(64) PRIMARY KEY,
  sender_id VARCHAR(64) NOT NULL,
  sender_name VARCHAR(255) NOT NULL,
  sender_avatar TEXT,
  timestamp VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  channel_id VARCHAR(100) NOT NULL DEFAULT 'geral',
  is_official BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_channel (channel_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
  status ENUM('aberto', 'combinado') DEFAULT 'aberto',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
