export interface PacienteApi {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: "MASCULINO" | "FEMENINO" | "OTRO";
  birthDate: string;
  isActive: boolean;
}
