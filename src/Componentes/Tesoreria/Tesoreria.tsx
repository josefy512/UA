import { useState, useEffect, useMemo } from 'react';
import './Tesoreria.css';
import BoletasCobrosPanel, { type BoletaCobroItem } from './Boletas_Cobros/Boletas';
import {
  Wallet,
  Receipt,
  Users,
  FileSpreadsheet,
  Building2,
  LogOut,
  Search,
  CheckCircle2,
  Clock,
  Menu,
  X,
  PlusCircle,
  Download
} from 'lucide-react';

type TesoreriaSection = 'caja' | 'pensiones' | 'comprobantes' | 'reportes';

interface PagoRegistro {
  id: string;
  boleta: string;
  estudiante: string;
  codigo: string;
  concepto: string;
  carrera: string;
  monto: number;
  fecha: string;
  medio: 'Caja Presencial' | 'Transferencia' | 'Billetera Digital';
  estado: 'Pagado' | 'Pendiente' | 'Vencido';
}

interface UsuarioTesoreria {
  nombres?: string;
  apellidos?: string;
  email?: string;
  institucionNombre?: string;
  institucion_nombre?: string;
}

const PAGOS_INICIALES: PagoRegistro[] = [
  {
    id: 'pag-101',
    boleta: 'B001-00482',
    estudiante: 'Valentina Sosa Ortiz',
    codigo: '20241089',
    concepto: 'Pensión Ciclo 2026-II · Cuota 3',
    carrera: 'Computación e Informática',
    monto: 480.0,
    fecha: '23 Nov 2026',
    medio: 'Transferencia',
    estado: 'Pagado'
  },
  {
    id: 'pag-102',
    boleta: 'B001-00483',
    estudiante: 'Lucas Romero Quispe',
    codigo: '20241104',
    concepto: 'Pensión Ciclo 2026-II · Cuota 3',
    carrera: 'Administración de Empresas',
    monto: 450.0,
    fecha: '22 Nov 2026',
    medio: 'Caja Presencial',
    estado: 'Pagado'
  },
  {
    id: 'pag-103',
    boleta: 'B001-00484',
    estudiante: 'Elena Díaz Vargas',
    codigo: '20241152',
    concepto: 'Derecho de Constancia y Trámite FUT',
    carrera: 'Computación e Informática',
    monto: 35.0,
    fecha: '21 Nov 2026',
    medio: 'Billetera Digital',
    estado: 'Pagado'
  },
  {
    id: 'pag-104',
    boleta: 'B001-00485',
    estudiante: 'Carlos Ruiz Dávila',
    codigo: '20241219',
    concepto: 'Pensión Ciclo 2026-II · Cuota 3',
    carrera: 'Electrotecnia Industrial',
    monto: 450.0,
    fecha: '18 Nov 2026',
    medio: 'Caja Presencial',
    estado: 'Pendiente'
  },
  {
    id: 'pag-105',
    boleta: 'B001-00486',
    estudiante: 'Sofía Morales Benítez',
    codigo: '20241288',
    concepto: 'Pensión Ciclo 2026-II · Cuota 2',
    carrera: 'Administración de Empresas',
    monto: 450.0,
    fecha: '05 Nov 2026',
    medio: 'Transferencia',
    estado: 'Vencido'
  }
];

const NAV_ITEMS: { id: TesoreriaSection; label: string; icon: typeof Wallet }[] = [
  { id: 'caja', label: 'Resumen de Caja', icon: Wallet },
  { id: 'pensiones', label: 'Pensiones y Cuotas', icon: Users },
  { id: 'comprobantes', label: 'Boletas y Cobros', icon: Receipt },
  { id: 'reportes', label: 'Cierre y Reportes', icon: FileSpreadsheet }
];

