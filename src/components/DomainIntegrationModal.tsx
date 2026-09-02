import React, { useState } from 'react';
import { 
  Globe, 
  Copy, 
  Check, 
  Layers, 
  Server, 
  ShieldCheck, 
  Smartphone, 
  Code2, 
  X,
  Sparkles,
  ArrowUpRight,
  Database,
  RefreshCw,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { useTennis } from '../context/TennisContext';

interface DomainIntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DomainIntegrationModal: React.FC<DomainIntegrationModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'mysql' | 'embed' | 'dns' | 'build' | 'pwa'>('mysql');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [initResult, setInitResult] = useState<{ success: boolean; message: string } | null>(null);

  const { dbStatus, isDbConnected, isDbLoading, checkDbStatus, initDbSchema } = useTennis();

  if (!isOpen) return null;

  const liveCloudAppUrl = 'https://ais-pre-ztmq2h2ugj4icbmywau6ox-69298850452.us-west2.run.app';

  const embedCodeFull = `<!-- Incorporação do App Tennis Condé 2 em Tela Cheia no tennisconde2.com -->
<div style="width: 100%; height: 100vh; overflow: hidden; margin: 0; padding: 0;">
  <iframe 
    src="${liveCloudAppUrl}" 
    title="Tennis Condé 2 - Torneios, Rankings e Quadras"
    style="width: 100%; height: 100%; border: none; min-height: 100vh;" 
    allow="clipboard-write; fullscreen; geolocation"
    loading="lazy">
  </iframe>
</div>`;

  const embedCodeResponsive = `<!-- Incorporação Responsiva para WordPress / cPanel / Elementor -->
<iframe 
  src="${liveCloudAppUrl}" 
  width="100%" 
  height="900px" 
  frameborder="0" 
  style="border-radius: 16px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1); border: 1px solid #e2e8f0;" 
  allow="clipboard-write; fullscreen"
  loading="lazy">
</iframe>`;

  const htaccessCode = `# Configuração Apache / cPanel para SPA (Single Page Application)
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>`;

  const sqlSchemaSnippet = `-- Script SQL para criar as tabelas no phpMyAdmin / HostGator
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleRunInitDb = async () => {
    const res = await initDbSchema();
    setInitResult(res);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white">
                  Integração MySQL & Publicação Web
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950">
                  HostGator
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Banco de Dados MySQL remoto e instruções para o site <strong>tennisconde2.com</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 p-3 bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('mysql')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'mysql'
                ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Database className="w-4 h-4" />
            Banco MySQL (HostGator)
            {isDbConnected ? (
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block ml-1"></span>
            ) : (
              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block ml-1"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('embed')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'embed'
                ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Code2 className="w-4 h-4" />
            Incorporar no Site (Iframe)
          </button>

          <button
            onClick={() => setActiveTab('dns')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'dns'
                ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Server className="w-4 h-4" />
            Apontamento DNS
          </button>

          <button
            onClick={() => setActiveTab('build')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'build'
                ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            Build & Hospedagem
          </button>

          <button
            onClick={() => setActiveTab('pwa')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'pwa'
                ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            Instalação App (PWA)
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700 dark:text-slate-300">
          
          {/* TAB 0: MYSQL */}
          {activeTab === 'mysql' && (
            <div className="space-y-5 animate-fadeIn">
              
              {/* Status Box */}
              <div className={`p-4 rounded-2xl border flex flex-col gap-3 ${
                isDbConnected 
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800' 
                  : 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800'
              }`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    {isDbConnected ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0" />
                    )}
                    <div>
                      <h3 className="font-black text-sm text-slate-900 dark:text-white">
                        {isDbConnected 
                          ? 'Conexão MySQL Ativa e Operante!' 
                          : 'Teste de Conexão com o Banco de Dados HostGator'}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        {dbStatus.message}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={checkDbStatus}
                    disabled={isDbLoading}
                    className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors shadow-sm"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isDbLoading ? 'animate-spin' : ''}`} />
                    Testar Conexão Agora
                  </button>
                </div>

                {/* Connection Parameters Info */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800/80 text-[11px] font-mono">
                  <div className="p-2 bg-white/70 dark:bg-slate-900/60 rounded-lg">
                    <span className="text-slate-500 block text-[10px]">HOST / IP:</span>
                    <strong className="text-slate-800 dark:text-slate-200">216.172.172.195</strong>
                  </div>
                  <div className="p-2 bg-white/70 dark:bg-slate-900/60 rounded-lg">
                    <span className="text-slate-500 block text-[10px]">DATABASE:</span>
                    <strong className="text-slate-800 dark:text-slate-200">rica2888_tenisconde</strong>
                  </div>
                  <div className="p-2 bg-white/70 dark:bg-slate-900/60 rounded-lg">
                    <span className="text-slate-500 block text-[10px]">USUÁRIO:</span>
                    <strong className="text-slate-800 dark:text-slate-200">rica2888_adm</strong>
                  </div>
                  <div className="p-2 bg-white/70 dark:bg-slate-900/60 rounded-lg">
                    <span className="text-slate-500 block text-[10px]">PORTA:</span>
                    <strong className="text-slate-800 dark:text-slate-200">3306 (MySQL)</strong>
                  </div>
                </div>
              </div>

              {/* HostGator cPanel Remote MySQL Guide (Crucial step!) */}
              {!isDbConnected && (
                <div className="p-5 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2">
                    <Server className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <h4 className="font-extrabold text-blue-950 dark:text-blue-200 text-sm">
                      Como Liberar o Acesso Remoto no cPanel da HostGator (Passo de 1 minuto):
                    </h4>
                  </div>
                  <p className="text-xs text-blue-900 dark:text-blue-300 leading-relaxed">
                    O servidor MySQL na HostGator bloqueia por padrão conexões externas até que o IP ou o coringa <code>%</code> seja adicionado na lista de permissões do cPanel:
                  </p>
                  <ol className="list-decimal list-inside space-y-1.5 text-xs text-blue-950 dark:text-blue-200 font-medium">
                    <li>Acesse o <strong>cPanel da HostGator</strong> (ex: <code>tennisconde2.com:2083</code>).</li>
                    <li>Na seção <strong>Banco de Dados</strong>, clique em <strong>MySQL Remoto</strong> (<em>Remote MySQL</em>).</li>
                    <li>No campo <strong>Host (% coringa é permitido)</strong>, digite: <code className="bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded font-bold border">%</code> (para liberar conexões de qualquer IP) ou o IP que aparecer no erro.</li>
                    <li>Clique no botão <strong>Adicionar Host</strong> (<em>Add Host</em>).</li>
                    <li>Certifique-se também em <strong>Bancos de dados MySQL</strong> que o usuário <code>rica2888_adm</code> está associado ao banco <code>rica2888_tenisconde</code> com <strong>TODOS OS PRIVILÉGIOS</strong> (ALL PRIVILEGES).</li>
                    <li>Volte aqui e clique no botão <strong>"Testar Conexão Agora"</strong> acima!</li>
                  </ol>
                </div>
              )}

              {/* Initialize / Sync Tables Action */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-xs">
                    Estrutura de Tabelas & Migração Inicial
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Cria automaticamente as tabelas (<code>players</code>, <code>tournaments</code>, <code>court_bookings</code>, <code>chat_messages</code>, etc.) e popula com os dados iniciais do clube se as tabelas estiverem vazias.
                  </p>
                </div>

                <button
                  onClick={handleRunInitDb}
                  disabled={isDbLoading}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
                >
                  <Sparkles className="w-4 h-4" />
                  Criar Tabelas & Migrar Dados
                </button>
              </div>

              {initResult && (
                <div className={`p-3 rounded-xl text-xs font-bold ${initResult.success ? 'bg-emerald-100 text-emerald-900' : 'bg-red-100 text-red-900'}`}>
                  {initResult.message}
                </div>
              )}

              {/* SQL Schema Preview */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">
                    Arquivo <code>schema.sql</code> (Para executar direto no phpMyAdmin se preferir):
                  </span>
                  <button
                    onClick={() => handleCopy(sqlSchemaSnippet, 'sql')}
                    className="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 transition-colors"
                  >
                    {copiedKey === 'sql' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copiar Script SQL
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-4 bg-slate-950 text-slate-300 text-xs font-mono rounded-xl overflow-x-auto border border-slate-800 max-h-48">
                  {sqlSchemaSnippet}
                </pre>
              </div>

            </div>
          )}

          {/* TAB 1: EMBED */}
          {activeTab === 'embed' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl">
                <h3 className="font-extrabold text-emerald-900 dark:text-emerald-200 text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  Método Mais Rápido: Incorporar em Página Existente do tennisconde2.com
                </h3>
                <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-1 leading-relaxed">
                  Se você já possui um site em WordPress, Wix, Webflow ou HTML no domínio <strong>https://tennisconde2.com/</strong>, basta colar um dos blocos HTML abaixo na página desejada (ex: <code>/torneios</code> ou na home).
                </p>
              </div>

              {/* Snippet 1 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">
                    Opção A: Tela Cheia 100% Responsiva (Recomendado para páginas dedicadas)
                  </span>
                  <button
                    onClick={() => handleCopy(embedCodeFull, 'full')}
                    className="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 transition-colors"
                  >
                    {copiedKey === 'full' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copiar Código
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-4 bg-slate-950 text-slate-200 text-xs font-mono rounded-xl overflow-x-auto border border-slate-800">
                  {embedCodeFull}
                </pre>
              </div>

              {/* Snippet 2 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">
                    Opção B: Bloco Embutido com Altura Fixa (Ideal para posts e blogs)
                  </span>
                  <button
                    onClick={() => handleCopy(embedCodeResponsive, 'resp')}
                    className="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 transition-colors"
                  >
                    {copiedKey === 'resp' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copiar Código
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-4 bg-slate-950 text-slate-200 text-xs font-mono rounded-xl overflow-x-auto border border-slate-800">
                  {embedCodeResponsive}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 2: DNS */}
          {activeTab === 'dns' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 rounded-2xl">
                <h3 className="font-extrabold text-blue-900 dark:text-blue-200 text-sm flex items-center gap-2">
                  <Server className="w-4 h-4 text-blue-600" />
                  Apontamento Direto de DNS para tennisconde2.com
                </h3>
                <p className="text-xs text-blue-800 dark:text-blue-300 mt-1 leading-relaxed">
                  Para apontar o domínio próprio diretamente para o servidor onde o aplicativo será executado (ex: Vercel, Cloud Run, Netlify ou VPS), configure os registros DNS no seu registrador (HostGator, Registro.br, Cloudflare):
                </p>
              </div>

              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300 uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="p-3">Tipo</th>
                      <th className="p-3">Nome / Host</th>
                      <th className="p-3">Destino / Valor</th>
                      <th className="p-3">TTL</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono">
                    <tr className="bg-white dark:bg-slate-900">
                      <td className="p-3 font-bold text-emerald-600">A</td>
                      <td className="p-3 text-slate-800 dark:text-slate-200">@</td>
                      <td className="p-3 text-slate-600 dark:text-slate-400">216.172.172.195 (ou IP da sua hospedagem)</td>
                      <td className="p-3 text-slate-500">Automático / 3600</td>
                    </tr>
                    <tr className="bg-slate-50 dark:bg-slate-900/50">
                      <td className="p-3 font-bold text-emerald-600">CNAME</td>
                      <td className="p-3 text-slate-800 dark:text-slate-200">www</td>
                      <td className="p-3 text-slate-600 dark:text-slate-400">tennisconde2.com</td>
                      <td className="p-3 text-slate-500">Automático / 3600</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="space-y-2 text-xs">
                <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  Certificado SSL (HTTPS):
                </p>
                <p className="text-slate-600 dark:text-slate-400">
                  O certificado SSL é gerado automaticamente e gratuitamente pelo cPanel / Let's Encrypt da HostGator assim que o apontamento DNS estiver ativo.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: BUILD & HOSTING */}
          {activeTab === 'build' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">
                  1. Gerando o Pacote de Produção (Dist)
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  No terminal do seu projeto, execute o comando de compilação:
                </p>
                <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl text-emerald-400 font-mono text-xs">
                  <span>npm run build</span>
                  <button
                    onClick={() => handleCopy('npm run build', 'npmbuild')}
                    className="text-slate-400 hover:text-white"
                  >
                    {copiedKey === 'npmbuild' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-500">
                  Isso gerará a pasta <code>/dist</code> contendo todos os arquivos estáticos minificados para fazer o upload na pasta <code>public_html</code> do cPanel da HostGator.
                </p>
              </div>

              {/* Apache / cPanel */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">
                    Arquivo .htaccess para o public_html da HostGator:
                  </span>
                  <button
                    onClick={() => handleCopy(htaccessCode, 'htaccess')}
                    className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1"
                  >
                    {copiedKey === 'htaccess' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    Copiar
                  </button>
                </div>
                <pre className="p-3 bg-slate-950 text-slate-300 text-xs font-mono rounded-xl overflow-x-auto border border-slate-800">
                  {htaccessCode}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 4: PWA */}
          {activeTab === 'pwa' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="p-4 bg-lime-50 dark:bg-lime-950/30 border border-lime-200 dark:border-lime-800/60 rounded-2xl">
                <h3 className="font-extrabold text-lime-950 dark:text-lime-200 text-sm flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-lime-600" />
                  Instalação Direta no Celular dos Tenistas (PWA)
                </h3>
                <p className="text-xs text-lime-900 dark:text-lime-300 mt-1 leading-relaxed">
                  O aplicativo já está configurado com <strong>Web App Manifest</strong> e ícones vetoriais. Ao acessar <strong>https://tennisconde2.com/</strong> no celular:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                    📱 No iPhone (Safari iOS):
                  </div>
                  <ol className="list-decimal list-inside space-y-1.5 text-slate-600 dark:text-slate-300">
                    <li>Abra o site <strong>tennisconde2.com</strong> no Safari</li>
                    <li>Toque no botão <strong>Compartilhar</strong> (ícone de quadrado com seta para cima)</li>
                    <li>Role para baixo e selecione <strong>Adicionar à Tela de Início</strong></li>
                    <li>O ícone do Tennis Condé 2 aparecerá como um app nativo no celular!</li>
                  </ol>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                    🤖 No Android (Chrome):
                  </div>
                  <ol className="list-decimal list-inside space-y-1.5 text-slate-600 dark:text-slate-300">
                    <li>Abra o site <strong>tennisconde2.com</strong> no Chrome</li>
                    <li>Toque no menu (3 pontinhos no canto superior direito)</li>
                    <li>Selecione <strong>Instalar aplicativo</strong> ou <strong>Adicionar à tela inicial</strong></li>
                    <li>Pronto! O app abrirá em tela cheia sem a barra de endereços do navegador.</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            Configuração HostGator MySQL & tennisconde2.com
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://tennisconde2.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors flex items-center gap-1.5"
            >
              Visitar tennisconde2.com
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
