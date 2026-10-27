import { BookOpen, Calendar, GraduationCap, Video, Users, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const stats = [
    { label: 'Cursos Activos', value: '4', icon: BookOpen, color: 'bg-blue-500' },
    { label: 'Asistencia Promedio', value: '92%', icon: Calendar, color: 'bg-emerald-500' },
    { label: 'Promedio General', value: '8.8 / 10', icon: GraduationCap, color: 'bg-amber-500' },
    { label: 'Próxima Clase Live', value: 'En 45 min', icon: Video, color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-8">
      {/* Saludo / Encabezado */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Panel de Control General</h1>
          <p className="text-slate-500 text-sm mt-1">
            Bienvenido al entorno virtual de aprendizaje. Revisa el estado general de tus asignaturas.
          </p>
        </div>
        <Link
          href="/dashboard/videollamada"
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2.5 rounded-lg shadow transition-colors text-sm"
        >
          <Video className="h-4 w-4" />
          Unirse a Clase en Vivo
        </Link>
      </div>

      {/* Tarjetas de Estadísticas (Métricas) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg text-white shadow`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Módulos Principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Próximos Encuentros Virtuales */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Video className="h-5 w-5 text-indigo-600" />
              Próximos Encuentros Virtuales
            </h2>
            <Link 
              href="/dashboard/videollamada" 
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              Ver aula <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-3">
            <div className="p-4 border border-slate-200 rounded-xl bg-slate-50 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-800 text-sm">Programación Web Avanzada</h3>
                <p className="text-xs text-slate-500 mt-0.5">Hoy - 16:00 hs (Jitsi Meet)</p>
              </div>
              <span className="bg-emerald-100 text-emerald-700 text-xs px-3 py-1 rounded-full font-semibold">
                Confirmada
              </span>
            </div>
            <div className="p-4 border border-slate-200 rounded-xl bg-slate-50 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-800 text-sm">Bases de Datos Relacionales</h3>
                <p className="text-xs text-slate-500 mt-0.5">Mañana - 10:00 hs (Jitsi Meet)</p>
              </div>
              <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full font-semibold">
                Programada
              </span>
            </div>
          </div>
        </div>

        {/* Estado de Entregas Recientes */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-indigo-600" />
              Entregas Recientes
            </h2>
            <Link 
              href="/dashboard/tareas" 
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              Ver tareas <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-3">
            <div className="p-4 border border-slate-200 rounded-xl bg-slate-50 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-800 text-sm">TP 1 - Arquitectura Next.js</h3>
                <p className="text-xs text-slate-500 mt-0.5">Nota: 9 / 10</p>
              </div>
              <span className="bg-emerald-100 text-emerald-700 text-xs px-3 py-1 rounded-full font-semibold">
                Aprobado
              </span>
            </div>
            <div className="p-4 border border-slate-200 rounded-xl bg-slate-50 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-800 text-sm">TP 2 - Esqueleto del Sistema</h3>
                <p className="text-xs text-slate-500 mt-0.5">Pendiente de revisión</p>
              </div>
              <span className="bg-amber-100 text-amber-700 text-xs px-3 py-1 rounded-full font-semibold">
                En revisión
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}