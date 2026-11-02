import { UserRound } from "lucide-react";
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
  {
    ruta: "/historial",
    nombre: "Historial de citas",
    icono: "🕘",
    exacto: true,
  },
];

export function Layout() {
  const navigate = useNavigate();
  const usuario = useAuthStore((state) => state.usuario);
  const logout = useAuthStore((state) => state.logout);

  function cerrarSesion() {
    logout();
    navigate("/login", { replace: true });
  }

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
          {enlaces
            .filter((enlace) => {
              if (enlace.ruta === "/historial") {
                return ["MEDICO", "GERENCIA"].includes(usuario?.role ?? "");
              }

              if (usuario?.role === "MEDICO") {
                return enlace.ruta === "/gestion-citas";
              }

              if (enlace.ruta === "/reportes") {
                return usuario?.role === "GERENCIA";
              }

              return true;
            })
            .map((enlace) => (
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

          {usuario?.role === "MEDICO" && (
            <NavLink
              to="/perfil"
              className={({ isActive }) =>
                isActive
                  ? "flex shrink-0 items-center gap-3 rounded-xl bg-cyan-800 px-4 py-3 text-base font-medium text-white transition-colors"
                  : "flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
              }
            >
              <UserRound size={18} aria-hidden="true" />
              <span>Mi perfil</span>
            </NavLink>
          )}
        </nav>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white px-6 py-4">
          <div>
            <p className="font-semibold">{usuario?.nombre}</p>
            <p className="mt-1 text-xs text-slate-500">{usuario?.role}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800"
            >
              ⌂ Dashboard
            </button>

            <button
              type="button"
              onClick={cerrarSesion}
              className="rounded-lg border border-emerald-700 px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
            >
              Cerrar sesión
            </button>
          </div>
        </header>

        <Outlet />
      </div>
    </div>
  );
}
