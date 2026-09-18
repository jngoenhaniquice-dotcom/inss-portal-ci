import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

// M13 — formulário controlado (value + onChange).
// Validar aqui avisa o atendente na hora; a regra de verdade continua no Service (M8).
export default function NovoContribuintePage() {
  const [nome, setNome] = useState("");
  const [nuit, setNuit] = useState("");
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);
  const navegar = useNavigate();

  function validar() {
    if (nome.trim().length < 3)
      return "Nome precisa de pelo menos 3 letras.";
    if (!/^\d{9}$/.test(nuit))
      return "NUIT precisa de exatamente 9 dígitos.";
    return "";
  }

  async function enviar(e) {
    e.preventDefault(); // sem isto a página recarrega

    const problema = validar();
    if (problema) {
      setErro(problema);
      return;
    }

    setErro("");
    setSalvando(true);
    try {
      await api.criarContribuinte({ nuit, nome });
      navegar("/");
    } catch {
      // API recusa NUIT duplicado (mesma regra do Dia 2)
      setErro("A API recusou. O NUIT já está cadastrado?");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <form onSubmit={enviar}>
      <h2>Novo contribuinte</h2>

      <label htmlFor="nome">Nome completo</label>
      <input
        id="nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />

      <label htmlFor="nuit">NUIT (9 dígitos)</label>
      <input
        id="nuit"
        value={nuit}
        onChange={(e) => setNuit(e.target.value)}
      />

      {erro && (
        <p className="erro" role="alert">
          {erro}
        </p>
      )}

      <button disabled={salvando}>
        {salvando ? "Salvando…" : "Salvar"}
      </button>
    </form>
  );
}
