# Portal Institucional Progresa

Aplicación web hecha con **React**, **TypeScript** y **Supabase** para gestionar el día a día académico, administrativo y de tesorería dentro de una institución educativa.

## ¿Qué hace esta página?

La plataforma se adapta según el rol con el que entres al iniciar sesión:

* **Login y sesión**: Valida usuarios y alumnos contra Supabase, mantiene la sesión guardada y refresca caché local para tener respaldo al recargar.
* **Portal de Alumnos (`PortalAlumnos.tsx`)**: Permite revisar cursos, sílabos en PDF, horarios, calificaciones, asistencias, pensiones/cuotas y enviar solicitudes FUT.
* **Módulo de Docentes (`Docentes.tsx`)**: Muestra cursos, horarios y estudiantes, y permite subir sílabos en **PDF** directo al bucket `silabos-pdf` de Supabase Storage.
* **Módulo de Tesorería (`Tesoreria.tsx`)**: Gestiona pensiones y cuotas, registra fotos de boletas subidas por alumnos (en el bucket `boletas-fotos`), registra cobros de otras entidades y permite validar, observar o dejar pendientes los comprobantes.
* **Módulo de Dirección (`Direccion.tsx`)**: Revisa solicitudes FUT y permite aprobarlas, observarlas, rechazarlas o dejarlas pendientes con observaciones.

## Estructura principal del proyecto

* `src/lib/supabase.ts`: Cliente de Supabase y nombres de buckets (`boletas-fotos` y `silabos-pdf`).
* `src/lib/progresaApi.ts`: Consultas a tablas, autenticación, subida de archivos a Storage y helpers de caché.
* `src/types/progresa.ts`: Interfaces y tipos de datos de la base relacional.
* `src/Componentes/`: Vistas y módulos separados por rol (`Login`, `Alumnos`, `Docentes`, `Tesoreria` y `Direccion`).