export default function TesoreriaPanel() {
  const [boletasCobros, setBoletasCobros] = useState<BoletaCobroItem[]>([
    {
      id: 'bol-1',
      numeroComprobante: 'FOT-2026-091',
      origen: 'Alumno (Foto)',
      entidadOAlumno: 'Valentina Sosa Ortiz',
      codigoReferencia: '20241089',
      concepto: 'Pensión Ciclo 2026-II · Cuota 3',
      monto: 480.0,
      fecha: '23 Nov 2026',
      estado: 'Pendiente',
      fotoUrl: null,
      detalleEntidad: 'Foto enviada desde portal del alumno'
    },
    {
      id: 'bol-2',
      numeroComprobante: 'ENT-2026-304',
      origen: 'Otra Entidad',
      entidadOAlumno: 'Convenio Banco / Pasarela Interbancaria',
      codigoReferencia: 'OP-884120',
      concepto: 'Recaudación masiva de matrícula y pensiones',
      monto: 1350.0,
      fecha: '22 Nov 2026',
      estado: 'Pendiente',
      fotoUrl: null,
      detalleEntidad: 'Canal Interbancario / Entidad Externa'
    }
  ]);

  const handleValidarBoleta = (id: string) => {
    setBoletasCobros((prev) =>
      prev.map((item) => (item.id === id ? { ...item, estado: 'Validado' } : item))
    );
    setAviso('Comprobante o cobro validado en tesorería.');
  };

  const handleObservarBoleta = (id: string) => {
    setBoletasCobros((prev) =>
      prev.map((item) => (item.id === id ? { ...item, estado: 'Observado' } : item))
    );
    setAviso('Registro marcado como observado para revisión.');
  };

  const handleAdjuntarFotoBoleta = (id: string, file: File) => {
    const url = URL.createObjectURL(file);
    setBoletasCobros((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, fotoUrl: url, nombreArchivo: file.name } : item
      )
    );
    setAviso(`Comprobante "${file.name}" cargado para inspección.`);
  };
  const [activeSection, setActiveSection] = useState<TesoreriaSection>('caja');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [pagos, setPagos] = useState<PagoRegistro[]>([]);
  const [busqueda, setBusqueda] = useState<string>('');
  const [filtroEstado, setFiltroEstado] = useState<'Todos' | PagoRegistro['estado']>('Todos');
  const [aviso, setAviso] = useState<string>('');

  // Formulario rápido para registrar abono en caja
  const [alumnoNombre, setAlumnoNombre] = useState<string>('');
  const [alumnoCodigo, setAlumnoCodigo] = useState<string>('');
  const [conceptoPago, setConceptoPago] = useState<string>('Pensión Ciclo 2026-II · Cuota 3');
  const [montoPago, setMontoPago] = useState<string>('480');
  const [medioPago, setMedioPago] = useState<PagoRegistro['medio']>('Caja Presencial');

  let usuario: UsuarioTesoreria = {};
  try {
    const raw = localStorage.getItem('usuarioLogueado');
    if (raw) {
      usuario = JSON.parse(raw) as UsuarioTesoreria;
    }
  } catch {
    usuario = {};
  }

  const nombreResponsable =
    usuario.nombres && usuario.apellidos
      ? `${usuario.nombres} ${usuario.apellidos}`
      : 'Responsable de Tesorería';
  const correoResponsable = usuario.email || 'tesoreria@institucion.edu.pe';
  const institucionNombre =
    usuario.institucionNombre || usuario.institucion_nombre || 'Institución Educativa';
  const iniciales = usuario.nombres ? usuario.nombres.charAt(0).toUpperCase() : 'T';

  useEffect(() => {
    try {
      const guardados = localStorage.getItem('ua_tesoreria_pagos');
      if (guardados) {
        const parsed = JSON.parse(guardados) as PagoRegistro[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPagos(parsed);
          return;
        }
      }
    } catch {
      // Usar catálogo base si no hay datos previos
    }
    setPagos(PAGOS_INICIALES);
  }, []);

  const guardarPagos = (lista: PagoRegistro[]) => {
    setPagos(lista);
    try {
      localStorage.setItem('ua_tesoreria_pagos', JSON.stringify(lista));
    } catch {
      // Ignorar errores de cuota local
    }
  };

  const metricas = useMemo(() => {
    const recaudado = pagos
      .filter((p) => p.estado === 'Pagado')
      .reduce((acc, p) => acc + p.monto, 0);
    const porCobrar = pagos
      .filter((p) => p.estado !== 'Pagado')
      .reduce((acc, p) => acc + p.monto, 0);
    const cantidadPagados = pagos.filter((p) => p.estado === 'Pagado').length;
    const tasaCobro = pagos.length > 0 ? Math.round((cantidadPagados / pagos.length) * 100) : 0;

    return { recaudado, porCobrar, tasaCobro };
  }, [pagos]);

  const pagosFiltrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return pagos.filter((p) => {
      const cumpleEstado = filtroEstado === 'Todos' || p.estado === filtroEstado;
      const cumpleTexto =
        !q ||
        p.estudiante.toLowerCase().includes(q) ||
        p.codigo.toLowerCase().includes(q) ||
        p.boleta.toLowerCase().includes(q) ||
        p.concepto.toLowerCase().includes(q);
      return cumpleEstado && cumpleTexto;
    });
  }, [pagos, busqueda, filtroEstado]);

  const handleRegistrarAbono = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const limpioNombre = alumnoNombre.trim();
    const limpioCodigo = alumnoCodigo.trim();
    const valorMonto = Number(montoPago);

    if (!limpioNombre || !limpioCodigo || Number.isNaN(valorMonto) || valorMonto <= 0) {
      setAviso('Completa el nombre, código del alumno y un monto válido mayor a 0.');
      return;
    }

    const correlativo = String(487 + pagos.length).padStart(5, '0');
    const nuevo: PagoRegistro = {
      id: `pag-${Date.now()}`,
      boleta: `B001-${correlativo}`,
      estudiante: limpioNombre,
      codigo: limpioCodigo,
      concepto: conceptoPago,
      carrera: 'Programa Regular',
      monto: valorMonto,
      fecha: '23 Nov 2026',
      medio: medioPago,
      estado: 'Pagado'
    };

    guardarPagos([nuevo, ...pagos]);
    setAlumnoNombre('');
    setAlumnoCodigo('');
    setAviso(`Comprobante ${nuevo.boleta} registrado por S/ ${valorMonto.toFixed(2)}.`);
  };

  const handleMarcarPagado = (id: string) => {
    const actualizada = pagos.map((p) =>
      p.id === id ? { ...p, estado: 'Pagado' as const, fecha: '23 Nov 2026' } : p
    );
    guardarPagos(actualizada);
    setAviso('Pago confirmado y actualizado en caja.');
  };

  const handleCerrarSesion = () => {
    try {
      localStorage.removeItem('usuarioLogueado');
    } catch {
      // Ignorar errores de almacenamiento
    }
    setAviso('Sesión de tesorería finalizada.');
  };

  return (
    <div className="tes-shell">
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="tes-backdrop"
          aria-hidden="true"
        />
      )}

      {/* Barra lateral */}
      <aside className={`tes-sidebar ${mobileMenuOpen ? 'tes-sidebar-open' : ''}`}>
        <div className="tes-brand">
          <div className="tes-brand-left">
            <div className="tes-brand-badge">
              <Wallet className="tes-icon-md" />
            </div>
            <div className="tes-brand-copy">
              <span className="tes-brand-name">Progresa</span>
              <span className="tes-brand-role">Tesorería y Caja</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="tes-close-btn"
            aria-label="Cerrar menú"
          >
            <X className="tes-icon-md" />
          </button>
        </div>

        <div className="tes-user-box">
          <div className="tes-user-avatar">{iniciales}</div>
          <div className="tes-user-meta">
            <p className="tes-user-name">{nombreResponsable}</p>
            <p className="tes-user-email">{correoResponsable}</p>
          </div>
        </div>

        <div className="tes-nav-label">Módulos Financieros</div>

        <nav className="tes-nav" aria-label="Navegación de tesorería">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = activeSection === item.id;
            return (
              <button
                type="button"
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setMobileMenuOpen(false);
                  setAviso('');
                }}
                className={`tes-nav-btn ${active ? 'tes-nav-active' : ''}`}
              >
                <Icon
                  className={`tes-icon-sm ${active ? 'tes-text-sky' : 'tes-ico-muted'}`}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="tes-sidebar-foot">
          <button
            type="button"
            onClick={handleCerrarSesion}
            className="tes-logout-btn"
          >
            <LogOut className="tes-icon-sm" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Contenedor principal */}
      <div className="tes-main-col">
        <header className="tes-topbar">
          <div className="tes-topbar-left">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="tes-menu-btn"
              aria-label="Abrir menú"
            >
              <Menu className="tes-icon-md" />
            </button>
            <div>
              <h1 className="tes-topbar-title">Gestión de Tesorería y Recaudación</h1>
              <p className="tes-topbar-sub">
                <Building2 className="tes-icon-xs tes-text-sky" />
                <span>{institucionNombre}</span>
              </p>
            </div>
          </div>

          <div className="tes-status-pill">
            <span className="tes-status-dot" aria-hidden="true" />
            <span>Caja Operativa · Ciclo 2026-II</span>
          </div>
        </header>

        <main className="tes-content">
          {aviso && <div className="tes-notice">{aviso}</div>}

          {/* KPIs superiores */}
          <div className="tes-kpi-grid">
            <div className="tes-card tes-kpi-card">
              <div className="tes-kpi-top">
                <span>Recaudación Registrada</span>
                <CheckCircle2 className="tes-icon-sm tes-text-emerald" />
              </div>
              <div className="tes-kpi-val">S/ {metricas.recaudado.toFixed(2)}</div>
              <p className="tes-kpi-foot">Comprobantes abonados en el periodo</p>
            </div>

            <div className="tes-card tes-kpi-card">
              <div className="tes-kpi-top">
                <span>Saldo Pendiente / Vencido</span>
                <Clock className="tes-icon-sm tes-text-amber" />
              </div>
              <div className="tes-kpi-val">S/ {metricas.porCobrar.toFixed(2)}</div>
              <p className="tes-kpi-foot">Cuotas por regularizar en ventanilla</p>
            </div>

            <div className="tes-card tes-kpi-card">
              <div className="tes-kpi-top">
                <span>Cumplimiento de Caja</span>
                <Wallet className="tes-icon-sm tes-text-sky" />
              </div>
              <div className="tes-kpi-val">{metricas.tasaCobro}%</div>
              <p className="tes-kpi-foot">Proporción de órdenes liquidadas</p>
            </div>
          </div>

          {activeSection === 'caja' && (
            <div className="tes-split-grid">
              <section className="tes-card tes-panel-pad tes-span-2">
                <div className="tes-panel-head">
                  <div>
                    <h2 className="tes-panel-title">Movimientos Recientes de Caja</h2>
                    <p className="tes-panel-sub">
                      Control de boletas, pensiones y pagos por derecho de trámite
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveSection('pensiones')}
                    className="tes-btn-secondary"
                  >
                    Ver Todas las Cuotas
                  </button>
                </div>

                <div className="tes-table-wrap">
                  <table className="tes-table">
                    <thead>
                      <tr>
                        <th>Boleta</th>
                        <th>Estudiante</th>
                        <th>Concepto</th>
                        <th>Monto</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pagos.slice(0, 5).map((pago) => (
                        <tr key={pago.id}>
                          <td className="tes-td-mono">{pago.boleta}</td>
                          <td>
                            <div className="tes-td-strong">{pago.estudiante}</div>
                            <div className="tes-td-sub">Cód. {pago.codigo}</div>
                          </td>
                          <td className="tes-td-muted">{pago.concepto}</td>
                          <td className="tes-td-strong">S/ {pago.monto.toFixed(2)}</td>
                          <td>
                            <span
                              className={`tes-badge ${
                                pago.estado === 'Pagado'
                                  ? 'tes-badge-ok'
                                  : pago.estado === 'Pendiente'
                                  ? 'tes-badge-warn'
                                  : 'tes-badge-bad'
                              }`}
                            >
                              {pago.estado}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <aside className="tes-card tes-panel-pad tes-span-1">
                <div className="tes-panel-head">
                  <div>
                    <h2 className="tes-panel-title">Registrar Abono en Caja</h2>
                    <p className="tes-panel-sub">Emisión inmediata de comprobante</p>
                  </div>
                </div>

                <form onSubmit={handleRegistrarAbono} className="tes-form">
                  <div className="tes-field">
                    <label htmlFor="tes-alumno">Apellidos y Nombres</label>
                    <input
                      id="tes-alumno"
                      type="text"
                      value={alumnoNombre}
                      onChange={(e) => setAlumnoNombre(e.target.value)}
                      placeholder="Ej. Diego Quispe Flores"
                      className="tes-input"
                    />
                  </div>

                  <div className="tes-field">
                    <label htmlFor="tes-codigo">Código o DNI</label>
                    <input
                      id="tes-codigo"
                      type="text"
                      value={alumnoCodigo}
                      onChange={(e) => setAlumnoCodigo(e.target.value)}
                      placeholder="Ej. 20241390"
                      className="tes-input"
                    />
                  </div>

                  <div className="tes-field">
                    <label htmlFor="tes-concepto">Concepto de Pago</label>
                    <select
                      id="tes-concepto"
                      value={conceptoPago}
                      onChange={(e) => setConceptoPago(e.target.value)}
                      className="tes-input"
                    >
                      <option value="Pensión Ciclo 2026-II · Cuota 3">
                        Pensión Ciclo 2026-II · Cuota 3
                      </option>
                      <option value="Matrícula Regular 2026-II">
                        Matrícula Regular 2026-II
                      </option>
                      <option value="Derecho de Constancia y Trámite FUT">
                        Derecho de Constancia y Trámite FUT
                      </option>
                    </select>
                  </div>

                  <div className="tes-form-row">
                    <div className="tes-field">
                      <label htmlFor="tes-monto">Monto (S/)</label>
                      <input
                        id="tes-monto"
                        type="number"
                        min="1"
                        step="0.5"
                        value={montoPago}
                        onChange={(e) => setMontoPago(e.target.value)}
                        className="tes-input"
                      />
                    </div>

                    <div className="tes-field">
                      <label htmlFor="tes-medio">Medio</label>
                      <select
                        id="tes-medio"
                        value={medioPago}
                        onChange={(e) =>
                          setMedioPago(e.target.value as PagoRegistro['medio'])
                        }
                        className="tes-input"
                      >
                        <option value="Caja Presencial">Caja Presencial</option>
                        <option value="Transferencia">Transferencia</option>
                        <option value="Billetera Digital">Billetera Digital</option>
                      </select>
                    </div>
                  </div>

                  <button type="submit" className="tes-btn-primary">
                    <PlusCircle className="tes-icon-xs" />
                    <span>Registrar Cobro</span>
                  </button>
                </form>
              </aside>
            </div>
          )}

          {activeSection === 'pensiones' && (
            <section className="tes-card tes-panel-pad">
              <div className="tes-panel-head">
                <div>
                  <h2 className="tes-panel-title">Control de Pensiones y Cuotas</h2>
                  <p className="tes-panel-sub">
                    Filtra por estado o busca por apellido, código o número de boleta
                  </p>
                </div>

                <div className="tes-filters-row">
                  <div className="tes-filter-group">
                    {(['Todos', 'Pagado', 'Pendiente', 'Vencido'] as const).map((est) => (
                      <button
                        type="button"
                        key={est}
                        onClick={() => setFiltroEstado(est)}
                        className={`tes-chip-btn ${
                          filtroEstado === est ? 'tes-chip-active' : ''
                        }`}
                      >
                        {est}
                      </button>
                    ))}
                  </div>

                  <div className="tes-search-box">
                    <Search className="tes-search-icon" />
                    <input
                      type="text"
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                      placeholder="Buscar alumno o boleta..."
                      className="tes-search-input"
                    />
                  </div>
                </div>
              </div>

              <div className="tes-table-wrap">
                <table className="tes-table">
                  <thead>
                    <tr>
                      <th>Boleta</th>
                      <th>Estudiante</th>
                      <th>Concepto</th>
                      <th>Medio / Fecha</th>
                      <th>Monto</th>
                      <th>Estado</th>
                      <th>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagosFiltrados.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="tes-td-empty">
                          No hay registros que coincidan con el filtro.
                        </td>
                      </tr>
                    ) : (
                      pagosFiltrados.map((pago) => (
                        <tr key={pago.id}>
                          <td className="tes-td-mono">{pago.boleta}</td>
                          <td>
                            <div className="tes-td-strong">{pago.estudiante}</div>
                            <div className="tes-td-sub">
                              {pago.codigo} · {pago.carrera}
                            </div>
                          </td>
                          <td className="tes-td-muted">{pago.concepto}</td>
                          <td className="tes-td-sub">
                            <div>{pago.medio}</div>
                            <div>{pago.fecha}</div>
                          </td>
                          <td className="tes-td-strong">S/ {pago.monto.toFixed(2)}</td>
                          <td>
                            <span
                              className={`tes-badge ${
                                pago.estado === 'Pagado'
                                  ? 'tes-badge-ok'
                                  : pago.estado === 'Pendiente'
                                  ? 'tes-badge-warn'
                                  : 'tes-badge-bad'
                              }`}
                            >
                              {pago.estado}
                            </span>
                          </td>
                          <td>
                            {pago.estado !== 'Pagado' ? (
                              <button
                                type="button"
                                onClick={() => handleMarcarPagado(pago.id)}
                                className="tes-btn-confirm"
                              >
                                Confirmar Pago
                              </button>
                            ) : (
                              <span className="tes-td-sub">Liquidado</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {activeSection === 'comprobantes' && (
            <BoletasCobrosPanel
              registros={boletasCobros}
              onValidar={handleValidarBoleta}
              onObservar={handleObservarBoleta}
              onAdjuntarFoto={handleAdjuntarFotoBoleta}
            />
          )}

          {activeSection === 'reportes' && (
            <section className="tes-card tes-panel-pad">
              <div className="tes-panel-head">
                <div>
                  <h2 className="tes-panel-title">Cierre Diario y Reportes de Caja</h2>
                  <p className="tes-panel-sub">
                    Consolidado financiero del turno actual en {institucionNombre}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setAviso('Resumen de cierre diario generado para revisión de dirección.')
                  }
                  className="tes-btn-primary"
                >
                  <Download className="tes-icon-xs" />
                  <span>Generar Cierre de Turno</span>
                </button>
              </div>

              <div className="tes-report-grid">
                <div className="tes-report-box">
                  <span className="tes-report-kicker">Caja Presencial</span>
                  <strong className="tes-report-num">
                    S/{' '}
                    {pagos
                      .filter((p) => p.estado === 'Pagado' && p.medio === 'Caja Presencial')
                      .reduce((acc, p) => acc + p.monto, 0)
                      .toFixed(2)}
                  </strong>
                  <span className="tes-td-sub">Efectivo y POS en ventanilla</span>
                </div>

                <div className="tes-report-box">
                  <span className="tes-report-kicker">Transferencias Bancarias</span>
                  <strong className="tes-report-num">
                    S/{' '}
                    {pagos
                      .filter((p) => p.estado === 'Pagado' && p.medio === 'Transferencia')
                      .reduce((acc, p) => acc + p.monto, 0)
                      .toFixed(2)}
                  </strong>
                  <span className="tes-td-sub">Abonos en cuenta institucional</span>
                </div>

                <div className="tes-report-box">
                  <span className="tes-report-kicker">Billeteras Digitales</span>
                  <strong className="tes-report-num">
                    S/{' '}
                    {pagos
                      .filter(
                        (p) => p.estado === 'Pagado' && p.medio === 'Billetera Digital'
                      )
                      .reduce((acc, p) => acc + p.monto, 0)
                      .toFixed(2)}
                  </strong>
                  <span className="tes-td-sub">Pagos móviles validados</span>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}