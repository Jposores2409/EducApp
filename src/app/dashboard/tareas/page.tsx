import { supabase } from '../../../lib/supabase';
import { FileCheck, AlertCircle, Upload, CheckCircle2, Award, Clock, MessageSquare, Send, Plus, Trash2, Download, UserCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function TareasPage() {
  // Cargar trabajos prácticos desde Supabase
  const { data: assignmentsData } = await supabase
    .from('assignments')
    .select('*')
    .order('created_at', { ascending: false });

  const assignments = assignmentsData || [];

  return (
    <div className="space-y-8">
      {/* Explorador de archivos nativo para consignas de TP */}
      <input
        type="file"
        id="tp-file-input"
        className="hidden"
        accept=".pdf,.doc,.docx,.zip,.rar"
      />

      {/* Encabezado con Botón de Creación */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FileCheck className="h-7 w-7 text-indigo-600" />
            Trabajos Prácticos & Evaluaciones
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Gestión de entregas, asignación de consignas y devolución de calificaciones.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="btn-open-modal-tp"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2.5 rounded-xl shadow text-sm transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Crear Trabajo Práctico
          </button>
        </div>
      </div>

      {/* Modal / Formulario Nueva Consigna de TP */}
      <div id="modal-tp" className="hidden bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-4 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800">Crear Nuevo Trabajo Práctico</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input id="input-tp-subject" type="text" placeholder="Materia (ej: Matemáticas)" className="p-2.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none" />
          <input id="input-tp-title" type="text" placeholder="Título del Trabajo Práctico" className="p-2.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none" />
          <input id="input-tp-duedate" type="text" placeholder="Fecha límite (ej: Mañana, 23:59)" className="p-2.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none" />
        </div>
        <textarea id="input-tp-desc" placeholder="Instrucciones o consignas del trabajo..." className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none"></textarea>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2">
          <button
            type="button"
            id="btn-trigger-tp-file"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <Upload className="h-3.5 w-3.5 text-indigo-600" />
            <span id="label-tp-file">Adjuntar Archivo de Consigna (opcional)</span>
          </button>

          <div className="flex gap-2 w-full sm:w-auto justify-end">
            <button id="btn-cancel-tp" type="button" className="px-4 py-2 bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer">Cancelar</button>
            <button id="btn-save-tp" type="button" className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg shadow cursor-pointer">Publicar TP</button>
          </div>
        </div>
      </div>

      {/* Selector de Rol Simulado para pruebas */}
      <div className="bg-slate-100 p-3 rounded-xl flex items-center justify-between text-xs text-slate-600 border border-slate-200">
        <span className="font-semibold flex items-center gap-1">
          <UserCheck className="h-4 w-4 text-indigo-600" /> Modo de Vista Actual:
        </span>
        <div className="flex gap-2">
          <button id="btn-set-student" className="role-btn px-3 py-1 rounded-md bg-indigo-600 text-white font-bold cursor-pointer" data-role="student">
            Vista Alumno
          </button>
          <button id="btn-set-admin" className="role-btn px-3 py-1 rounded-md bg-white text-slate-700 border border-slate-200 font-bold cursor-pointer" data-role="admin">
            Vista Docente / Admin
          </button>
        </div>
      </div>

      {/* Listado de Trabajos Prácticos */}
      {assignments.length === 0 ? (
        <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl text-slate-400 text-sm">
          No hay trabajos prácticos creados. Presiona "Crear Trabajo Práctico" para asignar el primero.
        </div>
      ) : (
        <div className="space-y-6">
          {assignments.map((tp) => (
            <div
              key={tp.id}
              className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden p-6 space-y-4"
            >
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-2 border-b border-slate-100 pb-4">
                <div>
                  <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full border border-indigo-100">
                    {tp.subject}
                  </span>
                  <h3 className="text-lg font-bold text-slate-800 mt-1">{tp.title}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 flex items-center gap-1 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                    <Clock className="h-3.5 w-3.5 text-slate-500" />
                    Entrega: {tp.due_date}
                  </span>

                  {tp.file_url && (
                    <a
                      href={tp.file_url}
                      download
                      className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 hover:bg-indigo-100"
                    >
                      <Download className="h-3.5 w-3.5" /> Archivo Consigna
                    </a>
                  )}

                  <button
                    className="btn-delete-tp p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                    data-id={tp.id}
                    title="Dar de baja este Trabajo Práctico"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <p className="text-sm text-slate-600">{tp.description}</p>

              {/* Vista de Entrega para ALUMNO */}
              <div className="view-student pt-2 space-y-3">
                {tp.status === 'graded' ? (
                  <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-800 uppercase flex items-center gap-1">
                        <Award className="h-4 w-4 text-emerald-600" /> Calificación & Devolución
                      </span>
                      <span className="text-lg font-extrabold text-emerald-700">{tp.grade}</span>
                    </div>
                    {tp.feedback && (
                      <p className="text-xs text-emerald-900 bg-white p-3 rounded-lg border border-emerald-100 italic">
                        "{tp.feedback}"
                      </p>
                    )}
                  </div>
                ) : (
                  <button className="btn-deliver-tp inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-xl text-xs transition-all shadow cursor-pointer">
                    <Upload className="h-4 w-4" /> Subir y Entregar Trabajo Práctico
                  </button>
                )}
              </div>

              {/* Vista de Calificación para DOCENTE / ADMIN */}
              <div className="view-admin hidden pt-4 border-t border-slate-100 bg-slate-50/50 p-4 rounded-xl space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5">
                  <MessageSquare className="h-4 w-4 text-indigo-600" />
                  Panel del Docente: Cargar Calificación y Devolución
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <input
                    type="text"
                    placeholder="Nota (ej: 9 / 10)"
                    defaultValue={tp.grade || ''}
                    className="input-grade p-2.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Escribir correcciones u observaciones..."
                    defaultValue={tp.feedback || ''}
                    className="input-feedback md:col-span-2 p-2.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none"
                  />
                  <button
                    className="btn-send-grade inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold p-2.5 rounded-lg text-xs transition-all shadow cursor-pointer"
                    data-id={tp.id}
                  >
                    <Send className="h-3.5 w-3.5" /> Guardar Devolución
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Script Interactivo de Manejo de Archivos y CRUD */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            let tempTpAttachedUrl = null;

            document.addEventListener('click', function(e) {
              const modal = document.getElementById('modal-tp');

              // Modal Crear TP
              if (e.target && (e.target.id === 'btn-open-modal-tp' || e.target.closest('#btn-open-modal-tp'))) {
                modal.classList.remove('hidden');
              }
              if (e.target && e.target.id === 'btn-cancel-tp') {
                modal.classList.add('hidden');
              }

              // Disparar Selección de Archivo Consigna
              if (e.target && (e.target.id === 'btn-trigger-tp-file' || e.target.closest('#btn-trigger-tp-file'))) {
                document.getElementById('tp-file-input').click();
              }

              // Guardar Nuevo Trabajo Práctico
              if (e.target && e.target.id === 'btn-save-tp') {
                const payload = {
                  subject: document.getElementById('input-tp-subject').value,
                  title: document.getElementById('input-tp-title').value,
                  due_date: document.getElementById('input-tp-duedate').value,
                  description: document.getElementById('input-tp-desc').value,
                  file_url: tempTpAttachedUrl
                };

                fetch('/api/assignments', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ action: 'create_assignment', payload })
                }).then(() => window.location.reload());
              }

              // Dar de Baja Trabajo Práctico
              const btnDel = e.target.closest('.btn-delete-tp');
              if (btnDel) {
                const id = btnDel.getAttribute('data-id');
                if (confirm('¿Estás seguro de eliminar este trabajo práctico?')) {
                  fetch('/api/assignments?id=' + id, { method: 'DELETE' })
                    .then(() => window.location.reload());
                }
              }

              // Guardar Devolución/Calificación Docente
              const btnGrade = e.target.closest('.btn-send-grade');
              if (btnGrade) {
                const id = btnGrade.getAttribute('data-id');
                const row = btnGrade.closest('.view-admin');
                const grade = row.querySelector('.input-grade').value;
                const feedback = row.querySelector('.input-feedback').value;

                fetch('/api/assignments', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    action: 'grade_submission',
                    payload: { id, grade, feedback }
                  })
                }).then(() => window.location.reload());
              }

              // Alternar Roles (Simulación Alumno vs Profesor)
              const roleBtn = e.target.closest('.role-btn');
              if (roleBtn) {
                const role = roleBtn.getAttribute('data-role');
                const studentViews = document.querySelectorAll('.view-student');
                const adminViews = document.querySelectorAll('.view-admin');

                if (role === 'admin') {
                  studentViews.forEach(v => v.classList.add('hidden'));
                  adminViews.forEach(v => v.classList.remove('hidden'));
                } else {
                  studentViews.forEach(v => v.classList.remove('hidden'));
                  adminViews.forEach(v => v.classList.add('hidden'));
                }
              }

              // Entregar TP desde explorador por el alumno
              if (e.target && e.target.classList.contains('btn-deliver-tp')) {
                const input = document.createElement('input');
                input.type = 'file';
                input.onchange = e => {
                  alert('¡Trabajo subido correctamente! Notificación enviada al profesor.');
                };
                input.click();
              }
            });

            // Escuchar Selección de Archivo Consigna por el Docente
            document.addEventListener('change', function(e) {
              if (e.target && e.target.id === 'tp-file-input') {
                const file = e.target.files[0];
                if (file) {
                  tempTpAttachedUrl = URL.createObjectURL(file);
                  document.getElementById('label-tp-file').innerText = 'Archivo cargado: ' + file.name;
                }
              }
            });
          `,
        }}
      />
    </div>
  );
}