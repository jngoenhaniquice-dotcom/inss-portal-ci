import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { api } from "../api";

// M14 — mesmo padrão do formulário da manhã; novidade = entrar(dados) no Context
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [entrando, setEntrando] = useState(false);
  const { entrar } = useAuth();
  const navegar = useNavigate();

  async function enviar(e) {
    e.preventDefault();
    setErro("");
    setEntrando(true);
    try {
      const dados = await api.login(email, senha); // { token, nome, email }
      entrar(dados);
      navegar("/");
    } catch {
      setErro("E-mail ou senha inválidos.");
    } finally {
      setEntrando(false);
    }
  }

  return (
    <form onSubmit={enviar} className="login">
      <h2>Entrar no portal</h2>

      <label htmlFor="email">E-mail</label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <label htmlFor="senha">Senha</label>
      <input
        id="senha"
        type="password"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
      />

      {erro && (
        <p className="erro" role="alert">
          {erro}
        </p>
      )}

      <button disabled={entrando}>
        {entrando ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
