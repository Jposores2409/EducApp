'use client';

import { FolderClosed, File, Download, HardDrive } from 'lucide-react';

export default function EntregasArchivosPage() {
  const archivos = [
    { name: 'Arquitectura_TP1_Final.pdf', size: '2.4 MB', date: '2026-10-18', subject: 'Programación Web' },
    { name: 'Esquema_BD_v2.sql', size: '450 KB', date: '2026-10-21', subject: 'Bases de Datos' },
    { name: 'Documento_Requisitos_Sistema.pdf', size: '1.1 MB', date: '2026-10-22', subject: 'Ingeniería de Software' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <FolderClosed className="h-7 w-7 text-indigo-600" />
          Repositorio de Entregas y Archivos
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Archivos adjuntados y documentación almacenada en la nube (Supabase Storage).
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <HardDrive className="h-5 w-5 text-indigo-600" />
            <span>Almacenamiento Utilizado: 3.9 MB / 1 GB</span>
          </div>
        </div>

        <div className="space-y-3">
          {archivos.map((file, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-indigo-200 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-lg">
                  <File className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{file.name}</p>
                  <p className="text-xs text-slate-400">{file.subject} • {file.size} • {file.date}</p>
                </div>
              </div>
              <button className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                <Download className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}