import React, { useEffect, useState } from 'react';
import {
  obtenerCursosConSilabo,
  obtenerDocentes,
  obtenerEstudiantes,
  obtenerFuts,
  resolverFutDireccion,
} from '../../lib/progresaApi';
import type {
  CursoSilaboDB,
  DocenteDB,
  EstudianteDB,
  FutDB,
  UsuarioSesion,
} from '../../types/progresa';
import './Dirección.css';

interface DireccionProps {
  usuario?: UsuarioSesion | null;
  onLogout?: () => void;
}

export const Direccion: React.FC<DireccionProps> = ({ usuario, onLogout }) => {
  const [futs, setFuts] = useState<FutDB[]>([]);
  const [estudiantes, setEstudiantes] = useState<EstudianteDB[]>([]);
  const [docentes, setDocentes] = useState<DocenteDB[]>([]);
  const [cursos, setCursos] = useState<CursoSilaboDB[]>([]);
  const [observaciones, setObservaciones] = useState<Record<number, string>>({});
  const [cargando, setCargando] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [mensajeOk, setMensajeOk] = useState<string | null>(null);

  const cargarDatosDireccion = async () => {
    setCargando(true);
    setErrorMsg(null);
    try {
      const [futsData, estData, docData, curData] = await Promise.all([
        obtenerFuts(),
        obtenerEstudiantes(),
        obtenerDocentes(),
        obtenerCursosConSilabo(),
      ]);
      setFuts(futsData);
      setEstudiantes(estData);
      setDocentes(docData);
      setCursos(curData);

      const obsMap: Record<number, string> = {};
      for (const item of futsData) {
        obsMap[item.id] = item.observacion_direccion ?? '';
      }
      setObservaciones(obsMap);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Error cargando datos de Dirección.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatosDireccion();
  }, []);

  const handleResolverFut = async (
    id: number,
    estado: 'Pendiente' | 'Aprobado' | 'Observado' | 'Rechazado'
  ) => {
    setErrorMsg(null);
    setMensajeOk(null);
    try {
      const actualizado = await resolverFutDireccion({
        id,
        estado,
        observacionDireccion: observaciones[id] ?? '',
      });
      setFuts((prev) => prev.map((f) => (f.id === id ? actualizado : f)));
      setMensajeOk(`FUT #${id} actualizado a ${estado}.`);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Error al resolver el FUT.');
    }
  };

  return (
    <div className="direccion-container" style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1>Módulo de Dirección</h1>
          <p>
            {usuario
              ? `${usuario.nombres} ${usuario.apellidos} (${usuario.codigo})`
              : 'Gestión institucional y validación de FUTs'}
          </p>
        </div>
        {onLogout && (
          <button type="button" onClick={onLogout}>
            Cerrar sesión
          </button>
        )}
      </div>

      {cargando && <p>Cargando FUTs y registros institucionales desde Supabase...</p>}
      {errorMsg && <div style={{ color: '#b91c1c', marginBottom: 12 }}>{errorMsg}</div>}
      {mensajeOk && <div style={{ color: '#15803d', marginBottom: 12 }}>{mensajeOk}</div>}

      <section style={{ marginBottom: 24 }}>
        <h2>Resumen Institucional</h2>
        <p>
          Estudiantes: <strong>{estudiantes.length}</strong> · Docentes: <strong>{docentes.length}</strong> · Cursos:{' '}
          <strong>{cursos.length}</strong> · FUTs: <strong>{futs.length}</strong>
        </p>
      </section>

      <section>
        <h2>Solicitudes FUT ({futs.length})</h2>
        <ul>
          {futs.map((fut) => (
            <li key={fut.id} style={{ marginBottom: 14, paddingBottom: 10, borderBottom: '1px solid #e5e7eb' }}>
              <div>
                <strong>FUT #{fut.id}</strong> · {fut.nombres_apellidos}{' '}
                {fut.codigo_estudiante ? `(${fut.codigo_estudiante})` : ''} —{' '}
                <strong>Estado: {fut.estado}</strong>
              </div>
              <div>
                <strong>Sumilla:</strong> {fut.sumilla}
              </div>
              <div>
                <strong>Fundamento:</strong> {fut.fundamento}
              </div>
              {fut.adjunto_nombre && (
                <div>
                  <strong>Adjunto:</strong> {fut.adjunto_nombre}
                </div>
              )}
              <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Observación de dirección..."
                  value={observaciones[fut.id] ?? ''}
                  onChange={(e) =>
                    setObservaciones((prev) => ({ ...prev, [fut.id]: e.target.value }))
                  }
                  style={{ minWidth: 260, padding: 6 }}
                />
                <button type="button" onClick={() => handleResolverFut(fut.id, 'Aprobado')}>
                  Aprobar
                </button>
                <button type="button" onClick={() => handleResolverFut(fut.id, 'Observado')}>
                  Observar
                </button>
                <button type="button" onClick={() => handleResolverFut(fut.id, 'Rechazado')}>
                  Rechazar
                </button>
                <button type="button" onClick={() => handleResolverFut(fut.id, 'Pendiente')}>
                  Pendiente
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default Direccion;