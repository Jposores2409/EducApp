import { Video, Calendar, Clock, BookOpen, ExternalLink, FileText, CheckCircle2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function VideollamadaPage() {
  // Datos simulados de clases y tareas vinculadas (escalable a tablas de Supabase 'lessons' y 'assignments')
  const upcomingMeetings = [
    {
      id: 'meet-1',
      subject: 'Matemáticas Avanzadas',
      topic: 'Ecuaciones Diferenciales y Aplicaciones Prácticas',
      professor: 'Prof. Roberto Gómez',
      date: 'Hoy',
      time: '18:00 - 19:30',
      jitsiRoom: 'PlataformaEducativa-Matematicas-Room1',
      assignments: [
        { id: 'task-1', title: 'Resolver Guía de Ejercicios #4', dueDate: 'Mañana, 23:59', status: 'pending' },
        { id: 'task-2', title: 'Lectura Cap. 5: Métodos de Resolución', dueDate: '30 Oct', status: 'completed' },
      ],
    },
    {
      id: 'meet-2',
      subject: 'Historia Contemporánea',
      topic: 'Análisis de la Revolución Industrial y Impacto Social',
      professor: 'Prof. Elena Torres',
      date: 'Mañana',
      time: '16:00 - 17:30',
      jitsiRoom: 'PlataformaEducativa-Historia-Room2',
      assignments: [
        { id: 'task-3', title: 'Ensayo Breve: Transformaciones Urbanas', dueDate: '02 Nov, 18:00', status: 'pending' },
      ],
    },
  ];

  return (
    <div className="space-y-8">
      {/* Encabezado */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Video className="h-7 w-7 text-indigo-600" />
          Aulas Virtuales & Videollamadas
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Acceso directo a reuniones sincrónicas vía Jitsi Meet y seguimiento de tareas asociadas.
        </p>
      </div>

      {/* Listado de Próximos Encuentros */}
      <div className="space-y-6">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-indigo-600" />
          Próximos Encuentros Programados
        </h2>

        <div className="grid grid-cols-1 gap-6">
          {upcomingMeetings.map((meeting) => {
            const jitsiUrl = `https://meet.jit.si/${meeting.jitsiRoom}`;

            return (
              <div
                key={meeting.id}
                className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden hover:border-slate-300 transition-all"
              >
                {/* Header de la Clase */}
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full">
                        {meeting.subject}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {meeting.date} ({meeting.time})
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">{meeting.topic}</h3>
                    <p className="text-xs text-slate-500">Dictado por: <span className="font-semibold text-slate-700">{meeting.professor}</span></p>
                  </div>

                  {/* Botón directo a Jitsi */}
                  <a
                    href={jitsiUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-md transition-all text-sm flex-shrink-0"
                  >
                    <Video className="h-4 w-4" />
                    Unirse a la Clase (Jitsi)
                    <ExternalLink className="h-3.5 w-3.5 opacity-80" />
                  </a>
                </div>

                {/* Subsección de Tareas de la Clase */}
                <div className="p-6 bg-white space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4 text-slate-500" />
                    Tareas y Materiales de esta Clase
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {meeting.assignments.map((task) => (
                      <div
                        key={task.id}
                        className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/80 flex items-start justify-between gap-3"
                      >
                        <div className="space-y-0.5">
                          <p className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                            <FileText className="h-4 w-4 text-indigo-500 flex-shrink-0" />
                            {task.title}
                          </p>
                          <p className="text-xs text-slate-400">Entrega: {task.dueDate}</p>
                        </div>

                        {task.status === 'completed' ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Entregada
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-md border border-amber-100">
                            Pendiente
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}