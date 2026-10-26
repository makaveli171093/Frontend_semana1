import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { extraerMensajeError } from "../lib/errorHandler";
import { reportesService } from "../services/reportes";
import type { CitasPorEspecialidadApi } from "../types/reportesApi";

interface CitasPorDiaGrafica {
  fecha: string;
  etiqueta: string;
  total: number;
}

function obtenerUltimosSieteDias(): string[] {
  const hoy = new Date();

  return Array.from({ length: 7 }, (_, index) => {
    const fecha = new Date(hoy);
    fecha.setDate(hoy.getDate() - (6 - index));

    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const dia = String(fecha.getDate()).padStart(2, "0");

    return `${anio}-${mes}-${dia}`;
  });
}

function formatearFecha(fecha: string): string {
  return new Date(`${fecha}T12:00:00`).toLocaleDateString("es-BO", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
}

export function PaginaReportes() {
  const [citasEspecialidad, setCitasEspecialidad] = useState<
    CitasPorEspecialidadApi[]
  >([]);

  const [citasDiarias, setCitasDiarias] = useState<CitasPorDiaGrafica[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    let vigente = true;

    async function cargarReportes() {
      setCargando(true);
      setError(null);

      try {
        const fechas = obtenerUltimosSieteDias();

        const [especialidades, diarios] = await Promise.all([
          reportesService.obtenerCitasPorEspecialidad(),

          Promise.all(
            fechas.map(async (fecha) => {
              const reporte =
                await reportesService.obtenerHorariosOcupados(fecha);

              return {
                fecha,
                etiqueta: formatearFecha(fecha),
                total: reporte.totalBooked,
              };
            }),
          ),
        ]);

        if (!vigente) return;

        setCitasEspecialidad(especialidades);
        setCitasDiarias(diarios);
      } catch (err: unknown) {
        if (!vigente) return;

        setError(extraerMensajeError(err));
      } finally {
        if (vigente) {
          setCargando(false);
        }
      }
    }

    void cargarReportes();

    return () => {
      vigente = false;
    };
  }, [intento]);

  const sinCitasDiarias =
    citasDiarias.length === 0 || citasDiarias.every((dia) => dia.total === 0);

  return (
    <main className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-800">
          Reportes y estadísticas
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Consulta las citas por especialidad y la actividad de los últimos
          siete días.
        </p>
      </header>

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-4"
        >
          <p className="font-medium text-red-700">
            No se pudieron cargar los reportes.
          </p>

          <p className="mt-1 text-sm text-red-600">{error}</p>

          <button
            type="button"
            onClick={() => setIntento((actual) => actual + 1)}
            className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      )}

      {cargando && !error ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {[1, 2].map((item) => (
            <section
              key={item}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="mb-6 h-6 w-2/3 animate-pulse rounded bg-slate-200" />
              <div className="h-72 animate-pulse rounded-lg bg-slate-100" />
            </section>
          ))}
        </div>
      ) : !error ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800">
              Citas por especialidad
            </h2>

            <p className="mb-4 mt-1 text-sm text-slate-500">
              Distribución de las citas registradas por especialidad.
            </p>

            {citasEspecialidad.length === 0 ? (
              <div className="flex h-72 items-center justify-center rounded-lg bg-slate-50 p-6 text-center text-slate-500">
                No hay datos de citas por especialidad.
              </div>
            ) : (
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={citasEspecialidad}
                    margin={{ top: 10, right: 10, left: 0, bottom: 45 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="specialty"
                      angle={-25}
                      textAnchor="end"
                      interval={0}
                      height={65}
                      tick={{ fontSize: 11 }}
                    />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar
                      dataKey="total_appointments"
                      name="Citas"
                      fill="#2563eb"
                      radius={[5, 5, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800">
              Actividad de los últimos 7 días
            </h2>

            <p className="mb-4 mt-1 text-sm text-slate-500">
              Citas no canceladas por día.
            </p>

            {sinCitasDiarias ? (
              <div className="flex h-72 items-center justify-center rounded-lg bg-slate-50 p-6 text-center text-slate-500">
                No se registraron citas no canceladas durante los últimos siete
                días.
              </div>
            ) : (
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={citasDiarias}
                    margin={{ top: 10, right: 15, left: 0, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="etiqueta" tick={{ fontSize: 11 }} />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="total"
                      name="Citas no canceladas"
                      stroke="#16a34a"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            <p className="mt-3 text-xs text-slate-500">
              Incluye citas PROGRAMADA, COMPLETADA y ATENDIDO; excluye las
              CANCELADA.
            </p>
          </section>
        </div>
      ) : null}
    </main>
  );
}
