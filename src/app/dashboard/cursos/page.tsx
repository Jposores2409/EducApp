import { supabase } from '../../../lib/supabase';
import { BookOpen, FileText, Link as LinkIcon, Download, Folder, Plus, Trash2, FileCode, Upload } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function CursosPage() {
  // Cargar materias y archivos de Supabase
  const { data: coursesData } = await supabase.from('courses').select('*').order('created_at', { ascending: false });
  const { data: materialsData } = await supabase.from('materials').select('*').order('created_at', { ascending: false });

  const courses = coursesData || [];
  const materials = materialsData || [];

  return (
    <div className="space-y-8">
      {/* Input oculto para abrir el Explorador de Archivos de la Computadora */}
      <input
        type="file"
        id="file-input-explorer"
        className="hidden"
        accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
      />

      {/* Encabezado */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <BookOpen className="h-7 w-7 text-indigo-600" />
            Gestión de Materias & Repositorio
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Carga de archivos locales mediante el explorador de Windows/Mac y administración de materias.
          </p>
        </div>

        <button
          id="btn-open-modal-course"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2.5 rounded-xl shadow text-sm transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Nueva Materia
        </button>
      </div>

      <div id="alert-box" className="hidden p-4 rounded-xl text-sm font-medium"></div>

      {/* Modal Formulario Nueva Materia */}
      <div id="modal-course" className="hidden bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-4">
        <h3 className="text-sm font-bold text-slate-800">Agregar Nueva Materia</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input id="input-code" type="text" placeholder="Código (ej: MAT-301)" className="p-2.5 bg-white border border-slate-200 rounded-lg text-xs" />
          <input id="input-title" type="text" placeholder="Nombre de la Materia" className="p-2.5 bg-white border border-slate-200 rounded-lg text-xs" />
          <input id="input-prof" type="text" placeholder="Profesor a cargo" className="p-2.5 bg-white border border-slate-200 rounded-lg text-xs" />
        </div>
        <textarea id="input-desc" placeholder="Descripción de la materia..." className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs"></textarea>
        <div className="flex justify-end gap-2">
          <button id="btn-cancel-course" type="button" className="px-4 py-2 bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer">Cancelar</button>
          <button id="btn-save-course" type="button" className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg shadow cursor-pointer">Guardar Materia</button>
        </div>
      </div>

      {/* Grilla de Materias */}
      {courses.length === 0 ? (
        <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl text-slate-400 text-sm">
          No hay materias registradas. Haz clic en "Nueva Materia" para dar de alta la primera.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {courses.map((course) => {
            const courseMaterials = materials.filter((m) => m.course_id === course.id);

            return (
              <div key={course.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between">
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start gap-2">
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-100">
                      {course.code}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 font-medium">{course.professor}</span>
                      <button
                        className="btn-delete-course p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                        data-id={course.id}
                        title="Dar de baja materia"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-slate-800">{course.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">{course.description}</p>
                  </div>

                  {/* Sección de Recursos */}
                  <div className="space-y-3 pt-3 border-t border-slate-100">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Folder className="h-4 w-4 text-indigo-500" />
                        Archivos Adjuntos ({courseMaterials.length})
                      </h4>

                      {/* Botón que dispara el explorador de archivos nativo */}
                      <button
                        className="btn-trigger-explorer text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100 transition-all"
                        data-course-id={course.id}
                      >
                        <Upload className="h-3.5 w-3.5" /> Adjuntar desde PC
                      </button>
                    </div>

                    <div className="space-y-2">
                      {courseMaterials.length === 0 ? (
                        <p className="text-xs text-slate-400 italic p-2">Sin archivos adjuntos en esta materia.</p>
                      ) : (
                        courseMaterials.map((item) => (
                          <div key={item.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2.5">
                              {item.type === 'pdf' && <FileText className="h-4 w-4 text-rose-500" />}
                              {item.type === 'link' && <LinkIcon className="h-4 w-4 text-indigo-500" />}
                              {item.type === 'doc' && <FileCode className="h-4 w-4 text-amber-500" />}
                              <div>
                                <a href={item.url} target="_blank" download rel="noopener noreferrer" className="text-xs font-semibold text-slate-800 hover:text-indigo-600">
                                  {item.title}
                                </a>
                                {item.size && <p className="text-[10px] text-slate-400">{item.size}</p>}
                              </div>
                            </div>

                            <div className="flex items-center gap-1">
                              <a
                                href={item.url}
                                download
                                className="p-1 text-slate-400 hover:text-indigo-600 rounded cursor-pointer"
                                title="Descargar archivo"
                              >
                                <Download className="h-3.5 w-3.5" />
                              </a>
                              <button
                                className="btn-delete-material p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                                data-id={item.id}
                                title="Eliminar archivo"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Script del Explorador de Archivos y CRUD */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            let selectedCourseIdForUpload = null;

            document.addEventListener('click', function(e) {
              const modal = document.getElementById('modal-course');

              // Modal Nueva Materia
              if (e.target && (e.target.id === 'btn-open-modal-course' || e.target.closest('#btn-open-modal-course'))) {
                modal.classList.remove('hidden');
              }
              if (e.target && e.target.id === 'btn-cancel-course') {
                modal.classList.add('hidden');
              }

              // Guardar Nueva Materia
              if (e.target && e.target.id === 'btn-save-course') {
                const payload = {
                  code: document.getElementById('input-code').value,
                  title: document.getElementById('input-title').value,
                  professor: document.getElementById('input-prof').value,
                  description: document.getElementById('input-desc').value,
                };

                fetch('/api/courses', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ action: 'create_course', payload })
                }).then(() => window.location.reload());
              }

              // Eliminar Materia
              const btnDelCourse = e.target.closest('.btn-delete-course');
              if (btnDelCourse) {
                const id = btnDelCourse.getAttribute('data-id');
                if (confirm('¿Estás seguro de dar de baja esta materia y sus archivos?')) {
                  fetch('/api/courses?action=delete_course&id=' + id, { method: 'DELETE' })
                    .then(() => window.location.reload());
                }
              }

              // Disparar explorador de archivos
              const btnExplorer = e.target.closest('.btn-trigger-explorer');
              if (btnExplorer) {
                selectedCourseIdForUpload = btnExplorer.getAttribute('data-course-id');
                const fileInput = document.getElementById('file-input-explorer');
                fileInput.click();
              }

              // Eliminar Archivo
              const btnDelMat = e.target.closest('.btn-delete-material');
              if (btnDelMat) {
                const id = btnDelMat.getAttribute('data-id');
                if (confirm('¿Eliminar este archivo?')) {
                  fetch('/api/courses?action=delete_material&id=' + id, { method: 'DELETE' })
                    .then(() => window.location.reload());
                }
              }
            });

            // Escuchar la selección de archivo desde el Explorador de Windows/Mac
            document.addEventListener('change', function(e) {
              if (e.target && e.target.id === 'file-input-explorer') {
                const file = e.target.files[0];
                if (!file || !selectedCourseIdForUpload) return;

                // Formatear tamaño del archivo
                const fileSize = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
                const fileType = file.name.endsWith('.pdf') ? 'pdf' : 'doc';
                
                // En un entorno de producción, aquí subirías el archivo al Bucket de Supabase Storage.
                // Creamos una URL directa temporal para descarga.
                const fakeFileUrl = URL.createObjectURL(file);

                const payload = {
                  course_id: selectedCourseIdForUpload,
                  title: file.name,
                  type: fileType,
                  url: fakeFileUrl,
                  size: fileSize
                };

                fetch('/api/courses', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ action: 'create_material', payload })
                }).then(() => window.location.reload());
              }
            });
          `,
        }}
      />
    </div>
  );
}