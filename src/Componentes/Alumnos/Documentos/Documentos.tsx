import { useState, useEffect, useMemo, type ReactNode } from 'react';
import './Documentos.css';
import Fut from './FUT/Fut';
import {
  Search,
  Upload,
  Plus,
  FileText,
  Download,
  Eye,
  Award,
  ShieldCheck,
  ChevronRight,
  FileSpreadsheet,
  BookOpen,
  Calendar,
  X,
  ExternalLink,
  Loader2
} from 'lucide-react';

interface SilaboItem {
  id: string;
  curso: string;
  codigo: string;
  docente: string;
  creditos: string;
  tamano: string;
  actualizado: string;
  silaboUrl: string | null;
}

const SILABOS_INICIALES: SilaboItem[] = [
  {
    id: 'sil-1',
    curso: 'Proyecto de Investigación e Innovación Tecnológica',
    codigo: 'INV-401',
    docente: 'Prof. Adolfo Ventocilla Flores',
    creditos: '4 Créditos',
    tamano: 'PDF Oficial',
    actualizado: 'Ciclo 2026-II',
    silaboUrl: null
  },
  {
    id: 'sil-2',
    curso: 'Seminario de Tesis',
    codigo: 'SEM-502',
    docente: 'Docente de Seminario',
    creditos: '3 Créditos',
    tamano: 'PDF Oficial',
    actualizado: 'Ciclo 2026-II',
    silaboUrl: null
  }
];

function RenderFutSeguro() {
  try {
    return <Fut />;
  } catch {
    return (
      <div className="doc-fut-fallback">
        <h4 className="doc-fut-fallback-title">FUT — Formulario Único de Trámite</h4>
        <p className="doc-fut-fallback-desc">
          El componente de formulario FUT está disponible en <code>Documentos/FUT/Fut.tsx</code>.
        </p>
      </div>
    );
  }
}

