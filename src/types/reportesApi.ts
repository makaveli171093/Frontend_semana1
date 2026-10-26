export interface CitasPorEspecialidadApi {
  specialty: string;
  total_appointments: number;
}

export interface CorteDiarioApi {
  date: string;
  completadas: number;
  canceladas: number;
  atendidas: number;
}

export interface HorarioOcupadoApi {
  cita: number;
  time: string;
  status: "PROGRAMADA" | "COMPLETADA" | "CANCELADA" | "ATENDIDO";
  doctor: string;
  patient: string;
}

export interface HorariosOcupadosApi {
  date: string;
  doctorId: number | "TODOS";
  totalBooked: number;
  slots: HorarioOcupadoApi[];
}
