import axios from "axios";

interface RespuestaErrorApi {
  message?: string | string[];
}

export function extraerMensajeError(err: unknown): string {
  if (axios.isAxiosError<RespuestaErrorApi>(err)) {
    const mensaje = err.response?.data?.message;

    if (typeof mensaje === "string" && mensaje.trim()) {
      return mensaje;
    }

    if (Array.isArray(mensaje) && mensaje.length > 0) {
      return mensaje.join(", ");
    }

    if (!err.response) {
      return "No se pudo conectar con el servidor";
    }

    return "Error del servidor";
  }

  if (err instanceof Error) {
    return err.message;
  }

  return "Error inesperado";
}
