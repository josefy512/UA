import { useState, useMemo } from 'react';
import './Val_Futs.css';
import {
  Search,
  CheckCircle2,
  XCircle,
  FileCheck2
} from 'lucide-react';

export interface FUT {
  id: string;
  codigo: string;
  estudiante: string;
  carrera: string;
  asunto: string;
  fecha: string;
  estado: 'pendiente' | 'aprobado' | 'rechazado';
}

interface ValFutsProps {
  futs: FUT[];
  cargando?: boolean;
  onAprobar: (id: string) => void;
  onObservar: (id: string) => void;
}

type FiltroEstado = 'todos' | 'pendiente' | 'aprobado' | 'rechazado';

export default function ValFutsPanel({
  futs,
  cargando = false,
  onAprobar,
  onObservar
}: ValFutsProps) {
  const [filtroEstado, setFiltroEstado] = useState<FiltroEstado>('todos');
  const [busqueda, setBusqueda] = useState<string>('');

  const conteos = useMemo(() => {
    return {
      todos: futs.length,
      pendiente: futs.filter((f) => f.estado === 'pendiente').length,
      aprobado: futs.filter((f) => f.estado === 'aprobado').length,
      rechazado: futs.filter((f) => f.estado === 'rechazado').length
    };
  }, [futs]);

  const futsFiltrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return futs.filter((fut) => {
      const cumpleEstado = filtroEstado === 'todos' || fut.estado === filtroEstado;
      const cumpleTexto =
        !q ||
        fut.codigo.toLowerCase().includes(q) ||
        fut.estudiante.toLowerCase().includes(q) ||
        fut.asunto.toLowerCase().includes(q) ||
        fut.carrera.toLowerCase().includes(q);
      return cumpleEstado && cumpleTexto;
    });
  }, [futs, filtroEstado, busqueda]);

  return (
    <section className="vfut-root">
      <header className="vfut-head">
        <div className="vfut-head-info">
          <div className="vfut-title-row">
            <FileCheck2 className="vfut-icon-sm vfut-text-sky" />
            <h2 className="vfut-title">Bandeja de Aprobación de FUTs</h2>
          </div>
          <p className="vfut-subtitle">
            Revisión y firma digital de solicitudes institucionales
          </p>
        </div>

        <span className="vfut-pending-badge">
          Pendientes ({conteos.pendiente})
        </span>
      </header>

      <div className="vfut-toolbar">
        <div className="vfut-tabs" role="tablist" aria-label="Filtrar FUTs por estado">
          {(
            [
              { id: 'todos', label: 'Todos', count: conteos.todos },
              { id: 'pendiente', label: 'Pendientes', count: conteos.pendiente },
              { id: 'aprobado', label: 'Aprobados', count: conteos.aprobado },
              { id: 'rechazado', label: 'Observados', count: conteos.rechazado }
            ] as const
          ).map((tab) => {
            const activo = filtroEstado === tab.id;
            return (
              <button
                type="button"
                key={tab.id}
                onClick={() => setFiltroEstado(tab.id)}
                className={`vfut-tab-btn ${activo ? 'vfut-tab-active' : ''}`}
              >
                <span>{tab.label}</span>
                <span className="vfut-tab-count">{tab.count}</span>
              </button>
            );
          })}
        </div>

        <div className="vfut-search-box">
          <Search className="vfut-search-icon" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar código, alumno o trámite..."
            className="vfut-search-input"
          />
        </div>
      </div>

      {cargando ? (
        <div className="vfut-empty">Cargando trámites institucionales...</div>
      ) : futsFiltrados.length === 0 ? (
        <div className="vfut-empty">
          No hay solicitudes FUT que coincidan con el filtro seleccionado.
        </div>
      ) : (
        <div className="vfut-list">
          {futsFiltrados.map((fut) => {
            const estadoClase =
              fut.estado === 'pendiente'
                ? 'vfut-status-pending'
                : fut.estado === 'aprobado'
                ? 'vfut-status-approved'
                : 'vfut-status-rejected';

            const etiquetaEstado =
              fut.estado === 'rechazado' ? 'OBSERVADO' : fut.estado.toUpperCase();

            return (
              <article key={fut.id} className="vfut-card">
                <div className="vfut-card-info">
                  <div className="vfut-meta-row">
                    <span className="vfut-code">{fut.codigo}</span>
                    <span className="vfut-date">| {fut.fecha}</span>
                    <span className={`vfut-status-pill ${estadoClase}`}>
                      {etiquetaEstado}
                    </span>
                  </div>

                  <h3 className="vfut-subject">{fut.asunto}</h3>

                  <p className="vfut-applicant">
                    Solicitante: <strong>{fut.estudiante}</strong> ({fut.carrera})
                  </p>
                </div>

                {fut.estado === 'pendiente' ? (
                  <div className="vfut-actions">
                    <button
                      type="button"
                      onClick={() => onObservar(fut.id)}
                      className="vfut-btn-observe"
                    >
                      <XCircle className="vfut-icon-xs" />
                      <span>Observar</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onAprobar(fut.id)}
                      className="vfut-btn-approve"
                    >
                      <CheckCircle2 className="vfut-icon-xs" />
                      <span>Aprobar y Firmar</span>
                    </button>
                  </div>
                ) : (
                  <span className="vfut-processed">Trámite procesado</span>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}