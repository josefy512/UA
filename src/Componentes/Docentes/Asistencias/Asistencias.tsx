import { useState, useEffect } from 'react';
import './Asistencias.css';
import {
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  FileCheck2,
  Zap,
  RotateCcw,
  Search,
  ShieldAlert,
  FileText,
  Download,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  BellRing
} from 'lucide-react';

type EstadoAsistencia = 'P' | 'T' | 'F' | 'J';

interface EstudianteAsistencia {
  num: string;
  nombre: string;
  condicion: string;
  avatar: string;
  codigo: string;
  asistCiclo: number;
  estado: EstadoAsistencia;
  observacion: string;
  alertaDPI?: boolean;
  dpiAlcanzado?: boolean;
}

interface FutAprobadoItem {
  id: string | number;
  nombres_apellidos?: string;
  codigo?: string;
  carrera?: string;
  sumilla?: string;
  fundamento?: string;
  fecha_solicitud?: string;
}

const FUTS_APROBADOS_RESPALDO: FutAprobadoItem[] = [
  {
    id: 'fut-101',
    nombres_apellidos: 'Elena Díaz Vargas',
    codigo: '2021-09431',
    carrera: 'Computación e Informática',
    sumilla: 'Justificación por cita médica institucional',
    fundamento: 'Certificado médico validado por bienestar estudiantil.',
    fecha_solicitud: '2026-10-10T09:00:00Z'
  }
];

