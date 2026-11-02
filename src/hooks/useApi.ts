import { useCallback, useEffect, useState } from "react";
import { api } from "../lib/axios";
import { extraerMensajeError } from "../lib/errorHandler";

interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

interface ResultadoApi<T> {
  clave: string;
  data: T;
  error: string | null;
}

export function useApi<T>(endpoint: string | null): UseApiResult<T> {
  const [resultado, setResultado] = useState<ResultadoApi<T> | null>(null);
  const [reload, setReload] = useState(0);

  const refetch = useCallback(() => {
    setReload((value) => value + 1);
  }, []);

  const claveConsulta = endpoint ? JSON.stringify([endpoint, reload]) : null;

  useEffect(() => {
    if (!endpoint || !claveConsulta) return;

    const controller = new AbortController();

    api
      .get<T>(endpoint, { signal: controller.signal })
      .then((response) => {
        if (!controller.signal.aborted) {
          setResultado({
            clave: claveConsulta,
            data: response.data,
            error: null,
          });
        }
      })
      .catch((err: unknown) => {
        if (!controller.signal.aborted) {
          setResultado({
            clave: claveConsulta,
            data: null as T,
            error: extraerMensajeError(err),
          });
        }
      });

    return () => controller.abort();
  }, [endpoint, claveConsulta]);

  const resultadoActual =
    claveConsulta && resultado?.clave === claveConsulta ? resultado : null;

  return {
    data: endpoint ? (resultadoActual?.data ?? null) : null,
    loading: Boolean(endpoint) && !resultadoActual,
    error: endpoint ? (resultadoActual?.error ?? null) : null,
    refetch,
  };
}
