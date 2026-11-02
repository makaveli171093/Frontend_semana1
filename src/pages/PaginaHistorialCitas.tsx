import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { citasService } from "../services/citas";
import { medicosService } from "../services/medicos";

import { useAuthStore } from "../stores/authStore";
import { extraerMensajeError } from "../lib/errorHandler";

import type { RespuestaPaginada } from "../types/api";
import type { CitaHistorialApi, EstadoCita } from "../types/citasApi";
import type { MedicoApi } from "../types/medicosApi";
import { AlertaBanner } from "../shared/components/ui/AlertaBanner";
import { EstadoVacio } from "../shared/components/ui/EstadoVacio";
import { SkeletonCitaRow } from "../shared/components/skeletons/SkeletonCitaRow";

const ESTADOS = ["Todos", "Programada", "Completada", "Cancelada"] as const;

type EstadoFiltro = (typeof ESTADOS)[number];

const ESTADO_API: Record<EstadoFiltro, EstadoCita | "TODOS"> = {
  Todos: "TODOS",
  Programada: "PROGRAMADA",
  Completada: "COMPLETADA",
  Cancelada: "CANCELADA",
};

const ETIQUETAS_ESTADO: Record<EstadoCita, string> = {
  PROGRAMADA: "Programada",
  COMPLETADA: "Completada",
  CANCELADA: "Cancelada",
  ATENDIDO: "Atendido",
};

const CLASES_ESTADO: Record<EstadoCita, string> = {
  PROGRAMADA: "bg-amber-100 text-amber-800",
  COMPLETADA: "bg-emerald-100 text-emerald-800",
  CANCELADA: "bg-rose-100 text-rose-800",
  ATENDIDO: "bg-sky-100 text-sky-800",
};

function leerPagina(valor: string | null): number {
  if (!valor) return 1;

  const numero = Number(valor);

  return Number.isSafeInteger(numero) && numero > 0 ? numero : 1;
}

function leerEstado(valor: string | null): EstadoFiltro {
  return ESTADOS.find((estado) => estado === valor) ?? "Todos";
}

