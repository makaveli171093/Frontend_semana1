interface BuscadorPacientesProps {
  value: string;
  onChange: (valor: string) => void;
}

export function BuscadorPacientes({ value, onChange }: BuscadorPacientesProps) {
  return (
    <div className="relative w-full md:max-w-sm">
      <span
        aria-hidden="true"
        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
      >
        🔍
      </span>

      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar por nombre, apellido o correo..."
        aria-label="Buscar pacientes"
        className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"
      />
    </div>
  );
}