function ModalFut({
  children,
  onClose
}: {
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="doc-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="doc-modal-scroller"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className="doc-modal-box">
          <button
            type="button"
            onClick={onClose}
            className="doc-modal-close"
            title="Cerrar formulario"
            aria-label="Cerrar formulario"
          >
            <X className="doc-icon-md" />
          </button>
          <div className="doc-modal-content">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default function DocumentosView() {
  const [activeCategory, setActiveCategory] = useState<
    'Todos' | 'Academicos' | 'Tramites' | 'Reglamentos'
  >('Todos');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showFutModal, setShowFutModal] = useState<boolean>(false);

  const [silabosDinamicos, setSilabosDinamicos] = useState<SilaboItem[]>([]);
  const [loadingSilabos, setLoadingSilabos] = useState<boolean>(true);

  const abrirFut = () => {
    window.history.pushState({ futModal: true }, '');
    setShowFutModal(true);
  };

  const cerrarFut = () => {
    if (window.history.state && window.history.state.futModal) {
      window.history.back();
    } else {
      setShowFutModal(false);
    }
  };

  useEffect(() => {
    if (!showFutModal) return;

    const onPopState = () => setShowFutModal(false);
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') cerrarFut();
    };

    window.addEventListener('popstate', onPopState);
    window.addEventListener('keydown', onKeyDown);
    const overflowPrevio = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('popstate', onPopState);
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = overflowPrevio;
    };
  }, [showFutModal]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSilabosDinamicos(SILABOS_INICIALES);
      setLoadingSilabos(false);
    }, 150);

    return () => window.clearTimeout(timer);
  }, []);

  const silabosFiltrados = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return silabosDinamicos;
    return silabosDinamicos.filter(
      (s) =>
        s.curso.toLowerCase().includes(q) ||
        s.codigo.toLowerCase().includes(q) ||
        s.docente.toLowerCase().includes(q)
    );
  }, [silabosDinamicos, searchTerm]);

  const categorias: Array<{
    id: 'Todos' | 'Academicos' | 'Tramites' | 'Reglamentos';
    label: string;
  }> = [
    { id: 'Todos', label: 'Todos' },
    { id: 'Academicos', label: 'Académicos' },
    { id: 'Tramites', label: 'Trámites' },
    { id: 'Reglamentos', label: 'Reglamentos' }
  ];

  const mostrarAcademicos = activeCategory === 'Todos' || activeCategory === 'Academicos';
  const mostrarTramites = activeCategory === 'Todos' || activeCategory === 'Tramites';
  const mostrarReglamentos = activeCategory === 'Todos' || activeCategory === 'Reglamentos';

  return (
    <div className="doc-root">
      {/* Encabezado del módulo y acciones */}
      <div className="doc-card doc-header-banner">
        <div className="doc-truncate-wrap">
          <div className="doc-title-row">
            <h2 className="doc-title">Documentos y Constancias</h2>
            <span className="doc-period-badge">Periodo 2026-II</span>
          </div>
          <p className="doc-subtitle">
            Consulta fichas de matrícula, sílabos oficiales, récord académico, reglamentos y formatos de trámite.
          </p>
        </div>

        <div className="doc-header-actions">
          <button type="button" className="doc-btn-secondary">
            <Upload className="doc-icon-md doc-ico-sky" />
            <span>Adjuntar documento</span>
          </button>
          <button type="button" onClick={abrirFut} className="doc-btn-primary">
            <Plus className="doc-icon-md" />
            <span>Solicitar trámite (FUT)</span>
          </button>
        </div>
      </div>

      {/* Buscador y filtros */}
      <div className="doc-card doc-filter-bar">
        <div className="doc-search-wrap">
          <Search className="doc-search-icon" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar curso, código o docente..."
            className="doc-search-input"
          />
        </div>

        <div className="doc-cat-scroll">
          <div className="doc-cat-group">
            {categorias.map((cat) => {
              const activa = activeCategory === cat.id;
              return (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`doc-cat-btn ${activa ? 'doc-cat-btn-active' : ''}`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Ficha de matrícula */}
      {mostrarAcademicos && (
        <div className="doc-card doc-matricula-card">
          <div className="doc-matricula-row">
            <div className="doc-matricula-main">
              <div className="doc-matricula-icon">
                <FileText className="doc-icon-lg" />
              </div>
              <div className="doc-matricula-info">
                <div className="doc-matricula-top">
                  <h3 className="doc-matricula-title">Ficha y Constancia de Matrícula</h3>
                  <span className="doc-registered-badge">
                    <ShieldCheck className="doc-icon-sm" />
                    <span>Registrada</span>
                  </span>
                </div>
                <p className="doc-matricula-sub">
                  Periodo Lectivo 2026-II · Constancia con código de verificación institucional.
                </p>

                <div className="doc-matricula-grid">
                  <div className="doc-truncate-wrap">
                    <p className="doc-meta-label">Estudiante</p>
                    <p className="doc-meta-val">
                      Estudiante Registrado{' '}
                      <span className="doc-meta-code">(202110482)</span>
                    </p>
                  </div>
                  <div className="doc-truncate-wrap">
                    <p className="doc-meta-label">Programa de Estudios</p>
                    <p className="doc-meta-val">Ingeniería de Software</p>
                  </div>
                  <div className="doc-truncate-wrap">
                    <p className="doc-meta-label">Carga Académica</p>
                    <p className="doc-meta-val doc-text-sky">22 Créditos (5 cursos)</p>
                  </div>
                  <div className="doc-truncate-wrap">
                    <p className="doc-meta-label">Fecha de Registro</p>
                    <p className="doc-meta-val">14 Ago, 2026 · 09:42</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="doc-matricula-actions">
              <button type="button" className="doc-btn-secondary">
                <Eye className="doc-icon-md doc-ico-sky" />
                <span>Vista previa</span>
              </button>
              <button type="button" className="doc-btn-primary">
                <Download className="doc-icon-md" />
                <span>Descargar PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sílabos + Formulario FUT */}
      {(mostrarAcademicos || mostrarTramites) && (
        <div className="doc-mid-grid">
          {mostrarAcademicos && (
            <div
              className={`${
                mostrarTramites ? 'doc-col-silabos-split' : 'doc-col-full'
              } doc-col-stack`}
            >
              <div className="doc-col-header">
                <h3 className="doc-section-heading">Sílabos de Asignaturas</h3>
                <span className="doc-count-pill">{silabosFiltrados.length} curso(s)</span>
              </div>

              {loadingSilabos ? (
                <div className="doc-card doc-loading-box">
                  <Loader2 className="doc-icon-lg doc-spin doc-ico-blue" />
                  <p className="doc-loading-text">Cargando sílabos...</p>
                </div>
              ) : silabosFiltrados.length === 0 ? (
                <div className="doc-card doc-empty-box">
                  No se encontraron sílabos con el filtro actual.
                </div>
              ) : (
                <div className="doc-silabos-grid">
                  {silabosFiltrados.map((item) => (
                    <div key={item.id} className="doc-card doc-silabo-card">
                      <div className="doc-silabo-top">
                        <div className="doc-silabo-head">
                          <div className="doc-small-icon">
                            <FileText className="doc-icon-md" />
                          </div>
                          <span className="doc-credit-badge">{item.creditos}</span>
                        </div>

                        <div className="doc-truncate-wrap">
                          <h4 className="doc-silabo-title">{item.curso}</h4>
                          <p className="doc-silabo-sub">
                            {item.codigo} · {item.docente}
                          </p>
                        </div>
                      </div>

                      <div className="doc-silabo-foot">
                        <p className="doc-silabo-meta">
                          {item.actualizado} · {item.tamano}
                        </p>

                        {item.silaboUrl ? (
                          <a
                            href={item.silaboUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="doc-silabo-link"
                          >
                            <Download className="doc-icon-sm" />
                            <span className="doc-truncate-text">Descargar Sílabo (PDF)</span>
                            <ExternalLink className="doc-icon-xs" />
                          </a>
                        ) : (
                          <div className="doc-silabo-pending">
                            Publicación pendiente del docente
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {mostrarTramites && (
            <div
              className={`${
                mostrarAcademicos ? 'doc-col-fut-split' : 'doc-col-full'
              } doc-col-stack`}
            >
              <h3 className="doc-section-heading">Formularios y Trámites</h3>

              <div className="doc-card doc-fut-card">
                <div className="doc-silabo-head">
                  <div className="doc-med-icon">
                    <FileText className="doc-icon-md" />
                  </div>
                  <span className="doc-credit-badge">Formato 2026</span>
                </div>

                <div>
                  <h4 className="doc-fut-title">FUT — Formulario Único de Trámite</h4>
                  <p className="doc-fut-desc">
                    Solicitud de constancias, convalidaciones, rectificación de matrícula y certificados.
                  </p>
                </div>

                <div className="doc-fut-features">
                  <p className="doc-fut-features-title">Características</p>
                  <ul className="doc-fut-list">
                    <li>· Registro en línea con comprobante de seguimiento.</li>
                    <li>· Datos del estudiante precargados en el formulario.</li>
                    <li>· Atención directa por mesa de partes / secretaría.</li>
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={abrirFut}
                  className="doc-btn-primary doc-btn-full"
                >
                  <FileText className="doc-icon-md" />
                  <span>Completar FUT Digital</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Récord Académico y Reglamentos */}
      {(mostrarAcademicos || mostrarReglamentos) && (
        <div className="doc-bottom-grid">
          {mostrarAcademicos && (
            <div className="doc-col-stack">
              <div className="doc-col-header">
                <h3 className="doc-section-heading">Historial y Récord de Notas</h3>
                <button type="button" className="doc-link-btn">
                  <span>Ver detalle</span>
                  <ChevronRight className="doc-icon-sm" />
                </button>
              </div>

              <div className="doc-records-list">
                <div className="doc-card doc-record-row">
                  <div className="doc-record-left">
                    <div className="doc-record-icon">
                      <Award className="doc-icon-md" />
                    </div>
                    <div className="doc-truncate-wrap">
                      <h4 className="doc-record-title">Récord Académico Consolidado</h4>
                      <p className="doc-record-sub">
                        Promedio ponderado: <strong>16.8 / 20.0</strong>
                      </p>
                    </div>
                  </div>

                  <button type="button" className="doc-btn-compact">
                    Descargar
                  </button>
                </div>

                <div className="doc-card doc-record-row">
                  <div className="doc-record-left">
                    <div className="doc-record-icon">
                      <FileSpreadsheet className="doc-icon-md" />
                    </div>
                    <div className="doc-truncate-wrap">
                      <h4 className="doc-record-title">Boleta de Notas — Ciclo 2026-I</h4>
                      <p className="doc-record-sub">
                        24 créditos culminados · Periodo anterior
                      </p>
                    </div>
                  </div>

                  <button type="button" className="doc-btn-compact">
                    Descargar
                  </button>
                </div>
              </div>
            </div>
          )}

          {mostrarReglamentos && (
            <div className="doc-col-stack">
              <div className="doc-col-header">
                <h3 className="doc-section-heading">Normativa y Reglamentos</h3>
                <span className="doc-muted-label">Vigente</span>
              </div>

              <div className="doc-records-list">
                <div className="doc-card doc-record-row">
                  <div className="doc-record-left">
                    <div className="doc-record-icon">
                      <BookOpen className="doc-icon-md" />
                    </div>
                    <div className="doc-truncate-wrap">
                      <h4 className="doc-record-title">Reglamento del Estudiante 2026</h4>
                      <p className="doc-record-sub">
                        Normas de evaluación, asistencia y convivencia
                      </p>
                    </div>
                  </div>

                  <span className="doc-pdf-chip">PDF</span>
                </div>

                <div className="doc-card doc-record-row">
                  <div className="doc-record-left">
                    <div className="doc-record-icon">
                      <Calendar className="doc-icon-md" />
                    </div>
                    <div className="doc-truncate-wrap">
                      <h4 className="doc-record-title">
                        Cronograma Académico Institucional 2026
                      </h4>
                      <p className="doc-record-sub">
                        Fechas de matrículas, evaluaciones y cierres de acta
                      </p>
                    </div>
                  </div>

                  <span className="doc-pdf-chip">PDF</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal FUT Digital */}
      {showFutModal && (
        <ModalFut onClose={cerrarFut}>
          <RenderFutSeguro />
        </ModalFut>
      )}
    </div>
  );
}