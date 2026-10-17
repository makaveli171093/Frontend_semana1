import { NavLink, Outlet } from "react-router-dom";

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
];

export function Layout() {
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
                `flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-cyan-800 text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`
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

      {/* Contenido correspondiente a la ruta */}
      <div className="min-w-0 flex-1">
        <Outlet />
      </div>
    </div>
  );
}
