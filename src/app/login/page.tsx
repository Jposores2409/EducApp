'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GraduationCap, Lock, Mail, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'profesor' | 'alumno'>('profesor');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Guardamos temporalmente el rol en el navegador para simular el acceso
    localStorage.setItem('userRole', role);
    localStorage.setItem('userEmail', email);
    
    // Redireccionamos al Dashboard
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl space-y-6">
        {/* Iso/Logo */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-500/30">
            <GraduationCap className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">EduPlatform</h1>
          <p className="text-xs text-slate-400">Ingresa a la Plataforma Virtual Educativa</p>
        </div>

        {/* Selector de Rol */}
        <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl">
          <button
            type="button"
            onClick={() => setRole('profesor')}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              role === 'profesor'
                ? 'bg-white text-indigo-600 shadow'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Docente / Profesor
          </button>
          <button
            type="button"
            onClick={() => setRole('alumno')}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              role === 'alumno'
                ? 'bg-white text-indigo-600 shadow'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Estudiante / Alumno
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600">Correo Electrónico</label>
            <div className="relative">
              <Mail className="h-5 w-5 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder={role === 'profesor' ? 'docente@plataforma.edu' : 'alumno@plataforma.edu'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-600 text-slate-800"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600">Contraseña</label>
            <div className="relative">
              <Lock className="h-5 w-5 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-600 text-slate-800"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 text-sm"
          >
            <span>Iniciar Sesión como {role === 'profesor' ? 'Docente' : 'Alumno'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}