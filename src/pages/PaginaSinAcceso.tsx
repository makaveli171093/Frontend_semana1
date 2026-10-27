import { Link } from "react-router-dom";

export function PaginaSinAcceso() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="text-2xl font-bold text-gray-900">Acceso denegado</h1>

      <p className="mt-3 max-w-xl text-gray-600">
        No tienes permisos para acceder a esta página. Si crees que deberías
        tener acceso, contacta con el administrador.
      </p>

      <Link
        to="/"
        className="mt-6 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
      >
        Volver al inicio
      </Link>
    </main>
  );
}
