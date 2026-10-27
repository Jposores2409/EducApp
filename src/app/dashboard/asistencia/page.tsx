import { supabase } from '../../../lib/supabase';
import { CalendarCheck, Save, PhoneCall, AlertTriangle, UserCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AsistenciaPage() {
  // 1. Obtener todos los perfiles
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name, email, role');

  const students = profiles?.filter((p) => p.role === 'student' || p.role === 'alumno') || profiles || [];

  // 2. Obtener todo el historial de asistencias para calcular inasistencias totales
  const { data: attendanceHistory } = await supabase
    .from('attendance')
    .select('student_id, status');

  // 3. Contar faltas por cada alumno
  const absentsMap: Record<string, number> = {};
  attendanceHistory?.forEach((record) => {
    if (record.status === 'absent') {
      absentsMap[record.student_id] = (absentsMap[record.student_id] || 0) + 1;
    }
  });

  const todayFormatted = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const UMBRAL_FALTAS = 3; // Límite de inasistencias para activar alerta

  return (
    <div className="space-y-6">
      {/* Encabezado con Fecha */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <CalendarCheck className="h-7 w-7 text-indigo-600" />
            Control de Asistencia Diario
          </h1>
          <p className="text-slate-500 text-sm mt-1 capitalize">
            Registro para hoy: <span className="font-semibold text-indigo-600">{todayFormatted}</span>
          </p>
        </div>

        <button
          id="btn-save-attendance"
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow text-sm cursor-pointer"
        >
          <Save className="h-4 w-4" />
          Guardar Asistencia del Día
        </button>
      </div>

      <div id="alert-box" className="hidden p-4 rounded-xl text-sm font-medium"></div>

      {/* Resumen de Alertas Críticas */}
      {students.some((s) => (absentsMap[s.id] || 0) >= UMBRAL_FALTAS) && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold text-amber-900">Alumnos con riesgo por inasistencias</h3>
            <p className="text-xs text-amber-700 mt-1">
              Hay estudiantes que han alcanzado o superado {UMBRAL_FALTAS} inasistencias acumuladas. Requieren seguimiento telefónico prioritario.
            </p>
          </div>
        </div>
      )}

      {/* Tabla con Alertas Integradas */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">
              <th className="p-4">Estudiante</th>
              <th className="p-4 text-center">Faltas Acumuladas</th>
              <th className="p-4 text-center">Estado de Hoy</th>
              <th className="p-4 text-center">Acción Recomendada</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
            {students.map((student) => {
              const faltas = absentsMap[student.id] || 0;
              const requiereLlamada = faltas >= UMBRAL_FALTAS;

              return (
                <tr
                  key={student.id}
                  className={`student-row transition-colors ${
                    requiereLlamada ? 'bg-rose-50/40 hover:bg-rose-50/70' : 'hover:bg-slate-50/80'
                  }`}
                  data-student-id={student.id}
                  data-status="present"
                >
                  {/* Datos Alumno */}
                  <td className="p-4">
                    <p className="font-bold text-slate-800">{student.full_name || 'Sin Nombre'}</p>
                    <p className="text-xs text-slate-400">{student.email}</p>
                  </td>

                  {/* Faltas Totales */}
                  <td className="p-4 text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                        requiereLlamada
                          ? 'bg-rose-100 text-rose-700 border border-rose-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {faltas} {faltas === 1 ? 'falta' : 'faltas'}
                    </span>
                  </td>

                  {/* Botones Estado */}
                  <td className="p-4 text-center">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        className="btn-status px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white shadow cursor-pointer"
                        data-target-status="present"
                      >
                        Presente
                      </button>
                      <button
                        type="button"
                        className="btn-status px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-600 cursor-pointer"
                        data-target-status="late"
                      >
                        Tarde
                      </button>
                      <button
                        type="button"
                        className="btn-status px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-600 cursor-pointer"
                        data-target-status="absent"
                      >
                        Ausente
                      </button>
                    </div>
                  </td>

                  {/* Indicador de Acción Admin */}
                  <td className="p-4 text-center">
                    {requiereLlamada ? (
                      <a
                        href={`mailto:${student.email}?subject=Aviso de Inasistencias Recurrentes`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-all shadow"
                      >
                        <PhoneCall className="h-3.5 w-3.5" />
                        Llamar / Contactar
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                        <UserCheck className="h-3.5 w-3.5 text-emerald-500" /> Regular
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Script Interactivo de Guardado */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.addEventListener('click', function(e) {
              if (e.target && e.target.classList.contains('btn-status')) {
                const button = e.target;
                const row = button.closest('.student-row');
                const newStatus = button.getAttribute('data-target-status');
                
                row.setAttribute('data-status', newStatus);

                const buttons = row.querySelectorAll('.btn-status');
                buttons.forEach(btn => {
                  btn.className = 'btn-status px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-600 cursor-pointer';
                });

                if (newStatus === 'present') {
                  button.className = 'btn-status px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white shadow cursor-pointer';
                } else if (newStatus === 'late') {
                  button.className = 'btn-status px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 text-white shadow cursor-pointer';
                } else if (newStatus === 'absent') {
                  button.className = 'btn-status px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 text-white shadow cursor-pointer';
                }
              }

              if (e.target && (e.target.id === 'btn-save-attendance' || e.target.closest('#btn-save-attendance'))) {
                const rows = document.querySelectorAll('.student-row');
                const attendanceData = [];

                rows.forEach(row => {
                  attendanceData.push({
                    student_id: row.getAttribute('data-student-id'),
                    status: row.getAttribute('data-status')
                  });
                });

                const alertBox = document.getElementById('alert-box');
                alertBox.className = 'p-4 rounded-xl text-sm font-medium bg-indigo-50 text-indigo-800 border border-indigo-200';
                alertBox.innerText = 'Guardando registro del día en Supabase...';
                alertBox.classList.remove('hidden');

                fetch('/api/attendance', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ attendanceData })
                })
                .then(res => res.json())
                .then(data => {
                  if (data.success) {
                    alertBox.className = 'p-4 rounded-xl text-sm font-medium bg-emerald-50 text-emerald-800 border border-emerald-200';
                    alertBox.innerText = '¡Asistencia del día guardada e historial actualizado!';
                    setTimeout(() => window.location.reload(), 1500);
                  } else {
                    alertBox.className = 'p-4 rounded-xl text-sm font-medium bg-rose-50 text-rose-800 border border-rose-200';
                    alertBox.innerText = 'Error al guardar: ' + data.error;
                  }
                })
                .catch(err => {
                  alertBox.className = 'p-4 rounded-xl text-sm font-medium bg-rose-50 text-rose-800 border border-rose-200';
                  alertBox.innerText = 'Error de conexión con el servidor.';
                });
              }
            });
          `,
        }}
      />
    </div>
  );
}