import { useState, useMemo } from 'react';
import './Biblioteca.css';
import {
  BookOpen,
  Search,
  Bookmark,
  //History,
  CheckCircle,
  Star,
  Download,
  Eye,
  ThumbsUp,
  Library,
  Key,
  Layers,
  ChevronRight
} from 'lucide-react';

type CategoriaRecurso = 'Todos' | 'Libros' | 'Articulos' | 'Herramientas' | 'Repositorios';

interface RecursoItem {
  id: string;
  categoria: Exclude<CategoriaRecurso, 'Todos'>;
  curso: string;
  edicion: string;
  area: string;
  portadaTitulo: string;
  titulo: string;
  autor: string;
  archivo: string;
  calificacion: string;
  votos: number;
  recomendado: boolean;
}

const TABS: Array<{ id: CategoriaRecurso; label: string; count: number }> = [
  { id: 'Todos', label: 'Todos los recursos', count: 48 },
  { id: 'Libros', label: 'Libros y Manuales', count: 24 },
  { id: 'Articulos', label: 'Artículos y Fuentes', count: 12 },
  { id: 'Herramientas', label: 'Herramientas y Software', count: 8 },
  { id: 'Repositorios', label: 'Repositorios Académicos', count: 4 }
];

const STATS = [
  { icon: Library, label: 'Libros indexados', value: '48 disponibles' },
  { icon: CheckCircle, label: 'Lecturas del sílabo', value: '100% cubiertas' },
  { icon: Key, label: 'Entornos y licencias', value: '3 activas' },
  { icon: Layers, label: 'Colecciones vigentes', value: '5 áreas' }
];

const RECURSOS: RecursoItem[] = [
  {
    id: 'rec-1',
    categoria: 'Libros',
    curso: 'Cálculo II',
    edicion: '7.ª Edición',
    area: 'Ciencias Básicas',
    portadaTitulo: 'Cálculo Multivariable y Vectorial',
    titulo: 'Cálculo de Varias Variables y Vectorial',
    autor: 'James Stewart · Cengage Learning',
    archivo: 'PDF (18.4 MB)',
    calificacion: '4.9',
    votos: 128,
    recomendado: true
  },
  {
    id: 'rec-2',
    categoria: 'Libros',
    curso: 'Resistencia de Materiales',
    edicion: '8.ª Edición',
    area: 'Estructuras',
    portadaTitulo: 'Mecánica de Materiales y Esfuerzos',
    titulo: 'Mecánica de Materiales y Tensión',
    autor: 'Ferdinand P. Beer, Johnston · McGraw-Hill',
    archivo: 'PDF Oficial (32.1 MB)',
    calificacion: '4.8',
    votos: 94,
    recomendado: true
  },
  {
    id: 'rec-3',
    categoria: 'Articulos',
    curso: 'Física II',
    edicion: 'Edición 2025',
    area: 'Ciencias Básicas',
    portadaTitulo: 'Guía de Electromagnetismo y Ondas',
    titulo: 'Apuntes y Ejercicios Resueltos de Electromagnetismo',
    autor: 'Departamento de Ciencias · Material de Cátedra',
    archivo: 'PDF (6.2 MB)',
    calificacion: '4.7',
    votos: 65,
    recomendado: true
  },
  {
    id: 'rec-4',
    categoria: 'Herramientas',
    curso: 'Bases de Datos',
    edicion: 'Guía Práctica',
    area: 'Sistemas y Gestión',
    portadaTitulo: 'Modelado Relacional y Consultas SQL',
    titulo: 'Manual de Diseño de Bases de Datos Relacionales',
    autor: 'Coordinación Académica · Guía Técnica',
    archivo: 'PDF (4.8 MB)',
    calificacion: '4.9',
    votos: 82,
    recomendado: false
  }
];

