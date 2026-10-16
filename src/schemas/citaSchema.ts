import { z } from "zod";

const obtenerFechaLocal = (): string => {
  const ahora = new Date();

  const anio = ahora.getFullYear();
  const mes = String(ahora.getMonth() + 1).padStart(2, "0");
  const dia = String(ahora.getDate()).padStart(2, "0");

  return `${anio}-${mes}-${dia}`;
};

export const citaSchema = z.object({
  pacienteNombre: z
    .string()
    .trim()
    .min(3, "El nombre debe tener al menos 3 caracteres"),

  medicoId: z.string().min(1, "Debes seleccionar un médico"),

  fecha: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "La fecha debe tener el formato YYYY-MM-DD")
    .refine((fecha) => {
      const [anio, mes, dia] = fecha.split("-").map(Number);
      const fechaConstruida = new Date(anio, mes - 1, dia);

      const fechaValida =
        fechaConstruida.getFullYear() === anio &&
        fechaConstruida.getMonth() === mes - 1 &&
        fechaConstruida.getDate() === dia;

      return fechaValida && fecha >= obtenerFechaLocal();
    }, "Selecciona una fecha válida que no sea pasada"),

  hora: z
    .string()
    .regex(
      /^([01]\d|2[0-3]):[0-5]\d$/,
      "Ingresa una hora válida en formato HH:MM",
    ),

  motivo: z
    .string()
    .trim()
    .min(10, "El motivo debe tener al menos 10 caracteres")
    .max(500, "El motivo no puede superar 500 caracteres"),

  urgencia: z.enum(["baja", "media", "alta", "critica"], {
    error: "Selecciona un nivel de urgencia válido",
  }),
});

export type CitaFormData = z.infer<typeof citaSchema>;
