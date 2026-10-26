import { LogOut } from "lucide-react";
import toast from "react-hot-toast";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

import { useAuthStore } from "../stores/authStore";

const enlaces = [
  {
    ruta: "/",
    nombre: "Dashboard",
    icono: "▦",
    exacto: true,
  },
  {
    ruta: "/pacientes",
    nombre: "Pacientes",
    icono: "♙",
    exacto: false,
  },
  {
    ruta: "/citas/nueva",
    nombre: "Nueva cita",
    icono: "+",
    exacto: true,
  },
  {
    ruta: "/gestion-citas",
    nombre: "Gestión de citas",
    icono: "📅",
    exacto: true,
  },
  { ruta: "/reportes", nombre: "Reportes", icono: "📊", exacto: true },
];

export function Layout() {
  const navigate = useNavigate();
  const usuario = useAuthStore((state) => state.usuario);
  const logout = useAuthStore((state) => state.logout);

  const cerrarSesion = () => {
    logout();
    toast.success("Sesión cerrada correctamente");
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      <aside className="border-b border-slate-200 bg-white md:min-h-screen md:w-64 md:shrink-0 md:border-b-0 md:border-r">
        <div className="border-b border-slate-100 px-5 py-6">
          <h1 className="text-lg font-bold text-cyan-900">
            Clínica Salud Integral
          </h1>

          <p className="mt-1 text-xs text-slate-500">
            Sistema de gestión médica
          </p>
        </div>

        <nav
          aria-label="Navegación principal"
          className="flex gap-2 overflow-x-auto p-3 md:flex-col"
        >
          {enlaces.map((enlace) => (
            <NavLink
              key={enlace.ruta}
              to={enlace.ruta}
              end={enlace.exacto}
              className={({ isActive }) =>
                isActive
                  ? "flex shrink-0 items-center gap-3 rounded-xl bg-cyan-800 px-4 py-3 text-sm font-medium text-white transition-colors"
                  : "flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
              }
            >
              <span aria-hidden="true" className="text-lg">
                {enlace.icono}
              </span>

              {enlace.nombre}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="flex items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-800">
              {usuario?.email ?? "Pepito"}
            </p>
            <p className="text-xs text-slate-500">
              {usuario?.role ?? "Sesión autenticada"}
            </p>
          </div>

          <button
            type="button"
            onClick={cerrarSesion}
            className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 focus:outline-none focus:ring-4 focus:ring-cyan-100"
          >
            <LogOut size={16} aria-hidden="true" />
            <span className="hidden sm:inline">Cerrar sesión</span>
          </button>
        </header>

        <Outlet />
      </div>
    </div>
  );
}
