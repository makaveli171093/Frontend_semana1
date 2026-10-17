import { useNavigate, useParams } from "react-router-dom";

import { pacientesIniciales } from "../data/pacientes";
import { BadgeEstado } from "../components/pacientes/BadgeEstado";
import { PaginaNotFound } from "./PaginaNotFound";

export function PaginaDetallePaciente() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const paciente = pacientesIniciales.find((registro) => registro.id === id);

  if (!paciente) {
    return <PaginaNotFound />;
  }

  const nombreCompleto = `${paciente.nombre} ${paciente.apellido}`;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 text-sm font-medium text-cyan-800 hover:underline"
        >
          ← Volver
        </button>

        <header className="mb-8">
          <p className="text-sm font-semibold text-cyan-800">
            Clínica Salud Integral
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Detalle del paciente
          </h1>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {nombreCompleto}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Código: {paciente.id}
              </p>
            </div>

            <BadgeEstado estado={paciente.estado} />
          </div>

          <dl className="grid gap-6 sm:grid-cols-2">
            {[
              ["Nombre", paciente.nombre],
              ["Apellido", paciente.apellido],
              ["Correo electrónico", paciente.email],
              ["Teléfono", paciente.telefono],
              ["Especialidad", paciente.especialidadAsignada],
              ["Última cita", paciente.ultimaCita],
              ["Estado", paciente.estado],
              ["Identificador", paciente.id],
            ].map(([titulo, valor]) => (
              <div key={titulo}>
                <dt className="text-sm font-medium text-slate-500">{titulo}</dt>

                <dd className="mt-1 break-words font-semibold text-slate-900">
                  {valor}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </main>
  );
}
