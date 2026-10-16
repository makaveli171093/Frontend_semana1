import { useState } from "react";
import PaginaDashboard from "./pages/PaginaDashboard";
import { PaginaPacientes } from "./pages/PaginaPacientes";
import { PaginaNuevaCita } from "./pages/PaginaNuevaCita";

function App() {
  const [pagina, setPagina] = useState<"dashboard" | "pacientes" | "citas">(
    "dashboard",
  );

  return (
    <div>
      {/* Navegación temporal */}
      <nav className="flex gap-3 bg-white border-b border-slate-200 p-4">
        <button
          type="button"
          onClick={() => setPagina("dashboard")}
          className={`px-4 py-2 rounded-lg font-medium ${
            pagina === "dashboard"
              ? "bg-cyan-800 text-white"
              : "bg-slate-100 text-slate-700"
          }`}
        >
          Dashboard
        </button>

        <button
          type="button"
          onClick={() => setPagina("pacientes")}
          className={`px-4 py-2 rounded-lg font-medium ${
            pagina === "pacientes"
              ? "bg-cyan-800 text-white"
              : "bg-slate-100 text-slate-700"
          }`}
        >
          Pacientes
        </button>

        <button
          type="button"
          onClick={() => setPagina("citas")}
          className={`rounded-lg px-4 py-2 font-medium ${
            pagina === "citas"
              ? "bg-cyan-800 text-white"
              : "bg-slate-100 text-slate-700"
          }`}
        >
          Nueva cita
        </button>
      </nav>

      {/* Renderizado condicional */}
      {pagina === "dashboard" ? (
        <PaginaDashboard />
      ) : pagina === "pacientes" ? (
        <PaginaPacientes />
      ) : (
        <PaginaNuevaCita />
      )}
    </div>
  );
}

export default App;
