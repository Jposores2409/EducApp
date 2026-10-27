'use client';

import { useState } from 'react';
import { GraduationCap, Lock, Mail, ArrowRight, ShieldCheck, Loader2, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@educapp.edu');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Almacenar perfil de usuario
        localStorage.setItem('educapp_user', JSON.stringify(data.user));
        
        // Forzar redirección limpia del navegador
        window.location.href = '/dashboard';
      } else {
        setErrorMsg(data.error || 'Credenciales no válidas.');
        setLoading(false);
      }
    } catch (err) {
      setErrorMsg('No se pudo conectar con el servidor.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Esferas decorativas */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md space-y-8 z-10">
        {/* Marca EducApp */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-500/30 mb-2">
            <GraduationCap className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">EducApp</h1>
          <p className="text-slate-400 text-sm">Plataforma Virtual Educativa Unificada</p>
        </div>

        {/* Tarjeta de Formulario */}
        <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/60 p-8 rounded-3xl shadow-2xl space-y-6">
          <div className="space-y-1 text-center">
            <h2 className="text-xl font-bold text-white">Iniciar Sesión</h2>
            <p className="text-xs text-slate-400">Ingreso único de Administrador</p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs font-medium text-center flex items-center justify-center gap-2">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Correo Electrónico</label>
              <div className="relative">
                <Mail className="h-4 w-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@educapp.edu"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/60 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Contraseña</label>
              <div className="relative">
                <Lock className="h-4 w-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/60 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl text-xs shadow-lg shadow-indigo-600/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                <>
                  Ingresar al Campus <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Enlace directo alternativo de seguridad */}
          <div className="pt-2 border-t border-slate-700/50 text-center space-y-2">
            <a
              href="/dashboard"
              className="text-[11px] text-indigo-400 hover:text-indigo-300 underline font-medium block"
            >
              ¿Acceso directo al Panel General sin validación? Haz clic aquí
            </a>
            <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
              <ShieldCheck className="h-3.5 w-3.5 text-indigo-400" /> Conexión segura con Supabase DB
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}