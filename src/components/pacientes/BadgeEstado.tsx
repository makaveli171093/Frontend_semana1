import type { EstadoPaciente } from "../../types/paciente";

interface BadgeEstadoProps {
  estado: EstadoPaciente;
}

const estilosPorEstado: Record<EstadoPaciente, string> = {
  activo: "bg-emerald-50 text-emerald-700 border-emerald-200",
  inactivo: "bg-slate-100 text-slate-600 border-slate-200",
  en_espera: "bg-amber-50 text-amber-700 border-amber-200",
};

const textosPorEstado: Record<EstadoPaciente, string> = {
  activo: "Activo",
  inactivo: "Inactivo",
  en_espera: "En espera",
};

export function BadgeEstado({ estado }: BadgeEstadoProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${estilosPorEstado[estado]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {textosPorEstado[estado]}
    </span>
  );
}
