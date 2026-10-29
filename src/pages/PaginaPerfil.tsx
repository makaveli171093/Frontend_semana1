import { useEffect, useState, type ChangeEvent } from "react";
import { Camera, Save, UserRound } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import {
  perfilSchema,
  type PerfilFormData,
} from "../schemas/perfilSchema";
import {
  actualizarPerfil,
  obtenerPerfil,
} from "../services/perfil";
import { useAuthStore } from "../stores/authStore";

const TIPOS_FOTO = ["image/jpeg", "image/png", "image/webp"];
const TAMANO_MAXIMO = 5 * 1024 * 1024;

const claseInput =
  "mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-cyan-700 focus:ring-4 focus:ring-cyan-100 disabled:bg-slate-100";

export function PaginaPerfil() {
  const actualizarUsuario = useAuthStore(
    (state) => state.actualizarUsuario,
  );

  const [cargandoPerfil, setCargandoPerfil] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [errorCarga, setErrorCarga] = useState<string | null>(null);
  const [errorFoto, setErrorFoto] = useState("");
  const [fotoGuardada, setFotoGuardada] = useState<string | null>(null);
  const [fotoTemporal, setFotoTemporal] = useState<string | null>(null);
  const [fotoSeleccionada, setFotoSeleccionada] = useState<File | null>(
    null,
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PerfilFormData>({
    resolver: zodResolver(perfilSchema),
    defaultValues: {
      nombre: "",
      email: "",
      telefono: "",
    },
  });

  const fotoVisible = fotoTemporal ?? fotoGuardada;

  useEffect(() => {
    if (!fotoTemporal?.startsWith("blob:")) return;

    return () => URL.revokeObjectURL(fotoTemporal);
  }, [fotoTemporal]);

  useEffect(() => {
    let activo = true;

    const cargarPerfil = async () => {
      try {
        const perfil = await obtenerPerfil();

        if (!activo) return;

        reset({
          nombre: perfil.nombre,
          email: perfil.email,
          telefono: perfil.telefono ?? "",
        });

        setFotoGuardada(perfil.foto ?? null);

        actualizarUsuario({
          nombre: perfil.nombre,
          email: perfil.email,
          telefono: perfil.telefono ?? "",
          foto: perfil.foto ?? null,
          especialidad: perfil.especialidad ?? undefined,
        });
      } catch {
        if (activo) {
          setErrorCarga(
            "No se pudo cargar el perfil. Verifica tu sesión, tu rol de médico y la disponibilidad de la API.",
          );
        }
      } finally {
        if (activo) setCargandoPerfil(false);
      }
    };

    void cargarPerfil();

    return () => {
      activo = false;
    };
  }, [reset, actualizarUsuario]);

  const manejarCambioFoto = (event: ChangeEvent<HTMLInputElement>) => {
    const archivo = event.currentTarget.files?.[0];

    if (!archivo) return;

    if (!TIPOS_FOTO.includes(archivo.type)) {
      setErrorFoto("Selecciona una imagen JPG, PNG o WEBP.");
      setFotoSeleccionada(null);
      setFotoTemporal(null);
      event.currentTarget.value = "";
      return;
    }

    if (archivo.size > TAMANO_MAXIMO) {
      setErrorFoto("La imagen no puede superar los 5 MB.");
      setFotoSeleccionada(null);
      setFotoTemporal(null);
      event.currentTarget.value = "";
      return;
    }

    setErrorFoto("");
    setFotoSeleccionada(archivo);
    setFotoTemporal(URL.createObjectURL(archivo));
  };

  const guardarPerfil = async (datos: PerfilFormData) => {
    setGuardando(true);

    try {
      const formulario = new FormData();

      formulario.append("nombre", datos.nombre.trim());
      formulario.append("email", datos.email.trim());
      formulario.append("telefono", datos.telefono.trim());

      if (fotoSeleccionada) {
        formulario.append("foto", fotoSeleccionada);
      }

      const actualizado = await actualizarPerfil(formulario);

      const nombre = actualizado.nombre ?? datos.nombre;
      const email = actualizado.email ?? datos.email;
      const telefono = actualizado.telefono ?? datos.telefono;

      const fotoFinal =
        typeof actualizado.foto === "undefined"
          ? fotoGuardada
          : actualizado.foto ?? null;

      reset({ nombre, email, telefono });
      setFotoGuardada(fotoFinal);
      setFotoTemporal(null);
      setFotoSeleccionada(null);
      setErrorCarga(null);

      actualizarUsuario({
        nombre,
        email,
        telefono,
        foto: fotoFinal,
        especialidad: actualizado.especialidad ?? undefined,
      });

      toast.success("Perfil actualizado correctamente.");
    } catch {
      toast.error(
        "No se pudo actualizar el perfil. Revisa los datos e inténtalo nuevamente.",
      );
    } finally {
      setGuardando(false);
    }
  };

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-800">
            Cuenta médica
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Mi perfil
          </h2>
          <p className="mt-2 text-base text-slate-600">
            Consulta y actualiza tus datos personales y fotografía.
          </p>
        </div>

        {errorCarga && (
          <div
            role="alert"
            className="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-base text-rose-800"
          >
            {errorCarga}
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="grid md:grid-cols-[260px_minmax(0,1fr)]">
            <section className="border-b border-slate-200 bg-slate-50 p-6 md:border-b-0 md:border-r">
              <h3 className="text-lg font-semibold text-slate-900">
                Fotografía
              </h3>

              <p className="mt-1 text-sm text-slate-600">
                Elige una imagen clara para tu perfil.
              </p>

              <div className="mt-6 flex justify-center">
                {fotoVisible ? (
                  <img
                    src={fotoVisible}
                    alt="Fotografía del perfil médico"
                    className="h-32 w-32 rounded-full border-4 border-white object-cover shadow-md"
                  />
                ) : (
                  <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-white bg-cyan-100 text-cyan-800 shadow-md">
                    <UserRound size={52} strokeWidth={1.5} />
                  </div>
                )}
              </div>

              <div className="mt-5 flex justify-center">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-cyan-200 bg-white px-4 py-3 text-base font-semibold text-cyan-900 transition hover:bg-cyan-50">
                  <Camera size={18} aria-hidden="true" />
                  Cambiar fotografía
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="sr-only"
                    onChange={manejarCambioFoto}
                    disabled={cargandoPerfil || guardando}
                  />
                </label>
              </div>

              <p className="mt-3 text-center text-sm text-slate-500">
                JPG, PNG o WEBP. Máximo 5 MB.
              </p>

              {fotoSeleccionada && (
                <p className="mt-2 break-all text-center text-sm text-slate-600">
                  {fotoSeleccionada.name}
                </p>
              )}

              {errorFoto && (
                <p role="alert" className="mt-3 text-sm text-rose-600">
                  {errorFoto}
                </p>
              )}
            </section>

            <section className="p-5 sm:p-7">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-900">
                  Datos personales
                </h3>
                <p className="mt-1 text-base text-slate-600">
                  Mantén tu información actualizada.
                </p>
              </div>

              {cargandoPerfil && (
                <p className="mb-4 text-base text-slate-500" role="status">
                  Cargando información del perfil…
                </p>
              )}

              <form
                noValidate
                onSubmit={handleSubmit(guardarPerfil)}
                className="space-y-5"
              >
                <div>
                  <label
                    htmlFor="nombre"
                    className="text-base font-medium text-slate-700"
                  >
                    Nombre completo
                  </label>
                  <input
                    id="nombre"
                    type="text"
                    autoComplete="name"
                    placeholder="Ej. Juan Pérez"
                    className={claseInput}
                    disabled={cargandoPerfil || guardando}
                    {...register("nombre")}
                  />
                  {errors.nombre && (
                    <p className="mt-1.5 text-sm text-rose-600">
                      {errors.nombre.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="text-base font-medium text-slate-700"
                  >
                    Correo electrónico
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="doctor@clinica.com"
                    className={claseInput}
                    disabled={cargandoPerfil || guardando}
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="mt-1.5 text-sm text-rose-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="telefono"
                    className="text-base font-medium text-slate-700"
                  >
                    Teléfono
                  </label>
                  <input
                    id="telefono"
                    type="tel"
                    autoComplete="tel"
                    placeholder="Ej. 71234567"
                    className={claseInput}
                    disabled={cargandoPerfil || guardando}
                    {...register("telefono")}
                  />
                  {errors.telefono && (
                    <p className="mt-1.5 text-sm text-rose-600">
                      {errors.telefono.message}
                    </p>
                  )}
                </div>

                <div className="border-t border-slate-200 pt-5">
                  <button
                    type="submit"
                    disabled={cargandoPerfil || guardando}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-800 px-5 py-3.5 text-base font-semibold text-white transition hover:bg-cyan-900 focus:outline-none focus:ring-4 focus:ring-cyan-200 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                  >
                    <Save size={18} aria-hidden="true" />
                    {guardando ? "Guardando cambios…" : "Guardar cambios"}
                  </button>
                </div>
              </form>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
