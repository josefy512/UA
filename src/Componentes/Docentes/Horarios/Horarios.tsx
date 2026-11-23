import { useState } from 'react';
import './Horarios.css';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  CheckSquare,
  FileText,
  ExternalLink,
  Layers
} from 'lucide-react';

interface DiaSemana {
  nombre: string;
  fecha: string;
  sesiones: string;
  esHoy?: boolean;
}

interface BloqueItinerario {
  id: number;
  horario: string;
  duracion: string;
  tipo: 'claseFinalizada' | 'claseEnCurso' | 'tutoria' | 'reunion';
  codigo?: string;
  subtitulo?: string;
  nombre?: string;
  titulo?: string;
  sesion?: string;
  modalidad?: string;
  citas?: string;
  aula?: string;
  ubicacion?: string;
  grupo?: string;
  enlace?: string;
  meet?: string;
  extra?: string;
  tema?: string;
  agenda?: string;
  estado?: string;
  estudiantesCitados?: string[];
}

const DIAS_SEMANA: DiaSemana[] = [
  { nombre: 'Lunes', fecha: '12 May', sesiones: '3 sesiones' },
  { nombre: 'Martes', fecha: '13 May', sesiones: '2 sesiones' },
  { nombre: 'Miércoles', fecha: '14 May', sesiones: '4 sesiones', esHoy: true },
  { nombre: 'Jueves', fecha: '15 May', sesiones: '2 sesiones' },
  { nombre: 'Viernes', fecha: '16 May', sesiones: '1 sesión' },
  { nombre: 'Sábado', fecha: '17 May', sesiones: 'Taller libre' }
];

const ITINERARIO_DIA: BloqueItinerario[] = [
  {
    id: 1,
    horario: '08:00 AM – 09:30 AM',
    duracion: '90 min',
    codigo: 'HAR-101 · PREGRADO REGULAR',
    nombre: 'Fundamentos del Diseño Visual',
    aula: 'Aula 204 · Pabellón A (Presencial)',
    grupo: 'Grupo 1A (38 matriculados)',
    estado: 'FINALIZADO',
    tipo: 'claseFinalizada'
  },
  {
    id: 2,
    horario: '10:00 AM – 11:30 AM',
    duracion: '90 min',
    codigo: 'HAR-302 · NIVEL INTERMEDIO',
    nombre: 'Historia del Arte Moderno',
    sesion: 'Sesión 14 de 32',
    aula: 'Aula 102 · Pabellón B (Presencial)',
    grupo: 'Grupo 4B · 40 estudiantes',
    extra: 'Proyector 4K y Pizarra Smart',
    tema: 'Tema de hoy: Expresionismo alemán y movimientos de vanguardia del Siglo XX (Semana 7).',
    estado: 'EN CURSO · RESTAN 35M',
    tipo: 'claseEnCurso'
  },
  {
    id: 3,
    horario: '03:00 PM – 04:30 PM',
    duracion: '90 min',
    tipo: 'tutoria',
    titulo: 'Asesoría de Tesis y Consultas de Cátedra',
    subtitulo: 'ASESORÍA DOCENTE PROGRAMADA',
    citas: '3 Citas Agendadas',
    ubicacion: 'Cubículo Docente 4 · Pabellón de Profesores',
    enlace: 'Enlace virtual activo disponible',
    estudiantesCitados: [
      'Elena Díaz (15:00)',
      'Javier Mendoza (15:30)',
      'Carlos Ruiz (16:00)'
    ]
  },
  {
    id: 4,
    horario: '05:00 PM – 06:00 PM',
    duracion: '60 min',
    tipo: 'reunion',
    titulo: 'Consejo de Cátedra de Humanidades y Artes',
    subtitulo: 'GESTIÓN ACADÉMICA E INSTITUCIONAL',
    modalidad: 'Híbrida',
    ubicacion: 'Sala de Juntas B (Edificio Central)',
    meet: 'Sesión híbrida institucional',
    agenda: 'Agenda: Revisión de Actas Parciales y Cierre de Sílabo de medio ciclo.'
  }
];

interface HorariosPanelProps {
  onIrSeccion?: (seccion: string) => void;
}

