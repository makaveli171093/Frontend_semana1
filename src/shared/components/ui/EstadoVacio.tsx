interface EstadoVacioProps {
  titulo: string;
  descripcion?: string;
  accion?: {
    label: string;
    onClick: () => void;
  };
}

export function EstadoVacio({ titulo, descripcion, accion }: EstadoVacioProps) {
  return (
    <section
      role="status"
      className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center"
    >
      <div className="text-4xl" aria-hidden="true">
        📂
      </div>

      <h3 className="mt-4 font-semibold text-slate-800">{titulo}</h3>

      {descripcion && (
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
          {descripcion}
        </p>
      )}

      {accion && (
        <button
          type="button"
          onClick={accion.onClick}
          className="mt-5 rounded-xl bg-cyan-800 px-5 py-3 text-sm font-semibold text-white hover:bg-cyan-900"
        >
          {accion.label}
        </button>
      )}
    </section>
  );
}
