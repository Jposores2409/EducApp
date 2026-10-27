'use client';

import { GraduationCap, Award, TrendingUp } from 'lucide-react';

export default function NotasPage() {
  const calificaciones = [
    { id: '1', subject: 'Programación Web Avanzada', tp1: '9.0', tp2: '8.5', parcial: '9.5', final: '9.0', status: 'Aprobado' },
    { id: '2', subject: 'Bases de Datos Relacionales', tp1: '8.0', tp2: '7.5', parcial: '8.0', final: '7.8', status: 'Aprobado' },
    { id: '3', subject: 'Ingeniería de Software II', tp1: '10.0', tp2: 'Pendiente', parcial: '-', final: '-', status: 'En curso' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <GraduationCap className="h-7 w-7 text-indigo-600" />
          Boletín de Calificaciones
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Registro académico detallado de evaluaciones parciales y promedios finales.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="p-4">Asignatura</th>
                <th className="p-4">Trabajo Práctico 1</th>
                <th className="p-4">Trabajo Práctico 2</th>
                <th className="p-4">Examen Parcial</th>
                <th className="p-4">Promedio Final</th>
                <th className="p-4">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
              {calificaciones.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 font-bold text-slate-800">{row.subject}</td>
                  <td className="p-4">{row.tp1}</td>
                  <td className="p-4">{row.tp2}</td>
                  <td className="p-4">{row.parcial}</td>
                  <td className="p-4 font-bold text-indigo-600">{row.final}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      row.status === 'Aprobado' 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}