import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";

// M13 — quatro estados: carregando | erro | vazio | lista
export default function ContribuintesPage() {
  const [lista, setLista] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    // [] = roda ao montar (como "ao abrir a tela")
    api
      .listarContribuintes()
      .then(setLista)
      .catch(() => setErro("Não consegui falar com a API."))
      .finally(() => setCarregando(false));
  }, []);

  if (carregando) return <p>Carregando…</p>;

  if (erro)
    return <p className="erro" role="alert">{erro}</p>;

  if (lista.length === 0)
    return <p>Nenhum contribuinte cadastrado ainda.</p>;

  return (
    <ul className="lista">
      {lista.map((c) => (
        <li key={c.id}>
          <Link to={`/contribuintes/${c.id}`}>{c.nome}</Link>
          <span>{c.nuit}</span>
        </li>
      ))}
    </ul>
  );
}
