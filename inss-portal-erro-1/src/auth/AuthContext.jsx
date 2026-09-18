import { createContext, useContext, useState } from "react";

// M14 — estado global da sessão (quem está logado). Evita prop drilling.
const Ctx = createContext(null);
const CHAVE = "inss.sessao";

export function AuthProvider({ children }) {
  // useState com função = lê localStorage só na 1ª vez (sobrevive ao F5)
  const [sessao, setSessao] = useState(() => {
    const salvo = localStorage.getItem(CHAVE);
    return salvo ? JSON.parse(salvo) : null;
  });

  function entrar(dados) {
    localStorage.setItem(CHAVE, JSON.stringify(dados));
    setSessao(dados);
  }

  function sair() {
    localStorage.removeItem(CHAVE);
    setSessao(null);
  }

  return (
    <Ctx.Provider value={{ sessao, entrar, sair }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  return useContext(Ctx);
}
