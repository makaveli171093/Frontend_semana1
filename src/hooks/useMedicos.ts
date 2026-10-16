import { useEffect, useState } from "react";

export interface Medico {
  id: string;
  nombre: string;
  especialidad: string;
}

const medicosSimulados: Medico[] = [
  {
    id: "MED-001",
    nombre: "Dra. María Fernández",
    especialidad: "Medicina General",
  },
  {
    id: "MED-002",
    nombre: "Dr. Carlos Mendoza",
    especialidad: "Cardiología",
  },
  {
    id: "MED-003",
    nombre: "Dra. Ana Rodríguez",
    especialidad: "Pediatría",
  },
  {
    id: "MED-004",
    nombre: "Dr. Luis Herrera",
    especialidad: "Traumatología",
  },
];

export function useMedicos() {
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMedicos(medicosSimulados);
      setCargando(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return { medicos, cargando };
}
