import { Routes, Route, Link } from "react-router-dom";
import ContribuintesPage from "./paginas/ContribuintesPage";
import NovoContribuintePage from "./paginas/NovoContribuintePage";
import ContribuinteDetalhePage from "./paginas/ContribuinteDetalhePage";
import PedidosPage from "./paginas/PedidosPage";

// M13 — React Router: cada path = uma tela
export default function App() {
  return (
    <div className="app">
      <header>
        <h1>Portal INSS</h1>
        <nav>
          <Link to="/">Contribuintes</Link>
          <Link to="/novo">Novo cadastro</Link>
          <Link to="/pedidos">Pedidos</Link>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<ContribuintesPage />} />
          <Route path="/novo" element={<NovoContribuintePage />} />
          <Route path="/pedidos" element={<PedidosPage />} />
          <Route path="/contribuintes/:id" element={<ContribuinteDetalhePage />} />
        </Routes>
      </main>
    </div>
  );
}