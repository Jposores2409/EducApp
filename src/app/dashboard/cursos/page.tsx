'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { BookOpen, Plus, Trash2, Loader2, Folder } from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

interface Course {
  id: string;
  title: string;
  description: string;
  created_at?: string;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (err) {
      console.error('Error al obtener cursos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setCreating(true);
    try {
      const { error } = await supabase.from('courses').insert([
        {
          title,
          description,
        },
      ]);

      if (error) throw error;

      setTitle('');
      setDescription('');
      await fetchCourses();
    } catch (err: any) {
      alert('Error creando materia: ' + err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (!confirm('¿Deseas eliminar esta materia?')) return;

    try {
      const { error } = await supabase.from('courses').delete().eq('id', id);
      if (error) throw error;
      await fetchCourses();
    } catch (err: any) {
      alert('Error eliminando la materia: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-indigo-600" /> Materias & Cursos
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Gestión de asignaturas y repositorios académicos institucionales.
          </p>
        </div>
      </div>

      {/* Formulario de Creación Directa */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Plus className="h-4 w-4 text-indigo-600" /> Crear Nueva Materia
        </h2>
        <form onSubmit={handleCreateCourse} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            required
            placeholder="Nombre de la Materia (Ej: Matemática I)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 bg-slate-50"
          />
          <input
            type="text"
            placeholder="Descripción o Comisión (Opcional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 bg-slate-50"
          />
          <button
            type="submit"
            disabled={creating}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Guardar Materia
          </button>
        </form>
      </div>

      {/* Lista de Materias */}
      {loading ? (
        <div className="flex justify-center py-12 text-slate-500 gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
          <span className="text-sm">Cargando materias...</span>
        </div>
      ) : courses.length === 0 ? (
        <div className="bg-white p-8 text-center rounded-2xl border border-slate-200 text-slate-500 text-sm">
          No hay materias registradas aún. ¡Crea la primera utilizando el formulario superior!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 hover:border-indigo-200 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                    <Folder className="h-5 w-5" />
                  </div>
                  <button
                    onClick={() => handleDeleteCourse(course.id)}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Eliminar materia"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <h3 className="font-bold text-slate-900 text-base">{course.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2">
                  {course.description || 'Sin descripción adicional.'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}