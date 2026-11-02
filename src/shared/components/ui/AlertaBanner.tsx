type TipoAlerta = "info" | "exito" | "advertencia" | "error";

interface AlertaBannerProps {
  tipo: TipoAlerta;
  titulo?: string;
  mensaje: string;
  accion?: {
    label: string;
    onClick: () => void;
  };
}

const estilos: Record<TipoAlerta, string> = {
  info: "border-sky-200 bg-sky-50 text-sky-800",
  exito: "border-emerald-200 bg-emerald-50 text-emerald-800",
  advertencia: "border-amber-200 bg-amber-50 text-amber-800",
  error: "border-rose-200 bg-rose-50 text-rose-800",
};

const titulos: Record<TipoAlerta, string> = {
  info: "Información",
  exito: "Operación exitosa",
  advertencia: "Atención",
  error: "Ha ocurrido un error",
};

export function AlertaBanner({
  tipo,
  titulo,
  mensaje,
  accion,
}: AlertaBannerProps) {
  return (
    <div
      role={tipo === "info" || tipo === "exito" ? "status" : "alert"}
      className={`flex flex-wrap items-center justify-between gap-4 rounded-xl border p-4 ${estilos[tipo]}`}
    >
      <div>
        <p className="font-semibold">{titulo ?? titulos[tipo]}</p>
        <p className="mt-1 text-sm">{mensaje}</p>
      </div>

      {accion && (
        <button
          type="button"
          onClick={accion.onClick}
          className="rounded-lg border border-current px-4 py-2 text-sm font-semibold hover:bg-white/50"
        >
          {accion.label}
        </button>
      )}
    </div>
  );
}
