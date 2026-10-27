'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Check, Clock, X, Save, Search, Loader2, AlertCircle } from 'lucide-react';

interface Student {
  id: string;
  full_name: string;
  email: string;
  role: string;
}

interface Props {
  initialStudents: Student[];
}

export default function TablaAsistencia({ initialStudents }: Props) {
  // 1. Filtrar estudiantes si existen
  const studentsOnly = initialStudents.filter(
    (s) => s.role === 'student' || s.role === 'alumno'
  );
  const listToRender = studentsOnly.length > 0 ? studentsOnly : initialStudents;

  // 2. Estado local de React para cambiar botones al instante
  const [rows, setRows] = useState(
    listToRender.map((student) => ({
      student,
      status: 'present' as 'present' | 'absent' | 'late',
    }))
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Cambiar estado en memoria al presionar botones
  const handleStatusChange = (studentId: string, status: 'present' | 'absent' | 'late') => {
    setRows((prev) =>
      prev.map((r) => (r.student.id === studentId ? { ...r, status } : r))
    );
  };

  // Guardar en Supabase al hacer clic en el botón superior
  const handleSave = async () => {
    if (rows.length === 0) return;
    setSaving(true);
    setErrorMessage(null);

    try {
      // Instanciamos el cliente únicamente durante la petición
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
      const supabase = createClient(supabaseUrl, supabaseKey);

      const payload = rows.map((r) => ({
        student_id: r.student.id,
        status: r.status,
      }));

      const { error } = await supabase.from('attendance').insert(payload);

      if (error) {
        setErrorMessage(`Error al guardar en Supabase: ${error.message}`);
      } else {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err: any) {
      setErrorMessage('Error de conexión al enviar la asistencia.');
    } finally {
      setSaving(false);
    }
  };

  const filteredRows = rows.filter(
    (r) =>
      r.student.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.student.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Control superior */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="h-5 w-5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar alumno por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm text-slate-800 bg-transparent focus:outline-none"
          />
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving || rows.length === 0}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow transition-all text-sm disabled:opacity-50 cursor-pointer"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Guardar Asistencia
        </button>
      </div>

      {/* Alertas */}
      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-sm font-medium flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-rose-600 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm font-medium flex items-center gap-2">
          <Check className="h-5 w-5 text-emerald-600 flex-shrink-0" />
          ¡Asistencia registrada correctamente en la base de datos!
        </div>
      )}

      {/* Tabla con Botones */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {filteredRows.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            No hay alumnos para mostrar.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">
                <th className="p-4">Estudiante</th>
                <th className="p-4 text-center">Estado del Día</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
              {filteredRows.map(({ student, status }) => (
                <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-slate-800">{student.full_name || 'Sin Nombre'}</p>
                    <p className="text-xs text-slate-400">{student.email}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleStatusChange(student.id, 'present')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                          status === 'present'
                            ? 'bg-emerald-600 text-white shadow'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        <Check className="h-3.5 w-3.5" /> Presente
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStatusChange(student.id, 'late')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                          status === 'late'
                            ? 'bg-amber-500 text-white shadow'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        <Clock className="h-3.5 w-3.5" /> Tarde
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStatusChange(student.id, 'absent')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                          status === 'absent'
                            ? 'bg-rose-600 text-white shadow'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        <X className="h-3.5 w-3.5" /> Ausente
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}