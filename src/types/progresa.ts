export type RolUsuario =
  | 'alumno'
  | 'docente'
  | 'director'
  | 'tesoreria'
  | 'tesorero';

export interface UsuarioSesion {
  id: number;
  institucion_id?: number | null;
  codigo: string;
  nombres: string;
  apellidos: string;
  email?: string | null;
  rol: RolUsuario;
  especialidad?: string | null;
  activo?: boolean;
}

export interface EstudianteDB {
  id: number;
  institucion_id?: number | null;
  usuario_id?: number | null;
  codigo: string;
  dni?: string;
  nombres: string;
  apellidos: string;
  gmail?: string;
  carrera: string;
  carrera_tecnica?: string;
  ciclo: string;
  grupo: string;
  estado: string;
}

export interface DocenteDB {
  id: number;
  institucion_id?: number | null;
  usuario_id?: number | null;
  codigo: string;
  nombres: string;
  apellidos: string;
  especialidad: string;
  estado: string;
}

export interface CursoSilaboDB {
  id: number;
  institucion_id?: number | null;
  docente_id?: number | null;
  codigo: string;
  nombre: string;
  grupo: string;
  periodo: string;
  creditos: number;
  silabo_titulo: string | null;
  silabo_nombre_archivo: string | null;
  silabo_storage_path: string | null;
  silabo_url: string | null;
  silabo_tamano_bytes: number | null;
  silabo_subido_en: string | null;
}

export interface HorarioDB {
  id: number;
  curso_id: number;
  docente_id?: number | null;
  dia_semana: string;
  hora_inicio: string;
  hora_fin: string;
  aula: string;
  modalidad: string;
  grupo: string;
}

export interface AsistenciaDB {
  id: number;
  curso_id: number;
  estudiante_id: number;
  fecha: string;
  estado: 'Presente' | 'Tardanza' | 'Falta' | 'Justificado';
  observacion: string | null;
}

export interface CalificacionDB {
  id: number;
  curso_id: number;
  estudiante_id: number;
  evaluacion: string;
  nota: number;
  peso: number;
  registrado_en: string;
}

export interface FutDB {
  id: number;
  institucion_id?: number | null;
  estudiante_id?: number | null;
  nombres_apellidos: string;
  codigo_estudiante: string | null;
  sumilla: string;
  fundamento: string;
  adjunto_nombre: string | null;
  adjunto_url: string | null;
  estado: 'Pendiente' | 'Aprobado' | 'Observado' | 'Rechazado';
  observacion_direccion: string | null;
  fecha_solicitud: string;
  resuelto_en: string | null;
}

export interface PensionCuotaDB {
  id: number;
  institucion_id?: number | null;
  estudiante_id?: number | null;
  boleta: string;
  estudiante_nombre: string;
  codigo_estudiante: string;
  carrera: string;
  concepto: string;
  medio: 'Caja Presencial' | 'Transferencia' | 'Billetera Digital' | 'Otra Entidad';
  monto: number;
  estado: 'Pagado' | 'Pendiente' | 'Vencido';
  fecha_pago: string;
  confirmado_en: string | null;
}

export interface BoletaCobroDB {
  id: number;
  institucion_id?: number | null;
  estudiante_id?: number | null;
  numero_comprobante: string;
  origen: 'Alumno (Foto)' | 'Otra Entidad';
  entidad_o_alumno: string;
  codigo_referencia: string;
  concepto: string;
  detalle_entidad: string | null;
  monto: number;
  fecha_registro: string;
  estado: 'Pendiente' | 'Validado' | 'Observado';
  foto_nombre_archivo: string | null;
  foto_storage_path: string | null;
  foto_url: string | null;
  foto_mime_type: string | null;
  validado_en: string | null;
}