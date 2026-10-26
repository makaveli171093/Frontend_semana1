import { useNavigate, useParams } from "react-router-dom";
import { BadgeEstado } from "../components/pacientes/BadgeEstado";
import { PaginaNotFound } from "./PaginaNotFound";
import { useApi } from "../hooks/useApi";
import type { PacienteApi } from "../types/pacientesApi";

export function PaginaDetallePaciente() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const idValido = id && /^\d+$/.test(id) ? id : null;

  const {
    data: paciente,
    loading,
    error,
    refetch,
  } = useApi<PacienteApi>(idValido ? `/patients/${idValido}` : null);

  if (!idValido) {
    return <PaginaNotFound />;
  }

  const volver = () => navigate(-1);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <button
          type="button"
          onClick={volver}
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

        {loading ? (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-slate-600">Cargando datos del paciente...</p>
          </section>
        ) : error || !paciente ? (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="font-semibold text-red-700">
              {error ?? "No se encontró el paciente."}
            </p>

            <button
              type="button"
              onClick={refetch}
              className="mt-4 rounded-lg bg-cyan-800 px-4 py-2 text-white hover:bg-cyan-900"
            >
              Reintentar
            </button>
          </section>
        ) : (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {paciente.firstName} {paciente.lastName}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Código: {paciente.id}
                </p>
              </div>

              <BadgeEstado estado={paciente.isActive ? "activo" : "inactivo"} />
            </div>

            <dl className="grid gap-6 sm:grid-cols-2">
              {[
                ["Nombre", paciente.firstName],
                ["Apellido", paciente.lastName],
                ["Correo electrónico", paciente.email],
                ["Teléfono", paciente.phone],
                ["Género", paciente.gender],
                [
                  "Fecha de nacimiento",
                  new Date(paciente.birthDate).toLocaleDateString("es-BO"),
                ],
                ["Estado", paciente.isActive ? "Activo" : "Inactivo"],
                ["Identificador", String(paciente.id)],
              ].map(([titulo, valor]) => (
                <div key={titulo}>
                  <dt className="text-sm font-medium text-slate-500">
                    {titulo}
                  </dt>

                  <dd className="mt-1 break-words font-semibold text-slate-900">
                    {valor}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        )}
      </div>
    </main>
  );
}
