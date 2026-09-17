// M13 — um arquivo só conhece o endereço da API.
// Cobre os verbos do InssApi (Swagger): GET, POST, PUT, PATCH, DELETE.
const BASE = "http://localhost:5088";

async function req(caminho, opcoes = {}) {
  const r = await fetch(BASE + caminho, {
    headers: { "Content-Type": "application/json" },
    ...opcoes,
  });

  if (!r.ok) throw new Error("A API respondeu " + r.status);
  if (r.status === 204) return null;
  return r.json();
}

export const api = {
  // --- Contribuintes ---
  listarContribuintes: () => req("/api/contribuintes"),

  obterContribuinte: (id) => req(`/api/contribuintes/${id}`),

  pedidosDoContribuinte: (id) =>
    req(`/api/contribuintes/${id}/pedidos`),

  criarContribuinte: (dados) =>
    req("/api/contribuintes", {
      method: "POST",
      body: JSON.stringify(dados),
    }),

  atualizarContribuinte: (id, dados) =>
    req(`/api/contribuintes/${id}`, {
      method: "PUT",
      body: JSON.stringify(dados),
    }),

  // [FromBody] string → JSON "Ativo" (com aspas)
  patchStatusContribuinte: (id, status) =>
    req(`/api/contribuintes/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify(status),
    }),

  removerContribuinte: (id) =>
    req(`/api/contribuintes/${id}`, { method: "DELETE" }),

  // --- Pedidos ---
  listarPedidos: (pagina = 1, tamanho = 10) =>
    req(`/api/pedidos?pagina=${pagina}&tamanho=${tamanho}`),

  obterPedido: (id) => req(`/api/pedidos/${id}`),

  criarPedido: (dados) =>
    req("/api/pedidos", {
      method: "POST",
      body: JSON.stringify(dados),
    }),

  atualizarPedido: (id, dados) =>
    req(`/api/pedidos/${id}`, {
      method: "PUT",
      body: JSON.stringify(dados),
    }),

  patchStatusPedido: (id, status) =>
    req(`/api/pedidos/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify(status),
    }),

  removerPedido: (id) =>
    req(`/api/pedidos/${id}`, { method: "DELETE" }),
};