export function SkeletonCitaRow() {
  return (
    <tr
      aria-hidden="true"
      className="h-19 animate-pulse border-t border-slate-100"
    >
      {[40, 32, 44, 24].map((ancho, index) => (
        <td key={index} className="px-5 py-4">
          <div
            className={`h-4 rounded bg-slate-200`}
            style={{ width: `${ancho * 2}px` }}
          />
        </td>
      ))}
    </tr>
  );
}
