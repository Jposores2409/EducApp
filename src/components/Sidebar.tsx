'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  BookOpen, 
  Video, 
  FileText, 
  CalendarCheck, 
  GraduationCap, 
  FolderClosed, 
  Contact 
} from 'lucide-react';

const menuItems = [
  { name: 'Inicio', href: '/dashboard', icon: Home },
  { name: 'Cursos', href: '/dashboard/cursos', icon: BookOpen },
  { name: 'Aulas Virtuales', href: '/dashboard/videollamada', icon: Video },
  { name: 'Tareas', href: '/dashboard/tareas', icon: FileText },
  { name: 'Asistencia', href: '/dashboard/asistencia', icon: CalendarCheck },
  { name: 'Calificaciones', href: '/dashboard/notas', icon: GraduationCap },
  { name: 'Archivos', href: '/dashboard/entregas', icon: FolderClosed },
  { name: 'Directorio', href: '/dashboard/directorio', icon: Contact },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-screen p-4 flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-3 px-3 py-4 mb-6 border-b border-slate-800">
          <div className="bg-indigo-600 p-2 rounded-xl text-white font-bold text-xl">
            PV
          </div>
          <div>
            <h1 className="font-bold text-white text-base leading-tight">EduPlatform</h1>
            <span className="text-xs text-slate-500">v1.0 MVP</span>
          </div>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'hover:bg-slate-800 hover:text-white text-slate-400'
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}