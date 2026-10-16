import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { citaSchema, type CitaFormData } from "../../schemas/citaSchema";

import { useMedicos } from "../../hooks/useMedicos";

const valoresIniciales: CitaFormData = {
  pacienteNombre: "",
  medicoId: "",
  fecha: "",
  hora: "",
  motivo: "",
  urgencia: "media",
};

function obtenerFechaLocal(): string {
  const hoy = new Date();
  const anio = hoy.getFullYear();
  const mes = String(hoy.getMonth() + 1).padStart(2, "0");
  const dia = String(hoy.getDate()).padStart(2, "0");

  return `${anio}-${mes}-${dia}`;
}

export function FormularioCita() {
  const { medicos, cargando } = useMedicos();

  const [citaConfirmada, setCitaConfirmada] = useState<CitaFormData | null>(
    null,
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CitaFormData>({
    resolver: zodResolver(citaSchema),
    defaultValues: valoresIniciales,
  });

  const agendarCita = async (datos: CitaFormData) => {
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 1500);
    });

    setCitaConfirmada(datos);
  };

  const agendarOtraCita = () => {
    reset(valoresIniciales);
    setCitaConfirmada(null);
  };

  if (citaConfirmada) {
    const medico = medicos.find((m) => m.id === citaConfirmada.medicoId);

    return (
      <section className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm">
        <div className="mb-5 text-4xl">✅</div>

        <h2 className="text-2xl font-bold text-slate-900">
          ¡Cita agendada correctamente!
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Confirmación simulada. Todavía no se guarda en un servidor.
        </p>

        <dl className="mt-6 grid gap-3 text-sm">
          {[
            ["Paciente", citaConfirmada.pacienteNombre],
            ["Médico", medico?.nombre ?? "No disponible"],
            ["Fecha", citaConfirmada.fecha],
            ["Hora", citaConfirmada.hora],
            ["Motivo", citaConfirmada.motivo],
            ["Urgencia", citaConfirmada.urgencia],
          ].map(([titulo, valor]) => (
            <div
              key={titulo}
              className="flex justify-between gap-4 border-b border-slate-100 pb-3"
            >
              <dt className="font-medium text-slate-500">{titulo}</dt>
              <dd className="text-right text-slate-900">{valor}</dd>
            </div>
          ))}
        </dl>

        <button
          type="button"
          onClick={agendarOtraCita}
          className="mt-6 rounded-xl bg-cyan-800 px-5 py-3 font-medium text-white hover:bg-cyan-900"
        >
          Agendar otra cita
        </button>
      </section>
    );
  }

  const campoClass = (tieneError: boolean) =>
    `w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition ${
      tieneError
        ? "border-red-500 focus:ring-2 focus:ring-red-100"
        : "border-slate-200 focus:border-cyan-700 focus:ring-2 focus:ring-cyan-100"
    }`;

  return (
    <form
      onSubmit={handleSubmit(agendarCita)}
      noValidate
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h2 className="mb-2 text-xl font-bold text-slate-900">
        Nueva cita médica
      </h2>

      <p className="mb-6 text-sm text-slate-500">
        Completa los datos para programar una atención.
      </p>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Paciente */}
        <div>
          <label
            htmlFor="pacienteNombre"
            className="mb-2 block text-sm font-medium"
          >
            Nombre del paciente
          </label>

          <input
            id="pacienteNombre"
            {...register("pacienteNombre")}
            className={campoClass(!!errors.pacienteNombre)}
            aria-invalid={!!errors.pacienteNombre}
            placeholder="Nombre completo"
          />

          {errors.pacienteNombre && (
            <p role="alert" className="mt-1 text-xs text-red-600">
              {errors.pacienteNombre.message}
            </p>
          )}
        </div>

        {/* Médico */}
        <div>
          <label htmlFor="medicoId" className="mb-2 block text-sm font-medium">
            Médico
          </label>

          <select
            id="medicoId"
            {...register("medicoId")}
            disabled={cargando}
            className={campoClass(!!errors.medicoId)}
            aria-invalid={!!errors.medicoId}
          >
            {cargando ? (
              <option value="" disabled>
                Cargando médicos...
              </option>
            ) : (
              <>
                <option value="">Selecciona un médico</option>
                {medicos.map((medico) => (
                  <option key={medico.id} value={medico.id}>
                    {medico.nombre} — {medico.especialidad}
                  </option>
                ))}
              </>
            )}
          </select>

          {errors.medicoId && (
            <p role="alert" className="mt-1 text-xs text-red-600">
              {errors.medicoId.message}
            </p>
          )}
        </div>

        {/* Fecha */}
        <div>
          <label htmlFor="fecha" className="mb-2 block text-sm font-medium">
            Fecha de la cita
          </label>

          <input
            id="fecha"
            type="date"
            min={obtenerFechaLocal()}
            {...register("fecha")}
            className={campoClass(!!errors.fecha)}
            aria-invalid={!!errors.fecha}
          />

          {errors.fecha && (
            <p role="alert" className="mt-1 text-xs text-red-600">
              {errors.fecha.message}
            </p>
          )}
        </div>

        {/* Hora */}
        <div>
          <label htmlFor="hora" className="mb-2 block text-sm font-medium">
            Hora
          </label>

          <input
            id="hora"
            type="time"
            {...register("hora")}
            className={campoClass(!!errors.hora)}
            aria-invalid={!!errors.hora}
          />

          {errors.hora && (
            <p role="alert" className="mt-1 text-xs text-red-600">
              {errors.hora.message}
            </p>
          )}
        </div>

        {/* Motivo */}
        <div className="md:col-span-2">
          <label htmlFor="motivo" className="mb-2 block text-sm font-medium">
            Motivo de la consulta
          </label>

          <textarea
            id="motivo"
            rows={4}
            maxLength={500}
            {...register("motivo")}
            className={campoClass(!!errors.motivo)}
            aria-invalid={!!errors.motivo}
            placeholder="Describe brevemente el motivo de la cita..."
          />

          {errors.motivo && (
            <p role="alert" className="mt-1 text-xs text-red-600">
              {errors.motivo.message}
            </p>
          )}
        </div>

        {/* Urgencia */}
        <div className="md:col-span-2">
          <label htmlFor="urgencia" className="mb-2 block text-sm font-medium">
            Nivel de urgencia
          </label>

          <select
            id="urgencia"
            {...register("urgencia")}
            className={campoClass(!!errors.urgencia)}
            aria-invalid={!!errors.urgencia}
          >
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
            <option value="critica">Crítica</option>
          </select>

          {errors.urgencia && (
            <p role="alert" className="mt-1 text-xs text-red-600">
              {errors.urgencia.message}
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || cargando}
        className="mt-7 w-full rounded-xl bg-cyan-800 px-6 py-3 font-semibold text-white transition hover:bg-cyan-900 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Agendando..." : "Agendar cita"}
      </button>
    </form>
  );
}