function formatearFecha(fecha: string): string {
  const fechaValida = new Date(fecha);

  if (Number.isNaN(fechaValida.getTime())) return fecha;

  return new Intl.DateTimeFormat("es-BO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(fechaValida);
}

export function PaginaHistorialCitas() {
  const [intento, setIntento] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();

  const usuario = useAuthStore((state) => state.usuario);
  const esGerencia = usuario?.role === "GERENCIA";

  // Estado sincronizado con la URL
  const pagina = leerPagina(searchParams.get("pagina"));
  const estado = leerEstado(searchParams.get("estado"));

  const medicoIdParam = searchParams.get("medicoId") ?? "";
  const medicoId = Number(medicoIdParam);

  const medicoIdValido =
    /^\d+$/.test(medicoIdParam) &&
    Number.isSafeInteger(medicoId) &&
    medicoId > 0;

  // Médicos
  const [medicos, setMedicos] = useState<MedicoApi[]>([]);
  const [medicosListos, setMedicosListos] = useState(false);
  const [errorMedicos, setErrorMedicos] = useState<string | null>(null);
  const [intentoMedicos, setIntentoMedicos] = useState(0);

  // Historial
  const [resultadoHistorial, setResultadoHistorial] = useState<{
    clave: string;
    datos: RespuestaPaginada<CitaHistorialApi>;
  } | null>(null);

  const [errorSolicitud, setErrorSolicitud] = useState<{
    clave: string;
    mensaje: string;
  } | null>(null);

  const medicoSeleccionado = medicos.find((medico) => medico.id === medicoId);

  const requiereSeleccion = esGerencia && !medicoIdValido;

  const medicosCargando = esGerencia && !medicosListos && !errorMedicos;

  const claveConsulta = `${esGerencia ? medicoId : "mi-historial"}-${pagina}-${estado}-${intento}`;

  const historial =
    resultadoHistorial?.clave === claveConsulta
      ? resultadoHistorial.datos
      : null;

  const error =
    errorSolicitud?.clave === claveConsulta ? errorSolicitud.mensaje : null;

  const cargando = !requiereSeleccion && !historial && !error;

  // Gerencia: cargar médicos disponibles
  useEffect(() => {
    if (!esGerencia) return;

    const controller = new AbortController();

    void medicosService
      .listarTodos(controller.signal)
      .then((resultado) => {
        if (!controller.signal.aborted) {
          setMedicos(resultado);
          setErrorMedicos(null);
        }
      })
      .catch((err: unknown) => {
        if (!controller.signal.aborted) {
          setErrorMedicos(extraerMensajeError(err));
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setMedicosListos(true);
        }
      });

    return () => controller.abort();
  }, [esGerencia, intentoMedicos]);

  // Cargar historial según rol, médico, página y estado
  useEffect(() => {
    const controller = new AbortController();

    if (esGerencia && !medicoIdValido) {
      return () => controller.abort();
    }

    const filtros = {
      pagina,
      limite: 10,
      estado: ESTADO_API[estado],
      signal: controller.signal,
    };

    const solicitud = esGerencia
      ? citasService.obtenerHistorialMedico(medicoId, filtros)
      : citasService.obtenerMiHistorial(filtros);

    void solicitud
      .then((resultado) => {
        if (!controller.signal.aborted) {
          setResultadoHistorial({
            clave: claveConsulta,
            datos: resultado,
          });
        }
      })
      .catch((err: unknown) => {
        if (!controller.signal.aborted) {
          setErrorSolicitud({
            clave: claveConsulta,
            mensaje: extraerMensajeError(err),
          });
        }
      });

    return () => controller.abort();
  }, [
    pagina,
    estado,
    esGerencia,
    medicoId,
    medicoIdValido,
    intento,
    claveConsulta,
  ]);

  // Evitar permanecer en una página que ya no existe
  useEffect(() => {
    if (cargando || !historial) return;

    const ultimaPagina = Math.max(historial.totalPaginas, 1);

    if (pagina > ultimaPagina) {
      const parametros = new URLSearchParams(searchParams);

      parametros.set("pagina", String(ultimaPagina));

      setSearchParams(parametros, { replace: true });
    }
  }, [cargando, historial, pagina, searchParams, setSearchParams]);

  // Cambiar estado y volver a página 1
  const handleCambiarEstado = (nuevoEstado: EstadoFiltro) => {
    const parametros: Record<string, string> = {
      pagina: "1",
      estado: nuevoEstado,
    };

    if (esGerencia && medicoIdValido) {
      parametros.medicoId = String(medicoId);
    }

    setSearchParams(parametros);
  };

  // Cambiar médico y volver a página 1
  const handleCambiarMedico = (nuevoMedicoId: string) => {
    const parametros: Record<string, string> = {
      pagina: "1",
      estado,
    };

    if (nuevoMedicoId) {
      parametros.medicoId = nuevoMedicoId;
    }

    setSearchParams(parametros);
  };

  // Cambiar página conservando filtros y médico seleccionado
  const handleCambiarPagina = (nuevaPagina: number) => {
    const parametros = new URLSearchParams(searchParams);

    parametros.set("pagina", String(nuevaPagina));
    parametros.set("estado", estado);

    setSearchParams(parametros);
  };

  const totalPaginas = historial?.totalPaginas ?? 0;
  const totalPaginasMostrar = Math.max(totalPaginas, 1);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl">
        {/* Encabezado */}
        <header className="mb-8">
          <p className="text-sm font-semibold text-cyan-800">
            Clínica Salud Integral
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            {esGerencia
              ? medicoSeleccionado
                ? `Historial de ${medicoSeleccionado.firstName} ${medicoSeleccionado.lastName}`
                : "Historial de citas"
              : "Mi historial de citas"}
          </h1>

          <p className="mt-2 text-slate-500">
            Consulta el historial de citas médicas y filtra por estado.
          </p>
        </header>

        {/* Selector exclusivo de Gerencia */}
        {esGerencia && (
          <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <label
              htmlFor="medicoId"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Seleccionar médico
            </label>

            <select
              id="medicoId"
              value={medicoIdParam}
              onChange={(event) => handleCambiarMedico(event.target.value)}
              disabled={medicosCargando || !!errorMedicos}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-700 focus:ring-2 focus:ring-cyan-100 disabled:opacity-50 sm:max-w-xl"
            >
              <option value="">
                {medicosCargando
                  ? "Cargando médicos..."
                  : "Selecciona un médico"}
              </option>

              {medicos.map((medico) => (
                <option key={medico.id} value={medico.id}>
                  {medico.firstName} {medico.lastName}
                  {" — "}
                  {medico.specialty.name}
                  {!medico.isActive ? " (Inactivo)" : ""}
                </option>
              ))}
            </select>

            {errorMedicos && (
              <div className="mt-4">
                <AlertaBanner
                  tipo="error"
                  titulo="No se pudieron cargar los médicos"
                  mensaje={errorMedicos}
                  accion={{
                    label: "Reintentar",
                    onClick: () => {
                      setErrorMedicos(null);
                      setMedicosListos(false);
                      setIntentoMedicos((actual) => actual + 1);
                    },
                  }}
                />
              </div>
            )}
          </section>
        )}

        {/* Filtros */}
        <section className="mb-6 flex flex-wrap items-end justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div>
            <label
              htmlFor="estado"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Filtrar por estado
            </label>

            <select
              id="estado"
              value={estado}
              onChange={(event) =>
                handleCambiarEstado(event.target.value as EstadoFiltro)
              }
              className="min-w-48 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-700 focus:ring-2 focus:ring-cyan-100"
            >
              {ESTADOS.map((opcion) => (
                <option key={opcion} value={opcion}>
                  {opcion}
                </option>
              ))}
            </select>
          </div>

          <p className="text-sm text-slate-500">Registros por página: 10</p>
        </section>

        {/* Selección pendiente */}
        {requiereSeleccion ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <p className="font-medium text-slate-700">
              Selecciona un médico para consultar su historial.
            </p>
          </div>
        ) : error && !cargando ? (
          <AlertaBanner
            tipo="error"
            titulo="No se pudo cargar el historial"
            mensaje={error}
            accion={{
              label: "Reintentar",
              onClick: () => setIntento((actual) => actual + 1),
            }}
          />
        ) : (
          <>
            {/* Tabla */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="overflow-x-auto" aria-busy={cargando}>
                <table className="w-full min-w-190 text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-5 py-4">Paciente</th>
                      <th className="px-5 py-4">Fecha de cita</th>
                      <th className="px-5 py-4">Motivo</th>
                      <th className="px-5 py-4">Estado</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {cargando ? (
                      Array.from({ length: 10 }, (_, index) => (
                        <SkeletonCitaRow key={`skeleton-${index}`} />
                      ))
                    ) : historial && historial.data.length > 0 ? (
                      historial.data.map((cita) => (
                        <tr key={cita.id} className="h-19 hover:bg-slate-50">
                          <td className="px-5 font-medium text-slate-800">
                            {cita.patient.firstName} {cita.patient.lastName}
                          </td>

                          <td className="px-5 text-slate-600">
                            {formatearFecha(cita.scheduledAt)}
                          </td>

                          <td className="max-w-xs truncate px-5 text-slate-600">
                            {cita.reason || "Sin motivo registrado"}
                          </td>

                          <td className="px-5">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${CLASES_ESTADO[cita.status]}`}
                            >
                              {ETIQUETAS_ESTADO[cita.status]}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-5 py-6">
                          <EstadoVacio
                            titulo="No hay citas registradas"
                            descripcion="No se encontraron citas para el médico y estado seleccionados."
                          />
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Paginación */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <p
                aria-live="polite"
                className="text-sm font-medium text-slate-600"
              >
                {cargando
                  ? "Cargando historial..."
                  : `Página ${pagina} de ${totalPaginasMostrar} — ${historial?.total ?? 0} registros`}
              </p>

              <div className="flex gap-3">
                <button
                  type="button"
                  disabled={cargando || pagina <= 1}
                  onClick={() => handleCambiarPagina(pagina - 1)}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  ← Anterior
                </button>

                <button
                  type="button"
                  disabled={cargando || pagina >= totalPaginas}
                  onClick={() => handleCambiarPagina(pagina + 1)}
                  className="rounded-xl bg-cyan-800 px-5 py-3 text-sm font-medium text-white transition hover:bg-cyan-900 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Siguiente →
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
