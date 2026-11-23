import { useState, useMemo } from 'react';
import './Calificaciones.css';
import {
  Search,
  ShieldCheck,
  Download,
  Send,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  Info,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface EstudianteNota {
  id: string;
  nombre: string;
  iniciales: string;
  ec1: string;
  ep: string;
  ec2: string;
  tf: string;
  estado: 'aprobado' | 'riesgo' | 'desaprobado';
  fut?: boolean;
  alerta?: boolean;
}

const ESTUDIANTES: EstudianteNota[] = [
  {
    id: '2022-10492',
    nombre: 'Ana García Méndez',
    iniciales: 'AG',
    ec1: '16.5',
    ep: '15.0',
    ec2: '17.0',
    tf: '18.0',
    estado: 'aprobado'
  },
  {
    id: '2021-08731',
    nombre: 'Carlos Ruiz Dávila',
    iniciales: 'CR',
    ec1: '14.0',
    ep: '11.0',
    ec2: '13.5',
    tf: '12.0',
    estado: 'aprobado',
    fut: true
  },
  {
    id: '2023-14205',
    nombre: 'Elena Díaz Vargas',
    iniciales: 'ED',
    ec1: '08.5',
    ep: '09.0',
    ec2: '10.0',
    tf: '--',
    estado: 'desaprobado',
    alerta: true
  },
  {
    id: '2022-11840',
    nombre: 'Sofía Morales Benítez',
    iniciales: 'SM',
    ec1: '15.0',
    ep: '14.0',
    ec2: '16.0',
    tf: '15.0',
    estado: 'aprobado'
  },
  {
    id: '2021-09452',
    nombre: 'Lucas Romero Quispe',
    iniciales: 'LR',
    ec1: '11.0',
    ep: '10.5',
    ec2: '12.0',
    tf: '11.0',
    estado: 'riesgo'
  }
];

export default function CalificacionesPanel() {
  const [activeTab, setActiveTab] = useState<'Todos' | 'Aprobados' | 'Riesgo' | 'Desaprobados'>(
    'Todos'
  );
  const [searchCode, setSearchCode] = useState<string>('');
  const [portalEstudianteVisible, setPortalEstudianteVisible] = useState<boolean>(true);
  const [paginaActual, setPaginaActual] = useState<number>(1);
  const [actaCerrada, setActaCerrada] = useState<boolean>(false);
  const [avisoAccion, setAvisoAccion] = useState<string>('');

  const estudiantesFiltrados = useMemo(() => {
    const q = searchCode.trim().toLowerCase();
    return ESTUDIANTES.filter((est) => {
      const cumpleEstado =
        activeTab === 'Todos' ||
        (activeTab === 'Aprobados' && est.estado === 'aprobado') ||
        (activeTab === 'Riesgo' && est.estado === 'riesgo') ||
        (activeTab === 'Desaprobados' && est.estado === 'desaprobado');

      const cumpleBusqueda =
        !q || est.id.toLowerCase().includes(q) || est.nombre.toLowerCase().includes(q);

      return cumpleEstado && cumpleBusqueda;
    });
  }, [activeTab, searchCode]);

  const handleToggleActa = () => {
    setActaCerrada((prev) => {
      const siguiente = !prev;
      setAvisoAccion(
        siguiente
          ? 'Cierre de acta registrado en el borrador de la sección.'
          : 'Acta reabierta para edición de calificaciones.'
      );
      return siguiente;
    });
  };

  return (
    <div className="cal-root">
      {/* Encabezado del módulo y cierre de acta */}
      <section className="cal-card cal-header-card">
        <div className="cal-header-top">
          <div className="cal-header-info">
            <div className="cal-title-row">
              <h2 className="cal-title">Calificaciones y Registro de Actas</h2>
              <span className="cal-period-badge">Periodo 2026-II</span>
            </div>
            <p className="cal-subtitle">
              Registro de evaluaciones continuas, exámenes y consolidado de notas por sección.
            </p>
          </div>

          <button
            type="button"
            onClick={handleToggleActa}
            className="cal-btn-primary"
          >
            <ShieldCheck className="cal-icon-sm" />
            <span>{actaCerrada ? 'Acta registrada' : 'Registrar cierre de acta'}</span>
          </button>
        </div>

        {avisoAccion && <div className="cal-notice">{avisoAccion}</div>}

        <div className="cal-meta-grid">
          <div className="cal-meta-box">
            <p className="cal-meta-kicker">Asignatura</p>
            <p className="cal-meta-value">
              Historia del Arte Moderno <span className="cal-mono-sky">(HAR-302)</span>
            </p>
            <p className="cal-meta-sub">Programa Académico · Grupo 4B</p>
          </div>

          <div className="cal-meta-box">
            <p className="cal-meta-kicker">Periodo lectivo</p>
            <p className="cal-meta-value">Ciclo 2026-II</p>
            <p className="cal-meta-sub cal-text-emerald">Registro habilitado</p>
          </div>

          <div className="cal-meta-box">
            <p className="cal-meta-kicker">Sección y matrícula</p>
            <p className="cal-meta-value">Sección B · 38 estudiantes</p>
            <p className="cal-meta-sub">Sede Institucional</p>
          </div>
        </div>
      </section>

      {/* Estructura ponderada de la asignatura */}
      <section className="cal-card cal-rubric-card">
        <div className="cal-rubric-head">
          <div>
            <h3 className="cal-section-title">Estructura de Evaluación</h3>
            <p className="cal-section-sub">
              Ponderaciones vigentes establecidas en el sílabo de la asignatura.
            </p>
          </div>
          <span className="cal-min-grade">Nota aprobatoria mínima: 10.5 / 20.0</span>
        </div>

        <div className="cal-rubric-grid">
          <div className="cal-rubric-item">
            <div className="cal-rubric-top">
              <span className="cal-rubric-label">Rubro 1</span>
              <span className="cal-rubric-weight">20%</span>
            </div>
            <h4 className="cal-rubric-name">Evaluación Continua 1</h4>
            <div className="cal-rubric-status cal-text-emerald">
              <CheckCircle2 className="cal-icon-xs" />
              <span>Calificado · 100%</span>
            </div>
          </div>

          <div className="cal-rubric-item">
            <div className="cal-rubric-top">
              <span className="cal-rubric-label">Rubro 2</span>
              <span className="cal-rubric-weight">30%</span>
            </div>
            <h4 className="cal-rubric-name">Examen Parcial</h4>
            <div className="cal-rubric-status cal-text-emerald">
              <CheckCircle2 className="cal-icon-xs" />
              <span>Calificado · 100%</span>
            </div>
          </div>

          <div className="cal-rubric-item cal-rubric-active">
            <div className="cal-rubric-top">
              <span className="cal-rubric-label-sky">Rubro 3</span>
              <span className="cal-rubric-weight-sky">20%</span>
            </div>
            <h4 className="cal-rubric-name">Evaluación Continua 2</h4>
            <div className="cal-rubric-status cal-text-amber">
              <Clock className="cal-icon-xs" />
              <span>En revisión · 75%</span>
            </div>
          </div>

          <div className="cal-rubric-item">
            <div className="cal-rubric-top">
              <span className="cal-rubric-label">Rubro 4</span>
              <span className="cal-rubric-weight-muted">30%</span>
            </div>
            <h4 className="cal-rubric-name cal-text-soft">Trabajo Final</h4>
            <div className="cal-rubric-status cal-text-muted">
              Programado · Cierre de ciclo
            </div>
          </div>
        </div>
      </section>

      {/* Matriz de calificaciones + Panel lateral */}
      <div className="cal-body-grid">
        <section className="cal-card cal-matrix-card">
          <div className="cal-matrix-toolbar">
            <div className="cal-tabs-bar">
              {(
                [
                  { id: 'Todos', label: 'Todos', count: 38 },
                  { id: 'Aprobados', label: 'Aprobados', count: 29 },
                  { id: 'Riesgo', label: 'En seguimiento', count: 6 },
                  { id: 'Desaprobados', label: 'Desaprobados', count: 3 }
                ] as const
              ).map((tab) => {
                const activo = activeTab === tab.id;
                return (
                  <button
                    type="button"
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`cal-tab-btn ${activo ? 'cal-tab-active' : ''}`}
                  >
                    <span>{tab.label}</span>
                    <span className="cal-tab-count">{tab.count}</span>
                  </button>
                );
              })}
            </div>

            <div className="cal-search-wrap">
              <Search className="cal-search-icon" />
              <input
                type="text"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                placeholder="Buscar código o alumno..."
                className="cal-search-input"
              />
            </div>
          </div>

          <div className="cal-table-scroll">
            <table className="cal-table">
              <thead>
                <tr>
                  <th>Estudiante</th>
                  <th className="cal-th-center">EC1 (20%)</th>
                  <th className="cal-th-center">EP (30%)</th>
                  <th className="cal-th-center cal-th-ec2">EC2 (20%)</th>
                  <th className="cal-th-center">TF (30%)</th>
                </tr>
              </thead>
              <tbody>
                {estudiantesFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="cal-td-empty">
                      No hay estudiantes que coincidan con el filtro seleccionado.
                    </td>
                  </tr>
                ) : (
                  estudiantesFiltrados.map((est) => {
                    const ec2Num = parseFloat(est.ec2);
                    const ec2Baja = !Number.isNaN(ec2Num) && ec2Num < 10.5;

                    return (
                      <tr key={est.id}>
                        <td>
                          <div className="cal-student-cell">
                            <div className="cal-avatar">{est.iniciales}</div>
                            <div className="cal-student-meta">
                              <p className="cal-student-name">
                                <span className="cal-truncate">{est.nombre}</span>
                                {est.fut && <span className="cal-fut-pill">FUT</span>}
                                {est.alerta && (
                                  <AlertTriangle className="cal-icon-xs cal-text-rose" />
                                )}
                              </p>
                              <p className="cal-student-code">{est.id}</p>
                            </div>
                          </div>
                        </td>

                        <td className="cal-td-center cal-mono-grade">{est.ec1}</td>
                        <td className="cal-td-center cal-mono-grade">{est.ep}</td>

                        <td className="cal-td-center cal-td-ec2">
                          <span
                            className={`cal-ec2-pill ${
                              ec2Baja ? 'cal-ec2-low' : 'cal-ec2-ok'
                            }`}
                          >
                            {est.ec2}
                          </span>
                        </td>

                        <td className="cal-td-center cal-mono-muted">{est.tf}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="cal-pagination">
            <span className="cal-pagination-info">Mostrando registros del periodo vigente</span>

            <div className="cal-pagination-btns">
              <button
                type="button"
                onClick={() => setPaginaActual((p) => Math.max(1, p - 1))}
                className="cal-page-arrow"
                aria-label="Página anterior"
              >
                <ChevronLeft className="cal-icon-xs" />
              </button>
              {[1, 2, 3].map((num) => (
                <button
                  type="button"
                  key={num}
                  onClick={() => setPaginaActual(num)}
                  className={`cal-page-num ${paginaActual === num ? 'cal-page-active' : ''}`}
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setPaginaActual((p) => p + 1)}
                className="cal-page-arrow"
                aria-label="Página siguiente"
              >
                <ChevronRight className="cal-icon-xs" />
              </button>
            </div>
          </div>

          <div className="cal-policy-note">
            <Info className="cal-icon-sm cal-text-sky" />
            <p>
              Las calificaciones se registran en escala vigesimal de 0 a 20 conforme al
              reglamento académico institucional.
            </p>
          </div>
        </section>

        <aside className="cal-side-col">
          <div className="cal-card cal-side-box">
            <div className="cal-side-head">
              <h3 className="cal-side-title">Acciones del Acta</h3>
              <span className="cal-side-badge">
                {actaCerrada ? 'Cerrada' : 'En borrador'}
              </span>
            </div>

            <div className="cal-schedule-box">
              <Clock className="cal-icon-sm cal-text-sky" />
              <div>
                <p className="cal-schedule-title">Cierre de actas ordinarias</p>
                <p className="cal-schedule-sub">Según cronograma académico</p>
              </div>
            </div>

            <div className="cal-action-stack">
              <button
                type="button"
                onClick={() =>
                  setAvisoAccion('Reporte de notas preparado para exportación.')
                }
                className="cal-btn-secondary"
              >
                <Download className="cal-icon-sm cal-text-sky" />
                <span>Exportar reporte de notas</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  setAvisoAccion('Calificaciones marcadas para publicación en el portal.')
                }
                className="cal-btn-navy"
              >
                <Send className="cal-icon-sm cal-text-sky" />
                <span>Publicar calificaciones</span>
              </button>
            </div>

            <div className="cal-toggle-row">
              <div>
                <p className="cal-toggle-title">Visibilidad para alumnos</p>
                <p className="cal-toggle-sub">Mostrar notas de evaluación continua</p>
              </div>
              <button
                type="button"
                onClick={() => setPortalEstudianteVisible((prev) => !prev)}
                className={`cal-switch ${
                  portalEstudianteVisible ? 'cal-switch-on' : 'cal-switch-off'
                }`}
                aria-label="Alternar visibilidad para alumnos"
              >
                <span className="cal-switch-thumb" />
              </button>
            </div>
          </div>

          <div className="cal-card cal-side-box">
            <div className="cal-side-head">
              <h3 className="cal-side-title">Resumen de Sección</h3>
              <span className="cal-mono-sky-sm">HAR-302</span>
            </div>

            <div className="cal-avg-row">
              <div>
                <p className="cal-meta-kicker">Promedio de sección</p>
                <p className="cal-avg-val">
                  14.2 <span className="cal-avg-denom">/ 20.0</span>
                </p>
              </div>
              <span className="cal-side-badge">38 matriculados</span>
            </div>

            <div className="cal-summary-list">
              <div className="cal-summary-item">
                <span>Aprobados</span>
                <strong>29 estudiantes</strong>
              </div>
              <div className="cal-summary-item">
                <span>En seguimiento</span>
                <strong>6 estudiantes</strong>
              </div>
              <div className="cal-summary-item">
                <span>Desaprobados</span>
                <strong>3 estudiantes</strong>
              </div>
            </div>
          </div>

          <div className="cal-card cal-side-box">
            <div className="cal-side-head">
              <h3 className="cal-side-title cal-title-icon">
                <FileText className="cal-icon-sm cal-text-sky" />
                <span>Solicitudes de Revisión</span>
              </h3>
              <span className="cal-side-badge">2 pendientes</span>
            </div>

            <div className="cal-review-list">
              <div className="cal-review-item">
                <div className="cal-review-info">
                  <p className="cal-review-name">Carlos Ruiz</p>
                  <p className="cal-review-topic">Revisión de evaluación</p>
                </div>
                <button
                  type="button"
                  onClick={() => setAvisoAccion('Revisión abierta para Carlos Ruiz.')}
                  className="cal-btn-review"
                >
                  Revisar
                </button>
              </div>

              <div className="cal-review-item">
                <div className="cal-review-info">
                  <p className="cal-review-name">Elena Díaz</p>
                  <p className="cal-review-topic">Revisión de rúbrica</p>
                </div>
                <button
                  type="button"
                  onClick={() => setAvisoAccion('Revisión abierta para Elena Díaz.')}
                  className="cal-btn-review"
                >
                  Revisar
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}