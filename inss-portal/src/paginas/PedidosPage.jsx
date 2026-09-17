import { useEffect, useState } from "react";
import { api } from "../api";

// M13 — GET /api/pedidos?pagina=&tamanho= (resposta: { total, pagina, tamanho, itens })
export default function PedidosPage() {
  const [itens, setItens] = useState([]);
  const [total, setTotal] = useState(0);
  const [pagina, setPagina] = useState(1);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    setCarregando(true);
    api
      .listarPedidos(pagina, 10)
      .then((dados) => {
        setItens(dados.itens ?? []);
        setTotal(dados.total ?? 0);
      })
      .catch(() => setErro("Não consegui listar os pedidos."))
      .finally(() => setCarregando(false));
  }, [pagina]);

  if (carregando) return <p>Carregando…</p>;
  if (erro)
    return <p className="erro" role="alert">{erro}</p>;
  if (itens.length === 0)
    return <p>Nenhum pedido nesta página.</p>;

  return (
    <div>
      <h2>Todos os pedidos</h2>
      <p>
        GET /api/pedidos — página {pagina} · total {total}
      </p>
      <ul className="lista">
        {itens.map((p) => (
          <li key={p.id}>
            <span>
              #{p.id} · {p.tipo} · {p.status}
            </span>
            <span>{p.nomeContribuinte}</span>
          </li>
        ))}
      </ul>
      <div className="acoes">
        <button type="button" disabled={pagina <= 1} onClick={() => setPagina((n) => n - 1)}>
          Anterior
        </button>
        <button
          type="button"
          disabled={pagina * 10 >= total}
          onClick={() => setPagina((n) => n + 1)}
        >
          Próxima
        </button>
      </div>
    </div>
  );
}