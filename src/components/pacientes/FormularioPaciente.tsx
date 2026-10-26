import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import type { Paciente } from "../../types/paciente";

import {
  pacienteSchema,
  type DatosNuevoPaciente,
} from "../../schemas/paciente.schema";

export type { DatosNuevoPaciente } from "../../schemas/paciente.schema";

interface FormularioPacienteProps {
  onAgregar: (datos: DatosNuevoPaciente) => Promise<void>;
  guardando: boolean;
  pacienteInicial?: Paciente | null;
  onCancelarEdicion?: () => void;
}

const valoresInicialesVacios: DatosNuevoPaciente = {
  nombre: "",
  apellido: "",
  email: "",
  telefono: "",
  genero: "MASCULINO",
  fechaNacimiento: "",
};

export function FormularioPaciente({
  onAgregar,
  guardando,
  pacienteInicial = null,
  onCancelarEdicion,
}: FormularioPacienteProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DatosNuevoPaciente>({
    resolver: zodResolver(pacienteSchema),
    defaultValues: valoresInicialesVacios,
  });
  useEffect(() => {
    if (pacienteInicial) {
      reset({
        nombre: pacienteInicial.nombre,
        apellido: pacienteInicial.apellido,
        email: pacienteInicial.email,
        telefono: pacienteInicial.telefono,
        genero: pacienteInicial.genero ?? "MASCULINO",
        fechaNacimiento: pacienteInicial.fechaNacimiento ?? "",
      });
    } else {
      reset(valoresInicialesVacios);
    }
  }, [pacienteInicial, reset]);

  const enviar = async (datos: DatosNuevoPaciente) => {
    try {
      await onAgregar(datos);
      reset();
    } catch {
      // El componente padre ya muestra el mensaje de error.
      // Conservamos los campos para que el usuario los corrija.
    }
  };

  const claseInput =
    "rounded-lg border border-slate-200 p-3 outline-none focus:border-cyan-600";

  return (
    <form
      onSubmit={handleSubmit(enviar)}
      className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h2 className="mb-5 text-lg font-semibold text-slate-900">
        Registrar nuevo paciente
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm text-slate-700">
          Nombre *
          <input
            {...register("nombre")}
            className={claseInput}
            placeholder="Nombre"
          />
          {errors.nombre && (
            <span className="text-red-600">{errors.nombre.message}</span>
          )}
        </label>

        <label className="flex flex-col gap-2 text-sm text-slate-700">
          Apellido *
          <input
            {...register("apellido")}
            className={claseInput}
            placeholder="Apellido"
          />
          {errors.apellido && (
            <span className="text-red-600">{errors.apellido.message}</span>
          )}
        </label>

        <label className="flex flex-col gap-2 text-sm text-slate-700">
          Correo electrónico *
          <input
            type="email"
            {...register("email")}
            className={claseInput}
            placeholder="paciente@correo.com"
          />
          {errors.email && (
            <span className="text-red-600">{errors.email.message}</span>
          )}
        </label>

        <label className="flex flex-col gap-2 text-sm text-slate-700">
          Teléfono *
          <input
            type="tel"
            {...register("telefono")}
            className={claseInput}
            placeholder="78945612"
          />
          {errors.telefono && (
            <span className="text-red-600">{errors.telefono.message}</span>
          )}
        </label>

        <label className="flex flex-col gap-2 text-sm text-slate-700">
          Género *
          <select {...register("genero")} className={claseInput}>
            <option value="MASCULINO">Masculino</option>
            <option value="FEMENINO">Femenino</option>
            <option value="OTRO">Otro</option>
          </select>
          {errors.genero && (
            <span className="text-red-600">{errors.genero.message}</span>
          )}
        </label>

        <label className="flex flex-col gap-2 text-sm text-slate-700">
          Fecha de nacimiento *
          <input
            type="date"
            max={new Date().toISOString().slice(0, 10)}
            {...register("fechaNacimiento")}
            className={claseInput}
          />
          {errors.fechaNacimiento && (
            <span className="text-red-600">
              {errors.fechaNacimiento.message}
            </span>
          )}
        </label>
      </div>

      <button
        type="submit"
        disabled={guardando}
        className="mt-5 rounded-xl bg-cyan-800 px-6 py-3 font-medium text-white transition hover:bg-cyan-900 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {guardando
          ? pacienteInicial
            ? "Guardando cambios..."
            : "Registrando..."
          : pacienteInicial
            ? "Guardar cambios"
            : "Registrar paciente"}
      </button>
      {pacienteInicial && (
        <button
          type="button"
          className="mt-5 rounded-xl bg-red-800 px-6 py-3 font-medium text-white transition hover:bg-cyan-900 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={onCancelarEdicion}
          disabled={guardando}
        >
          Cancelar edición
        </button>
      )}
    </form>
  );
}
