import type { PacienteApi } from "./pacientesApi";
import type { CitaApi } from "./citasApi";

// Datos necesarios para registrar un paciente
export type CrearPacienteDTO = Omit<PacienteApi, "id" | "isActive">;

// Datos opcionales para actualizar un paciente
export type ActualizarPacienteDTO = Partial<
  Omit<PacienteApi, "id" | "isActive">
>;

// Datos básicos para mostrar un paciente
export type ResumenPaciente = Pick<
  PacienteApi,
  "id" | "firstName" | "lastName" | "email"
>;

// Datos necesarios para registrar una cita
export type CrearCitaDTO = Pick<
  CitaApi,
  "patientId" | "doctorId" | "scheduledAt"
> & {
  reason?: string;
};
