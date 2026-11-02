export interface MedicoApi {
  id: number;
  firstName: string;
  lastName: string;
  isActive: boolean;
  specialty: {
    name: string;
  };
}
