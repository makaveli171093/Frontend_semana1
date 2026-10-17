import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Rocket,
  RotateCw,
  AlertTriangle,
  Search,
  WifiOff,
  Volume2,
  ArrowLeft,
  Settings,
  User,
} from "lucide-react";

/**
 * 404 - Michi en Órbita
 * Componente NotFound en React + Tailwind CSS
 */

export function PaginaNotFound() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [meowed, setMeowed] = useState(false);
  const [selectedCauses, setSelectedCauses] = useState({
    martian: true,
    paws: true,
    nap: true,
  });

  const toggleCause = (key: keyof typeof selectedCauses) => {
    setSelectedCauses((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleMeow = () => {
    setMeowed(true);
    setTimeout(() => setMeowed(false), 1200);
  };

  return (
    <div className="min-h-screen bg-[#0b1326] text-white flex justify-center selection:bg-indigo-500 selection:text-white">
      {/* Contenedor central simulando vista móvil o app embed */}
      <main className="w-full max-w-md min-h-screen flex flex-col justify-between px-5 py-6 font-['Plus_Jakarta_Sans',sans-serif]">
        {/* Top App Bar */}
        <header className="flex items-center justify-between pb-4">
          <button
            type="button"
            className="w-10 h-10 rounded-full bg-[#131b2e] hover:bg-[#31394d] flex items-center justify-center text-slate-300 transition-colors"
            aria-label="Volver atrás"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center font-bold text-sm">
              🚀
            </span>
            <span className="font-bold text-base tracking-tight text-slate-100">
              Lost In Orbit
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="w-10 h-10 rounded-full bg-[#131b2e] hover:bg-[#31394d] flex items-center justify-center text-slate-300 transition-colors"
              aria-label="Configuración"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="w-10 h-10 rounded-full bg-[#131b2e] hover:bg-[#31394d] flex items-center justify-center text-slate-300 transition-colors"
              aria-label="Perfil de usuario"
            >
              <User className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Contenido Principal */}
        <div className="flex flex-col items-center text-center space-y-6 pt-2">
          {/* Badge Superior */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#131b2e] border border-slate-700/50 text-xs font-semibold text-slate-300 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span>ERROR 404: COORDENADAS PERDIDAS 🚀</span>
          </div>

          {/* Hero Visual Card / Michi en Órbita */}
          <div className="relative w-full max-w-85 aspect-square rounded-3xl overflow-hidden border border-indigo-500/20 shadow-2xl bg-linear-to-b from-[#131b2e] to-[#060e20] flex items-center justify-center p-3">
            {/* Badge Sin Señal */}
            <div className="absolute top-4 left-4 z-10 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-extrabold uppercase tracking-wide shadow-md transform -rotate-3">
              <WifiOff className="w-3.5 h-3.5" />
              <span>SIN SEÑAL</span>
            </div>

            {/* Ilustración o Imagen del astronauta */}
            <img
              src="https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&w=800&q=80"
              alt="Gatito astronauta perdido en el espacio"
              className="w-full h-full object-cover rounded-2xl opacity-90 hover:scale-105 transition-transform duration-500"
            />

            {/* Botón interactivo flotante sobre la imagen */}
            <button
              type="button"
              onClick={handleMeow}
              className="absolute bottom-4 z-10 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-rose-100 hover:bg-rose-200 text-rose-950 font-bold text-xs uppercase tracking-wider shadow-lg transition-transform active:scale-95"
            >
              <Volume2 className="w-4 h-4 text-rose-600" />
              <span>{meowed ? "¡MIAAAU! 🐾" : "¡TÓCAME PARA MAULLAR!"}</span>
            </button>
          </div>

          {/* Gran 404 */}
          <div className="flex items-center justify-center gap-3 text-6xl font-black tracking-tight text-slate-300">
            <span>4</span>
            <div className="w-14 h-14 rounded-full bg-amber-400/20 border-2 border-amber-400 flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(251,191,36,0.3)] animate-bounce">
              🐱
            </div>
            <span>4</span>
          </div>

          {/* Textos descriptivos */}
          <div className="space-y-3 px-2">
            <h1 className="text-2xl font-black text-slate-50 tracking-tight leading-snug">
              ¡Ups! Esta página se fue a otra dimensión 🪐
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed max-w-sm mx-auto">
              Ni el GPS intergaláctico ni nuestro mejor astronauta bigotudo
              pudieron encontrar lo que buscabas. Sospechamos que un agujero
              negro (o un gato jugando con los cables) se comió este enlace.
            </p>
          </div>

          {/* Tarjeta de Diagnóstico / Checklist cómico */}
          <div className="w-full bg-[#131b2e]/90 border border-slate-800 rounded-2xl p-4 text-left shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-amber-400 text-base">💡</span>
                <span className="text-sm font-bold text-slate-200">
                  Posibles causas del extravío:
                </span>
              </div>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 tracking-wider">
                DIAGNÓSTICO
              </span>
            </div>

            <div className="space-y-2 pt-1 text-xs">
              <label
                onClick={() => toggleCause("martian")}
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#0b1326] border border-slate-800/80 cursor-pointer hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-2.5 text-slate-200">
                  <input
                    type="checkbox"
                    checked={selectedCauses.martian}
                    readOnly
                    className="rounded border-slate-700 text-amber-500 focus:ring-0"
                  />
                  <span>Un marciano pisó el enchufe del servidor</span>
                </div>
                <span className="text-base">👽</span>
              </label>

              <label
                onClick={() => toggleCause("paws")}
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#0b1326] border border-slate-800/80 cursor-pointer hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-2.5 text-slate-200">
                  <input
                    type="checkbox"
                    checked={selectedCauses.paws}
                    readOnly
                    className="rounded border-slate-700 text-amber-500 focus:ring-0"
                  />
                  <span>Escribiste la URL con las patas (literalmente)</span>
                </div>
                <span className="text-base">🐾</span>
              </label>

              <label
                onClick={() => toggleCause("nap")}
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#0b1326] border border-slate-800/80 cursor-pointer hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-2.5 text-slate-200">
                  <input
                    type="checkbox"
                    checked={selectedCauses.nap}
                    readOnly
                    className="rounded border-slate-700 text-amber-500 focus:ring-0"
                  />
                  <span>
                    La página está en huelga tomando una siesta cósmica
                  </span>
                </div>
                <span className="text-base">😴</span>
              </label>
            </div>

            {/* Input de Búsqueda */}
            <div className="pt-2">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert(`Buscando: ${searchQuery}`);
                }}
                className="relative flex items-center"
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar coordenadas perdidas..."
                  className="w-full bg-[#060e20] border border-slate-700/80 rounded-full pl-4 pr-12 py-2.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  aria-label="Buscar"
                  className="absolute right-1 w-8 h-8 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center hover:bg-amber-300 transition-colors"
                >
                  <Search className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Botones de Acción (CTAs) */}
          <div className="w-full space-y-3 pt-2">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="w-full py-3.5 px-4 rounded-full bg-[#b8c4ff] hover:bg-[#a6b6ff] text-[#060e20] font-extrabold text-sm flex items-center justify-center gap-2 transition-transform active:scale-98 shadow-md"
            >
              <Rocket className="w-4 h-4" />
              <span>🛸 Rescatar y volver al inicio</span>
            </button>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="w-full py-3.5 px-4 rounded-full bg-[#1e293b] hover:bg-[#334155] text-slate-200 font-bold text-sm flex items-center justify-center gap-2 transition-colors border border-slate-700"
            >
              <RotateCw className="w-4 h-4" />
              <span>🔄 Reintentar el salto cuántico</span>
            </button>

            <button
              type="button"
              onClick={() =>
                alert("¡Reporte enviado al centro de mando felino!")
              }
              className="w-full py-2 text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center justify-center gap-1.5 transition-colors"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>🚨 Culpar al gato / Reportar fallo</span>
            </button>
          </div>

          {/* Footer de auxilio */}
          <footer className="pt-2 pb-4 text-center space-y-2">
            <div className="inline-block px-3 py-1 rounded-full bg-[#060e20] border border-slate-800 text-[11px] font-mono text-slate-400">
              <span className="text-amber-400 mr-1.5">●</span>
              Código de auxilio:{" "}
              <span className="text-slate-200 font-bold">#MIAU-404-ORBITA</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Ningún felino espacial fue herido en la desaparición de este
              enlace.
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
