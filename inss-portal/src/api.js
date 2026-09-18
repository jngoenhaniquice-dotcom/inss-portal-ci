// M14 — api.js completo (verbos do Swagger) + Bearer + 401 num lugar só
const BASE = "http://localhost:5088";

function pegarToken() {
  const salvo = localStorage.getItem("inss.sessao");
  return salvo ? JSON.parse(salvo).token : null;
}

async function req(caminho, opcoes = {}) {
  const t = pegarToken();

  const r = await fetch(BASE + caminho, {
    headers: {
      "Content-Type": "application/json",
      ...(t ? { Authorization: "Bearer " + t } : {}),
    },
    ...opcoes,
  });

  if (r.status === 401) {
    localStorage.removeItem("inss.sessao");
    window.location.href = "/login";
    throw new Error("Sessão expirada.");
  }

  if (!r.ok) throw new Error("A API respondeu " + r.status);
  if (r.status === 204) return null;
  return r.json();
}

export const api = {
  login: (email, senha) =>
    req("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, senha }),
    }),

  listarContribuintes: () => req("/api/contribuintes"),
  obterContribuinte: (id) => req(`/api/contribuintes/${id}`),
  pedidosDoContribuinte: (id) => req(`/api/contribuintes/${id}/pedidos`),
  criarContribuinte: (dados) =>
    req("/api/contribuintes", { method: "POST", body: JSON.stringify(dados) }),
  atualizarContribuinte: (id, dados) =>
    req(`/api/contribuintes/${id}`, { method: "PUT", body: JSON.stringify(dados) }),
  patchStatusContribuinte: (id, status) =>
    req(`/api/contribuintes/${id}/status`, { method: "PATCH", body: JSON.stringify(status) }),
  removerContribuinte: (id) =>
    req(`/api/contribuintes/${id}`, { method: "DELETE" }),

  listarPedidos: (pagina = 1, tamanho = 10) =>
    req(`/api/pedidos?pagina=${pagina}&tamanho=${tamanho}`),
  obterPedido: (id) => req(`/api/pedidos/${id}`),
  criarPedido: (dados) =>
    req("/api/pedidos", { method: "POST", body: JSON.stringify(dados) }),
  atualizarPedido: (id, dados) =>
    req(`/api/pedidos/${id}`, { method: "PUT", body: JSON.stringify(dados) }),
  patchStatusPedido: (id, status) =>
    req(`/api/pedidos/${id}/status`, { method: "PATCH", body: JSON.stringify(status) }),
  removerPedido: (id) =>
    req(`/api/pedidos/${id}`, { method: "DELETE" }),
};