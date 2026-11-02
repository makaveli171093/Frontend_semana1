interface SpinnerProps {
  fullscreen?: boolean;
}

export function Spinner({ fullscreen = false }: SpinnerProps) {
  const indicador = (
    <span
      aria-hidden="true"
      className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-cyan-800"
    />
  );

  if (fullscreen) {
    return (
      <div
        role="status"
        aria-label="Cargando"
        className="fixed inset-0 z-100 flex items-center justify-center bg-white/75"
      >
        <span className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-cyan-800" />
      </div>
    );
  }

  return (
    <span role="status" aria-label="Cargando" className="inline-flex">
      {indicador}
    </span>
  );
}
