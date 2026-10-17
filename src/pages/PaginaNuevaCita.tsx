import { FormularioCita } from "../components/citas/FormularioCita";
import { useNavigate } from "react-router-dom";

export function PaginaNuevaCita() {
  const navigate = useNavigate();
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
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
        >
          ← Cancelar y volver
        </button>
        <FormularioCita />
      </div>
    </main>
  );
}
