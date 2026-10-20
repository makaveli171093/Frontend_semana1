import { useState, useEffect } from "react";
import MetricCard from "../components/MetricCard";
import StatusBadge from "../components/StatusBadge";
import type { Metrica } from "../types";
import { Link } from "react-router-dom";
import { api } from "../lib/axios";
import axios from "axios";

interface EstadisticasCitas {
  programadas: number;
  completadas: number;
}

function PaginaDashboard() {
  const [pacientes, setPacientes] = useState<number>(128);
  const [mantenimiento, setMantenimiento] = useState<boolean>(false);
  const [totalPacientes, setTotalPacientes] = useState<number | null>(null);
  const [cargandoPacientes, setCargandoPacientes] = useState(true);
  const [errorPacientes, setErrorPacientes] = useState(false);
  const [totalMedicos, setTotalMedicos] = useState<number | null>(null);
  const [cargandoMedicos, setCargandoMedicos] = useState(true);
  const [errorMedicos, setErrorMedicos] = useState(false);
  const [estadisticasCitas, setEstadisticasCitas] =
    useState<EstadisticasCitas | null>(null);

  const [cargandoCitas, setCargandoCitas] = useState(true);
  const [errorCitas, setErrorCitas] = useState(false);

  const incrementarPacientes = () => {
    setPacientes((anterior) => anterior + 1);
  };

  const decrementarPacientes = () => {
    setPacientes((anterior) => Math.max(0, anterior - 1));
  };

  useEffect(() => {
    const controlador = new AbortController();

    api
      .get<EstadisticasCitas>("/reports/appointment-stats", {
        signal: controlador.signal,
      })
      .then((respuesta) => {
        setEstadisticasCitas(respuesta.data);
        setErrorCitas(false);
      })
      .catch((error: unknown) => {
        if (!axios.isCancel(error)) {
          setErrorCitas(true);
        }
      })
      .finally(() => {
        if (!controlador.signal.aborted) {
          setCargandoCitas(false);
        }
      });

    return () => controlador.abort();
  }, []);

  useEffect(() => {
    const controlador = new AbortController();

    api
      .get<unknown[]>("/patients", {
        signal: controlador.signal,
      })
      .then((respuesta) => {
        setTotalPacientes(respuesta.data.length);
        setErrorPacientes(false);
      })
      .catch((error: unknown) => {
        if (!axios.isCancel(error)) {
          setErrorPacientes(true);
        }
      })
      .finally(() => {
        if (!controlador.signal.aborted) {
          setCargandoPacientes(false);
        }
      });

    return () => controlador.abort();
  }, []);

  useEffect(() => {
    const controlador = new AbortController();

    api
      .get<unknown[]>("/doctors", {
        signal: controlador.signal,
      })
      .then((respuesta) => {
        if (!Array.isArray(respuesta.data)) {
          throw new Error("La API no devolvió un arreglo de médicos");
        }

        setTotalMedicos(respuesta.data.length);
        setErrorMedicos(false);
      })
      .catch((error: unknown) => {
        if (!axios.isCancel(error)) {
          setErrorMedicos(true);
        }
      })
      .finally(() => {
        if (!controlador.signal.aborted) {
          setCargandoMedicos(false);
        }
      });

    return () => controlador.abort();
  }, []);

  const metricas: Metrica[] = [
    {
      id: "pacientes",
      titulo: "Pacientes",
      valor: cargandoPacientes
        ? "Cargando..."
        : errorPacientes
          ? "Error"
          : (totalPacientes ?? 0),
      descripcion: "Total registrado en PostgreSQL",
      tendencia: "neutra",
      icono: "👥",
    },
    {
      id: "citas",
      titulo: "Citas Programadas",
      valor: cargandoCitas
        ? "Cargando..."
        : errorCitas
          ? "Error"
          : (estadisticasCitas?.programadas ?? 0),
      descripcion: "Citas programadas en PostgreSQL",
      tendencia: "neutra",
      icono: "📅",
    },
    {
      id: "completadas",
      titulo: "Citas Completadas",
      valor: cargandoCitas
        ? "Cargando..."
        : errorCitas
          ? "Error"
          : (estadisticasCitas?.completadas ?? 0),
      descripcion: "Total histórico de citas completadas",
      tendencia: "neutra",
      icono: "✅",
    },
    {
      id: "medicos",
      titulo: "Médicos",
      valor: cargandoMedicos
        ? "Cargando..."
        : errorMedicos
          ? "Error"
          : (totalMedicos ?? 0),
      descripcion: "Médicos registrados en PostgreSQL",
      tendencia: "neutra",
      icono: "🩺",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        {/* Encabezado */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Clínica Salud Integral
            </h1>
            <p className="text-slate-500 mt-2">Panel de control general</p>
          </div>

          <StatusBadge activo={!mantenimiento} />
        </div>
        <Link
          to="/pacientes"
          className="inline-block rounded-lg bg-cyan-800 px-5 py-3 text-sm font-semibold text-white hover:bg-cyan-900"
        >
          Ver Pacientes →
        </Link>

        {/* Banner de mantenimiento */}
        {mantenimiento && (
          <div className="bg-rose-100 border border-rose-300 text-rose-800 rounded-xl p-4 mb-6">
            ⚠️ El sistema está en modo mantenimiento.
          </div>
        )}

        {/* Interruptor */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 mb-8 flex flex-wrap justify-between items-center gap-4">
          <div>
            <h2 className="font-semibold text-slate-800">Modo mantenimiento</h2>
            <p className="text-sm text-slate-500">
              Activa o desactiva el estado de mantenimiento.
            </p>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={mantenimiento}
            aria-label="Modo mantenimiento"
            onClick={() => setMantenimiento((anterior) => !anterior)}
            className={`w-14 h-8 rounded-full p-1 transition-colors ${
              mantenimiento ? "bg-rose-600" : "bg-slate-300"
            }`}
          >
            <span
              className={`block w-6 h-6 rounded-full bg-white shadow-sm transition-transform ${
                mantenimiento ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Listado de métricas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {metricas.map((metrica) => (
            <MetricCard key={metrica.id} metrica={metrica} />
          ))}
        </div>

        {/* Controles de pacientes */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 mt-8">
          <h2 className="text-lg font-semibold text-slate-800">
            Control de pacientes
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Modifica la cantidad mostrada en el Dashboard.
          </p>

          <div className="flex items-center gap-4 mt-5">
            <button
              type="button"
              onClick={decrementarPacientes}
              disabled={pacientes === 0}
              className="bg-slate-100 text-slate-700 px-5 py-2 rounded-lg font-bold hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              −
            </button>

            <span className="text-2xl font-bold text-slate-800">
              {pacientes}
            </span>

            <button
              type="button"
              onClick={incrementarPacientes}
              className="bg-emerald-600 text-white px-5 py-2 rounded-lg font-bold hover:bg-emerald-700"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default PaginaDashboard;