export default function HorariosPanel({ onIrSeccion }: HorariosPanelProps) {
  const [diaSeleccionado, setDiaSeleccionado] = useState<string>('Miércoles');
  const [disponibilidadTutoria, setDisponibilidadTutoria] = useState<boolean>(true);
  const [mensajeEstado, setMensajeEstado] = useState<string>('');

  const diaActual = DIAS_SEMANA.find((d) => d.nombre === diaSeleccionado) ?? DIAS_SEMANA[2];

  const handleAccion = (texto: string, seccionDestino?: string) => {
    if (seccionDestino && onIrSeccion) {
      onIrSeccion(seccionDestino);
      return;
    }
    setMensajeEstado(texto);
  };

  return (
    <div className="hor-root">
      {/* 1. Encabezado superior del módulo */}
      <section className="hor-card hor-header-card">
        <div className="hor-header-top">
          <div className="hor-header-info">
            <div className="hor-breadcrumb">
              <span className="hor-crumb-pill">Inicio</span>
              <span className="hor-crumb-sep">/</span>
              <span>Gestión Docente</span>
              <span className="hor-crumb-sep">/</span>
              <span className="hor-crumb-active">Mi Horario y Carga Semanal</span>
            </div>
            <h1 className="hor-title">Mi Horario y Carga Semanal</h1>
            <p className="hor-subtitle">
              Distribución de clases presenciales y gestión de disponibilidad horaria operativa.
            </p>
          </div>

          <div className="hor-header-badges">
            <div className="hor-status-pill">
              <span className="hor-status-dot" aria-hidden="true" />
              <span>CICLO 2026-II · SEMESTRE REGULAR</span>
            </div>
            <div className="hor-docente-pill">Docente Titular</div>
          </div>
        </div>

        {/* Selector horizontal de días */}
        <div className="hor-days-grid">
          {DIAS_SEMANA.map((d) => {
            const seleccionado = diaSeleccionado === d.nombre;
            return (
              <button
                type="button"
                key={d.nombre}
                onClick={() => {
                  setDiaSeleccionado(d.nombre);
                  setMensajeEstado('');
                }}
                className={`hor-day-btn ${seleccionado ? 'hor-day-active' : ''}`}
              >
                <div className="hor-day-top">
                  <span className="hor-day-name">{d.nombre}</span>
                  {d.esHoy && (
                    <span
                      className={`hor-day-today ${
                        seleccionado ? 'hor-today-active' : 'hor-today-idle'
                      }`}
                    >
                      HOY
                    </span>
                  )}
                </div>
                <div className="hor-day-bottom">
                  <span className="hor-day-date">{d.fecha}</span>
                  <span className="hor-day-count">{d.sesiones}</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {mensajeEstado && <div className="hor-notice">{mensajeEstado}</div>}

      {/* 2. Grilla principal: Itinerario (8 cols) + Carga y Disponibilidad (4 cols) */}
      <div className="hor-body-grid">
        <section className="hor-card hor-schedule-card">
          <div className="hor-schedule-head">
            <div className="hor-schedule-title-wrap">
              <CalendarIcon className="hor-icon-sm hor-text-sky" />
              <h3 className="hor-schedule-title">
                Itinerario Operativo: {diaActual.nombre} {diaActual.fecha}
              </h3>
            </div>
            <span className="hor-schedule-meta">{diaActual.sesiones}</span>
          </div>

          <div className="hor-blocks-list">
            {ITINERARIO_DIA.map((item) => {
              const enCurso = item.tipo === 'claseEnCurso';
              const accentClass =
                item.tipo === 'claseEnCurso'
                  ? 'hor-accent-sky'
                  : item.tipo === 'tutoria'
                  ? 'hor-accent-amber'
                  : item.tipo === 'reunion'
                  ? 'hor-accent-purple'
                  : 'hor-accent-emerald';

              return (
                <article
                  key={item.id}
                  className={`hor-block-card ${enCurso ? 'hor-block-live' : ''}`}
                >
                  <span className={`hor-block-bar ${accentClass}`} aria-hidden="true" />

                  <div className="hor-block-inner">
                    <div className="hor-time-col">
                      <p className="hor-time-range">{item.horario}</p>
                      <p className="hor-time-dur">{item.duracion}</p>
                    </div>

                    <div className="hor-info-col">
                      <div className="hor-tags-row">
                        <span className="hor-code-tag">{item.codigo || item.subtitulo}</span>
                        {item.sesion && (
                          <span className="hor-pill-sky">{item.sesion}</span>
                        )}
                        {item.modalidad && (
                          <span className="hor-pill-purple">{item.modalidad}</span>
                        )}
                        {item.citas && (
                          <span className="hor-pill-amber">{item.citas}</span>
                        )}
                      </div>

                      <h4 className="hor-block-title">{item.nombre || item.titulo}</h4>

                      <div className="hor-place-row">
                        <span className="hor-place-item">
                          <MapPin className="hor-icon-xs hor-ico-muted" />
                          <span>{item.aula || item.ubicacion}</span>
                        </span>
                        <span className="hor-dot-sep">•</span>
                        <span>{item.grupo || item.enlace || item.meet}</span>
                      </div>

                      {item.extra && <p className="hor-extra-note">{item.extra}</p>}

                      {item.tema && <div className="hor-topic-box">{item.tema}</div>}

                      {item.agenda && <p className="hor-agenda-text">{item.agenda}</p>}

                      {item.estudiantesCitados && (
                        <div className="hor-students-row">
                          <span className="hor-students-label">ESTUDIANTES CITADOS:</span>
                          {item.estudiantesCitados.map((est) => (
                            <span key={est} className="hor-student-chip">
                              ● {est}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="hor-actions-col">
                      {item.tipo === 'claseFinalizada' && (
                        <div className="hor-action-stack">
                          <span className="hor-badge-done">{item.estado}</span>
                          <button
                            type="button"
                            onClick={() =>
                              handleAccion(
                                `Registro de clase consultado para ${item.nombre}.`
                              )
                            }
                            className="hor-btn-ghost"
                          >
                            <FileText className="hor-icon-xs hor-ico-muted" />
                            <span>Ver Registro de Clase</span>
                          </button>
                        </div>
                      )}

                      {enCurso && (
                        <div className="hor-action-stack">
                          <span className="hor-badge-live">{item.estado}</span>
                          <div className="hor-btn-pair">
                            <button
                              type="button"
                              onClick={() => handleAccion('', 'cursos')}
                              className="hor-btn-ghost"
                            >
                              Ver Sílabo / Materiales
                            </button>
                            <button
                              type="button"
                              onClick={() => handleAccion('', 'asistencias')}
                              className="hor-btn-sky"
                            >
                              <CheckSquare className="hor-icon-xs" />
                              <span>Pasar Asistencia</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {item.tipo === 'tutoria' && (
                        <div className="hor-btn-pair">
                          <button
                            type="button"
                            onClick={() =>
                              handleAccion('Listado de citas de tutoría cargado.')
                            }
                            className="hor-btn-ghost"
                          >
                            Ver Citas de Alumnos
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleAccion('Sala virtual de asesoría habilitada.')
                            }
                            className="hor-btn-amber"
                          >
                            Abrir Sala Virtual
                          </button>
                        </div>
                      )}

                      {item.tipo === 'reunion' && (
                        <div className="hor-btn-pair">
                          <button
                            type="button"
                            onClick={() =>
                              handleAccion('Agenda de Consejo de Cátedra abierta.')
                            }
                            className="hor-btn-ghost"
                          >
                            Ver Agenda de Reunión
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleAccion('Enlace de sesión híbrida preparado.')
                            }
                            className="hor-btn-purple"
                          >
                            <span>Unirse a Sesión</span>
                            <ExternalLink className="hor-icon-xs" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Columna derecha: Carga lectiva semanal + Disponibilidad de tutoría */}
        <aside className="hor-side-col">
          <div className="hor-card hor-side-box">
            <div className="hor-side-head">
              <h3 className="hor-side-title hor-title-icon">
                <Layers className="hor-icon-sm hor-text-sky" />
                <span>Carga Lectiva Semanal</span>
              </h3>
              <span className="hor-badge-ok">CONFORME</span>
            </div>

            <div className="hor-load-summary">
              <p className="hor-load-val">
                24 <span className="hor-load-max">/ 32 hrs máx.</span>
              </p>
              <span className="hor-load-pct">75% ASIGNADO</span>
            </div>

            <div className="hor-load-bar">
              <span className="hor-load-seg-blue" />
              <span className="hor-load-seg-emerald" />
              <span className="hor-load-seg-amber" />
            </div>

            <div className="hor-load-breakdown">
              <div className="hor-breakdown-row">
                <span className="hor-breakdown-label">
                  <span className="hor-dot-blue" />
                  <span>Clases Teóricas (Lectivas)</span>
                </span>
                <strong>16 hrs</strong>
              </div>

              <div className="hor-breakdown-row">
                <span className="hor-breakdown-label">
                  <span className="hor-dot-emerald" />
                  <span>Laboratorios y Talleres</span>
                </span>
                <strong>6 hrs</strong>
              </div>

              <div className="hor-breakdown-row">
                <span className="hor-breakdown-label">
                  <span className="hor-dot-amber" />
                  <span>Asesoría y Tutoría</span>
                </span>
                <strong>2 hrs</strong>
              </div>
            </div>

            <div className="hor-regime-row">
              <span>RÉGIMEN CONTRACTUAL:</span>
              <strong>Tiempo Completo (TC)</strong>
            </div>
          </div>

          <div className="hor-card hor-side-box">
            <div className="hor-side-head">
              <h3 className="hor-side-title">Disponibilidad de Tutoría</h3>
              <button
                type="button"
                onClick={() => setDisponibilidadTutoria((prev) => !prev)}
                className={`hor-switch ${
                  disponibilidadTutoria ? 'hor-switch-on' : 'hor-switch-off'
                }`}
                aria-label="Alternar disponibilidad de tutoría"
              >
                <span className="hor-switch-thumb" />
              </button>
            </div>

            <div className="hor-tutor-copy">
              <span className="hor-badge-ok">
                {disponibilidadTutoria ? 'Canal de Reserva Abierto' : 'Canal en Pausa'}
              </span>
              <p>
                Los estudiantes de tus secciones asignadas pueden reservar espacios libres de 30
                minutos desde su portal institucional.
              </p>
            </div>

            <div className="hor-tutor-slot">
              <p className="hor-slot-heading">
                <Clock className="hor-icon-xs hor-text-sky" />
                <span>Horario Recurrente Fijado Activo</span>
              </p>
              <p className="hor-slot-days">Miércoles y Jueves: 15:00 a 17:00</p>
              <div className="hor-slot-foot">
                <span>Cupos disponibles hoy:</span>
                <strong>1 espacio restante</strong>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}