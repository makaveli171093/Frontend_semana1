import { Route, Routes } from "react-router-dom";

import { Layout } from "./layouts/Layout";
import PaginaDashboard from "./pages/PaginaDashboard";
import { PaginaPacientes } from "./pages/PaginaPacientes";
import { PaginaNuevaCita } from "./pages/PaginaNuevaCita";
import { PaginaDetallePaciente } from "./pages/PaginaDetallePaciente";
import { PaginaNotFound } from "./pages/PaginaNotFound";
import { PaginaGestionCitas } from "./pages/PaginaGestionCitas";
import { PaginaReportes } from "./pages/PaginaReportes";
import PaginaLogin from "./pages/PaginaLogin";
import { RutaProtegida } from "./components/RutaProtegida";
import { RutaSinMedico } from "./components/RutaSinMedico";
import { PaginaSinAcceso } from "./pages/PaginaSinAcceso";
import { PaginaPerfil } from "./pages/PaginaPerfil";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<PaginaLogin />} />

      <Route element={<RutaProtegida />}>
        <Route element={<Layout />}>
          <Route element={<RutaSinMedico />}>
            <Route path="/" element={<PaginaDashboard />} />
            <Route path="/pacientes" element={<PaginaPacientes />} />
            <Route path="/citas/nueva" element={<PaginaNuevaCita />} />
            <Route path="/pacientes/:id" element={<PaginaDetallePaciente />} />
          </Route>
          <Route path="/gestion-citas" element={<PaginaGestionCitas />} />
          <Route element={<RutaProtegida rolesPermitidos={["MEDICO"]} />}>
            <Route path="/perfil" element={<PaginaPerfil />} />
          </Route>
          <Route element={<RutaProtegida rolesPermitidos={["GERENCIA"]} />}>
            <Route path="/reportes" element={<PaginaReportes />} />
          </Route>

          <Route path="/sin-acceso" element={<PaginaSinAcceso />} />

          <Route path="*" element={<PaginaNotFound />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
