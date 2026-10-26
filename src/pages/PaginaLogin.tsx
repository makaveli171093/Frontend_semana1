import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  Activity,
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";

import { extraerMensajeError } from "../lib/errorHandler";
import { decodificarToken, login } from "../services/auth";
import { loginSchema, type LoginFormData } from "../schemas/loginSchema";
import { useAuthStore } from "../stores/authStore";

export default function PaginaLogin() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.login);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (datos: LoginFormData): Promise<void> => {
    try {
      const { token } = await login(datos);
      const usuario = decodificarToken(token);
      setAuth(token, usuario);
      toast.success("¡Bienvenido!");
      navigate("/", { replace: true });
    } catch (err: unknown) {
      toast.error(extraerMensajeError(err));
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="min-h-screen bg-slate-100 lg:grid lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-cyan-950 px-12 py-14 text-white lg:flex lg:flex-col lg:justify-between xl:px-20">
        <div className="absolute -right-28 -top-28 h-96 w-96 rounded-full bg-cyan-800/40 blur-3xl" />
        <div className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-teal-500/20 blur-3xl" />

        <div className="relative flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
            <Stethoscope size={25} aria-hidden="true" />
          </div>
          <div>
            <p className="text-lg font-bold">Clínica Salud Integral</p>
            <p className="text-sm text-cyan-100/70">
              Sistema de gestión médica
            </p>
          </div>
        </div>

        <div className="relative max-w-xl py-14">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-200/20 bg-white/5 px-4 py-2 text-sm text-cyan-100">
            <Activity size={16} aria-hidden="true" />
            Atención organizada, segura y cercana
          </div>
          <h1 className="text-4xl font-bold leading-tight xl:text-5xl">
            Cuidamos la salud.
            <span className="mt-2 block text-teal-300">
              Simplificamos la gestión.
            </span>
          </h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-cyan-100/75">
            Accede a pacientes, citas médicas y reportes desde un único espacio
            diseñado para el equipo de la clínica.
          </p>
        </div>

        <div className="relative flex items-center gap-3 text-sm text-cyan-100/70">
          <ShieldCheck size={19} aria-hidden="true" />
          Acceso protegido para personal autorizado
        </div>
      </section>

      <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-900 text-white">
              <Stethoscope size={25} aria-hidden="true" />
            </div>
            <div>
              <p className="font-bold text-slate-900">Clínica Salud Integral</p>
              <p className="text-sm text-slate-500">
                Sistema de gestión médica
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/60 sm:p-9">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-800">
                Bienvenido
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                Iniciar sesión
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Ingresa tus credenciales para acceder al sistema de la clínica.
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="space-y-5"
            >
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Correo electrónico
                </label>
                <div className="relative">
                  <Mail
                    size={18}
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="nombre@clinica.com"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    className={`w-full rounded-xl border bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 ${
                      errors.email
                        ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100"
                        : "border-slate-200 focus:border-cyan-700 focus:ring-cyan-100"
                    }`}
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p
                    id="email-error"
                    role="alert"
                    className="mt-2 text-sm text-rose-600"
                  >
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Contraseña
                </label>
                <div className="relative">
                  <LockKeyhole
                    size={18}
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    id="password"
                    type={mostrarPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Mínimo 6 caracteres"
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={
                      errors.password ? "password-error" : undefined
                    }
                    className={`w-full rounded-xl border bg-white py-3 pl-11 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 ${
                      errors.password
                        ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100"
                        : "border-slate-200 focus:border-cyan-700 focus:ring-cyan-100"
                    }`}
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarPassword((visible) => !visible)}
                    aria-label={
                      mostrarPassword
                        ? "Ocultar contraseña"
                        : "Mostrar contraseña"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-700"
                  >
                    {mostrarPassword ? (
                      <EyeOff size={18} aria-hidden="true" />
                    ) : (
                      <Eye size={18} aria-hidden="true" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p
                    id="password-error"
                    role="alert"
                    className="mt-2 text-sm text-rose-600"
                  >
                    {errors.password.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-900 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-cyan-900/15 transition hover:bg-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Validando credenciales...
                  </>
                ) : (
                  <>
                    Entrar al sistema
                    <ArrowRight size={18} aria-hidden="true" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 flex items-start gap-2 rounded-xl bg-slate-50 px-4 py-3 text-xs leading-5 text-slate-500">
              <ShieldCheck
                size={16}
                aria-hidden="true"
                className="mt-0.5 shrink-0 text-emerald-700"
              />
              Tu sesión se mantiene al recargar la página y se cierra si el
              servidor rechaza el token.
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-slate-400">
            Clínica Salud Integral · Acceso exclusivo para personal autorizado
          </p>
        </div>
      </section>
    </main>
  );
}