const RECS = [
  {
    initials: 'RV',
    name: 'Prof. Dr. Ramiro Valdivia',
    meta: 'Cálculo II · Grupo 04',
    quote: 'Revisar el capítulo 4 antes de la evaluación: Teorema de Green y aplicaciones de flujo vectorial.',
    action: 'Abrir capítulo de referencia (pp. 312-348)',
    icon: BookOpen
  },
  {
    initials: 'MC',
    name: 'Ing. Martha Córdova',
    meta: 'Resistencia de Materiales',
    quote: 'Tablas de esfuerzo cortante para la entrega obligatoria de laboratorio N.° 3. Revisar anexos.',
    action: 'Descargar tabla de esfuerzos (PDF)',
    icon: Download
  }
];

export default function BibliotecaView() {
  const [activeTab, setActiveTab] = useState<CategoriaRecurso>('Todos');
  const [onlyRecommended, setOnlyRecommended] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [guardados, setGuardados] = useState<string[]>([]);

  const toggleGuardado = (id: string) => {
    setGuardados((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const recursosFiltrados = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return RECURSOS.filter((item) => {
      const cumpleTab = activeTab === 'Todos' || item.categoria === activeTab;
      const cumpleRec = !onlyRecommended || item.recomendado;
      const cumpleBusqueda =
        !q ||
        item.titulo.toLowerCase().includes(q) ||
        item.autor.toLowerCase().includes(q) ||
        item.curso.toLowerCase().includes(q);
      return cumpleTab && cumpleRec && cumpleBusqueda;
    });
  }, [activeTab, onlyRecommended, searchTerm]);

  return (
    <div className="bib-root">
      {/* Encabezado del módulo y acciones */}
      <header className="bib-card bib-header">
        <div className="bib-header-top">
          <div className="bib-truncate-wrap">
            <h2 className="bib-title">Biblioteca y Recursos de Estudio</h2>
            <p className="bib-subtitle">
              Consulta libros, guías técnicas, artículos y material de apoyo vinculados a tus asignaturas vigentes.
            </p>
          </div>

          {/*
          <div className="bib-header-actions">
            <button type="button" className="bib-btn-primary">
              <BookOpen className="bib-icon-md" />
              <span>Solicitar Material</span>
            </button>
            <button type="button" className="bib-btn-secondary">
              <History className="bib-icon-md bib-ico-sky" />
              <span>Historial de Lectura</span>
            </button>
          </div>
          */}
        </div>

        <div className="bib-stats-grid">
          {STATS.map(({ icon: Icon, label, value }) => (
            <div key={label} className="bib-stat-card">
              <div className="bib-stat-icon">
                <Icon className="bib-icon-md" />
              </div>
              <div className="bib-truncate-wrap">
                <p className="bib-stat-label">{label}</p>
                <p className="bib-stat-value">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </header>

      {/* Búsqueda y filtros */}
      <section className="bib-filters-section">
        <div className="bib-controls-grid">
          <div className="bib-search-col">
            <Search className="bib-search-icon" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por título, autor o asignatura..."
              className="bib-search-input"
            />
          </div>

          <div className="bib-select-col">
            <select className="bib-select" aria-label="Filtrar por curso">
              <option>Todos los cursos</option>
              <option>Cálculo II (MAT-204)</option>
              <option>Resistencia de Materiales (CIV-301)</option>
              <option>Física II (FIS-102)</option>
            </select>
          </div>

          <div className="bib-select-col">
            <select className="bib-select" aria-label="Ordenar recursos">
              <option>Ordenar por: Recientes</option>
              <option>Mejor valorados</option>
              <option>Título (A - Z)</option>
            </select>
          </div>
        </div>

        <div className="bib-tabs-row">
          <div className="bib-tabs-scroll">
            <div className="bib-tabs-list">
              {TABS.map((tab) => {
                const activo = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`bib-tab-btn ${activo ? 'bib-tab-btn-active' : ''}`}
                  >
                    <span>{tab.label}</span>
                    <span className={`bib-tab-count ${activo ? 'bib-tab-count-active' : ''}`}>
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <label className="bib-rec-toggle">
            <input
              type="checkbox"
              checked={onlyRecommended}
              onChange={(e) => setOnlyRecommended(e.target.checked)}
              className="bib-checkbox"
            />
            <Star className="bib-icon-sm bib-ico-amber" />
            <span>Solo recomendados por docentes</span>
          </label>
        </div>
      </section>

      {/* Contenido principal */}
      <div className="bib-main-grid">
        <section className="bib-catalog-col">
          <div className="bib-section-header">
            <h3 className="bib-section-heading">
              <BookOpen className="bib-icon-md bib-ico-sky" />
              <span>Catálogo de Material Académico</span>
              <span className="bib-visible-pill">{recursosFiltrados.length} visibles</span>
            </h3>
            <button
              type="button"
              onClick={() => {
                setActiveTab('Todos');
                setOnlyRecommended(false);
                setSearchTerm('');
              }}
              className="bib-reset-link"
            >
              <span>Ver todo</span>
              <ChevronRight className="bib-icon-sm" />
            </button>
          </div>

          {recursosFiltrados.length === 0 ? (
            <div className="bib-card bib-empty-box">
              No se encontraron recursos con los filtros actuales.
            </div>
          ) : (
            <div className="bib-items-grid">
              {recursosFiltrados.map((b) => {
                const esGuardado = guardados.includes(b.id);
                return (
                  <article key={b.id} className="bib-card bib-item-card">
                    <div className="bib-item-top">
                      <div className="bib-cover-box">
                        <span className="bib-cover-course">{b.curso}</span>
                        <span className="bib-cover-edition">{b.edicion}</span>
                        <div className="bib-cover-body">
                          <p className="bib-cover-area">{b.area}</p>
                          <p className="bib-cover-title">{b.portadaTitulo}</p>
                        </div>
                      </div>

                      <div className="bib-truncate-wrap">
                        <h4 className="bib-item-title">{b.titulo}</h4>
                        <p className="bib-item-author">{b.autor}</p>
                      </div>
                    </div>

                    <div className="bib-item-foot">
                      <div className="bib-item-meta">
                        <span className="bib-file-info">
                          <Download className="bib-icon-sm bib-ico-sky" />
                          <span>{b.archivo}</span>
                        </span>
                        <span className="bib-rating-info">
                          <Star className="bib-icon-sm" />
                          <span>{b.calificacion}</span>
                          <span className="bib-votes-count">({b.votos})</span>
                        </span>
                      </div>

                      <div className="bib-item-actions">
                        <button type="button" className="bib-open-btn">
                          <Eye className="bib-icon-sm" />
                          <span>Consultar material</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleGuardado(b.id)}
                          aria-label="Guardar recurso"
                          className={`bib-bookmark-btn ${
                            esGuardado ? 'bib-bookmark-btn-active' : ''
                          }`}
                        >
                          <Bookmark className="bib-icon-md" />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <aside className="bib-aside-col">
          <div className="bib-section-header">
            <h3 className="bib-section-heading">
              <ThumbsUp className="bib-icon-sm bib-ico-sky" />
              <span>Sugerencias de Docentes</span>
            </h3>
          </div>

          <div className="bib-recs-grid">
            {RECS.map((r) => {
              const Icon = r.icon;
              return (
                <div key={r.initials} className="bib-card bib-rec-card">
                  <div className="bib-rec-author">
                    <div className="bib-rec-avatar">{r.initials}</div>
                    <div className="bib-truncate-wrap">
                      <h4 className="bib-rec-name">{r.name}</h4>
                      <p className="bib-rec-meta">{r.meta}</p>
                    </div>
                  </div>

                  <div className="bib-rec-quote">"{r.quote}"</div>

                  <button type="button" className="bib-rec-action">
                    <Icon className="bib-icon-sm" />
                    <span>{r.action}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
}