import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { api } from "../api";

// M13 — ficha: GET + PUT/PATCH/DELETE do contribuinte e dos pedidos (1:N)
export default function ContribuinteDetalhePage() {
  const { id } = useParams();
  const navegar = useNavigate();

  const [ficha, setFicha] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [nome, setNome] = useState("");
  const [nuit, setNuit] = useState("");
  const [erroFicha, setErroFicha] = useState("");
  const [salvandoFicha, setSalvandoFicha] = useState(false);

  const [tipo, setTipo] = useState("");
  const [erroPedido, setErroPedido] = useState("");
  const [salvando, setSalvando] = useState(false);

  async function carregar() {
    setCarregando(true);
    try {
      const [c, p] = await Promise.all([
        api.obterContribuinte(id),
        api.pedidosDoContribuinte(id),
      ]);
      setFicha(c);
      setNome(c.nome ?? "");
      setNuit(c.nuit ?? "");
      setPedidos(p);
      setErro("");
    } catch {
      setErro("Ficha não encontrada.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, [id]);

  async function salvarFicha(e) {
    e.preventDefault();
    setErroFicha("");
    if (!nuit.trim() || nuit.trim().length !== 9) {
      setErroFicha("NUIT precisa de 9 dígitos.");
      return;
    }
    if (!nome.trim()) {
      setErroFicha("Nome é obrigatório.");
      return;
    }
    setSalvandoFicha(true);
    try {
      const c = await api.atualizarContribuinte(id, {
        nuit: nuit.trim(),
        nome: nome.trim(),
      });
      setFicha(c);
    } catch {
      setErroFicha("Não consegui atualizar (PUT).");
    } finally {
      setSalvandoFicha(false);
    }
  }

  async function mudarStatusContribuinte(status) {
    try {
      const c = await api.patchStatusContribuinte(id, status);
      setFicha(c);
    } catch {
      setErroFicha("Não consegui mudar o status (PATCH).");
    }
  }

  async function apagarContribuinte() {
    if (!window.confirm("Apagar este contribuinte?")) return;
    try {
      await api.removerContribuinte(id);
      navegar("/");
    } catch {
      setErroFicha("Não consegui apagar (DELETE).");
    }
  }

  async function enviarPedido(e) {
    e.preventDefault();
    setErroPedido("");
    if (!tipo.trim()) {
      setErroPedido("Informe o tipo (ex.: Velhice ou Invalidez).");
      return;
    }
    setSalvando(true);
    try {
      await api.criarPedido({
        contribuinteId: Number(id),
        tipo: tipo.trim(),
      });
      setTipo("");
      setPedidos(await api.pedidosDoContribuinte(id));
    } catch {
      setErroPedido("Não consegui gravar o pedido (POST).");
    } finally {
      setSalvando(false);
    }
  }

  async function salvarTipoPedido(pedidoId, novoTipo) {
    const t = (novoTipo ?? "").trim();
    if (!t) return;
    try {
      await api.atualizarPedido(pedidoId, {
        contribuinteId: Number(id),
        tipo: t,
      });
      setPedidos(await api.pedidosDoContribuinte(id));
    } catch {
      setErroPedido("Não consegui atualizar o pedido (PUT).");
    }
  }

  async function mudarStatusPedido(pedidoId, status) {
    try {
      await api.patchStatusPedido(pedidoId, status);
      setPedidos(await api.pedidosDoContribuinte(id));
    } catch {
      setErroPedido("Não consegui mudar status do pedido (PATCH).");
    }
  }

  async function apagarPedido(pedidoId) {
    if (!window.confirm("Apagar este pedido?")) return;
    try {
      await api.removerPedido(pedidoId);
      setPedidos(await api.pedidosDoContribuinte(id));
    } catch {
      setErroPedido("Não consegui apagar o pedido (DELETE).");
    }
  }

  if (carregando) return <p>Carregando…</p>;
  if (erro)
    return <p className="erro" role="alert">{erro}</p>;

  return (
    <div>
      <Link to="/">← Voltar</Link>
      <h2>{ficha.nome}</h2>
      <p>
        NUIT: {ficha.nuit} · Status: {ficha.status}
      </p>

      <h3>Editar contribuinte (PUT)</h3>
      <form onSubmit={salvarFicha} className="form">
        <label htmlFor="nome">Nome</label>
        <input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} />
        <label htmlFor="nuit">NUIT</label>
        <input id="nuit" value={nuit} onChange={(e) => setNuit(e.target.value)} />
        {erroFicha && (
          <p className="erro" role="alert">{erroFicha}</p>
        )}
        <button disabled={salvandoFicha}>
          {salvandoFicha ? "Salvando…" : "Salvar alterações"}
        </button>
      </form>

      <div className="acoes">
        <button type="button" onClick={() => mudarStatusContribuinte("Ativo")}>
          Status Ativo (PATCH)
        </button>
        <button type="button" onClick={() => mudarStatusContribuinte("Inativo")}>
          Status Inativo (PATCH)
        </button>
        <button type="button" className="perigo" onClick={apagarContribuinte}>
          Apagar contribuinte (DELETE)
        </button>
      </div>

      <h3>Pedidos</h3>
      {pedidos.length === 0 ? (
        <p>Esta ficha ainda não tem pedidos.</p>
      ) : (
        <ul className="lista">
          {pedidos.map((p) => (
            <li key={p.id} className="pedido-item">
              <span>
                {p.tipo} · {p.status}
              </span>
              <span className="acoes">
                <button
                  type="button"
                  onClick={() => {
                    const t = window.prompt("Novo tipo do pedido:", p.tipo);
                    if (t != null) salvarTipoPedido(p.id, t);
                  }}
                >
                  Editar (PUT)
                </button>
                <button
                  type="button"
                  onClick={() => mudarStatusPedido(p.id, "Aberto")}
                >
                  Aberto
                </button>
                <button
                  type="button"
                  onClick={() => mudarStatusPedido(p.id, "Fechado")}
                >
                  Fechado
                </button>
                <button
                  type="button"
                  className="perigo"
                  onClick={() => apagarPedido(p.id)}
                >
                  Apagar
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}
      {erroPedido && (
        <p className="erro" role="alert">{erroPedido}</p>
      )}

      <h3>Novo pedido (POST)</h3>
      <form onSubmit={enviarPedido} className="form">
        <label htmlFor="tipo">Tipo</label>
        <input
          id="tipo"
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          placeholder="Velhice ou Invalidez"
        />
        <button disabled={salvando}>
          {salvando ? "Salvando…" : "Registrar pedido"}
        </button>
      </form>
    </div>
  );
}