interface ModalConfirmacionProps {
  abierto: boolean;
  titulo: string;
  mensaje: string;
  procesando: boolean;
  onConfirmar: () => void;
  onCancelar: () => void;
}

export function ModalConfirmacion({
  abierto,
  titulo,
  mensaje,
  procesando,
  onConfirmar,
  onCancelar,
}: ModalConfirmacionProps) {
  if (!abierto) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-confirmacion"
        aria-describedby="mensaje-confirmacion"
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
      >
        <h2
          id="titulo-confirmacion"
          className="text-xl font-bold text-slate-900"
        >
          {titulo}
        </h2>

        <p id="mensaje-confirmacion" className="mt-3 text-sm text-slate-600">
          {mensaje}
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancelar}
            disabled={procesando}
            className="rounded-lg border border-slate-300 px-4 py-2 text-slate-700 disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={onConfirmar}
            disabled={procesando}
            className="rounded-lg bg-red-700 px-4 py-2 text-white hover:bg-red-800 disabled:opacity-50"
          >
            {procesando ? "Eliminando..." : "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
}
