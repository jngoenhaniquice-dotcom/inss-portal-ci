import { Routes, Route, Link, useNavigate } from "react-router-dom";
import ContribuintesPage from "./paginas/ContribuintesPage";
import NovoContribuintePage from "./paginas/NovoContribuintePage";
import ContribuinteDetalhePage from "./paginas/ContribuinteDetalhePage";
import PedidosPage from "./paginas/PedidosPage";
import LoginPage from "./paginas/LoginPage";
import RotaProtegida from "./auth/RotaProtegida";
import { useAuth } from "./auth/AuthContext";

export default function App() {
  const { sessao, sair } = useAuth();
  const navegar = useNavigate();

  function sairAgora() {
    sair();
    navegar("/login");
  }

  return (
    <div className="app">
      <header>
        <h1>Portal INSS</h1>
        <nav>
          <Link to="/">Contribuintes</Link>
          <Link to="/novo">Novo cadastro</Link>
          <Link to="/pedidos">Pedidos</Link>
        </nav>
        {sessao && (
          <div className="sessao">
            <span>{sessao.nome}</span>
            <button onClick={sairAgora}>Sair</button>
          </div>
        )}
      </header>

      <main>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<RotaProtegida><ContribuintesPage /></RotaProtegida>} />
          <Route path="/novo" element={<RotaProtegida><NovoContribuintePage /></RotaProtegida>} />
          <Route path="/pedidos" element={<RotaProtegida><PedidosPage /></RotaProtegida>} />
          <Route path="/contribuintes/:id" element={<RotaProtegida><ContribuinteDetalhePage /></RotaProtegida>} />
        </Routes>
      </main>
    </div>
  );
}