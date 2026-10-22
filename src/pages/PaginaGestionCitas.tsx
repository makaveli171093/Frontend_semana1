import { useState } from "react";
import toast from "react-hot-toast";

import { useCitasStore } from "../stores/citasStore";
import type { NuevoEstadoCita } from "../services/citas";
import { extraerMensajeError } from "../lib/errorHandler";

export function PaginaGestionCitas() {
  const [id, setId] = useState("");
  const cita = useCitasStore((s) => s.citaSeleccionada);
  const buscando = useCitasStore((s) => s.cargando);
  const actualizando = useCitasStore((s) => s.actualizando);

  const cargarPorId = useCitasStore((s) => s.cargarPorId);
  const actualizarEstado = useCitasStore((s) => s.actualizarEstado);

  const buscarCita = async () => {
    const citaId = Number(id);

    if (!Number.isInteger(citaId) || citaId <= 0) {
      toast.error("Introduce un ID válido");
      return;
    }

    try {
      await cargarPorId(citaId);
    } catch (err: unknown) {
      toast.error(extraerMensajeError(err));
    }
  };

  const cambiarEstado = async (nuevoEstado: NuevoEstadoCita) => {
    if (!cita || actualizando || buscando) return;

    try {
      await actualizarEstado(cita.id, nuevoEstado);
      toast.success("Estado actualizado correctamente");
    } catch (err: unknown) {
      toast.error(`Cambio revertido: ${extraerMensajeError(err)}`);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-slate-900">Gestión de citas</h1>

        <p className="mt-2 text-slate-600">
          Consulta una cita real y actualiza su estado.
        </p>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <label className="block text-sm font-medium text-slate-700">
            ID de la cita
          </label>

          <div className="mt-3 flex gap-3">
            <input
              type="number"
              min="1"
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="Ej.: 1"
              className="min-w-0 flex-1 rounded-lg border border-slate-300 p-3"
            />

            <button
              type="button"
              disabled={buscando || actualizando}
              onClick={() => void buscarCita()}
              className="rounded-lg bg-cyan-800 px-5 py-3 text-white disabled:opacity-50"
            >
              {buscando ? "Buscando..." : "Consultar"}
            </button>
          </div>
        </section>

        {cita && (
          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Cita #{cita.id}</h2>

            <div className="mt-4 space-y-2 text-slate-700">
              <p>Paciente ID: {cita.patientId}</p>
              <p>Médico ID: {cita.doctorId}</p>
              <p>Fecha: {new Date(cita.scheduledAt).toLocaleString("es-BO")}</p>

              <p>
                Estado:
                <span className="ml-2 rounded-lg bg-cyan-100 px-3 py-1 font-semibold text-cyan-900">
                  {cita.status}
                </span>
              </p>
            </div>

            {cita.status === "PROGRAMADA" && (
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled={actualizando}
                  onClick={() => void cambiarEstado("COMPLETADA")}
                  className="rounded-lg bg-emerald-700 px-5 py-3 text-white disabled:opacity-50"
                >
                  Completar cita
                </button>

                <button
                  type="button"
                  disabled={actualizando}
                  onClick={() => void cambiarEstado("CANCELADA")}
                  className="rounded-lg bg-red-700 px-5 py-3 text-white disabled:opacity-50"
                >
                  Cancelar cita
                </button>
              </div>
            )}

            {actualizando && (
              <p role="status" className="mt-4 text-sm text-slate-500">
                Sincronizando cambio con el servidor...
              </p>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
