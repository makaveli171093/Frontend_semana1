import PaginaDashboard from "./pages/PaginaDashboard";
import { PaginaPacientes } from "./pages/PaginaPacientes";
import { PaginaNuevaCita } from "./pages/PaginaNuevaCita";
import { Route, Routes } from "react-router-dom";
import { Layout } from "./layouts/Layout";
import { PaginaDetallePaciente } from "./pages/PaginaDetallePaciente";
import { PaginaNotFound } from "./pages/PaginaNotFound";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<PaginaDashboard />} />
        <Route path="/pacientes" element={<PaginaPacientes />} />
        <Route path="/citas/nueva" element={<PaginaNuevaCita />} />
        <Route path="/pacientes/:id" element={<PaginaDetallePaciente />} />
        <Route path="*" element={<PaginaNotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
