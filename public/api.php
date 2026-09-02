<?php
/**
 * Backend API em PHP para HostGator (cPanel / Apache)
 * Conexão direta ao banco MySQL rica2888_tenisconde para tennisconde2.com
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Configurações do Banco de Dados HostGator
$db_user = 'rica2888_adm';
$db_pass = 'Quaglio@1983';
$db_name = 'rica2888_tenisconde';

$hosts = ['localhost', '127.0.0.1', '216.172.172.195'];
$pdo = null;
$last_error = '';

foreach ($hosts as $h) {
    try {
        $pdo = new PDO("mysql:host={$h};dbname={$db_name};charset=utf8mb4", $db_user, $db_pass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_TIMEOUT => 3
        ]);
        if ($pdo) {
            $active_host = $h;
            break;
        }
    } catch (PDOException $e) {
        $last_error = $e->getMessage();
    }
}

if (!$pdo) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erro ao conectar no banco MySQL: ' . $last_error,
        'tested' => true
    ]);
    exit;
}

// Extrai a ação solicitada (via $_GET['action'] ou REQUEST_URI)
$action = isset($_GET['action']) ? trim($_GET['action'], '/') : '';
if (empty($action)) {
    $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    if (preg_match('#(?:api\.php/|/api/)(.*)$#i', $uri, $matches)) {
        $action = trim($matches[1], '/');
    }
}

$method = $_SERVER['REQUEST_METHOD'];

// ============================================================================
// 1. STATUS & TESTE DE CONEXÃO
// ============================================================================
if ($action === 'status' || $action === 'db/status') {
    try {
        $stmt = $pdo->query('SELECT DATABASE() as db, VERSION() as version, NOW() as server_time');
        $info = $stmt->fetch();
        
        $tableStmt = $pdo->query("SHOW TABLES LIKE 'players'");
        $hasPlayers = $tableStmt->rowCount() > 0;

        echo json_encode([
            'success' => true,
            'message' => 'Conexão com o banco MySQL rica2888_tenisconde realizada com sucesso!',
            'tested' => true,
            'details' => [
                'host' => $active_host,
                'database' => $info['db'] ?? $db_name,
                'version' => $info['version'] ?? 'MySQL',
                'serverTime' => $info['server_time'] ?? date('Y-m-d H:i:s'),
                'playersTableExists' => $hasPlayers
            ]
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => $e->getMessage(), 'tested' => true]);
    }
    exit;
}

// ============================================================================
// 2. INICIALIZAR TABELAS (SCHEMA MIGRATION)
// ============================================================================
if ($action === 'db/init' && $method === 'POST') {
    try {
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS players (
                id VARCHAR(50) PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                avatar TEXT,
                category VARCHAR(50) NOT NULL,
                points INT DEFAULT 1000,
                rank_pos INT DEFAULT 1,
                matches_played INT DEFAULT 0,
                wins INT DEFAULT 0,
                losses INT DEFAULT 0,
                dominant_hand VARCHAR(20) DEFAULT 'Destro',
                backhand VARCHAR(20) DEFAULT 'Duas Mãos',
                racket VARCHAR(100),
                club VARCHAR(100) DEFAULT 'Tennis Condé 2',
                location VARCHAR(100) DEFAULT 'São Paulo, SP',
                phone VARCHAR(30),
                email VARCHAR(100),
                utr_rating DECIMAL(4,1) DEFAULT 6.0,
                streak INT DEFAULT 0,
                is_organizer BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        ");

        $pdo->exec("
            CREATE TABLE IF NOT EXISTS courts (
                id VARCHAR(50) PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                surface VARCHAR(50) NOT NULL,
                is_covered BOOLEAN DEFAULT FALSE,
                has_lights BOOLEAN DEFAULT TRUE,
                hourly_rate DECIMAL(10,2) DEFAULT 0,
                photo TEXT
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        ");

        $pdo->exec("
            CREATE TABLE IF NOT EXISTS tournaments (
                id VARCHAR(50) PRIMARY KEY,
                title VARCHAR(150) NOT NULL,
                banner_image TEXT,
                organizer_id VARCHAR(50),
                organizer_name VARCHAR(100),
                category VARCHAR(50),
                surface VARCHAR(50),
                club_name VARCHAR(100),
                address VARCHAR(150),
                start_date VARCHAR(30),
                end_date VARCHAR(30),
                entry_fee DECIMAL(10,2) DEFAULT 0,
                prize_description TEXT,
                status VARCHAR(30) DEFAULT 'upcoming',
                format VARCHAR(50) DEFAULT 'Eliminatória Simples',
                max_participants INT DEFAULT 16,
                rules TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        ");

        $pdo->exec("
            CREATE TABLE IF NOT EXISTS court_bookings (
                id VARCHAR(50) PRIMARY KEY,
                court_id VARCHAR(50) NOT NULL,
                court_name VARCHAR(100) NOT NULL,
                booking_date VARCHAR(20) NOT NULL,
                time_slot VARCHAR(20) NOT NULL,
                player1_id VARCHAR(50) NOT NULL,
                player2_id VARCHAR(50),
                booking_type VARCHAR(30) DEFAULT 'casual',
                status VARCHAR(30) DEFAULT 'confirmed',
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        ");

        $pdo->exec("
            CREATE TABLE IF NOT EXISTS chat_messages (
                id VARCHAR(50) PRIMARY KEY,
                sender_id VARCHAR(50) NOT NULL,
                sender_name VARCHAR(100) NOT NULL,
                sender_avatar TEXT,
                timestamp VARCHAR(50),
                content TEXT NOT NULL,
                channel_id VARCHAR(50) DEFAULT 'geral',
                is_official BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        ");

        echo json_encode([
            'success' => true,
            'message' => 'Tabelas do banco MySQL rica2888_tenisconde inicializadas com sucesso!'
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
    exit;
}

// ============================================================================
// 3. JOGADORES (PLAYERS)
// ============================================================================
if (preg_match('#^players(?:/(.*))?$#', $action, $m)) {
    $subId = $m[1] ?? '';

    // POST /api/players/clear-all
    if ($subId === 'clear-all' && $method === 'POST') {
        try {
            $pdo->query('DELETE FROM players');
            echo json_encode(['success' => true, 'message' => 'Tabela players limpa com sucesso!']);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
        exit;
    }

    // GET /api/players
    if ($method === 'GET') {
        try {
            $stmt = $pdo->query('SELECT * FROM players ORDER BY rank_pos ASC, points DESC');
            $rows = $stmt->fetchAll();
            $players = array_map(function($r) {
                return [
                    'id' => $r['id'],
                    'name' => $r['name'],
                    'avatar' => $r['avatar'] ?? '',
                    'category' => $r['category'],
                    'points' => (int)($r['points'] ?? 1000),
                    'rank' => (int)($r['rank_pos'] ?? 1),
                    'matchesPlayed' => (int)($r['matches_played'] ?? 0),
                    'wins' => (int)($r['wins'] ?? 0),
                    'losses' => (int)($r['losses'] ?? 0),
                    'dominantHand' => $r['dominant_hand'] ?? 'Destro',
                    'backhand' => $r['backhand'] ?? 'Duas Mãos',
                    'racket' => $r['racket'] ?? '',
                    'club' => $r['club'] ?? 'Tennis Condé 2',
                    'location' => $r['location'] ?? 'São Paulo, SP',
                    'phone' => $r['phone'] ?? '',
                    'email' => $r['email'] ?? '',
                    'utrRating' => (float)($r['utr_rating'] ?? 6.0),
                    'streak' => (int)($r['streak'] ?? 0),
                    'isOrganizer' => (bool)($r['is_organizer'] ?? false),
                ];
            }, $rows);
            echo json_encode(['success' => true, 'data' => $players]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
        exit;
    }

    // POST /api/players (Cadastrar ou Atualizar)
    if ($method === 'POST') {
        $body = json_decode(file_get_contents('php://input'), true);
        if (!$body || !isset($body['id'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Dados inválidos']);
            exit;
        }

        try {
            $sql = "
                INSERT INTO players (id, name, avatar, category, points, rank_pos, matches_played, wins, losses, dominant_hand, backhand, racket, club, location, phone, email, utr_rating, streak, is_organizer)
                VALUES (:id, :name, :avatar, :category, :points, :rank_pos, :matches_played, :wins, :losses, :dominant_hand, :backhand, :racket, :club, :location, :phone, :email, :utr_rating, :streak, :is_organizer)
                ON DUPLICATE KEY UPDATE
                    name=VALUES(name), avatar=VALUES(avatar), category=VALUES(category), points=VALUES(points),
                    rank_pos=VALUES(rank_pos), matches_played=VALUES(matches_played), wins=VALUES(wins), losses=VALUES(losses),
                    dominant_hand=VALUES(dominant_hand), backhand=VALUES(backhand), racket=VALUES(racket),
                    club=VALUES(club), location=VALUES(location), phone=VALUES(phone), email=VALUES(email),
                    utr_rating=VALUES(utr_rating), streak=VALUES(streak), is_organizer=VALUES(is_organizer)
            ";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                ':id' => $body['id'],
                ':name' => $body['name'] ?? '',
                ':avatar' => $body['avatar'] ?? '',
                ':category' => $body['category'] ?? '3ª Classe (Intermediário)',
                ':points' => $body['points'] ?? 1000,
                ':rank_pos' => $body['rank'] ?? 1,
                ':matches_played' => $body['matchesPlayed'] ?? 0,
                ':wins' => $body['wins'] ?? 0,
                ':losses' => $body['losses'] ?? 0,
                ':dominant_hand' => $body['dominantHand'] ?? 'Destro',
                ':backhand' => $body['backhand'] ?? 'Duas Mãos',
                ':racket' => $body['racket'] ?? '',
                ':club' => $body['club'] ?? 'Tennis Condé 2',
                ':location' => $body['location'] ?? 'São Paulo, SP',
                ':phone' => $body['phone'] ?? '',
                ':email' => $body['email'] ?? '',
                ':utr_rating' => $body['utrRating'] ?? 6.0,
                ':streak' => $body['streak'] ?? 0,
                ':is_organizer' => !empty($body['isOrganizer']) ? 1 : 0
            ]);
            echo json_encode(['success' => true, 'player' => $body]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
        exit;
    }

    // DELETE /api/players/:id ou DELETE /api/players
    if ($method === 'DELETE') {
        $id = $subId ?: ($_GET['id'] ?? null);
        try {
            if ($id) {
                $stmt = $pdo->prepare('DELETE FROM players WHERE id = ?');
                $stmt->execute([$id]);
            } else {
                $pdo->query('DELETE FROM players');
            }
            echo json_encode(['success' => true, 'message' => 'Operação concluída']);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
        exit;
    }
}

// ============================================================================
// 4. OUTRAS ROTAS (BOOKINGS, TOURNAMENTS, MESSAGES)
// ============================================================================
if ($action === 'bookings') {
    if ($method === 'GET') {
        try {
            $stmt = $pdo->query('SELECT * FROM court_bookings ORDER BY booking_date DESC, time_slot ASC');
            $bookings = $stmt->fetchAll();
            echo json_encode(['success' => true, 'data' => $bookings]);
        } catch (Exception $e) {
            echo json_encode(['success' => true, 'data' => []]);
        }
        exit;
    }
}

if ($action === 'tournaments') {
    if ($method === 'GET') {
        try {
            $stmt = $pdo->query('SELECT * FROM tournaments ORDER BY start_date DESC');
            $tournaments = $stmt->fetchAll();
            echo json_encode(['success' => true, 'data' => $tournaments]);
        } catch (Exception $e) {
            echo json_encode(['success' => true, 'data' => []]);
        }
        exit;
    }
}

if ($action === 'messages') {
    if ($method === 'GET') {
        try {
            $stmt = $pdo->query('SELECT * FROM chat_messages ORDER BY created_at ASC');
            $msgs = $stmt->fetchAll();
            echo json_encode(['success' => true, 'data' => $msgs]);
        } catch (Exception $e) {
            echo json_encode(['success' => true, 'data' => []]);
        }
        exit;
    }
}

// Resposta Padrão
echo json_encode(['success' => true, 'message' => 'API PHP Tennis Condé 2 Ativa', 'action' => $action]);
