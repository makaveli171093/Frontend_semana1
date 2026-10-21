import { z } from "zod";

export const pacienteSchema = z
  .object({
    nombre: z.string().trim().min(1, "El nombre es obligatorio"),
    apellido: z.string().trim().min(1, "El apellido es obligatorio"),
    email: z.email("Introduce un correo válido"),
    telefono: z.string().trim().min(6, "Mínimo 6 caracteres"),
    genero: z.enum(["MASCULINO", "FEMENINO", "OTRO"]),
    fechaNacimiento: z.iso.date("Introduce una fecha válida"),
  })
  .refine(
    (datos) => datos.fechaNacimiento <= new Date().toISOString().slice(0, 10),
    {
      path: ["fechaNacimiento"],
      message: "La fecha de nacimiento no puede ser futura",
    },
  );

export type DatosNuevoPaciente = z.infer<typeof pacienteSchema>;
