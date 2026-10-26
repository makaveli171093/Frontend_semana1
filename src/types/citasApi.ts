export type EstadoCita = "PROGRAMADA" | "COMPLETADA" | "CANCELADA" | "ATENDIDO";

export type NuevoEstadoCita = Extract<EstadoCita, "COMPLETADA" | "CANCELADA">;

export interface CitaApi {
  id: number;
  patientId: number;
  doctorId: number;
  status: EstadoCita;
  scheduledAt: string;
  reason?: string | null;
}
