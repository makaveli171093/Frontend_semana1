interface SkeletonPacienteRowProps {
  vista?: "tabla" | "tarjeta";
}

export function SkeletonPacienteRow({
  vista = "tabla",
}: SkeletonPacienteRowProps) {
  if (vista === "tarjeta") {
    return (
      <article
        aria-hidden="true"
        className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5"
      >
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-slate-200" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-36 rounded bg-slate-200" />
            <div className="h-3 w-48 rounded bg-slate-100" />
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="h-4 w-full rounded bg-slate-100" />
          <div className="h-4 w-3/4 rounded bg-slate-100" />
          <div className="h-4 w-2/3 rounded bg-slate-100" />
        </div>

        <div className="mt-5 h-9 w-full rounded bg-slate-100" />
      </article>
    );
  }

  return (
    <tr
      aria-hidden="true"
      className="h-21 animate-pulse border-b border-slate-100"
    >
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-slate-200" />
          <div className="space-y-2">
            <div className="h-4 w-32 rounded bg-slate-200" />
            <div className="h-3 w-40 rounded bg-slate-100" />
          </div>
        </div>
      </td>

      {[28, 32, 24, 20, 36].map((ancho, index) => (
        <td key={index} className="px-5 py-4">
          <div
            className="h-4 rounded bg-slate-200"
            style={{ width: `${ancho * 2}px` }}
          />
        </td>
      ))}
    </tr>
  );
}
