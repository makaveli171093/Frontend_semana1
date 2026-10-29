import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

export function RutaSinMedico() {
  const rol = useAuthStore((state) => state.usuario?.role);

  if (rol === "MEDICO") {
    return <Navigate to="/gestion-citas" replace />;
  }

  return <Outlet />;
}
