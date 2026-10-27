'use client';

import { Contact, Mail, Shield, User } from 'lucide-react';

export default function DirectorioPage() {
  const usuarios = [
    { name: 'Dra. María Fernández', role: 'Docente / Titular', email: 'mfernandez@plataforma.edu', subject: 'Programación Web Avanzada' },
    { name: 'Ing. Carlos Mendoza', role: 'Docente / JTP', email: 'cmendoza@plataforma.edu', subject: 'Bases de Datos Relacionales' },
    { name: 'Lucas Gómez', role: 'Estudiante', email: 'lgomez@plataforma.edu', subject: 'Ingeniería de Software' },
    { name: 'Sofía Martínez', role: 'Estudiante', email: 'smartinez@plataforma.edu', subject: 'Programación Web Avanzada' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Contact className="h-7 w-7 text-indigo-600" />
          Directorio Institucional
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Nómina de profesores, tutores y alumnos pertenecientes a la institución.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {usuarios.map((u, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-start gap-4">
            <div className="bg-slate-100 p-3 rounded-full text-slate-600">
              <User className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-800 text-base">{u.name}</h3>
              <p className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full inline-block">
                {u.role}
              </p>
              <div className="text-xs text-slate-500 flex items-center gap-1.5 pt-1">
                <Mail className="h-3.5 w-3.5" />
                <span>{u.email}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}