import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

interface RutaProtegidaProps {
  rolesPermitidos?: string[];
}

export function RutaProtegida({ rolesPermitidos }: RutaProtegidaProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const usuario = useAuthStore((state) => state.usuario);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (
    rolesPermitidos &&
    (!usuario || !rolesPermitidos.includes(usuario.role))
  ) {
    return <Navigate to="/sin-acceso" replace />;
  }
  return <Outlet />;
}
