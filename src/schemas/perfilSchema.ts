import { z } from "zod";

export const perfilSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(3, "Ingresa tu nombre completo.")
    .refine(
      (valor) => valor.split(/\s+/).filter(Boolean).length >= 2,
      "Ingresa tu nombre y al menos un apellido.",
    ),
  email: z
    .string()
    .trim()
    .email("Ingresa un correo electrónico válido."),
  telefono: z
    .string()
    .trim()
    .min(7, "El teléfono debe tener al menos 7 caracteres.")
    .max(20, "El teléfono no puede superar los 20 caracteres."),
});

export type PerfilFormData = z.infer<typeof perfilSchema>;
