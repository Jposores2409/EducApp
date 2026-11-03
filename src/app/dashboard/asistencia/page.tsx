'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { CalendarCheck, AlertTriangle, CheckCircle, Loader2, RefreshCw } from 'lucide-react';

// Inicialización segura del cliente Supabase
const getSupabaseClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kkqamahqoynwsokylgzj.supabase.co';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  return createClient(url, key);
};

interface StudentAttendance {
  id: string;
  full_name: string;
  email: string;
  absencesCount: number;
  statusToday: 'present' | 'absent' | 'late' | 'none';
}

export default function AttendancePage() {
  const [students, setStudents] = useState<StudentAttendance[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchAttendanceData();
  }, [selectedDate]);

  const fetchAttendanceData = async () => {
    setLoading(true);
    setErrorMessage(null);
    const supabase = getSupabaseClient();

    try {
      // 1. Obtener todos los perfiles registrados (sin filtrar estrictamente por rol en la BD para evitar vacíos)
      const { data: profiles, error: profErr } = await supabase
        .from('profiles')
        .select('*');

      if (profErr) {
        throw new Error(`Error en tabla profiles: ${profErr.message}`);
      }

      // Filtrar en cliente los perfiles que no sean administradores
      const studentProfiles = (profiles || []).filter(
        (p) => !p.role || p.role.toLowerCase() !== 'admin'
      );

      // 2. Obtener asistencias
      const { data: attendanceRecords, error: attErr } = await supabase
        .from('attendance')
        .select('*');

      if (attErr) {
        console.warn('Tabla attendance sin datos o no creada aún:', attErr.message);
      }

      // 3. Cruzar información
      const processed: StudentAttendance[] = studentProfiles.map((student) => {
        const studentRecords = (attendanceRecords || []).filter(
          (r) => r.student_id === student.id
        );

        const totalAbsences = studentRecords.filter(
          (r) => r.status === 'absent'
        ).length;

        const recordToday = studentRecords.find((r) => r.date === selectedDate);

        return {
          id: student.id,
          full_name: student.full_name || student.email || 'Estudiante',
          email: student.email || '',
          absencesCount: totalAbsences,
          statusToday: recordToday ? recordToday.status : 'none',
        };
      });

      setStudents(processed);
    } catch (err: any) {
      console.error('Error cargando asistencia:', err);
      setErrorMessage(err.message || 'Error al conectar con Supabase.');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAttendance = async (
    studentId: string,
    status: 'present' | 'absent' | 'late'
  ) => {
    setSavingId(studentId);
    const supabase = getSupabaseClient();
    try {
      const { error } = await supabase.from('attendance').upsert(
        {
          student_id: studentId,
          date: selectedDate,
          status: status,
        },
        { onConflict: 'student_id,date' }
      );

      if (error) throw error;
      await fetchAttendanceData();
    } catch (err: any) {
      alert('Error al actualizar la asistencia: ' + err.message);
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <CalendarCheck className="h-6 w-6 text-indigo-600" /> Control de Asistencia
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Registro diario y monitoreo automático de inasistencias acumuladas.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchAttendanceData}
            className="p-2 border border-slate-300 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors"
            title="Recargar datos"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-600">Fecha:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-indigo-500 bg-slate-50"
            />
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-medium">
          <strong>Error de conexión:</strong> {errorMessage}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12 text-slate-500 gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
          <span className="text-sm">Cargando lista de estudiantes...</span>
        </div>
      ) : students.length === 0 ? (
        <div className="bg-white p-8 text-center rounded-2xl border border-slate-200 text-slate-500 text-sm space-y-3">
          <p>No se encontraron perfiles de alumnos registrados en la base de datos.</p>
          <button
            onClick={fetchAttendanceData}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-500 transition-colors"
          >
            Volver a intentar
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="p-4">Estudiante</th>
                  <th className="p-4 text-center">Faltas Acumuladas</th>
                  <th className="p-4 text-center">Estado de Riesgo</th>
                  <th className="p-4 text-center">Marcar ({selectedDate})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {students.map((student) => {
                  const isHighRisk = student.absencesCount >= 3;
                  return (
                    <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-slate-900">{student.full_name}</div>
                        <div className="text-[11px] text-slate-400">{student.email}</div>
                      </td>
                      <td className="p-4 text-center font-bold text-sm">
                        {student.absencesCount}
                      </td>
                      <td className="p-4 text-center">
                        {isHighRisk ? (
                          <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-600 px-2.5 py-1 rounded-full text-[11px] font-bold border border-rose-200">
                            <AlertTriangle className="h-3.5 w-3.5" /> Riesgo (≥3)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full text-[11px] font-bold border border-emerald-200">
                            <CheckCircle className="h-3.5 w-3.5" /> Regular
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        {savingId === student.id ? (
                          <Loader2 className="h-4 w-4 animate-spin text-indigo-600 mx-auto" />
                        ) : (
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleMarkAttendance(student.id, 'present')}
                              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                                student.statusToday === 'present'
                                  ? 'bg-emerald-600 text-white shadow'
                                  : 'bg-slate-100 text-slate-600 hover:bg-emerald-100 hover:text-emerald-700'
                              }`}
                            >
                              Presente
                            </button>
                            <button
                              onClick={() => handleMarkAttendance(student.id, 'absent')}
                              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                                student.statusToday === 'absent'
                                  ? 'bg-rose-600 text-white shadow'
                                  : 'bg-slate-100 text-slate-600 hover:bg-rose-100 hover:text-rose-700'
                              }`}
                            >
                              Ausente
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}