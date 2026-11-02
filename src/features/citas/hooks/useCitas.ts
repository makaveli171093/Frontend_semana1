import { useCitasStore } from "../../../stores/citasStore";

export function useCitas() {
  const citas = useCitasStore((s) => s.citas);
  const citaSeleccionada = useCitasStore((s) => s.citaSeleccionada);
  const cargando = useCitasStore((s) => s.cargando);
  const error = useCitasStore((s) => s.error);
  const actualizando = useCitasStore((s) => s.actualizando);

  const cargarPorPaciente = useCitasStore((s) => s.cargarPorPaciente);
  const cargarPorId = useCitasStore((s) => s.cargarPorId);
  const seleccionar = useCitasStore((s) => s.seleccionar);
  const actualizarEstado = useCitasStore((s) => s.actualizarEstado);
  const agregarCita = useCitasStore((s) => s.agregarCita);

  return {
    citas,
    citaSeleccionada,
    cargando,
    error,
    actualizando,
    cargarPorPaciente,
    cargarPorId,
    seleccionar,
    actualizarEstado,
    agregarCita,
  };
}
