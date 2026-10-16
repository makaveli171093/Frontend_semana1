import { FormularioCita } from "../components/citas/FormularioCita";

export function PaginaNuevaCita() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8">
          <p className="text-sm font-semibold text-cyan-800">
            Clínica Salud Integral
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Agendar nueva cita
          </h1>

          <p className="mt-2 text-slate-500">Programa una atención médica.</p>
        </header>

        <FormularioCita />
      </div>
    </main>
  );
}
