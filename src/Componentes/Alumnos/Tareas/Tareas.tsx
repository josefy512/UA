import React, { useState, useEffect } from 'react';
import './Tareas.css';
import {
  Search,
  Clock,
  CheckCircle2,
  BookOpen,
  FileText,
  Download,
  ExternalLink,
  User,
  Loader2,
  AlertTriangle,
  Upload
} from 'lucide-react';

interface CursoItem {
  id: string | number;
  codigo: string;
  nombre: string;
  profesor: string;
  creditos: number;
  silaboUrl: string | null;
  ubicacion: string;
  horario: string;
  grupo: string;
  avance: number;
}

interface TareaItem {
  id: string;
  codigoCurso: string;
  nombreCurso: string;
  titulo: string;
  vencimiento: string;
  modalidad: string;
  ponderacion: string;
  docente: string;
  instrucciones: string[];
}

const CURSOS_INICIALES: CursoItem[] = [
  {
    id: 'cur-1',
    codigo: 'INV-401',
    nombre: 'Proyecto de Investigación e Innovación Tecnológica',
    profesor: 'Prof. Adolfo Ventocilla Flores',
    creditos: 4,
    silaboUrl: null,
    ubicacion: 'Aula 302 · Pabellón Académico',
    horario: 'Lun y Mié 10:00 – 12:00 PM',
    grupo: 'Grupo 1A · Turno Mañana',
    avance: 0
  },
  {
    id: 'cur-2',
    codigo: 'SEM-502',
    nombre: 'Seminario de Tesis',
    profesor: 'Docente de Seminario',
    creditos: 3,
    silaboUrl: null,
    ubicacion: 'Aula 205 · Pabellón B',
    horario: 'Mar y Jue 08:00 – 10:00 AM',
    grupo: 'Grupo 1A · Turno Mañana',
    avance: 0
  }
];

const TAREAS_ACTIVAS: TareaItem[] = [
  {
    id: 't-1',
    codigoCurso: 'INV-401',
    nombreCurso: 'Proyecto de Investigación e Innovación Tecnológica',
    titulo: 'Taller N° 4: Avance de Documentación y Matriz Metodológica',
    vencimiento: 'Mañana, 23:59 hrs',
    modalidad: 'Informe Grupal',
    ponderacion: '15%',
    docente: 'Prof. Adolfo Ventocilla Flores',
    instrucciones: [
      'Presentar el documento en formato PDF siguiendo los lineamientos explicados en clase.',
      'Verificar que las tablas, esquemas o enlaces de referencia estén legibles y completos.'
    ]
  },
  {
    id: 't-2',
    codigoCurso: 'SEM-502',
    nombreCurso: 'Seminario de Tesis',
    titulo: 'Entrega de Estado del Arte',
    vencimiento: 'En 4 días',
    modalidad: 'Individual',
    ponderacion: '10%',
    docente: 'Docente de Seminario',
    instrucciones: [
      'Consolidar al menos 6 fuentes académicas relevantes con resumen crítico.',
      'Subir el archivo en formato PDF dentro del plazo establecido.'
    ]
  }
];

