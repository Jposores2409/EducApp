'use client';

import { useState, useEffect } from 'react';
import { getSupabase } from '../../../lib/supabaseClient';
import { FileCheck, Plus, Trash2, Loader2, Calendar } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface Course {
  id: string;
  title: string;
}

interface Assignment {
  id: string;
  title: string;
  description: string;
  due_date: string;
  course_id: string;
  courses?: { title: string };
}

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [courseId, setCourseId] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const supabase = getSupabase();
      const { data: coursesData } = await supabase.from('courses').select('id, title');
      setCourses(coursesData || []);
      if (coursesData && coursesData.length > 0) {
        setCourseId(coursesData[0].id);
      }

      const { data: assignmentsData, error } = await supabase
        .from('assignments')
        .select('*, courses(title)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAssignments(assignmentsData || []);
    } catch (err) {
      console.error('Error cargando trabajos prácticos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !courseId) {
      alert('Por favor completa el título y selecciona una materia.');
      return;
    }

    setCreating(true);
    try {
      const supabase = getSupabase();
      const { error } = await supabase.from('assignments').insert([
        {
          title,
          description,
          due_date: dueDate || null,
          course_id: courseId,
        },
      ]);

      if (error) throw error;

      setTitle('');
      setDescription('');
      setDueDate('');
      await loadInitialData();
    } catch (err: any) {
      alert('Error creando trabajo práctico: ' + err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteAssignment = async (id: string) => {
    if (!confirm('¿Deseas eliminar este trabajo práctico?')) return;

    try {
      const supabase = getSupabase();
      const { error } = await supabase.from('assignments').delete().eq('id', id);
      if (error) throw error;
      await loadInitialData();
    } catch (err: any) {
      alert('Error eliminando trabajo práctico: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <FileCheck className="h-6 w-6 text-indigo-600" /> Trabajos Prácticos
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Publicación de consignas y seguimiento de entregas para los alumnos.
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <Plus className="h-4 w-4 text-indigo-600" /> Crear Nuevo Trabajo Práctico
        </h2>
        <form onSubmit={handleCreateAssignment} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">
                Materia Asignada
              </label>
              <select
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                className="w-full border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 bg-slate-50"
              >
                {courses.length === 0 ? (
                  <option value="">Primero crea una materia en el módulo Materias</option>
                ) : (
                  courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">
                Título del TP
              </label>
              <input
                type="text"
                required
                placeholder="Ej: TP 1 - Algoritmos Selección"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 bg-slate-50"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">
                Fecha de Entrega
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 bg-slate-50"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1 block">
              Consigna / Descripción
            </label>
            <textarea
              rows={2}
              placeholder="Detalle de la entrega, criterios de evaluación..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 bg-slate-50"
            />
          </div>

          <button
            type="submit"
            disabled={creating || courses.length === 0}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-6 rounded-xl text-xs inline-flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Publicar Trabajo Práctico
          </button>
        </form>
      </div>

      {loading ? (
        <div className="flex justify-center py-12 text-slate-500 gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
          <span className="text-sm">Cargando trabajos prácticos...</span>
        </div>
      ) : assignments.length === 0 ? (
        <div className="bg-white p-8 text-center rounded-2xl border border-slate-200 text-slate-500 text-sm">
          No hay trabajos prácticos publicados.
        </div>
      ) : (
        <div className="space-y-3">
          {assignments.map((item) => (
            <div
              key={item.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:border-indigo-200 transition-all"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-lg text-[10px] font-bold border border-indigo-100">
                    {item.courses?.title || 'Materia'}
                  </span>
                  {item.due_date && (
                    <span className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                      <Calendar className="h-3 w-3" /> Entrega: {item.due_date}
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-slate-900 text-sm">{item.title}</h3>
                <p className="text-xs text-slate-500">{item.description || 'Sin consigna especificada.'}</p>
              </div>

              <button
                onClick={() => handleDeleteAssignment(item.id)}
                className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                title="Eliminar trabajo práctico"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}