import Link from 'next/link';
import { GraduationCap, CalendarCheck, Video, BookOpen, FileCheck, LogOut } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Barra Superior con Marca EducApp */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-600 rounded-xl shadow">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-white">EducApp</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <Link href="/dashboard/asistencia" className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors">
              <CalendarCheck className="h-4 w-4 text-indigo-400" /> Asistencia
            </Link>
            <Link href="/dashboard/videollamada" className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors">
              <Video className="h-4 w-4 text-indigo-400" /> Aulas Virtuales
            </Link>
            <Link href="/dashboard/cursos" className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors">
              <BookOpen className="h-4 w-4 text-indigo-400" /> Materias
            </Link>
            <Link href="/dashboard/tareas" className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors">
              <FileCheck className="h-4 w-4 text-indigo-400" /> Trabajos Prácticos
            </Link>
          </nav>

          <Link href="/" className="flex items-center gap-1.5 text-xs font-semibold text-rose-400 hover:text-rose-300 px-3 py-1.5 bg-rose-500/10 rounded-lg border border-rose-500/20 transition-all">
            <LogOut className="h-3.5 w-3.5" /> Salir
          </Link>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}