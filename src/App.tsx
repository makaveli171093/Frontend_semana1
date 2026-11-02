import { Route, Routes } from "react-router-dom";

import { Layout } from "./layouts/Layout";
import PaginaDashboard from "./pages/PaginaDashboard";
import { PaginaPacientes } from "./pages/PaginaPacientes";
import { PaginaNuevaCita } from "./pages/PaginaNuevaCita";
import { PaginaDetallePaciente } from "./pages/PaginaDetallePaciente";
import { PaginaNotFound } from "./pages/PaginaNotFound";
import { PaginaGestionCitas } from "./pages/PaginaGestionCitas";
import { PaginaReportes } from "./pages/PaginaReportes";
import { RutaProtegida } from "./components/RutaProtegida";
import { RutaSinMedico } from "./components/RutaSinMedico";
import { PaginaSinAcceso } from "./pages/PaginaSinAcceso";
import { PaginaPerfil } from "./pages/PaginaPerfil";
import { PaginaHistorialCitas } from "./pages/PaginaHistorialCitas";

import type { ReactNode } from "react";
import { ErrorBoundary } from "./shared/components/ErrorBoundary";
import { AlertaBanner } from "./shared/components/ui/AlertaBanner";
import PaginaLogin from "./pages/PaginaLogin";

function aislarSeccion(contenido: ReactNode, mensaje: string) {
  return (
    <ErrorBoundary
      fallback={
        <AlertaBanner
          tipo="error"
          titulo="Sección temporalmente no disponible"
          mensaje={mensaje}
        />
      }
    >
      {contenido}
    </ErrorBoundary>
  );
}

function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={aislarSeccion(<PaginaLogin />, "Error al cargar el Login.")}
      />

      <Route element={<RutaProtegida />}>
        <Route element={<Layout />}>
          <Route element={<RutaSinMedico />}>
            <Route path="/" element={<PaginaDashboard />} />
            <Route
              path="/pacientes"
              element={aislarSeccion(
                <PaginaPacientes />,
                "Error al cargar pacientes.",
              )}
            />
            <Route path="/citas/nueva" element={<PaginaNuevaCita />} />
            <Route
              path="/pacientes/:id"
              element={aislarSeccion(
                <PaginaDetallePaciente />,
                "Error al cargar el paciente.",
              )}
            />
          </Route>
          <Route
            path="/gestion-citas"
            element={aislarSeccion(
              <PaginaGestionCitas />,
              "Error al cargar la gestión de citas.",
            )}
          />
          <Route element={<RutaProtegida rolesPermitidos={["MEDICO"]} />}>
            <Route
              path="/perfil"
              element={aislarSeccion(
                <PaginaPerfil />,
                "Error al cargar el perfil.",
              )}
            />
          </Route>
          <Route element={<RutaProtegida rolesPermitidos={["GERENCIA"]} />}>
            <Route
              path="/reportes"
              element={aislarSeccion(
                <PaginaReportes />,
                "Error al cargar reportes.",
              )}
            />
          </Route>

          <Route path="/sin-acceso" element={<PaginaSinAcceso />} />

          <Route path="*" element={<PaginaNotFound />} />
          <Route
            element={<RutaProtegida rolesPermitidos={["MEDICO", "GERENCIA"]} />}
          >
            <Route
              path="/historial"
              element={aislarSeccion(
                <PaginaHistorialCitas />,
                "Error al cargar el historial.",
              )}
            />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
