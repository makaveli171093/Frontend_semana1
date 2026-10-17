import { Link } from "react-router-dom";

export function PaginaNotFound() {
  return (
    <main className="flex min-h-[80vh] items-center justify-center px-6">
      <div className="max-w-md text-center">
        <div className="mb-4 text-6xl">🔍</div>

        <h1 className="text-6xl font-bold text-cyan-900">404</h1>

        <h2 className="mt-4 text-2xl font-semibold text-slate-900">
          Página no encontrada
        </h2>

        <p className="mt-3 text-slate-500">
          La página o el paciente que buscas no existe.
        </p>

        <Link
          to="/"
          className="mt-8 inline-block rounded-xl bg-cyan-800 px-6 py-3 font-medium text-white hover:bg-cyan-900"
        >
          Ir al inicio
        </Link>
      </div>
    </main>
  );
}
