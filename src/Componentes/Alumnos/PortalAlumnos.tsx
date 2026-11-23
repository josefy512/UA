import React, { useEffect, useState } from 'react';
import {
  crearFutAlumno,
  obtenerAsistencias,
  obtenerCalificaciones,
  obtenerCursosConSilabo,
  obtenerEstudiantes,
  obtenerFuts,
  obtenerHorarios,
  obtenerPensionesCuotas,
} from '../../lib/progresaApi';
import type {
  AsistenciaDB,
  CalificacionDB,
  CursoSilaboDB,
  EstudianteDB,
  FutDB,
  HorarioDB,
  PensionCuotaDB,
  UsuarioSesion,
} from '../../types/progresa';

interface PortalAlumnosProps {
  usuario?: UsuarioSesion | null;
  onLogout?: () => void;
}

export const PortalAlumnos: React.FC<PortalAlumnosProps> = ({ usuario, onLogout }) => {
  const [cursos, setCursos] = useState<CursoSilaboDB[]>([]);
  const [horarios, setHorarios] = useState<HorarioDB[]>([]);
  const [calificaciones, setCalificaciones] = useState<CalificacionDB[]>([]);
  const [asistencias, setAsistencias] = useState<AsistenciaDB[]>([]);
  const [pensiones, setPensiones] = useState<PensionCuotaDB[]>([]);
  const [futs, setFuts] = useState<FutDB[]>([]);
  const [estudiantePerfil, setEstudiantePerfil] = useState<EstudianteDB | null>(null);

  const [sumillaFut, setSumillaFut] = useState('');
  const [fundamentoFut, setFundamentoFut] = useState('');
  const [adjuntoFut, setAdjuntoFut] = useState('');
  const [enviandoFut, setEnviandoFut] = useState(false);

  const [cargando, setCargando] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [mensajeOk, setMensajeOk] = useState<string | null>(null);

  const cargarDatosAlumno = async () => {
    setCargando(true);
    setErrorMsg(null);
    try {
      const [
        cursosData,
        horariosData,
        notasData,
        asistData,
        pensionesData,
        futsData,
        estudiantesData,
      ] = await Promise.all([
        obtenerCursosConSilabo(),
        obtenerHorarios(),
        obtenerCalificaciones(),
        obtenerAsistencias(),
        obtenerPensionesCuotas(),
        obtenerFuts(),
        obtenerEstudiantes(),
      ]);

      setCursos(cursosData);
      setHorarios(horariosData);
      setPensiones(pensionesData);

      const encontrado =
        estudiantesData.find(
          (e) =>
            (usuario?.codigo && e.codigo === usuario.codigo) ||
            (usuario?.email && e.gmail?.toLowerCase() === usuario.email.toLowerCase())
        ) ?? estudiantesData[0] ?? null;

      setEstudiantePerfil(encontrado);

      if (encontrado) {
        setCalificaciones(notasData.filter((n) => n.estudiante_id === encontrado.id));
        setAsistencias(asistData.filter((a) => a.estudiante_id === encontrado.id));
        setFuts(
          futsData.filter(
            (f) => f.estudiante_id === encontrado.id || f.codigo_estudiante === encontrado.codigo
          )
        );
      } else {
        setCalificaciones(notasData);
        setAsistencias(asistData);
        setFuts(futsData);
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Error cargando datos del alumno.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatosAlumno();
  }, [usuario?.codigo]);

  const handleCrearFut = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setMensajeOk(null);

    if (!sumillaFut.trim() || !fundamentoFut.trim()) {
      setErrorMsg('Completa la sumilla y el fundamento del FUT.');
      return;
    }

    const nombreCompleto =
      usuario ? `${usuario.nombres} ${usuario.apellidos}`.trim() : 'Alumno Progresa';
    const codigoEst = estudiantePerfil?.codigo ?? usuario?.codigo ?? null;

    setEnviandoFut(true);
    try {
      const creado = await crearFutAlumno({
        institucionId: usuario?.institucion_id ?? estudiantePerfil?.institucion_id ?? null,
        estudianteId: estudiantePerfil?.id ?? null,
        nombresApellidos: nombreCompleto,
        codigoEstudiante: codigoEst,
        sumilla: sumillaFut,
        fundamento: fundamentoFut,
        adjuntoNombre: adjuntoFut || null,
      });

      setFuts((prev) => [creado, ...prev]);
      setSumillaFut('');
      setFundamentoFut('');
      setAdjuntoFut('');
      setMensajeOk(`FUT #${creado.id} enviado y registrado en estado Pendiente.`);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Error al enviar el FUT.');
    } finally {
      setEnviandoFut(false);
    }
  };

  const nombreCursoPorId = (cursoId: number) => {
    const c = cursos.find((item) => item.id === cursoId);
    return c ? `${c.codigo} · ${c.nombre}` : `Curso #${cursoId}`;
  };

  return (
    <div className="portal-alumnos" style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1>Portal del Alumno</h1>
          <p>
            {usuario
              ? `${usuario.nombres} ${usuario.apellidos} · Código: ${usuario.codigo}`
              : 'Información académica, pagos y trámites FUT'}
            {estudiantePerfil ? ` · ${estudiantePerfil.carrera} (${estudiantePerfil.grupo})` : ''}
          </p>
        </div>
        {onLogout && (
          <button type="button" onClick={onLogout}>
            Cerrar sesión
          </button>
        )}
      </div>

      {cargando && <p>Cargando información académica desde Supabase...</p>}
      {errorMsg && <div style={{ color: '#b91c1c', marginBottom: 12 }}>{errorMsg}</div>}
      {mensajeOk && <div style={{ color: '#15803d', marginBottom: 12 }}>{mensajeOk}</div>}

      <section style={{ marginBottom: 24 }}>
        <h2>Cursos y Sílabos ({cursos.length})</h2>
        <ul>
          {cursos.map((c) => (
            <li key={c.id}>
              <strong>{c.codigo}</strong> · {c.nombre} ({c.grupo}) —{' '}
              {c.silabo_url ? (
                <a href={c.silabo_url} target="_blank" rel="noreferrer">
                  Descargar Sílabo PDF ({c.silabo_nombre_archivo || 'PDF'})
                </a>
              ) : (
                <span>{c.silabo_nombre_archivo || 'Sílabo pendiente'}</span>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2>Horarios ({horarios.length})</h2>
        <ul>
          {horarios.map((h) => (
            <li key={h.id}>
              {h.dia_semana} · {h.hora_inicio} - {h.hora_fin} · {h.aula} ({h.grupo})
            </li>
          ))}
        </ul>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2>Calificaciones ({calificaciones.length})</h2>
        <ul>
          {calificaciones.map((n) => (
            <li key={n.id}>
              {nombreCursoPorId(n.curso_id)} — {n.evaluacion}: <strong>{Number(n.nota).toFixed(2)}</strong>
            </li>
          ))}
        </ul>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2>Asistencias ({asistencias.length})</h2>
        <ul>
          {asistencias.map((a) => (
            <li key={a.id}>
              {a.fecha} · {nombreCursoPorId(a.curso_id)} — <strong>{a.estado}</strong>
              {a.observacion ? ` (${a.observacion})` : ''}
            </li>
          ))}
        </ul>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2>Pensiones y Cuotas ({pensiones.length})</h2>
        <ul>
          {pensiones.map((p) => (
            <li key={p.id}>
              {p.boleta} — {p.estudiante_nombre} · {p.concepto} · <strong>S/ {Number(p.monto).toFixed(2)}</strong> · {p.estado}
            </li>
          ))}
        </ul>
      </section>

      <section style={{ marginBottom: 24, padding: 16, border: '1px solid #e5e7eb', borderRadius: 8 }}>
        <h2>Solicitar Nuevo FUT</h2>
        <form onSubmit={handleCrearFut} style={{ display: 'grid', gap: 10, maxWidth: 520 }}>
          <input
            type="text"
            placeholder="Sumilla del trámite (Ej: Constancia de estudios)"
            value={sumillaFut}
            onChange={(e) => setSumillaFut(e.target.value)}
          />
          <textarea
            rows={3}
            placeholder="Fundamento o sustento de la solicitud..."
            value={fundamentoFut}
            onChange={(e) => setFundamentoFut(e.target.value)}
          />
          <input
            type="text"
            placeholder="Nombre de archivo adjunto (opcional)"
            value={adjuntoFut}
            onChange={(e) => setAdjuntoFut(e.target.value)}
          />
          <button type="submit" disabled={enviandoFut} style={{ width: 'fit-content', padding: '8px 14px' }}>
            {enviandoFut ? 'Enviando FUT...' : 'Enviar FUT'}
          </button>
        </form>
      </section>

      <section>
        <h2>Mis FUTs ({futs.length})</h2>
        <ul>
          {futs.map((f) => (
            <li key={f.id}>
              <strong>FUT #{f.id}</strong> · {f.sumilla} — <strong>{f.estado}</strong>
              {f.observacion_direccion ? ` · Obs: ${f.observacion_direccion}` : ''}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default PortalAlumnos;