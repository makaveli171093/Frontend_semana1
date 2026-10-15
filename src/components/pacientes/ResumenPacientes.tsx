import type { Paciente } from "../../types/paciente";

interface ResumenPacientesProps {
  pacientes: Paciente[];
}

export function ResumenPacientes({ pacientes }: ResumenPacientesProps) {
  const total = pacientes.length;

  const activos = pacientes.filter(
    (paciente) => paciente.estado === "activo",
  ).length;

  const enEspera = pacientes.filter(
    (paciente) => paciente.estado === "en_espera",
  ).length;

  const metricas = [
    {
      titulo: "Total de pacientes",
      valor: total,
      descripcion: "Registrados en la clínica",
      icono: "👥",
      color: "text-cyan-800",
    },
    {
      titulo: "Pacientes activos",
      valor: activos,
      descripcion: "Con seguimiento vigente",
      icono: "💚",
      color: "text-emerald-700",
    },
    {
      titulo: "Pacientes en espera",
      valor: enEspera,
      descripcion: "Pendientes de asignación",
      icono: "🕒",
      color: "text-amber-700",
    },
  ];

  return (
    <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
      {metricas.map((metrica) => (
        <article
          key={metrica.titulo}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <span className={`text-3xl ${metrica.color}`} aria-hidden="true">
              {metrica.icono}
            </span>

            <div>
              <p className="text-sm text-slate-500">{metrica.titulo}</p>

              <p className={`text-3xl font-bold ${metrica.color}`}>
                {metrica.valor}
              </p>

              <p className="text-xs text-slate-500">{metrica.descripcion}</p>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
