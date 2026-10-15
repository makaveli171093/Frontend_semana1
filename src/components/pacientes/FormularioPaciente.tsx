import { useState } from "react";
import type { FormEvent } from "react";
import type { EstadoPaciente } from "../../types/paciente";

export interface DatosNuevoPaciente {
  nombre: string;
  apellido: string;
  email: string;
  estado: EstadoPaciente;
}

interface FormularioPacienteProps {
  onAgregar: (datos: DatosNuevoPaciente) => void;
}

const formularioInicial: DatosNuevoPaciente = {
  nombre: "",
  apellido: "",
  email: "",
  estado: "activo",
};

export function FormularioPaciente({ onAgregar }: FormularioPacienteProps) {
  const [formulario, setFormulario] =
    useState<DatosNuevoPaciente>(formularioInicial);

  const [error, setError] = useState("");

  const actualizarCampo = (campo: keyof DatosNuevoPaciente, valor: string) => {
    setFormulario((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const manejarSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formulario.nombre.trim() || !formulario.email.trim()) {
      setError("El nombre y el correo son obligatorios.");
      return;
    }

    onAgregar({
      ...formulario,
      nombre: formulario.nombre.trim(),
      apellido: formulario.apellido.trim(),
      email: formulario.email.trim(),
    });

    setFormulario({ ...formularioInicial });
    setError("");
  };

  return (
    <form
      onSubmit={manejarSubmit}
      className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h2 className="mb-5 text-lg font-semibold text-slate-900">
        Registrar nuevo paciente
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm text-slate-700">
          Nombre *
          <input
            type="text"
            value={formulario.nombre}
            onChange={(e) => actualizarCampo("nombre", e.target.value)}
            className="rounded-lg border border-slate-200 p-3 outline-none focus:border-cyan-600"
            placeholder="Nombre"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm text-slate-700">
          Apellido
          <input
            type="text"
            value={formulario.apellido}
            onChange={(e) => actualizarCampo("apellido", e.target.value)}
            className="rounded-lg border border-slate-200 p-3 outline-none focus:border-cyan-600"
            placeholder="Apellido"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm text-slate-700">
          Correo electrónico *
          <input
            type="email"
            value={formulario.email}
            onChange={(e) => actualizarCampo("email", e.target.value)}
            className="rounded-lg border border-slate-200 p-3 outline-none focus:border-cyan-600"
            placeholder="paciente@correo.com"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm text-slate-700">
          Estado
          <select
            value={formulario.estado}
            onChange={(e) => actualizarCampo("estado", e.target.value)}
            className="rounded-lg border border-slate-200 p-3 outline-none focus:border-cyan-600"
          >
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
            <option value="en_espera">En espera</option>
          </select>
        </label>
      </div>

      {error && (
        <p role="alert" className="mt-4 text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="mt-5 rounded-xl bg-cyan-800 px-6 py-3 font-medium text-white transition hover:bg-cyan-900"
      >
        Registrar paciente
      </button>
    </form>
  );
}