export default function AsistenciasPanel() {
  const [activeFilter, setActiveFilter] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [futsAprobados, setFutsAprobados] = useState<FutAprobadoItem[]>([]);
  const [cargandoFuts, setCargandoFuts] = useState<boolean>(true);
  const [mensajeConsolidado, setMensajeConsolidado] = useState<string>('');

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const guardados = localStorage.getItem('ua_futs_aprobados');
        if (guardados) {
          const parsed = JSON.parse(guardados);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setFutsAprobados(parsed);
            setCargandoFuts(false);
            return;
          }
        }
      } catch {
        // Usar respaldo inicial
      }
      setFutsAprobados(FUTS_APROBADOS_RESPALDO);
      setCargandoFuts(false);
    }, 150);

    return () => window.clearTimeout(timer);
  }, []);

  const [estudiantes, setEstudiantes] = useState<EstudianteAsistencia[]>([
    {
      num: '01',
      nombre: 'Ana García Méndez',
      condicion: 'Regular',
      avatar: 'AG',
      codigo: '2022-10492',
      asistCiclo: 96,
      estado: 'P',
      observacion: 'Normal'
    },
    {
      num: '02',
      nombre: 'Carlos Ruiz Dávila',
      condicion: 'Regular',
      avatar: 'CR',
      codigo: '2023-11884',
      asistCiclo: 88,
      estado: 'T',
      observacion: 'Ingreso 10:12 AM'
    },
    {
      num: '03',
      nombre: 'Elena Díaz Vargas',
      condicion: 'Regular',
      avatar: 'ED',
      codigo: '2021-09431',
      asistCiclo: 90,
      estado: 'J',
      observacion: 'FUT #4105 Aprobado (Salud)'
    },
    {
      num: '04',
      nombre: 'Sofía Morales Benítez',
      condicion: 'Riesgo Inminente',
      avatar: 'SM',
      codigo: '2024-20150',
      asistCiclo: 72,
      estado: 'F',
      observacion: 'Alerta DPI (28% faltas)',
      alertaDPI: true
    },
    {
      num: '05',
      nombre: 'Lucas Romero Quispe',
      condicion: 'Delegado de Aula',
      avatar: 'LR',
      codigo: '2022-10512',
      asistCiclo: 94,
      estado: 'P',
      observacion: 'Delegado Titular'
    },
    {
      num: '06',
      nombre: 'Mateo Fernández Solís',
      condicion: 'Inhabilitado',
      avatar: 'MF',
      codigo: '2020-05882',
      asistCiclo: 69,
      estado: 'F',
      observacion: 'DPI Alcanzado (31% Desaprobado)',
      dpiAlcanzado: true
    },
    {
      num: '07',
      nombre: 'Javier Mendoza Paz',
      condicion: 'En Seguimiento',
      avatar: 'JM',
      codigo: '2023-14205',
      asistCiclo: 75,
      estado: 'T',
      observacion: 'Riesgo preventivo 3 faltas'
    },
    {
      num: '08',
      nombre: 'Valeria Castro Silva',
      condicion: 'Destacado',
      avatar: 'VC',
      codigo: '2022-16789',
      asistCiclo: 98,
      estado: 'P',
      observacion: 'Asistencia perfecta'
    }
  ]);

  const handleCambiarEstado = (codigo: string, nuevoEstado: EstadoAsistencia) => {
    setEstudiantes((prev) =>
      prev.map((est) => (est.codigo === codigo ? { ...est, estado: nuevoEstado } : est))
    );
    setMensajeConsolidado('');
  };

  const handleMarcarTodosPresentes = () => {
    setEstudiantes((prev) => prev.map((est) => ({ ...est, estado: 'P' })));
    setMensajeConsolidado('');
  };

  const handleReiniciarLista = () => {
    setEstudiantes((prev) => prev.map((est) => ({ ...est, estado: 'F' })));
    setMensajeConsolidado('');
  };

  const handleConsolidar = () => {
    try {
      localStorage.setItem('ua_asistencia_sesion_12', JSON.stringify(estudiantes));
    } catch {
      // Ignorar errores de cuota local
    }
    setMensajeConsolidado('Asistencia consolidada y guardada en la sesión actual.');
  };

  const estudiantesFiltrados = estudiantes.filter((est) => {
    const q = searchQuery.trim().toLowerCase();
    const coincideBusqueda =
      !q ||
      est.nombre.toLowerCase().includes(q) ||
      est.codigo.toLowerCase().includes(q) ||
      est.condicion.toLowerCase().includes(q);

    if (!coincideBusqueda) return false;

    if (activeFilter === 'Presentes') return est.estado === 'P';
    if (activeFilter === 'Tardanzas') return est.estado === 'T';
    if (activeFilter === 'Faltas') return est.estado === 'F';
    if (activeFilter === 'Justificados') return est.estado === 'J';
    return true;
  });

  const totalMatriculados = 40;
  const totalPresentes = estudiantes.filter((e) => e.estado === 'P').length;
  const totalTardanzas = estudiantes.filter((e) => e.estado === 'T').length;
  const totalFaltas = estudiantes.filter((e) => e.estado === 'F').length;
  const totalJustificados = estudiantes.filter((e) => e.estado === 'J').length;
  const porcentajePresentes = Math.round((totalPresentes / totalMatriculados) * 100);
  const porcentajeGeneral = Math.round(
    ((totalPresentes + totalJustificados + 26) / totalMatriculados) * 100
  );

  return (
    <div className="asis-root">
      {/* 1. Cabecera del Curso y Sesión Activa */}
      <section className="asis-card asis-header-card">
        <div className="asis-header-top">
          <div className="asis-header-info">
            <p className="asis-program-kicker">
              DISEÑO Y DESARROLLO DE SOFTWARE · Grupo 4B · Aula 102 · Turno Mañana
            </p>
            <div className="asis-course-row">
              <h1 className="asis-course-title">Historia del Arte Moderno</h1>
              <span className="asis-course-code">HAR-302</span>
            </div>
            <div className="asis-meta-row">
              <span className="asis-live-tag">
                <span className="asis-live-dot" aria-hidden="true" />
                <span>SESIÓN EN CURSO · 10:00 - 11:30 AM</span>
              </span>
              <span className="asis-meta-sep">•</span>
              <span className="asis-session-detail">
                <Clock className="asis-icon-xs" />
                <span>Sesión N° 12 de 32 · Viernes, 10 de Octubre de 2026</span>
              </span>
            </div>
          </div>

          <div className="asis-header-actions">
            <div className="asis-autosave-box">
              <span className="asis-autosave-status">
                <CheckCircle2 className="asis-icon-xs" />
                <span>Autoguardado Activo</span>
              </span>
              <span className="asis-autosave-sub">Sincronizado hace 1 min</span>
            </div>

            <button
              type="button"
              onClick={handleConsolidar}
              className="asis-btn-primary"
            >
              <CheckCircle2 className="asis-icon-sm" />
              <span>Guardar y Consolidar Asistencia</span>
            </button>
          </div>
        </div>

        {mensajeConsolidado && (
          <div className="asis-notice-banner">{mensajeConsolidado}</div>
        )}

        {/* Métricas rápidas */}
        <div className="asis-metrics-grid">
          <div className="asis-metric-box asis-metric-neutral">
            <div className="asis-metric-head">
              <span>MATRICULADOS</span>
              <Users className="asis-icon-sm asis-ico-muted" />
            </div>
            <p className="asis-metric-val">{totalMatriculados}</p>
            <p className="asis-metric-note">100% matrícula activa</p>
          </div>

          <div className="asis-metric-box asis-metric-emerald">
            <div className="asis-metric-head asis-text-emerald">
              <span>PRESENTES [P]</span>
              <CheckCircle2 className="asis-icon-sm" />
            </div>
            <p className="asis-metric-val">{totalPresentes}</p>
            <p className="asis-metric-note asis-text-emerald">
              {porcentajePresentes}% de asistencia
            </p>
          </div>

          <div className="asis-metric-box asis-metric-amber">
            <div className="asis-metric-head asis-text-amber">
              <span>TARDANZAS [T]</span>
              <Clock className="asis-icon-sm" />
            </div>
            <p className="asis-metric-val">{totalTardanzas}</p>
            <p className="asis-metric-note">Tolerancia 15 min</p>
          </div>

          <div className="asis-metric-box asis-metric-rose">
            <div className="asis-metric-head asis-text-rose">
              <span>FALTAS [F]</span>
              <XCircle className="asis-icon-sm" />
            </div>
            <p className="asis-metric-val">{totalFaltas}</p>
            <p className="asis-metric-note">Sin justificación</p>
          </div>

          <div className="asis-metric-box asis-metric-sky asis-metric-span-sm">
            <div className="asis-metric-head asis-text-sky">
              <span>JUSTIFICADOS [J]</span>
              <FileCheck2 className="asis-icon-sm" />
            </div>
            <p className="asis-metric-val">{totalJustificados}</p>
            <p className="asis-metric-note asis-text-sky">Con trámite FUT</p>
          </div>
        </div>
      </section>

      {/* 2. Matriz Principal + Panel Lateral */}
      <div className="asis-body-grid">
        {/* Columna izquierda: Lista y marcaje */}
        <section className="asis-card asis-list-card">
          <div className="asis-toolbar">
            <div className="asis-bulk-actions">
              <button
                type="button"
                onClick={handleMarcarTodosPresentes}
                className="asis-btn-emerald"
              >
                <Zap className="asis-icon-xs" />
                <span>Marcar Todos como Presentes</span>
              </button>

              <button
                type="button"
                onClick={handleReiniciarLista}
                className="asis-btn-icon"
                title="Reiniciar lista"
                aria-label="Reiniciar lista"
              >
                <RotateCcw className="asis-icon-sm" />
              </button>
            </div>

            <div className="asis-filter-controls">
              <div className="asis-search-box">
                <Search className="asis-search-icon" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por nombre, código..."
                  className="asis-search-input"
                />
              </div>

              <div className="asis-filter-pills">
                {['Todos', 'Presentes', 'Tardanzas', 'Faltas', 'Justificados'].map((filtro) => (
                  <button
                    type="button"
                    key={filtro}
                    onClick={() => setActiveFilter(filtro)}
                    className={`asis-pill-btn ${
                      activeFilter === filtro ? 'asis-pill-active' : ''
                    }`}
                  >
                    {filtro}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="asis-table-scroll">
            <table className="asis-table">
              <thead>
                <tr>
                  <th className="asis-th-center">N°</th>
                  <th>Estudiante</th>
                  <th className="asis-th-center">Cód. Univ.</th>
                  <th className="asis-th-center">Asist. Ciclo</th>
                  <th className="asis-th-center">Marcaje de Asistencia</th>
                  <th>Observación / Alerta</th>
                </tr>
              </thead>
              <tbody>
                {estudiantesFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="asis-td-empty">
                      No se encontraron estudiantes con el filtro seleccionado.
                    </td>
                  </tr>
                ) : (
                  estudiantesFiltrados.map((est) => {
                    const cicloClass =
                      est.asistCiclo >= 90
                        ? 'asis-ciclo-emerald'
                        : est.asistCiclo >= 75
                        ? 'asis-ciclo-amber'
                        : 'asis-ciclo-rose';

                    return (
                      <tr key={est.codigo}>
                        <td className="asis-td-center asis-mono asis-text-muted">
                          {est.num}
                        </td>

                        <td>
                          <div className="asis-student-cell">
                            <div
                              className={`asis-avatar ${
                                est.dpiAlcanzado ? 'asis-avatar-dpi' : ''
                              }`}
                            >
                              {est.avatar}
                            </div>
                            <div className="asis-student-text">
                              <p className="asis-student-name">{est.nombre}</p>
                              <p className="asis-student-cond">{est.condicion}</p>
                            </div>
                          </div>
                        </td>

                        <td className="asis-td-center asis-mono asis-text-muted">
                          {est.codigo}
                        </td>

                        <td className="asis-td-center asis-mono">
                          <span className={`asis-ciclo-badge ${cicloClass}`}>
                            {est.asistCiclo}%
                          </span>
                        </td>

                        <td>
                          <div className="asis-mark-group">
                            {(
                              [
                                { code: 'P', activeClass: 'asis-mark-p-active' },
                                { code: 'T', activeClass: 'asis-mark-t-active' },
                                { code: 'F', activeClass: 'asis-mark-f-active' },
                                { code: 'J', activeClass: 'asis-mark-j-active' }
                              ] as const
                            ).map((btn) => (
                              <button
                                type="button"
                                key={btn.code}
                                onClick={() => handleCambiarEstado(est.codigo, btn.code)}
                                className={`asis-mark-btn ${
                                  est.estado === btn.code ? btn.activeClass : ''
                                }`}
                              >
                                {btn.code}
                              </button>
                            ))}
                          </div>
                        </td>

                        <td>
                          {est.dpiAlcanzado ? (
                            <span className="asis-alert-dpi">
                              <ShieldAlert className="asis-icon-xs" />
                              <span>DPI Alcanzado (31% Desaprobado)</span>
                            </span>
                          ) : est.alertaDPI ? (
                            <span className="asis-alert-warn">
                              <ShieldAlert className="asis-icon-xs" />
                              <span>Alerta (28% faltas)</span>
                            </span>
                          ) : (
                            <span className="asis-obs-text" title={est.observacion}>
                              {est.observacion}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="asis-table-footer">
            <span>
              Mostrando {estudiantesFiltrados.length} de {totalMatriculados} estudiantes
              matriculados
            </span>
            <div className="asis-pager">
              <span className="asis-pager-info">Filas por página: 8</span>
              <div className="asis-pager-controls">
                <button
                  type="button"
                  className="asis-pager-btn"
                  aria-label="Página anterior"
                >
                  <ChevronLeft className="asis-icon-xs" />
                </button>
                <span className="asis-pager-page">1 / 5</span>
                <button
                  type="button"
                  className="asis-pager-btn"
                  aria-label="Página siguiente"
                >
                  <ChevronRight className="asis-icon-xs" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Columna derecha: Monitor DPI + FUTs + Reportes */}
        <aside className="asis-side-col">
          {/* Monitor DPI */}
          <div className="asis-card asis-side-box">
            <div className="asis-side-head">
              <div className="asis-side-title-row">
                <ShieldAlert className="asis-icon-sm asis-text-rose" />
                <h3 className="asis-side-title">Monitor DPI</h3>
              </div>
              <span className="asis-badge-rose-soft">3 Casos</span>
            </div>

            <div className="asis-dpi-rule">
              <p>
                Límite máximo permitido:{' '}
                <strong>30% de inasistencias injustificadas</strong> (máx. 6 de 20 sesiones en
                el ciclo).
              </p>
            </div>

            <div className="asis-dpi-list">
              <div className="asis-dpi-card asis-dpi-card-danger">
                <div className="asis-dpi-card-top">
                  <span className="asis-dpi-name">Mateo Fernández S.</span>
                  <span className="asis-dpi-tag-danger">DPI APLICADO</span>
                </div>
                <p className="asis-dpi-sub-danger">
                  5 inasistencias acumuladas · 31% (Excedido)
                </p>
                <button
                  type="button"
                  onClick={() =>
                    window.alert('Expediente de Mateo Fernández Solís: DPI aplicado por exceso de faltas.')
                  }
                  className="asis-dpi-btn"
                >
                  <span>Ver Expediente</span>
                  <ExternalLink className="asis-icon-xs" />
                </button>
              </div>

              <div className="asis-dpi-card asis-dpi-card-warn">
                <div className="asis-dpi-card-top">
                  <span className="asis-dpi-name">Sofía Morales Benítez</span>
                  <span className="asis-dpi-tag-warn">Riesgo Crítico</span>
                </div>
                <p className="asis-dpi-sub-warn">
                  4 inasistencias acumuladas · 28% (Límite 30%)
                </p>
                <div className="asis-dpi-foot">
                  <span className="asis-dpi-risk-note">A 1 falta de baja</span>
                  <button
                    type="button"
                    onClick={() =>
                      window.alert('Notificación preventiva enviada a Sofía Morales Benítez.')
                    }
                    className="asis-notify-btn"
                  >
                    <BellRing className="asis-icon-xs" />
                    <span>Notificar Alumno</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Solicitudes FUT */}
          <div className="asis-card asis-side-box">
            <div className="asis-side-head">
              <div className="asis-side-title-row">
                <FileText className="asis-icon-sm asis-text-sky" />
                <h3 className="asis-side-title">Solicitudes FUT</h3>
              </div>
              <span className="asis-badge-sky-soft">{futsAprobados.length} Casos</span>
            </div>

            <div className="asis-fut-list">
              {cargandoFuts ? (
                <p className="asis-fut-empty">Cargando trámites aprobados...</p>
              ) : futsAprobados.length === 0 ? (
                <p className="asis-fut-empty">
                  No hay trámites FUT aprobados por el momento.
                </p>
              ) : (
                futsAprobados.map((fut) => (
                  <div key={fut.id} className="asis-fut-item">
                    <div className="asis-fut-item-top">
                      <span className="asis-fut-student">
                        {fut.nombres_apellidos || 'Estudiante'}
                      </span>
                      <span className="asis-fut-valid">Validado / Aprobado</span>
                    </div>
                    <p className="asis-fut-sumilla">
                      <strong className="asis-text-sky">{fut.codigo || 'FUT-2026'}</strong> •{' '}
                      {fut.sumilla || 'Solicitud registrada'}
                    </p>
                    <div className="asis-fut-item-foot">
                      <span>{fut.carrera || 'Programa Técnico'}</span>
                      <button
                        type="button"
                        onClick={() =>
                          window.alert(
                            `Fundamento del alumno: ${fut.fundamento || 'Sin detalle adicional.'}`
                          )
                        }
                        className="asis-detail-link"
                      >
                        Ver Detalle
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Reportes y Salida */}
          <div className="asis-card asis-side-box">
            <div className="asis-side-head">
              <h3 className="asis-side-title">Reportes y Salida</h3>
            </div>

            <div className="asis-summary-box">
              <div className="asis-ring">{porcentajeGeneral}%</div>
              <div>
                <p className="asis-summary-title">Asistencia General</p>
                <p className="asis-summary-sub">
                  34 de 40 alumnos en aula o justificados
                </p>
              </div>
            </div>

            <div className="asis-export-stack">
              <button
                type="button"
                onClick={() =>
                  window.alert('Exportación de registro (.xlsx) preparada para descarga.')
                }
                className="asis-export-btn"
              >
                <Download className="asis-icon-sm asis-text-emerald" />
                <span>Exportar Registro (.xlsx)</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  window.alert('Acta oficial (PDF) preparada para descarga.')
                }
                className="asis-export-btn"
              >
                <Download className="asis-icon-sm asis-text-rose" />
                <span>Descargar Acta Oficial (PDF)</span>
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}