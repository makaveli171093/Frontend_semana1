import type { Metrica, Tendencia } from "../types";

interface MetricCardProps {
  metrica: Metrica;
}

const colorPorTendencia: Record<Tendencia, string> = {
  positiva: "text-emerald-600",
  negativa: "text-rose-600",
  neutra: "text-slate-600",
};

function MetricCard({ metrica }: MetricCardProps) {
  return (
    <article className="bg-white p-6 rounded-2x1 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-slate-500">{metrica.titulo}</h2>
        <span className="text-3xl" aria-hidden="true">
          {metrica.icono}
        </span>
      </div>
      <p className="text-4xl font-bold text-slate-800 mt-4">{metrica.valor}</p>

      <p
        className={`text-sm mt-3 font-medium ${
          colorPorTendencia[metrica.tendencia]
        }`}
      >
        {metrica.descripcion}
      </p>
    </article>
  );
}

export default MetricCard;
