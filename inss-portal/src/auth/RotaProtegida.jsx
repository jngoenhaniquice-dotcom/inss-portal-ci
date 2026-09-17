import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

// M14 — porteiro: sem sessão → /login (replace evita laço no Voltar)
export default function RotaProtegida({ children }) {
  const { sessao } = useAuth();
  const local = useLocation();

  if (!sessao) {
    return (
      <Navigate
        to="/login"
        state={{ de: local.pathname }}
        replace
      />
    );
  }

  return children;
}