export default function TareasView() {
  const [activeMainTab, setActiveMainTab] = useState<'cursos' | 'tareas'>('tareas');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cursos, setCursos] = useState<CursoItem[]>([]);
  const [loadingCursos, setLoadingCursos] = useState<boolean>(true);
  const [tareaSeleccionadaId, setTareaSeleccionadaId] = useState<string>('t-1');
  const [archivoNombre, setArchivoNombre] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setCursos(CURSOS_INICIALES);
      setLoadingCursos(false);
    }, 150);

    return () => window.clearTimeout(timer);
  }, []);

  const cursosFiltrados = cursos.filter(
    (c) =>
      c.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.codigo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.profesor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tareaActiva =
    TAREAS_ACTIVAS.find((t) => t.id === tareaSeleccionadaId) || TAREAS_ACTIVAS[0];

  const handleArchivoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setArchivoNombre(file.name);
    }
  };

  return (
    <div className="tar-root">
      {/* Cabecera del módulo y selector de pestañas */}
      <div className="tar-card tar-header-banner">
        <div>
          <h2 className="tar-title">Cursos, Sílabos y Entregables</h2>
          <p className="tar-subtitle">
            Consulta asignaturas matriculadas, descarga sílabos oficiales y gestiona tus entregas.
          </p>
        </div>

        <div className="tar-tabs-box" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeMainTab === 'cursos'}
            onClick={() => setActiveMainTab('cursos')}
            className={`tar-tab-btn ${activeMainTab === 'cursos' ? 'tar-tab-btn-active' : ''}`}
          >
            <BookOpen className="tar-icon-sm tar-ico-sky" />
            <span>Mis Cursos y Sílabos</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeMainTab === 'tareas'}
            onClick={() => setActiveMainTab('tareas')}
            className={`tar-tab-btn ${activeMainTab === 'tareas' ? 'tar-tab-btn-active' : ''}`}
          >
            <FileText className="tar-icon-sm tar-ico-sky" />
            <span>Tareas y Entregables ({TAREAS_ACTIVAS.length})</span>
          </button>
        </div>
      </div>

      {/* VISTA 1: MIS CURSOS Y SÍLABOS */}
      {activeMainTab === 'cursos' && (
        <div className="tar-section-stack">
          <div className="tar-card tar-filter-bar">
            <div className="tar-search-wrap">
              <Search className="tar-search-icon" />
              <input
                type="text"
                placeholder="Filtrar por curso, código o docente..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="tar-search-input"
              />
            </div>

            <span className="tar-filter-count">
              {cursosFiltrados.length} asignatura(s) disponible(s)
            </span>
          </div>

          {loadingCursos ? (
            <div className="tar-card tar-loading-box">
              <Loader2 className="tar-icon-lg tar-spin tar-ico-blue" />
              <p className="tar-loading-text">Cargando asignaturas oficiales...</p>
            </div>
          ) : cursosFiltrados.length === 0 ? (
            <div className="tar-card tar-empty-box">
              No se encontraron cursos con el criterio ingresado.
            </div>
          ) : (
            <div className="tar-courses-grid">
              {cursosFiltrados.map((curso) => (
                <div key={curso.id} className="tar-card tar-course-card">
                  <div className="tar-course-head">
                    <div className="tar-course-badges">
                      <span className="tar-code-badge">{curso.codigo}</span>
                      <span className="tar-group-badge">{curso.grupo}</span>
                    </div>
                    <h3 className="tar-course-name">{curso.nombre}</h3>
                  </div>

                  <div className="tar-course-meta">
                    <div className="tar-meta-cell">
                      <div className="tar-meta-icon">
                        <User className="tar-icon-md" />
                      </div>
                      <div className="tar-truncate-wrap">
                        <p className="tar-meta-label">Docente</p>
                        <p className="tar-meta-value">{curso.profesor}</p>
                      </div>
                    </div>

                    <div className="tar-meta-cell">
                      <div className="tar-meta-icon">
                        <Clock className="tar-icon-md" />
                      </div>
                      <div className="tar-truncate-wrap">
                        <p className="tar-meta-label">Horario</p>
                        <p className="tar-meta-value">{curso.horario}</p>
                      </div>
                    </div>
                  </div>

                  <div className="tar-course-footer">
                    <div className="tar-syllabus-label">
                      <FileText className="tar-icon-md tar-ico-muted" />
                      <span>Sílabo del curso:</span>
                    </div>

                    {curso.silaboUrl ? (
                      <a
                        href={curso.silaboUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="tar-syllabus-link"
                      >
                        <Download className="tar-icon-sm" />
                        <span>Ver / Descargar PDF</span>
                        <ExternalLink className="tar-icon-xs" />
                      </a>
                    ) : (
                      <span className="tar-syllabus-pending">Publicación pendiente</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VISTA 2: TAREAS Y ENTREGABLES */}
      {activeMainTab === 'tareas' && (
        <div className="tar-section-stack">
          <div className="tar-stats-grid">
            <div className="tar-card tar-stat-card tar-stat-amber">
              <div className="tar-stat-top">
                <span>Tareas Pendientes</span>
                <Clock className="tar-icon-md tar-ico-amber" />
              </div>
              <div className="tar-stat-bottom">
                <span className="tar-stat-num">{TAREAS_ACTIVAS.length}</span>
                <span className="tar-stat-tag tar-text-amber">Por entregar</span>
              </div>
            </div>

            <div className="tar-card tar-stat-card tar-stat-emerald">
              <div className="tar-stat-top">
                <span>Entregadas a Tiempo</span>
                <CheckCircle2 className="tar-icon-md tar-ico-emerald" />
              </div>
              <div className="tar-stat-bottom">
                <span className="tar-stat-num">14</span>
                <span className="tar-stat-note tar-text-emerald">Registradas</span>
              </div>
            </div>

            <div className="tar-card tar-stat-card tar-stat-blue">
              <div className="tar-stat-top">
                <span>Evaluaciones Calificadas</span>
                <span className="tar-stat-note tar-text-sky">Prom: 17.8</span>
              </div>
              <div className="tar-stat-num-only">12</div>
            </div>

            <div className="tar-card tar-stat-card tar-stat-rose">
              <div className="tar-stat-top">
                <span>Próximo Vencimiento</span>
                <AlertTriangle className="tar-icon-md tar-ico-rose" />
              </div>
              <div className="tar-stat-due">
                <p className="tar-due-when">{tareaActiva.vencimiento}</p>
                <p className="tar-due-course">{tareaActiva.codigoCurso}</p>
              </div>
            </div>
          </div>

          <div className="tar-split-grid">
            <div className="tar-list-col">
              {TAREAS_ACTIVAS.map((tarea) => {
                const seleccionada = tarea.id === tareaActiva.id;
                return (
                  <button
                    type="button"
                    key={tarea.id}
                    onClick={() => {
                      setTareaSeleccionadaId(tarea.id);
                      setArchivoNombre(null);
                    }}
                    className={`tar-task-item ${seleccionada ? 'tar-task-item-active' : ''}`}
                  >
                    <div className="tar-task-item-top">
                      <span className="tar-task-course">
                        {tarea.codigoCurso} · {tarea.modalidad}
                      </span>
                      <span className="tar-due-pill">{tarea.vencimiento}</span>
                    </div>

                    <h3 className="tar-task-item-title">{tarea.titulo}</h3>

                    <div className="tar-task-item-foot">
                      <span className="tar-truncate-text">{tarea.docente}</span>
                      <span className="tar-task-weight">Peso: {tarea.ponderacion}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="tar-card tar-detail-col">
              <div className="tar-detail-head">
                <span className="tar-detail-badge">
                  {tareaActiva.codigoCurso} · {tareaActiva.nombreCurso}
                </span>
                <h3 className="tar-detail-title">{tareaActiva.titulo}</h3>
                <p className="tar-detail-meta">
                  {tareaActiva.docente} · Vence: {tareaActiva.vencimiento}
                </p>
              </div>

              <div className="tar-instructions-wrap">
                <p className="tar-instructions-heading">Indicaciones de Entrega</p>
                <div className="tar-instructions-box">
                  {tareaActiva.instrucciones.map((inst, idx) => (
                    <p key={idx} className="tar-instruction-line">
                      {idx + 1}. {inst}
                    </p>
                  ))}
                </div>
              </div>

              {archivoNombre && (
                <div className="tar-file-selected">
                  Archivo seleccionado: {archivoNombre}
                </div>
              )}

              <div className="tar-upload-wrap">
                <label className="tar-upload-btn">
                  <Upload className="tar-icon-md" />
                  <span>Seleccionar y Subir Entrega (PDF)</span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleArchivoChange}
                    className="tar-file-input"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}