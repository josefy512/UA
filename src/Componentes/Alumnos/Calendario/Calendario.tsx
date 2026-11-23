import React, { useState, useEffect, useMemo } from 'react';
import './Calendario.css';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
  Video,
  Plus,
  Pencil,
  Trash2,
  X,
  Calendar as CalendarIcon,
  List
} from 'lucide-react';

type TipoEvento = 'Examen' | 'Tarea' | 'Asesoria' | 'Feriado';

interface EventoCalendario {
  id: string;
  fecha: string; // YYYY-MM-DD
  titulo: string;
  tipo: TipoEvento;
  hora?: string;
  detalle?: string;
}

const STORAGE_KEY = 'progresa_eventos_calendario_v1';

const EVENTOS_INICIALES: EventoCalendario[] = [
  {
    id: 'ev-1',
    fecha: '2026-10-08',
    titulo: 'Combate de Angamos',
    tipo: 'Feriado',
    detalle: 'Feriado calendario nacional'
  },
  {
    id: 'ev-2',
    fecha: '2026-10-09',
    titulo: 'Laboratorio Inicial',
    tipo: 'Tarea',
    hora: '10:00',
    detalle: 'Reconocimiento de equipos y normas'
  },
  {
    id: 'ev-3',
    fecha: '2026-10-13',
    titulo: 'Quiz de Hidráulica',
    tipo: 'Examen',
    hora: '08:30',
    detalle: 'Evaluación corta en aula'
  },
  {
    id: 'ev-4',
    fecha: '2026-10-14',
    titulo: 'Examen Parcial: Cálculo II',
    tipo: 'Examen',
    hora: '09:00',
    detalle: 'Aula 304 - Pabellón B · Ponderación 25%'
  },
  {
    id: 'ev-5',
    fecha: '2026-10-14',
    titulo: 'Taller Nº 4: Integrales Múltiples',
    tipo: 'Tarea',
    hora: '23:59',
    detalle: 'Entrega en formato PDF grupal'
  },
  {
    id: 'ev-6',
    fecha: '2026-10-16',
    titulo: 'Asesoría: Resistencia de Materiales',
    tipo: 'Asesoria',
    hora: '15:00',
    detalle: 'Resolución de dudas con docente del curso'
  },
  {
    id: 'ev-7',
    fecha: '2026-10-17',
    titulo: 'Laboratorio 3: Tracción y Corte',
    tipo: 'Tarea',
    hora: '11:00',
    detalle: 'Registro de mediciones y ficha técnica'
  },
  {
    id: 'ev-8',
    fecha: '2026-10-20',
    titulo: 'Repaso General de Curso',
    tipo: 'Asesoria',
    hora: '16:30',
    detalle: 'Ejercicios propuestos de práctica'
  },
  {
    id: 'ev-9',
    fecha: '2026-10-21',
    titulo: 'PC2: Física Aplicada',
    tipo: 'Examen',
    hora: '10:00',
    detalle: 'Práctica calificada presencial'
  },
  {
    id: 'ev-10',
    fecha: '2026-10-23',
    titulo: 'Avance de Proyecto Integrador',
    tipo: 'Tarea',
    hora: '18:00',
    detalle: 'Revisión parcial de entregable'
  },
  {
    id: 'ev-11',
    fecha: '2026-10-24',
    titulo: 'Aniversario Institucional',
    tipo: 'Feriado',
    detalle: 'Actividad conmemorativa programada'
  }
];

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const toIsoDate = (year: number, monthIndex: number, day: number) => {
  const m = String(monthIndex + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
};

const claseBadgeTipo = (tipo: TipoEvento) => {
  switch (tipo) {
    case 'Examen':
      return 'cal-badge-examen';
    case 'Tarea':
      return 'cal-badge-tarea';
    case 'Asesoria':
      return 'cal-badge-asesoria';
    case 'Feriado':
      return 'cal-badge-feriado';
  }
};

export default function CalendarioView() {
  const [eventos, setEventos] = useState<EventoCalendario[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.error('Error al leer eventos del calendario:', e);
      }
    }
    return EVENTOS_INICIALES;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(eventos));
    } catch (e) {
      console.error('Error al guardar eventos del calendario:', e);
    }
  }, [eventos]);

  const [year, setYear] = useState<number>(2026);
  const [month, setMonth] = useState<number>(9); // Octubre (0-indexado)
  const [filtroTipo, setFiltroTipo] = useState<'Todos' | TipoEvento>('Todos');
  const [modoVista, setModoVista] = useState<'cuadricula' | 'lista'>('cuadricula');

  const [selectedDate, setSelectedDate] = useState<string>('2026-10-14');
  const [panelDiaAbierto, setPanelDiaAbierto] = useState<boolean>(false);

  const [editId, setEditId] = useState<string | null>(null);
  const [tituloForm, setTituloForm] = useState<string>('');
  const [tipoForm, setTipoForm] = useState<TipoEvento>('Tarea');
  const [horaForm, setHoraForm] = useState<string>('');
  const [detalleForm, setDetalleForm] = useState<string>('');

  const eventosFiltrados = useMemo(() => {
    if (filtroTipo === 'Todos') return eventos;
    return eventos.filter((ev) => ev.tipo === filtroTipo);
  }, [eventos, filtroTipo]);

  const eventosDelDiaSeleccionado = useMemo(() => {
    return eventos.filter((ev) => ev.fecha === selectedDate);
  }, [eventos, selectedDate]);

  const celdasCalendario = useMemo(() => {
    const primerDiaMes = new Date(year, month, 1);
    const totalDiasMes = new Date(year, month + 1, 0).getDate();
    const diasMesAnterior = new Date(year, month, 0).getDate();
    const offsetInicio = (primerDiaMes.getDay() + 6) % 7;

    const celdas: Array<{
      fecha: string;
      dia: number;
      esMesActual: boolean;
    }> = [];

    for (let i = offsetInicio - 1; i >= 0; i--) {
      const d = diasMesAnterior - i;
      const prevMonth = month === 0 ? 11 : month - 1;
      const prevYear = month === 0 ? year - 1 : year;
      celdas.push({
        fecha: toIsoDate(prevYear, prevMonth, d),
        dia: d,
        esMesActual: false
      });
    }

    for (let d = 1; d <= totalDiasMes; d++) {
      celdas.push({
        fecha: toIsoDate(year, month, d),
        dia: d,
        esMesActual: true
      });
    }

    const resto = celdas.length % 7 === 0 ? 0 : 7 - (celdas.length % 7);
    for (let d = 1; d <= resto; d++) {
      const nextMonth = month === 11 ? 0 : month + 1;
      const nextYear = month === 11 ? year + 1 : year;
      celdas.push({
        fecha: toIsoDate(nextYear, nextMonth, d),
        dia: d,
        esMesActual: false
      });
    }

    return celdas;
  }, [year, month]);

  const limpiarFormulario = () => {
    setEditId(null);
    setTituloForm('');
    setTipoForm('Tarea');
    setHoraForm('');
    setDetalleForm('');
  };

  const abrirDia = (fechaIso: string) => {
    setSelectedDate(fechaIso);
    limpiarFormulario();
    setPanelDiaAbierto(true);
  };

  const iniciarEdicion = (ev: EventoCalendario) => {
    setEditId(ev.id);
    setTituloForm(ev.titulo);
    setTipoForm(ev.tipo);
    setHoraForm(ev.hora || '');
    setDetalleForm(ev.detalle || '');
  };

  const eliminarEvento = (id: string) => {
    setEventos((prev) => prev.filter((ev) => ev.id !== id));
    if (editId === id) limpiarFormulario();
  };

  const guardarEvento = (e: React.FormEvent) => {
    e.preventDefault();
    const tituloLimpio = tituloForm.trim();
    if (!tituloLimpio) return;

    if (editId) {
      setEventos((prev) =>
        prev.map((ev) =>
          ev.id === editId
            ? {
                ...ev,
                titulo: tituloLimpio,
                tipo: tipoForm,
                hora: horaForm.trim() || undefined,
                detalle: detalleForm.trim() || undefined
              }
            : ev
        )
      );
      limpiarFormulario();
      return;
    }

    const nuevo: EventoCalendario = {
      id: `ev-${Date.now()}`,
      fecha: selectedDate,
      titulo: tituloLimpio,
      tipo: tipoForm,
      hora: horaForm.trim() || undefined,
      detalle: detalleForm.trim() || undefined
    };

    setEventos((prev) => [...prev, nuevo]);
    limpiarFormulario();
  };

  const cambiarMes = (delta: number) => {
    const nuevaFecha = new Date(year, month + delta, 1);
    setYear(nuevaFecha.getFullYear());
    setMonth(nuevaFecha.getMonth());
  };

  const irHoy = () => {
    const hoy = new Date();
    setYear(hoy.getFullYear());
    setMonth(hoy.getMonth());
    const isoHoy = toIsoDate(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    setSelectedDate(isoHoy);
  };

  const proximosEventos = useMemo(() => {
    return [...eventosFiltrados]
      .filter((ev) => ev.tipo !== 'Feriado')
      .slice(0, 4);
  }, [eventosFiltrados]);

  return (
    <div className="cal-root">
      {/* Encabezado del módulo */}
      <div className="cal-card cal-header-banner">
        <div>
          <h2 className="cal-title">Calendario Académico</h2>
          <p className="cal-subtitle">
            Selecciona un día para consultar actividades, agregar eventos o modificar registros.
          </p>
        </div>

        <button
          type="button"
          onClick={() => abrirDia(selectedDate)}
          className="cal-btn-primary"
        >
          <Plus className="cal-icon-md" />
          <span>Nuevo Evento</span>
        </button>
      </div>

      {/* Barra de controles */}
      <div className="cal-card cal-toolbar">
        <div className="cal-month-nav">
          <div className="cal-arrows">
            <button
              type="button"
              onClick={() => cambiarMes(-1)}
              title="Mes anterior"
              aria-label="Mes anterior"
              className="cal-icon-btn"
            >
              <ChevronLeft className="cal-icon-md" />
            </button>
            <button
              type="button"
              onClick={() => cambiarMes(1)}
              title="Mes siguiente"
              aria-label="Mes siguiente"
              className="cal-icon-btn"
            >
              <ChevronRight className="cal-icon-md" />
            </button>
          </div>

          <span className="cal-month-label">
            {MESES[month]} {year}
          </span>

          <button
            type="button"
            onClick={irHoy}
            className="cal-today-btn"
          >
            Hoy
          </button>
        </div>

        <div className="cal-filters">
          {(
            [
              { id: 'Todos', label: 'Todos' },
              { id: 'Examen', label: 'Exámenes' },
              { id: 'Tarea', label: 'Tareas' },
              { id: 'Asesoria', label: 'Asesorías' },
              { id: 'Feriado', label: 'Feriados' }
            ] as const
          ).map((tab) => {
            const activo = filtroTipo === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFiltroTipo(tab.id)}
                className={`cal-filter-btn ${activo ? 'cal-filter-btn-active' : ''}`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="cal-view-switch">
          <button
            type="button"
            onClick={() => setModoVista('cuadricula')}
            className={`cal-view-btn ${modoVista === 'cuadricula' ? 'cal-view-btn-active' : ''}`}
          >
            <CalendarIcon className="cal-icon-sm" />
            <span>Mes</span>
          </button>
          <button
            type="button"
            onClick={() => setModoVista('lista')}
            className={`cal-view-btn ${modoVista === 'lista' ? 'cal-view-btn-active' : ''}`}
          >
            <List className="cal-icon-sm" />
            <span>Lista</span>
          </button>
        </div>
      </div>

      {/* Cuerpo principal */}
      <div className="cal-main-grid">
        <div className="cal-card cal-calendar-col">
          {modoVista === 'cuadricula' ? (
            <>
              <div className="cal-weekdays">
                <span>Lun</span>
                <span>Mar</span>
                <span>Mié</span>
                <span>Jue</span>
                <span>Vie</span>
                <span>Sáb</span>
                <span>Dom</span>
              </div>

              <div className="cal-grid">
                {celdasCalendario.map((celda) => {
                  const evsDia = eventosFiltrados.filter((ev) => ev.fecha === celda.fecha);
                  const esSeleccionado = celda.fecha === selectedDate;

                  return (
                    <button
                      type="button"
                      key={celda.fecha}
                      onClick={() => abrirDia(celda.fecha)}
                      className={`cal-day-cell ${
                        esSeleccionado
                          ? 'cal-day-selected'
                          : celda.esMesActual
                            ? 'cal-day-current'
                            : 'cal-day-outside'
                      }`}
                    >
                      <div className="cal-day-top">
                        <span
                          className={`cal-day-num ${
                            esSeleccionado ? 'cal-day-num-selected' : ''
                          }`}
                        >
                          {celda.dia}
                        </span>
                        {evsDia.length > 0 && (
                          <span className="cal-day-count">{evsDia.length}</span>
                        )}
                      </div>

                      <div className="cal-day-events">
                        {evsDia.slice(0, 2).map((ev) => (
                          <div
                            key={ev.id}
                            className={`cal-event-pill ${claseBadgeTipo(ev.tipo)}`}
                          >
                            {ev.titulo}
                          </div>
                        ))}
                        {evsDia.length > 2 && (
                          <div className="cal-more-events">
                            +{evsDia.length - 2} más
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Lista responsiva en móvil */}
              <div className="cal-mobile-list">
                {celdasCalendario
                  .filter((c) => c.esMesActual)
                  .map((celda) => {
                    const evsDia = eventosFiltrados.filter((ev) => ev.fecha === celda.fecha);
                    return (
                      <button
                        type="button"
                        key={celda.fecha}
                        onClick={() => abrirDia(celda.fecha)}
                        className="cal-mobile-row"
                      >
                        <div className="cal-mobile-left">
                          <div className="cal-mobile-datebox">
                            <span>{celda.dia}</span>
                            <span className="cal-mobile-month">
                              {MESES[month].slice(0, 3)}
                            </span>
                          </div>
                          <div className="cal-truncate-wrap">
                            <p className="cal-mobile-summary">
                              {evsDia.length > 0
                                ? evsDia.map((e) => e.titulo).join(' · ')
                                : 'Sin eventos registrados'}
                            </p>
                            <p className="cal-mobile-hint">Toca para ver o agregar</p>
                          </div>
                        </div>
                        <span className="cal-mobile-badge">{evsDia.length}</span>
                      </button>
                    );
                  })}
              </div>
            </>
          ) : (
            <div className="cal-list-view">
              {eventosFiltrados.length === 0 ? (
                <p className="cal-empty-msg">
                  No hay eventos para el filtro seleccionado.
                </p>
              ) : (
                eventosFiltrados.map((ev) => (
                  <div
                    key={ev.id}
                    onClick={() => abrirDia(ev.fecha)}
                    className="cal-list-item"
                  >
                    <div className="cal-truncate-wrap">
                      <div className="cal-list-meta">
                        <span className="cal-list-date">{ev.fecha}</span>
                        <span className={`cal-type-badge ${claseBadgeTipo(ev.tipo)}`}>
                          {ev.tipo}
                        </span>
                        {ev.hora && (
                          <span className="cal-list-time">{ev.hora} hrs</span>
                        )}
                      </div>
                      <h4 className="cal-list-title">{ev.titulo}</h4>
                      {ev.detalle && (
                        <p className="cal-list-detail">{ev.detalle}</p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Columna derecha: Actividades programadas */}
        <div className="cal-side-col">
          <div className="cal-side-header">
            <h3 className="cal-side-heading">Actividades Programadas</h3>
            <span className="cal-side-count">{proximosEventos.length} registros</span>
          </div>

          <div className="cal-side-list">
            {proximosEventos.map((ev) => (
              <div
                key={ev.id}
                onClick={() => abrirDia(ev.fecha)}
                className="cal-card cal-side-card"
              >
                <div className="cal-side-card-top">
                  <span className="cal-side-when">
                    {ev.tipo === 'Examen' ? (
                      <Clock className="cal-icon-sm cal-ico-rose" />
                    ) : ev.tipo === 'Asesoria' ? (
                      <Video className="cal-icon-sm cal-ico-emerald" />
                    ) : (
                      <FileText className="cal-icon-sm cal-ico-sky" />
                    )}
                    {ev.fecha} {ev.hora ? `· ${ev.hora}` : ''}
                  </span>
                  <span className={`cal-type-badge ${claseBadgeTipo(ev.tipo)}`}>
                    {ev.tipo}
                  </span>
                </div>

                <h4 className="cal-side-title">{ev.titulo}</h4>
                {ev.detalle && (
                  <p className="cal-side-desc">{ev.detalle}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal de agenda del día */}
      {panelDiaAbierto && (
        <div className="cal-modal-backdrop">
          <div className="cal-modal">
            <div className="cal-modal-header">
              <div>
                <span className="cal-modal-kicker">Agenda del Día</span>
                <h3 className="cal-modal-date">{selectedDate}</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setPanelDiaAbierto(false);
                  limpiarFormulario();
                }}
                aria-label="Cerrar agenda"
                className="cal-modal-close"
              >
                <X className="cal-icon-md" />
              </button>
            </div>

            <div className="cal-modal-body">
              <div className="cal-day-agenda">
                <h4 className="cal-modal-section-title">
                  Eventos en esta fecha ({eventosDelDiaSeleccionado.length})
                </h4>

                {eventosDelDiaSeleccionado.length === 0 ? (
                  <p className="cal-agenda-empty">
                    No hay eventos registrados para este día. Agrega uno abajo.
                  </p>
                ) : (
                  <div className="cal-agenda-list">
                    {eventosDelDiaSeleccionado.map((ev) => (
                      <div key={ev.id} className="cal-agenda-item">
                        <div className="cal-truncate-wrap">
                          <div className="cal-list-meta">
                            <span className={`cal-type-badge ${claseBadgeTipo(ev.tipo)}`}>
                              {ev.tipo}
                            </span>
                            {ev.hora && (
                              <span className="cal-list-time">{ev.hora}</span>
                            )}
                          </div>
                          <p className="cal-agenda-item-title">{ev.titulo}</p>
                          {ev.detalle && (
                            <p className="cal-agenda-item-detail">{ev.detalle}</p>
                          )}
                        </div>

                        <div className="cal-agenda-actions">
                          <button
                            type="button"
                            onClick={() => iniciarEdicion(ev)}
                            title="Modificar evento"
                            className="cal-action-btn cal-action-edit"
                          >
                            <Pencil className="cal-icon-sm" />
                          </button>
                          <button
                            type="button"
                            onClick={() => eliminarEvento(ev.id)}
                            title="Eliminar evento"
                            className="cal-action-btn cal-action-delete"
                          >
                            <Trash2 className="cal-icon-sm" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <form onSubmit={guardarEvento} className="cal-form">
                <h4 className="cal-modal-section-title">
                  {editId ? 'Modificar Evento' : 'Agregar Nuevo Evento'}
                </h4>

                <div className="cal-field">
                  <label className="cal-label">Título</label>
                  <input
                    type="text"
                    required
                    value={tituloForm}
                    onChange={(e) => setTituloForm(e.target.value)}
                    placeholder="Ej. Entrega de informe de laboratorio"
                    className="cal-input"
                  />
                </div>

                <div className="cal-form-row">
                  <div className="cal-field">
                    <label className="cal-label">Tipo</label>
                    <select
                      value={tipoForm}
                      onChange={(e) => setTipoForm(e.target.value as TipoEvento)}
                      className="cal-input"
                    >
                      <option value="Tarea">Tarea</option>
                      <option value="Examen">Examen</option>
                      <option value="Asesoria">Asesoría</option>
                      <option value="Feriado">Feriado</option>
                    </select>
                  </div>

                  <div className="cal-field">
                    <label className="cal-label">Hora (opcional)</label>
                    <input
                      type="text"
                      value={horaForm}
                      onChange={(e) => setHoraForm(e.target.value)}
                      placeholder="Ej. 14:30"
                      className="cal-input"
                    />
                  </div>
                </div>

                <div className="cal-field">
                  <label className="cal-label">Detalle / Aula (opcional)</label>
                  <textarea
                    rows={2}
                    value={detalleForm}
                    onChange={(e) => setDetalleForm(e.target.value)}
                    placeholder="Indicaciones, aula o modalidad..."
                    className="cal-textarea"
                  />
                </div>

                <div className="cal-form-footer">
                  {editId && (
                    <button
                      type="button"
                      onClick={limpiarFormulario}
                      className="cal-btn-cancel"
                    >
                      Cancelar edición
                    </button>
                  )}
                  <button type="submit" className="cal-btn-primary">
                    {editId ? 'Guardar cambios' : 'Agregar evento'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}