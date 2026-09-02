// Helper para roteamento de chamadas à API MySQL (Local/HostGator ou Cloud Run)

export function getApiEndpoint(path: string): string {
  const cleanPath = path.replace(/^\/+/, '');
  
  if (typeof window === 'undefined') {
    return `/api/${cleanPath.replace(/^api\//, '')}`;
  }

  const origin = window.location.origin;

  // Se estiver rodando no ambiente de preview do AI Studio ou localhost Node.js
  if (origin.includes('run.app') || origin.includes('localhost') || origin.includes('127.0.0.1')) {
    const apiPath = cleanPath.startsWith('api/') ? cleanPath : `api/${cleanPath}`;
    return `/${apiPath}`;
  }

  // Quando estiver rodando no domínio próprio (https://tennisconde2.com ou cPanel HostGator):
  // Faz a chamada direto no mesmo domínio para o script api.php (zero CORS, ultra rápido e conectado ao MySQL local)
  const actionParam = cleanPath.replace(/^api\//, '');
  return `/api.php?action=${encodeURIComponent(actionParam)}`;
}

export async function apiFetch(path: string, options?: RequestInit): Promise<Response> {
  const url = getApiEndpoint(path);

  const defaultHeaders: Record<string, string> = {
    'Accept': 'application/json',
  };

  if (options?.body && !(options.body instanceof FormData)) {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...(options?.headers || {}),
      }
    });
    return response;
  } catch (error) {
    console.error(`Erro na requisição ${url}:`, error);
    throw error;
  }
}
